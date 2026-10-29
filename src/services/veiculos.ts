import { veiculosIniciais } from '@/data/veiculos';
import { supabaseConfig, usaSupabase } from '@/lib/supabaseConfig';
import type { Veiculo } from '@/types/veiculo';

/**
 * Leitura dos veículos para as páginas públicas.
 *
 * - Com Supabase configurado (.env), busca na tabela `veiculos` com um fetch simples à API
 *   REST, sem carregar a biblioteca do Supabase no site (ela só entra no painel).
 *   As regras do banco já escondem os vendidos de quem não é da loja.
 * - Sem Supabase, usa src/data/veiculos.ts e as alterações do painel de demonstração,
 *   guardadas no localStorage de quem usou o painel (como no site antigo).
 */

const CHAVE_DEMO = 'kimika-painel-v5';
const CHAVE_CACHE = 'kimika-cache-veiculos-v1';
const COLUNAS =
  'id,slug,marca,modelo,versao,ano,km,preco,cambio,combustivel,carroceria,situacao,importado,cor,fotos,itens';

let memoria: Veiculo[] | null = null;
let pedido: Promise<Veiculo[]> | null = null;
const ouvintes = new Set<() => void>();

/** Avisa quando o painel altera os veículos. Devolve a função para cancelar. */
export function assinarMudancas(avisar: () => void): () => void {
  ouvintes.add(avisar);
  return () => ouvintes.delete(avisar);
}

/** Chamado pelo painel depois de qualquer alteração: descarta o que estava em memória. */
export function avisarMudanca() {
  memoria = null;
  pedido = null;
  ouvintes.forEach((avisar) => avisar());
}

function lerJson<T>(chave: string): T | null {
  try {
    const salvo = localStorage.getItem(chave);
    return salvo ? (JSON.parse(salvo) as T) : null;
  } catch {
    return null;
  }
}

function gravarJson(chave: string, valor: unknown) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    // Sem localStorage (modo privado, por exemplo): segue só em memória
  }
}

// ---------------------------------------------------------------------------
// Modo local (sem Supabase)
// ---------------------------------------------------------------------------

function lerLocal(): Veiculo[] {
  const salvos = lerJson<unknown>(CHAVE_DEMO);
  return Array.isArray(salvos) && salvos.length > 0 ? (salvos as Veiculo[]) : veiculosIniciais;
}

/** Usado pelo painel de demonstração para gravar a lista inteira. */
export function gravarLocal(lista: Veiculo[]) {
  gravarJson(CHAVE_DEMO, lista);
  avisarMudanca();
}

// ---------------------------------------------------------------------------
// Supabase (API REST)
// ---------------------------------------------------------------------------

async function buscarRemoto(): Promise<Veiculo[]> {
  const resposta = await fetch(
    `${supabaseConfig.url}/rest/v1/veiculos?select=${COLUNAS}&order=id.desc`,
    { headers: { apikey: supabaseConfig.chave } },
  );
  if (!resposta.ok) throw new Error(`Supabase respondeu ${resposta.status}`);
  const lista = (await resposta.json()) as Veiculo[];
  gravarJson(CHAVE_CACHE, lista);
  return lista;
}

// ---------------------------------------------------------------------------
// API usada pelas páginas
// ---------------------------------------------------------------------------

export async function listarVeiculos(): Promise<Veiculo[]> {
  if (memoria) return memoria;
  if (!usaSupabase) return (memoria = lerLocal());

  pedido ??= buscarRemoto()
    .catch((erro: unknown) => {
      // Banco fora do ar ou ainda não configurado: mostra a última lista vista ou o arquivo local
      console.warn('Não foi possível carregar os veículos do Supabase.', erro);
      return lerJson<Veiculo[]>(CHAVE_CACHE) ?? veiculosIniciais;
    })
    .then((lista) => (memoria = lista));
  return pedido;
}

/** Veículos que aparecem na loja (vendidos ficam de fora). */
export async function listarVeiculosAVenda(): Promise<Veiculo[]> {
  const todos = await listarVeiculos();
  return todos.filter((v) => v.situacao !== 'Vendido');
}

export async function obterVeiculoPorSlug(slug: string): Promise<Veiculo | undefined> {
  const todos = await listarVeiculos();
  return todos.find((v) => v.slug === slug);
}

/**
 * A lista já disponível sem esperar, ou `null`. Com dados locais sempre há lista; com o
 * Supabase, vale o que já veio nesta visita ou a última lista guardada no navegador
 * (que é atualizada logo em seguida). Assim a primeira pintura vem completa sempre que dá.
 */
export function veiculosSemEsperar(): Veiculo[] | null {
  if (memoria) return memoria;
  if (!usaSupabase) return (memoria = lerLocal());
  return lerJson<Veiculo[]>(CHAVE_CACHE);
}
