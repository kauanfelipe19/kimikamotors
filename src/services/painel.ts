import { gerarSlug } from '@/lib/slug';
import { usaSupabase } from '@/lib/supabaseConfig';
import type { Situacao, Veiculo } from '@/types/veiculo';
import { gravarLocal, listarVeiculos } from './veiculos';

/** O que o formulário do painel envia (id, slug e cor são definidos aqui). */
export type DadosVeiculo = Omit<Veiculo, 'id' | 'slug' | 'cor'>;

export interface Sessao {
  email: string;
}

/**
 * Operações do painel. Há duas implementações com a mesma forma:
 * - Supabase: login, banco e fotos de verdade (painelSupabase.ts, carregado só no painel);
 * - demonstração: sem login, grava no localStorage e ignora as fotos, como o site antigo.
 */
export interface PainelApi {
  remoto: boolean;
  sessaoAtual(): Promise<Sessao | null>;
  aoMudarSessao(avisar: (sessao: Sessao | null) => void): () => void;
  entrar(email: string, senha: string): Promise<void>;
  sair(): Promise<void>;
  /** O login atual está na lista da loja? */
  ehAdmin(): Promise<boolean>;
  listarTodos(): Promise<Veiculo[]>;
  alterarSituacao(id: number, situacao: Situacao): Promise<void>;
  excluir(veiculo: Veiculo): Promise<void>;
  /** Cria (sem `id`) ou atualiza um veículo. `fotosNovas` são enviadas e somadas às atuais. */
  salvar(dados: DadosVeiculo, fotosNovas: File[], id?: number): Promise<Veiculo>;
}

// Cores da ilustração para veículos sem foto, como no site atual
const CORES = ['#3B6296', '#9A3B3B', '#4F7A5A', '#7A6A9A'];
export const corPorId = (id: number) => CORES[id % CORES.length] ?? '#3B6296';

/** Slug "marca-modelo-versao-ano", com o id no fim se já existir outro igual. */
export function slugUnico(dados: DadosVeiculo, id: number, existentes: Veiculo[]) {
  const base = gerarSlug(`${dados.marca} ${dados.modelo} ${dados.versao} ${dados.ano}`);
  return existentes.some((v) => v.slug === base && v.id !== id) ? `${base}-${id}` : base;
}

const painelLocal: PainelApi = {
  remoto: false,
  sessaoAtual: async () => ({ email: 'demonstração' }),
  aoMudarSessao: () => () => {},
  entrar: async () => {},
  sair: async () => {},
  ehAdmin: async () => true,
  listarTodos: () => listarVeiculos(),

  async alterarSituacao(id, situacao) {
    const todos = await listarVeiculos();
    gravarLocal(todos.map((v) => (v.id === id ? { ...v, situacao } : v)));
  },

  async excluir(veiculo) {
    const todos = await listarVeiculos();
    gravarLocal(todos.filter((v) => v.id !== veiculo.id));
  },

  async salvar(dados, _fotosNovas, idExistente) {
    const todos = await listarVeiculos();
    const id = idExistente ?? todos.reduce((maior, v) => Math.max(maior, v.id), 0) + 1;
    const anterior = todos.find((v) => v.id === id);
    const veiculo: Veiculo = {
      ...dados,
      id,
      slug: slugUnico(dados, id, todos),
      cor: anterior?.cor ?? corPorId(id),
    };
    gravarLocal(anterior ? todos.map((v) => (v.id === id ? veiculo : v)) : [...todos, veiculo]);
    return veiculo;
  },
};

let remoto: Promise<PainelApi> | null = null;

/** O painel em uso: Supabase se configurado, senão a demonstração. */
export function obterPainel(): Promise<PainelApi> {
  if (!usaSupabase) return Promise.resolve(painelLocal);
  remoto ??= import('./painelSupabase').then((m) => m.painelSupabase);
  return remoto;
}
