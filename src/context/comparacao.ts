import { createContext, useContext } from 'react';

export const MAX_COMPARAR = 3;
export const MIN_COMPARAR = 2;

export interface ComparacaoValor {
  ids: number[];
  /** Mensagem temporária, como "Máximo de 3 veículos..." */
  aviso: string | null;
  marcar: (id: number, marcado: boolean) => void;
  limpar: () => void;
  aberta: boolean;
  abrir: () => void;
  fechar: () => void;
}

export const ComparacaoContext = createContext<ComparacaoValor | null>(null);

export function useComparacao(): ComparacaoValor {
  const valor = useContext(ComparacaoContext);
  if (!valor) throw new Error('useComparacao precisa estar dentro de <ComparacaoProvider>');
  return valor;
}
