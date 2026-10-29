import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { SiteLayout } from './components/layout/SiteLayout';

// Code-splitting por rota
const Home = lazy(() => import('./pages/Home'));
const Estoque = lazy(() => import('./pages/Estoque'));
const Styleguide = lazy(() => import('./pages/Styleguide'));
const NaoEncontrada = lazy(() => import('./pages/NaoEncontrada'));

export function App() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-fundo" />}>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/estoque" element={<Estoque />} />
          <Route path="*" element={<NaoEncontrada />} />
        </Route>
        <Route path="/design" element={<Styleguide />} />
      </Routes>
    </Suspense>
  );
}
