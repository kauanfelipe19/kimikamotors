import { Logo } from '@/components/layout/Logo';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { usePageMeta } from '@/hooks/usePageMeta';

/** Placeholder da Home até a Etapa 3. */
export default function EmConstrucao() {
  usePageMeta({
    titulo: 'Kímika Motors | Carros e motos em Sorocaba-SP',
    descricao: 'Novo site da Kímika Motors em construção.',
    noindex: true,
  });
  return (
    <main className="grid min-h-dvh place-items-center">
      <Container className="flex flex-col items-center gap-6 text-center">
        <Logo tamanho={72} />
        <h1 className="text-display-md uppercase">Novo site em construção</h1>
        <ButtonLink to="/design">Ver guia de estilo</ButtonLink>
      </Container>
    </main>
  );
}
