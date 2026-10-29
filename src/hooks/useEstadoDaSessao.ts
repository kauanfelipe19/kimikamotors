import { useState, type Dispatch, type SetStateAction } from 'react';

const memoria = new Map<string, unknown>();

/**
 * useState que sobrevive à troca de página, mas não ao recarregamento.
 * Reproduz o site atual, onde o estado ficava só na memória: abrir um veículo e voltar
 * mantém os filtros; recarregar a página zera tudo.
 */
export function useEstadoDaSessao<T>(chave: string, inicial: T): [T, Dispatch<SetStateAction<T>>] {
  const [valor, setValor] = useState<T>(() =>
    memoria.has(chave) ? (memoria.get(chave) as T) : inicial,
  );

  const definir: Dispatch<SetStateAction<T>> = (novo) =>
    setValor((atual) => {
      const proximo = typeof novo === 'function' ? (novo as (a: T) => T)(atual) : novo;
      memoria.set(chave, proximo);
      return proximo;
    });

  return [valor, definir];
}
