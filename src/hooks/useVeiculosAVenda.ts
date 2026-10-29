import { useEffect, useState } from 'react';
import { assinarMudancas, listarVeiculosAVenda, veiculosSemEsperar } from '@/services/veiculos';
import type { Veiculo } from '@/types/veiculo';

const aVenda = (lista: Veiculo[]) => lista.filter((v) => v.situacao !== 'Vendido');

function useLista(
  buscar: () => Promise<Veiculo[]>,
  filtrar: (lista: Veiculo[]) => Veiculo[],
): Veiculo[] | null {
  // Começa com o que já está disponível (dados locais), para a primeira pintura vir completa
  const [veiculos, setVeiculos] = useState<Veiculo[] | null>(() => {
    const agora = veiculosSemEsperar();
    return agora ? filtrar(agora) : null;
  });

  useEffect(() => {
    let ativo = true;
    const carregar = () =>
      void buscar().then((lista) => {
        if (ativo) setVeiculos(lista);
      });
    carregar();
    const cancelar = assinarMudancas(carregar);
    return () => {
      ativo = false;
      cancelar();
    };
  }, [buscar]);

  return veiculos;
}

/** Veículos à venda. `null` enquanto carrega. */
export const useVeiculosAVenda = () => useLista(listarVeiculosAVenda, aVenda);
