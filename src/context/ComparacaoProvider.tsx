import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { ComparacaoContext, MAX_COMPARAR } from './comparacao';

/** Seleção para comparar, só em memória, como no site atual. */
export function ComparacaoProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<number[]>([]);
  const [aviso, setAviso] = useState<string | null>(null);
  const [aberta, setAberta] = useState(false);

  const marcar = useCallback(
    (id: number, marcado: boolean) => {
      if (marcado && ids.length >= MAX_COMPARAR) {
        setAviso(`Máximo de ${MAX_COMPARAR} veículos. Remova um para trocar.`);
        return;
      }
      setAviso(null);
      setIds((atual) =>
        marcado ? (atual.includes(id) ? atual : [...atual, id]) : atual.filter((x) => x !== id),
      );
    },
    [ids.length],
  );

  const fechar = useCallback(() => setAberta(false), []);

  const valor = useMemo(
    () => ({
      ids,
      aviso,
      marcar,
      limpar: () => {
        setIds([]);
        setAviso(null);
      },
      aberta,
      abrir: () => setAberta(true),
      fechar,
    }),
    [ids, aviso, marcar, aberta, fechar],
  );

  return <ComparacaoContext.Provider value={valor}>{children}</ComparacaoContext.Provider>;
}
