import { createContext, useContext } from 'react';

export interface FavoritosValor {
  ids: number[];
  ehFavorito: (id: number) => boolean;
  alternar: (id: number) => void;
}

export const FavoritosContext = createContext<FavoritosValor | null>(null);

export function useFavoritos(): FavoritosValor {
  const valor = useContext(FavoritosContext);
  if (!valor) throw new Error('useFavoritos precisa estar dentro de <FavoritosProvider>');
  return valor;
}
