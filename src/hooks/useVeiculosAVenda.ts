import { useEffect, useState } from 'react';
import { assinarMudancas, listarVeiculos, listarVeiculosAVenda } from '@/services/veiculos';
import type { Veiculo } from '@/types/veiculo';

// Guarda a última lista para a volta a uma página já vista renderizar na hora
// (sem skeleton), o que permite restaurar a rolagem.
const cache = new Map<string, Veiculo[]>();

function useLista(chave: string, buscar: () => Promise<Veiculo[]>): Veiculo[] | null {
  const [veiculos, setVeiculos] = useState<Veiculo[] | null>(cache.get(chave) ?? null);

  useEffect(() => {
    let ativo = true;
    const carregar = () =>
      void buscar().then((lista) => {
        cache.set(chave, lista);
        if (ativo) setVeiculos(lista);
      });
    carregar();
    const cancelar = assinarMudancas(carregar);
    return () => {
      ativo = false;
      cancelar();
    };
  }, [chave, buscar]);

  return veiculos;
}

/** Veículos à venda. `null` enquanto carrega. */
export const useVeiculosAVenda = () => useLista('a-venda', listarVeiculosAVenda);

/** Todos os veículos, inclusive vendidos (painel). `null` enquanto carrega. */
export const useTodosVeiculos = () => useLista('todos', listarVeiculos);
