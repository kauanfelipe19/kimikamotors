import { ArrowLeft, ImagePlus, Info, LogOut, Pencil, Trash2, X } from 'lucide-react';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { flushSync } from 'react-dom';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/layout/Logo';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { Textarea } from '@/components/ui/Textarea';
import { VehiclePhoto } from '@/components/vehicle/VehiclePhoto';
import { useComparacao } from '@/context/comparacao';
import { useFavoritos } from '@/context/favoritos';
import { usePageMeta } from '@/hooks/usePageMeta';
import { cn } from '@/lib/cn';
import { formatarKm, formatarPreco } from '@/lib/formatar';
import { nomeCurto, precoOuConsulte } from '@/lib/veiculo';
import { obterPainel, type DadosVeiculo, type PainelApi, type Sessao } from '@/services/painel';
import { assinarMudancas } from '@/services/veiculos';
import type {
  Cambio,
  Carroceria,
  Combustivel,
  FotoVeiculo,
  Situacao,
  Veiculo,
} from '@/types/veiculo';

const situacoes: Situacao[] = ['Disponível', 'Reservado', 'Vendido'];
const mensagemDeErro = (e: unknown) => (e instanceof Error ? e.message : 'Algo deu errado.');

export default function Painel() {
  usePageMeta({
    titulo: 'Painel',
    descricao: 'Área da loja.',
    caminho: '/painel',
    noindex: true,
  });

  const [api, setApi] = useState<PainelApi | null>(null);
  const [sessao, setSessao] = useState<Sessao | null | undefined>(undefined);
  const [admin, setAdmin] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    let ativo = true;
    let cancelar = () => {};
    void obterPainel().then(async (p) => {
      if (!ativo) return;
      setApi(p);
      setSessao(await p.sessaoAtual());
      cancelar = p.aoMudarSessao(setSessao);
    });
    return () => {
      ativo = false;
      cancelar();
    };
  }, []);

  // Confere se o login está na lista da loja sempre que a sessão muda
  useEffect(() => {
    if (!api || !sessao) return setAdmin(undefined);
    let ativo = true;
    api
      .ehAdmin()
      .then((sim) => ativo && setAdmin(sim))
      .catch(() => ativo && setAdmin(false));
    return () => {
      ativo = false;
    };
  }, [api, sessao]);

  let conteudo;
  if (!api || sessao === undefined) conteudo = <Carregando />;
  else if (!sessao) conteudo = <Login api={api} />;
  else if (admin === undefined) conteudo = <Carregando />;
  else if (!admin) conteudo = <SemAcesso api={api} email={sessao.email} />;
  else conteudo = <AreaLoja api={api} sessao={sessao} />;

  return (
    <div className="min-h-dvh">
      <header className="border-b border-linha">
        <Container className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="rounded-md" aria-label="Kímika Motors, página inicial">
            {/* No celular, só o selo: o nome não cabe ao lado do botão */}
            <Logo tamanho={40} className="[&>span:last-child]:max-sm:hidden" />
          </Link>
          <ButtonLink to="/" variante="secundario" tamanho="sm" className="whitespace-nowrap">
            <ArrowLeft aria-hidden /> Voltar para a loja
          </ButtonLink>
        </Container>
      </header>

      <main>
        <Container className="flex flex-col gap-8 py-10 sm:py-12">
          <div>
            <p className="rotulo text-destaque-texto">Área da loja</p>
            <h1 className="mt-2 text-display-lg uppercase">Painel</h1>
          </div>
          {conteudo}
        </Container>
      </main>
    </div>
  );
}

