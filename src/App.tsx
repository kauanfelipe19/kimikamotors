import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { SiteLayout } from './components/layout/SiteLayout';
import { ComparacaoProvider } from './context/ComparacaoProvider';
import { FavoritosProvider } from './context/FavoritosProvider';
// A Home vai no pacote principal: é a página de entrada e assim não espera um segundo download
import Home from './pages/Home';

// Code-splitting por rota
const Estoque = lazy(() => import('./pages/Estoque'));
const Detalhe = lazy(() => import('./pages/Detalhe'));
const Financiamento = lazy(() => import('./pages/Financiamento'));
const Vender = lazy(() => import('./pages/Vender'));
const Painel = lazy(() => import('./pages/Painel'));
const Styleguide = lazy(() => import('./pages/Styleguide'));
const NaoEncontrada = lazy(() => import('./pages/NaoEncontrada'));

export function App() {
  return (
    // Favoritos e comparação ficam acima das rotas para sobreviverem à ida ao painel, como no site atual
    <FavoritosProvider>
      <ComparacaoProvider>
        <Suspense fallback={<div className="min-h-dvh bg-fundo" />}>
          <Routes>
            <Route element={<SiteLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/estoque" element={<Estoque />} />
              <Route path="/estoque/:slug" element={<Detalhe />} />
              <Route path="/financiamento" element={<Financiamento />} />
              <Route path="/vender" element={<Vender />} />
              <Route path="*" element={<NaoEncontrada />} />
            </Route>
            <Route path="/painel" element={<Painel />} />
            <Route path="/design" element={<Styleguide />} />
          </Routes>
        </Suspense>
      </ComparacaoProvider>
    </FavoritosProvider>
  );
}
