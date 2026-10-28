import { veiculosIniciais } from '@/data/veiculos';
import type { Veiculo } from '@/types/veiculo';

/**
 * Camada de acesso aos veículos. Hoje lê o arquivo local; para trocar por Supabase
 * (ou outra API), basta reimplementar estas funções mantendo as assinaturas.
 */

export async function listarVeiculos(): Promise<Veiculo[]> {
  return veiculosIniciais;
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