function Carregando() {
  return (
    <div aria-busy="true" className="grid gap-3">
      <span className="sr-only">Carregando…</span>
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

function Aviso({ children, tom = 'aviso' }: { children: React.ReactNode; tom?: 'aviso' | 'erro' }) {
  return (
    <p
      role={tom === 'erro' ? 'alert' : undefined}
      className={cn(
        'flex gap-3 rounded-lg border p-4 text-sm',
        tom === 'erro' ? 'border-erro/40 bg-erro/10' : 'border-aviso/40 bg-aviso/10',
      )}
    >
      <Info
        className={cn('mt-0.5 size-4 shrink-0', tom === 'erro' ? 'text-erro' : 'text-aviso')}
        aria-hidden
      />
      <span>{children}</span>
    </p>
  );
}

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------

function Login({ api }: { api: PainelApi }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const entrar = async (e: FormEvent) => {
    e.preventDefault();
    setErro(null);
    setEnviando(true);
    try {
      await api.entrar(email.trim(), senha);
    } catch (falha) {
      setErro(mensagemDeErro(falha));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form
      onSubmit={(e) => void entrar(e)}
      aria-labelledby="titulo-login"
      className="flex w-full max-w-md flex-col gap-4 rounded-xl border border-linha bg-superficie p-6"
    >
      <h2 id="titulo-login" className="text-display-sm uppercase">
        Entrar
      </h2>
      <Input
        label="E-mail"
        type="email"
        autoComplete="username"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        label="Senha"
        type="password"
        autoComplete="current-password"
        required
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      {erro && <Aviso tom="erro">{erro}</Aviso>}
      <Button type="submit" disabled={enviando}>
        {enviando ? 'Entrando…' : 'Entrar'}
      </Button>
    </form>
  );
}

function SemAcesso({ api, email }: { api: PainelApi; email: string }) {
  return (
    <div className="flex max-w-xl flex-col items-start gap-4">
      <Aviso tom="erro">
        O login <strong>{email}</strong> não está na lista da loja, então não pode alterar o
        estoque. Peça para incluírem este e-mail na tabela <code>admins</code> do Supabase.
      </Aviso>
      <Button variante="secundario" onClick={() => void api.sair()}>
        <LogOut aria-hidden /> Sair
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Área da loja
// ---------------------------------------------------------------------------

function AreaLoja({ api, sessao }: { api: PainelApi; sessao: Sessao }) {
  const [veiculos, setVeiculos] = useState<Veiculo[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [editando, setEditando] = useState<Veiculo | null>(null);

  const carregar = useCallback(() => {
    api
      .listarTodos()
      .then(setVeiculos)
      .catch((e: unknown) => setErro(mensagemDeErro(e)));
  }, [api]);

  useEffect(() => {
    carregar();
    return assinarMudancas(carregar);
  }, [carregar]);

  const executar = async (acao: () => Promise<unknown>) => {
    setErro(null);
    try {
      await acao();
    } catch (e) {
      setErro(mensagemDeErro(e));
    }
  };

  return (
    <>
      {api.remoto ? (
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-texto-suave">
          <span>
            Conectado como <strong className="text-texto">{sessao.email}</strong>. As alterações
            aparecem na hora para todos os clientes.
          </span>
          <Button variante="secundario" tamanho="sm" onClick={() => void api.sair()}>
            <LogOut aria-hidden /> Sair
          </Button>
        </div>
      ) : (
        <Aviso>
          Visão de demonstração. No sistema final esta área fica atrás de login e as alterações
          ficam salvas no banco de dados. Por enquanto, elas valem só neste navegador.
        </Aviso>
      )}

      {erro && <Aviso tom="erro">{erro}</Aviso>}

      <Indicadores veiculos={veiculos} />

      <div className="grid items-start gap-8 xl:grid-cols-[1.6fr_1fr]">
        <TabelaVeiculos
          veiculos={veiculos}
          onSituacao={(id, s) => void executar(() => api.alterarSituacao(id, s))}
          onExcluir={(v) => void executar(() => api.excluir(v))}
          onEditar={(v) => {
            setEditando(v);
            document.getElementById('form-veiculo')?.scrollIntoView({ block: 'start' });
          }}
        />
        <FormVeiculo
          key={editando?.id ?? 'novo'}
          api={api}
          editando={editando}
          onCancelar={() => setEditando(null)}
          onSalvo={() => setEditando(null)}
        />
      </div>
    </>
  );
}

function Indicadores({ veiculos }: { veiculos: Veiculo[] | null }) {
  const lista = veiculos ?? [];
  const contar = (s: Situacao) => lista.filter((v) => v.situacao === s).length;
  const valor = lista
    .filter((v) => v.situacao !== 'Vendido')
    .reduce((soma, v) => soma + (v.preco ?? 0), 0);

  const itens = [
    ['Disponíveis', String(contar('Disponível'))],
    ['Reservados', String(contar('Reservado'))],
    ['Vendidos', String(contar('Vendido'))],
    ['Valor em estoque', formatarPreco(valor)],
  ];

  return (
    <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {itens.map(([rotulo, numero]) => (
        <div
          key={rotulo}
          className="flex flex-col-reverse gap-1 rounded-lg border border-linha bg-superficie p-4 sm:p-5"
        >
          <dt className="text-sm text-texto-suave">{rotulo}</dt>
          <dd className="font-display text-2xl font-bold [font-stretch:85%] sm:text-3xl">
            {veiculos ? numero : <Skeleton className="h-8 w-16" />}
          </dd>
        </div>
      ))}
    </dl>
  );
}

interface TabelaProps {
  veiculos: Veiculo[] | null;
  onSituacao: (id: number, situacao: Situacao) => void;
  onExcluir: (v: Veiculo) => void;
  onEditar: (v: Veiculo) => void;
}

function TabelaVeiculos({ veiculos, onSituacao, onExcluir, onEditar }: TabelaProps) {
  const { ehFavorito, alternar } = useFavoritos();
  const { marcar } = useComparacao();
  // Excluir pede um segundo clique em "Confirmar", como no site atual
  const [armado, setArmado] = useState<number | null>(null);

  const excluir = (v: Veiculo) => {
    if (armado !== v.id) {
      setArmado(v.id);
      return;
    }
    setArmado(null);
    if (ehFavorito(v.id)) alternar(v.id);
    marcar(v.id, false);
    onExcluir(v);
  };

  const ordenados = [...(veiculos ?? [])].sort((a, b) => b.id - a.id);

  return (
    <section
      aria-label="Veículos cadastrados"
      // min-w-0: sem isso a tabela larga estica a coluna do grid e a página rola de lado
      className="min-w-0 overflow-hidden rounded-xl border border-linha bg-superficie"
    >
      {/* relative: prende os rótulos sr-only (absolutos) dentro da área que rola */}
      <div className="relative overflow-x-auto">
        <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
          <thead className="border-b border-linha">
            <tr className="[&>th]:rotulo [&>th]:px-4 [&>th]:py-3">
              <th scope="col">Veículo</th>
              <th scope="col">Ano</th>
              <th scope="col">Preço</th>
              <th scope="col">Situação</th>
              <th scope="col">
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {ordenados.map((v) => (
              <tr key={v.id} className="border-b border-linha last:border-b-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="block size-12 shrink-0 overflow-hidden rounded-md bg-superficie-2">
                      <VehiclePhoto veiculo={v} sizes="48px" />
                    </span>
                    <span>
                      <span className="block font-semibold text-texto">{nomeCurto(v)}</span>
                      <span className="text-texto-suave">
                        {[v.versao, v.km != null ? formatarKm(v.km) : '']
                          .filter(Boolean)
                          .join(' · ')}
                      </span>
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">{v.ano}</td>
                <td className="whitespace-nowrap px-4 py-3">{precoOuConsulte(v)}</td>
                <td className="px-4 py-3">
                  <Select
                    label={`Situação de ${nomeCurto(v)}`}
                    labelOculto
                    opcoes={situacoes.map((s) => ({ valor: s, rotulo: s }))}
                    value={v.situacao}
                    onChange={(e) => onSituacao(v.id, e.target.value as Situacao)}
                    className="min-w-36 [&_select]:min-h-10"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button
                      tamanho="sm"
                      variante="secundario"
                      onClick={() => onEditar(v)}
                      aria-label={`Editar ${nomeCurto(v)}`}
                    >
                      <Pencil aria-hidden /> Editar
                    </Button>
                    <Button
                      tamanho="sm"
                      variante={armado === v.id ? 'primario' : 'secundario'}
                      onClick={() => excluir(v)}
                      onBlur={() => setArmado((a) => (a === v.id ? null : a))}
                      aria-label={
                        armado === v.id
                          ? `Confirmar exclusão de ${nomeCurto(v)}`
                          : `Excluir ${nomeCurto(v)}`
                      }
                      className={cn(
                        armado === v.id &&
                          'bg-erro-escuro text-carbono-50 hover:bg-erro-escuro hover:shadow-none',
                      )}
                    >
                      <Trash2 aria-hidden />
                      {armado === v.id ? 'Confirmar' : 'Excluir'}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p aria-live="polite" className="sr-only">
        {armado !== null ? 'Clique de novo para confirmar a exclusão.' : ''}
      </p>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Formulário de cadastro e edição
// ---------------------------------------------------------------------------

interface Campos {
  marca: string;
  modelo: string;
  versao: string;
  ano: string;
  km: string;
  preco: string;
  cambio: string;
  combustivel: string;
  carroceria: string;
  origem: string;
  itens: string;
}
type Erros = Partial<Record<keyof Campos, string>>;

const camposVazios: Campos = {
  marca: '',
  modelo: '',
  versao: '',
  ano: '',
  km: '',
  preco: '',
  cambio: '',
  combustivel: '',
  carroceria: 'Hatch',
  origem: '',
  itens: '',
};

const camposDe = (v: Veiculo): Campos => ({
  marca: v.marca,
  modelo: v.modelo,
  versao: v.versao,
  ano: String(v.ano),
  km: v.km != null ? String(v.km) : '',
  preco: v.preco != null ? String(v.preco) : '',
  cambio: v.cambio ?? '',
  combustivel: v.combustivel ?? '',
  carroceria: v.carroceria,
  origem: v.importado ? 'importado' : '',
  itens: v.itens.join('\n'),
});

const soDigitos = (s: string) => s.replace(/\D/g, '');
const ANO_MAX = new Date().getFullYear() + 1;

/** Mesmas regras do site atual: marca, modelo, ano (1900 até o ano que vem) e preço. */
function validar(c: Campos): Erros {
  const erros: Erros = {};
  const ano = Number(soDigitos(c.ano));
  if (!c.marca.trim()) erros.marca = 'Informe a marca.';
  if (!c.modelo.trim()) erros.modelo = 'Informe o modelo.';
  if (!ano || ano < 1900 || ano > ANO_MAX) erros.ano = `Informe um ano entre 1900 e ${ANO_MAX}.`;
  if (!Number(soDigitos(c.preco))) erros.preco = 'Informe o preço.';
  return erros;
}

interface FormProps {
  api: PainelApi;
  editando: Veiculo | null;
  onCancelar: () => void;
  onSalvo: () => void;
}

function FormVeiculo({ api, editando, onCancelar, onSalvo }: FormProps) {
  const [campos, setCampos] = useState<Campos>(editando ? camposDe(editando) : camposVazios);
  const [fotos, setFotos] = useState<FotoVeiculo[]>(editando?.fotos ?? []);
  const [novas, setNovas] = useState<File[]>([]);
  const [erros, setErros] = useState<Erros>({});
  const [salvando, setSalvando] = useState(false);
  const [falha, setFalha] = useState<string | null>(null);
  const [salvo, setSalvo] = useState<Veiculo | null>(null);

  const campo = (chave: keyof Campos) => ({
    value: campos[chave],
    erro: erros[chave],
    onChange: (e: { target: { value: string } }) =>
      setCampos((c) => ({ ...c, [chave]: e.target.value })),
  });

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const novos = validar(campos);
    flushSync(() => {
      setErros(novos);
      setSalvo(null);
      setFalha(null);
    });
    if (Object.keys(novos).length > 0) {
      form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }

    const dados: DadosVeiculo = {
      marca: campos.marca.trim(),
      modelo: campos.modelo.trim(),
      versao: campos.versao.trim(),
      ano: Number(soDigitos(campos.ano)),
      km: soDigitos(campos.km) === '' ? null : Number(soDigitos(campos.km)),
      preco: Number(soDigitos(campos.preco)),
      cambio: (campos.cambio || null) as Cambio | null,
      combustivel: (campos.combustivel || null) as Combustivel | null,
      carroceria: campos.carroceria as Carroceria,
      importado: campos.origem === 'importado',
      situacao: editando?.situacao ?? 'Disponível',
      fotos,
      itens: campos.itens
        .split('\n')
        .map((i) => i.trim())
        .filter(Boolean),
    };

    setSalvando(true);
    try {
      const veiculo = await api.salvar(dados, api.remoto ? novas : [], editando?.id);
      if (editando) {
        onSalvo();
        return;
      }
      setCampos(camposVazios);
      setFotos([]);
      setNovas([]);
      form.reset();
      setSalvo(veiculo);
    } catch (erro) {
      setFalha(mensagemDeErro(erro));
    } finally {
      setSalvando(false);
    }
  };

  return (
    <form
      id="form-veiculo"
      noValidate
      onSubmit={(e) => void enviar(e)}
      aria-labelledby="titulo-form"
      className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-linha bg-superficie p-5 sm:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 id="titulo-form" className="text-display-sm uppercase">
          {editando ? `Editar ${nomeCurto(editando)}` : 'Novo veículo'}
        </h2>
        {editando && (
          <Button variante="fantasma" tamanho="sm" onClick={onCancelar}>
            Cancelar
          </Button>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Marca" placeholder="Fiat" {...campo('marca')} />
        <Input label="Modelo" placeholder="Argo" {...campo('modelo')} />
      </div>
      <Input label="Versão" placeholder="1.0 Drive" {...campo('versao')} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Ano" inputMode="numeric" placeholder="2020" {...campo('ano')} />
        <Input label="KM" inputMode="numeric" placeholder="45000" {...campo('km')} />
      </div>
      <Input label="Preço (R$)" inputMode="numeric" placeholder="59900" {...campo('preco')} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Câmbio"
          opcoes={[
            { valor: '', rotulo: 'Não informado' },
            { valor: 'Manual', rotulo: 'Manual' },
            { valor: 'Automático', rotulo: 'Automático' },
          ]}
          {...campo('cambio')}
        />
        <Select
          label="Combustível"
          opcoes={[
            { valor: '', rotulo: 'Não informado' },
            { valor: 'Flex', rotulo: 'Flex' },
            { valor: 'Gasolina', rotulo: 'Gasolina' },
          ]}
          {...campo('combustivel')}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Carroceria"
          opcoes={['Hatch', 'Sedan', 'SUV', 'Minivan', 'Perua', 'Moto'].map((c) => ({
            valor: c,
            rotulo: c,
          }))}
          {...campo('carroceria')}
        />
        <Select
          label="Origem"
          opcoes={[
            { valor: '', rotulo: 'Nacional' },
            { valor: 'importado', rotulo: 'Importado' },
          ]}
          {...campo('origem')}
        />
      </div>
      <Textarea
        label="Itens"
        dica="Um por linha. Ex.: Ar condicionado"
        rows={4}
        {...campo('itens')}
      />

      <CampoFotos
        remoto={api.remoto}
        fotos={fotos}
        onRemoverFoto={(arquivo) => setFotos((f) => f.filter((x) => x.arquivo !== arquivo))}
        novas={novas}
        onNovas={(arquivos) => setNovas((n) => [...n, ...arquivos])}
        onRemoverNova={(i) => setNovas((n) => n.filter((_, j) => j !== i))}
        veiculo={editando}
      />

      {falha && <Aviso tom="erro">{falha}</Aviso>}
      <Button type="submit" disabled={salvando}>
        {salvando
          ? novas.length > 0
            ? 'Enviando fotos…'
            : 'Salvando…'
          : editando
            ? 'Salvar alterações'
            : 'Publicar na loja'}
      </Button>

      <p role="status" className="text-sm empty:hidden">
        {salvo && (
          <>
            Publicado na loja:{' '}
            <Link
              to={`/estoque/${salvo.slug}`}
              className="font-semibold text-destaque-texto underline underline-offset-4"
            >
              {nomeCurto(salvo)} {salvo.ano}
            </Link>
          </>
        )}
      </p>
    </form>
  );
}

interface CampoFotosProps {
  remoto: boolean;
  fotos: FotoVeiculo[];
  onRemoverFoto: (arquivo: string) => void;
  novas: File[];
  onNovas: (arquivos: File[]) => void;
  onRemoverNova: (indice: number) => void;
  veiculo: Veiculo | null;
}

function CampoFotos({
  remoto,
  fotos,
  onRemoverFoto,
  novas,
  onNovas,
  onRemoverNova,
  veiculo,
}: CampoFotosProps) {
  const [previas, setPrevias] = useState<string[]>([]);

  // Miniaturas das fotos escolhidas (liberadas ao trocar a seleção)
  useEffect(() => {
    const urls = novas.map((f) => URL.createObjectURL(f));
    setPrevias(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [novas]);

  if (!remoto) {
    // Campo mantido do site atual; o arquivo é ignorado na demonstração
    return (
      <Input
        label="Fotos"
        type="file"
        accept="image/*"
        multiple
        dica="No sistema final as fotos sobem direto do celular."
        className="[&_input]:py-2.5 [&_input]:text-sm"
      />
    );
  }

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="rotulo mb-1.5">Fotos</legend>
      {(fotos.length > 0 || novas.length > 0) && (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {fotos.map((f, i) => (
            <li key={f.arquivo} className="relative aspect-square overflow-hidden rounded-md">
              {veiculo && <VehiclePhoto veiculo={{ ...veiculo, fotos: [f] }} sizes="120px" />}
              {i === 0 && (
                <span className="absolute bottom-1 left-1 rounded bg-carbono-950/80 px-1.5 text-xs text-carbono-50">
                  Capa
                </span>
              )}
              <BotaoRemoverFoto onClick={() => onRemoverFoto(f.arquivo)} rotulo={`foto ${i + 1}`} />
            </li>
          ))}
          {previas.map((url, i) => (
            <li key={url} className="relative aspect-square overflow-hidden rounded-md">
              <img src={url} alt="" className="size-full object-cover" />
              {fotos.length === 0 && i === 0 && (
                <span className="absolute bottom-1 left-1 rounded bg-carbono-950/80 px-1.5 text-xs text-carbono-50">
                  Capa
                </span>
              )}
              <BotaoRemoverFoto onClick={() => onRemoverNova(i)} rotulo={`foto nova ${i + 1}`} />
            </li>
          ))}
        </ul>
      )}
      <label className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-linha px-4 text-sm font-semibold text-texto-suave transition-colors focus-within:ring-2 focus-within:ring-laranja-500 hover:border-laranja-500 hover:text-texto">
        <ImagePlus className="size-5" aria-hidden />
        Adicionar fotos
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic"
          multiple
          className="sr-only"
          onChange={(e) => {
            onNovas([...(e.target.files ?? [])]);
            e.target.value = '';
          }}
        />
      </label>
      <p className="text-sm text-texto-suave">
        Pode tirar direto do celular. A primeira foto é a capa. Elas são reduzidas antes de enviar,
        então o envio é rápido mesmo no 4G.
      </p>
    </fieldset>
  );
}

function BotaoRemoverFoto({ onClick, rotulo }: { onClick: () => void; rotulo: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Remover ${rotulo}`}
      className="absolute right-1 top-1 grid size-8 place-items-center rounded-full bg-carbono-950/80 text-carbono-50 hover:bg-erro-escuro"
    >
      <X className="size-4" aria-hidden />
    </button>
  );
}
