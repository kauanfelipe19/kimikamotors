import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { FavoritosContext } from './favoritos';

/**
 * Favoritos só em memória, como no site atual: recarregar a página zera a lista.
 * A sugestão de persistir está em docs/sugestoes.md.
 */
export function FavoritosProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<number[]>([]);

  const alternar = useCallback(
    (id: number) =>
      setIds((atual) => (atual.includes(id) ? atual.filter((x) => x !== id) : [...atual, id])),
    [],
  );

  const valor = useMemo(
    () => ({ ids, ehFavorito: (id: number) => ids.includes(id), alternar }),
    [ids, alternar],
  );

  return <FavoritosContext.Provider value={valor}>{children}</FavoritosContext.Provider>;
}
