import { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigationType } from 'react-router-dom';
import { BarraComparacao, ModalComparacao } from '@/components/vehicle/Comparacao';
import { useComparacao } from '@/context/comparacao';
import { ComparacaoProvider } from '@/context/ComparacaoProvider';
import { FavoritosProvider } from '@/context/FavoritosProvider';
import { cn } from '@/lib/cn';
import { FavoritosDialog } from './FavoritosDialog';
import { Footer } from './Footer';
import { Header } from './Header';

/** Estrutura comum das páginas públicas: cabeçalho, conteúdo, rodapé, favoritos e comparação. */
export function SiteLayout() {
  return (
    <FavoritosProvider>
      <ComparacaoProvider>
        <Estrutura />
      </ComparacaoProvider>
    </FavoritosProvider>
  );
}

function Estrutura() {
  const [favoritosAberto, setFavoritosAberto] = useState(false);
  const { ids, aviso, fechar: fecharComparacao } = useComparacao();
  const comBarra = ids.length > 0 || aviso !== null;
  const { pathname } = useLocation();

  useRolarAoTopo();

  // Os cards dentro dos modais levam a outra página: fecha tudo ao navegar
  useEffect(() => {
    setFavoritosAberto(false);
    fecharComparacao();
  }, [pathname, fecharComparacao]);

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only z-50 rounded-md bg-laranja-500 px-4 py-3 font-semibold text-carbono-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Pular para o conteúdo
      </a>
      {/* Espaço extra no fim para a barra de comparação não cobrir o rodapé */}
      <div className={cn('flex min-h-dvh flex-col', comBarra && 'pb-28 sm:pb-16')}>
        <Header onAbrirFavoritos={() => setFavoritosAberto(true)} />
        <main id="conteudo" className="flex-1">
          {/* Suspense aqui dentro: ao carregar uma página nova, cabeçalho e rodapé ficam */}
          <Suspense fallback={<div className="min-h-[60vh]" />}>
            <Outlet />
          </Suspense>
        </main>
        <Footer />
      </div>
      <BarraComparacao />
      <FavoritosDialog aberto={favoritosAberto} onFechar={() => setFavoritosAberto(false)} />
      <ModalComparacao />
    </>
  );
}

const posicoes = new Map<string, number>();

/**
 * Nova página começa do topo; no "voltar" a rolagem volta para onde estava
 * (por exemplo, ao sair do detalhe de um veículo de volta para o estoque).
 */
function useRolarAoTopo() {
  const { key, hash } = useLocation();
  const tipo = useNavigationType();
  const chaveAtual = useRef(key);

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    const guardar = () => posicoes.set(chaveAtual.current, window.scrollY);
    window.addEventListener('scroll', guardar, { passive: true });
    return () => window.removeEventListener('scroll', guardar);
  }, []);

  useLayoutEffect(() => {
    chaveAtual.current = key;
    // Âncoras como #contato: quem rola é o navegador
    if (hash) return;
    window.scrollTo({ top: tipo === 'POP' ? (posicoes.get(key) ?? 0) : 0, behavior: 'instant' });
  }, [key, hash, tipo]);
}
