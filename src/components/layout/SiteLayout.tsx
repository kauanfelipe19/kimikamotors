import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { FavoritosProvider } from '@/context/FavoritosProvider';
import { FavoritosDialog } from './FavoritosDialog';
import { Footer } from './Footer';
import { Header } from './Header';

/** Estrutura comum das páginas públicas: cabeçalho, conteúdo, rodapé e favoritos. */
export function SiteLayout() {
  const [favoritosAberto, setFavoritosAberto] = useState(false);

  return (
    <FavoritosProvider>
      <a
        href="#conteudo"
        className="sr-only z-50 rounded-md bg-laranja-500 px-4 py-3 font-semibold text-carbono-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Pular para o conteúdo
      </a>
      <div className="flex min-h-dvh flex-col">
        <Header onAbrirFavoritos={() => setFavoritosAberto(true)} />
        <main id="conteudo" className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
      <FavoritosDialog aberto={favoritosAberto} onFechar={() => setFavoritosAberto(false)} />
    </FavoritosProvider>
  );
}
