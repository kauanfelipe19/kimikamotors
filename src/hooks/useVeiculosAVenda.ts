import { useEffect, useState } from 'react';
import { listarVeiculosAVenda } from '@/services/veiculos';
import type { Veiculo } from '@/types/veiculo';

/** Veículos à venda. `null` enquanto carrega. */
export function useVeiculosAVenda(): Veiculo[] | null {
  const [veiculos, setVeiculos] = useState<Veiculo[] | null>(null);

  useEffect(() => {
    let ativo = true;
    void listarVeiculosAVenda().then((lista) => {
      if (ativo) setVeiculos(lista);
    });
    return () => {
      ativo = false;
    };
  }, []);

  return veiculos;
}
