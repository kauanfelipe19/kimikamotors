import { veiculosIniciais } from '@/data/veiculos';
import { gerarSlug } from '@/lib/slug';
import type { Situacao, Veiculo } from '@/types/veiculo';

/**
 * Camada de acesso aos veículos. Para trocar por Supabase (ou outra API), basta
 * reimplementar estas funções mantendo as assinaturas.
 *
 * Hoje, como no site atual, o painel de demonstração grava as alterações só no
 * localStorage de quem usou o painel; os outros visitantes continuam vendo o arquivo local.
 */

const CHAVE = 'kimika-painel-v5';

function lerSalvos(): Veiculo[] | null {
  try {
    const salvo = localStorage.getItem(CHAVE);
    if (!salvo) return null;
    const lista: unknown = JSON.parse(salvo);
    return Array.isArray(lista) && lista.length > 0 ? (lista as Veiculo[]) : null;
  } catch {
    return null;
  }
}

function salvar(lista: Veiculo[]) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(lista));
  } catch {
    // Sem localStorage (modo privado, por exemplo), a alteração vale só até recarregar
  }
  memoria = lista;
  ouvintes.forEach((avisar) => avisar());
}

let memoria: Veiculo[] | null = null;
const ouvintes = new Set<() => void>();

/** Avisa quando o painel altera os veículos. Devolve a função para cancelar. */
export function assinarMudancas(avisar: () => void): () => void {
  ouvintes.add(avisar);
  return () => ouvintes.delete(avisar);
}

export async function listarVeiculos(): Promise<Veiculo[]> {
  memoria ??= lerSalvos() ?? veiculosIniciais;
  return memoria;
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

export async function alterarSituacao(id: number, situacao: Situacao): Promise<void> {
  const todos = await listarVeiculos();
  salvar(todos.map((v) => (v.id === id ? { ...v, situacao } : v)));
}

export async function excluirVeiculo(id: number): Promise<void> {
  const todos = await listarVeiculos();
  salvar(todos.filter((v) => v.id !== id));
}

export type NovoVeiculo = Omit<Veiculo, 'id' | 'slug' | 'situacao' | 'cor' | 'fotos' | 'itens'>;

// Cores da ilustração para veículos sem foto, como no site atual
const CORES = ['#3B6296', '#9A3B3B', '#4F7A5A', '#7A6A9A'];

export async function adicionarVeiculo(dados: NovoVeiculo): Promise<Veiculo> {
  const todos = await listarVeiculos();
  const id = todos.reduce((maior, v) => Math.max(maior, v.id), 0) + 1;
  const base = gerarSlug(`${dados.marca} ${dados.modelo} ${dados.versao} ${dados.ano}`);
  const slug = todos.some((v) => v.slug === base) ? `${base}-${id}` : base;
  const novo: Veiculo = {
    ...dados,
    id,
    slug,
    situacao: 'Disponível',
    cor: CORES[id % CORES.length] ?? '#3B6296',
    // O upload de fotos é ignorado, como no site atual: entra a ilustração
    fotos: [],
    itens: [],
  };
  salvar([...todos, novo]);
  return novo;
}
