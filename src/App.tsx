import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { SiteLayout } from './components/layout/SiteLayout';

// Code-splitting por rota
const Home = lazy(() => import('./pages/Home'));
const Estoque = lazy(() => import('./pages/Estoque'));
const Detalhe = lazy(() => import('./pages/Detalhe'));
const Financiamento = lazy(() => import('./pages/Financiamento'));
const Vender = lazy(() => import('./pages/Vender'));
const Styleguide = lazy(() => import('./pages/Styleguide'));
const NaoEncontrada = lazy(() => import('./pages/NaoEncontrada'));

export function App() {
  return (
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
        <Route path="/design" element={<Styleguide />} />
      </Routes>
    </Suspense>
  );
}
