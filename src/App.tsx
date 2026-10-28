import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

// Code-splitting por rota
const EmConstrucao = lazy(() => import('./pages/EmConstrucao'));
const Styleguide = lazy(() => import('./pages/Styleguide'));
const NaoEncontrada = lazy(() => import('./pages/NaoEncontrada'));

export function App() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-fundo" />}>
      <Routes>
        <Route path="/" element={<EmConstrucao />} />
        <Route path="/design" element={<Styleguide />} />
        <Route path="*" element={<NaoEncontrada />} />
      </Routes>
    </Suspense>
  );
}
