import { useEffect, useState } from 'react';
import { listarVeiculosAVenda } from '@/services/veiculos';
import type { Veiculo } from '@/types/veiculo';

// Guarda a última lista para a volta a uma página já vista renderizar na hora
// (sem skeleton), o que permite ao navegador restaurar a rolagem.
let cache: Veiculo[] | null = null;

/** Veículos à venda. `null` enquanto carrega. */
export function useVeiculosAVenda(): Veiculo[] | null {
  const [veiculos, setVeiculos] = useState<Veiculo[] | null>(cache);

  useEffect(() => {
    let ativo = true;
    void listarVeiculosAVenda().then((lista) => {
      cache = lista;
      if (ativo) setVeiculos(lista);
    });
    return () => {
      ativo = false;
    };
  }, []);

  return veiculos;
}
