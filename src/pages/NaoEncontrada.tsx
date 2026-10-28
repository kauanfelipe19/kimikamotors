import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function NaoEncontrada() {
  usePageMeta({
    titulo: 'Página não encontrada',
    descricao: 'Esta página não existe.',
    noindex: true,
  });
  return (
    <main className="grid min-h-dvh place-items-center">
      <Container className="flex flex-col items-center gap-5 text-center">
        <p className="rotulo">Erro 404</p>
        <h1 className="text-display-lg uppercase">Página não encontrada</h1>
        <p className="text-lead text-texto-suave">
          O endereço pode ter mudado ou o veículo já foi vendido.
        </p>
        <ButtonLink to="/">Voltar ao início</ButtonLink>
      </Container>
    </main>
  );
}
