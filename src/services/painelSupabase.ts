import { createClient, type PostgrestError } from '@supabase/supabase-js';
import { LARGURAS_FOTO } from '@/lib/fotos';
import { nomeCompleto } from '@/lib/veiculo';
import { BUCKET_FOTOS, supabaseConfig } from '@/lib/supabaseConfig';
import type { FotoVeiculo, Veiculo } from '@/types/veiculo';
import { corPorId, slugUnico, type PainelApi } from './painel';
import { avisarMudanca } from './veiculos';

/* Painel com Supabase: login, banco e fotos. Carregado só quando alguém abre /painel. */

const supabase = createClient(supabaseConfig.url, supabaseConfig.chave);

const COLUNAS =
  'id,slug,marca,modelo,versao,ano,km,preco,cambio,combustivel,carroceria,situacao,importado,cor,fotos,itens';

/** Traduz os erros mais comuns para uma frase que a loja entenda. */
function erroAmigavel(erro: PostgrestError | Error | null): never {
  const codigo = erro && 'code' in erro ? erro.code : '';
  const msg = erro?.message ?? '';
  if (codigo === '42501' || /row-level security|permission/i.test(msg))
    throw new Error('Seu login não tem permissão para alterar o estoque.');
  if (codigo === '23505') throw new Error('Já existe um veículo com esse nome e ano.');
  if (codigo === '42P01' || /relation .* does not exist/i.test(msg))
    throw new Error('A tabela de veículos ainda não foi criada no Supabase (rode o schema.sql).');
  throw new Error(msg || 'Algo deu errado. Tente de novo.');
}

// ---------------------------------------------------------------------------
// Fotos: o navegador reduz para 400 e 800 px em WebP antes de enviar
// ---------------------------------------------------------------------------

async function reduzir(arquivo: File, largura: number, tipo: string): Promise<Blob> {
  const imagem = await createImageBitmap(arquivo, { imageOrientation: 'from-image' });
  const escala = Math.min(1, largura / imagem.width);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(imagem.width * escala);
  canvas.height = Math.round(imagem.height * escala);
  canvas.getContext('2d')?.drawImage(imagem, 0, 0, canvas.width, canvas.height);
  imagem.close();
  return new Promise((ok, falha) =>
    canvas.toBlob((b) => (b ? ok(b) : falha(new Error('Não foi possível ler a foto.'))), tipo, 0.8),
  );
}

async function enviarFoto(arquivo: File, idVeiculo: number, alt: string): Promise<FotoVeiculo> {
  // Navegadores sem WebP no canvas (Safari antigo) devolvem PNG: aí vai JPEG
  let ext: 'webp' | 'jpg' = 'webp';
  const teste = await reduzir(arquivo, 400, 'image/webp');
  if (teste.type !== 'image/webp') ext = 'jpg';
  const tipo = ext === 'webp' ? 'image/webp' : 'image/jpeg';

  const base = `${idVeiculo}/${crypto.randomUUID()}`;
  for (const largura of LARGURAS_FOTO) {
    const blob = largura === 400 && ext === 'webp' ? teste : await reduzir(arquivo, largura, tipo);
    const { error } = await supabase.storage
      .from(BUCKET_FOTOS)
      .upload(`${base}-${largura}.${ext}`, blob, { contentType: tipo, cacheControl: '31536000' });
    if (error) erroAmigavel(error);
  }
  return { arquivo: base, origem: 'storage', ext, alt, foco: '50% 55%' };
}

async function apagarFotos(fotos: FotoVeiculo[]) {
  const caminhos = fotos
    .filter((f) => f.origem === 'storage')
    .flatMap((f) => LARGURAS_FOTO.map((w) => `${f.arquivo}-${w}.${f.ext ?? 'webp'}`));
  if (caminhos.length) await supabase.storage.from(BUCKET_FOTOS).remove(caminhos);
}

// ---------------------------------------------------------------------------

async function listarTodos(): Promise<Veiculo[]> {
  const { data, error } = await supabase.from('veiculos').select(COLUNAS).order('id', {
    ascending: false,
  });
  if (error) erroAmigavel(error);
  return data as Veiculo[];
}

export const painelSupabase: PainelApi = {
  remoto: true,

  async sessaoAtual() {
    const { data } = await supabase.auth.getSession();
    const email = data.session?.user.email;
    return email ? { email } : null;
  },

  aoMudarSessao(avisar) {
    const { data } = supabase.auth.onAuthStateChange((_evento, sessao) => {
      const email = sessao?.user.email;
      avisar(email ? { email } : null);
    });
    return () => data.subscription.unsubscribe();
  },

  async entrar(email, senha) {
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error) {
      if (/invalid login credentials/i.test(error.message))
        throw new Error('E-mail ou senha incorretos.');
      if (/email not confirmed/i.test(error.message))
        throw new Error('Este e-mail ainda não foi confirmado no Supabase.');
      throw new Error(error.message);
    }
  },

  async sair() {
    await supabase.auth.signOut();
  },

  async ehAdmin() {
    const { data, error } = await supabase.rpc('eh_admin');
    if (error) erroAmigavel(error);
    return data === true;
  },

  listarTodos,

  async alterarSituacao(id, situacao) {
    const { error } = await supabase.from('veiculos').update({ situacao }).eq('id', id);
    if (error) erroAmigavel(error);
    avisarMudanca();
  },

  async excluir(veiculo) {
    const { error } = await supabase.from('veiculos').delete().eq('id', veiculo.id);
    if (error) erroAmigavel(error);
    await apagarFotos(veiculo.fotos);
    avisarMudanca();
  },

  async salvar(dados, fotosNovas, idExistente) {
    const todos = await listarTodos();
    const anterior = todos.find((v) => v.id === idExistente);
    let id = idExistente;

    // Veículo novo: cria a linha primeiro para ter o id (usado no slug e na pasta das fotos)
    if (id === undefined) {
      const provisorio = { ...dados, fotos: [], slug: `novo-${crypto.randomUUID().slice(0, 8)}` };
      const { data, error } = await supabase
        .from('veiculos')
        .insert(provisorio)
        .select('id')
        .single();
      if (error) erroAmigavel(error);
      id = (data as { id: number }).id;
    }

    const alt = `${nomeCompleto({ ...dados, id, slug: '', cor: '' })} ${dados.ano}`;
    const enviadas: FotoVeiculo[] = [];
    let data: unknown;
    try {
      for (const [i, arquivo] of fotosNovas.entries()) {
        const n = dados.fotos.length + i + 1;
        enviadas.push(await enviarFoto(arquivo, id, n > 1 ? `${alt}, foto ${n}` : alt));
      }

      const final = {
        ...dados,
        fotos: [...dados.fotos, ...enviadas],
        slug: slugUnico(dados, id, todos),
        cor: anterior?.cor ?? corPorId(id),
      };
      const resposta = await supabase
        .from('veiculos')
        .update(final)
        .eq('id', id)
        .select(COLUNAS)
        .single();
      if (resposta.error) erroAmigavel(resposta.error);
      data = resposta.data;
    } catch (erro) {
      // Falhou no meio: não deixa foto solta nem veículo novo pela metade
      await apagarFotos(enviadas);
      if (!anterior) await supabase.from('veiculos').delete().eq('id', id);
      throw erro;
    }

    // Fotos removidas na edição saem também do Storage
    if (anterior) {
      const mantidas = new Set(dados.fotos.map((f) => f.arquivo));
      await apagarFotos(anterior.fotos.filter((f) => !mantidas.has(f.arquivo)));
    }

    avisarMudanca();
    return data as Veiculo;
  },
};
