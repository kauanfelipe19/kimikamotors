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
    <Container className="flex flex-col items-center gap-5 py-24 text-center sm:py-32">
      <p className="rotulo">Erro 404</p>
      <h1 className="text-display-lg uppercase">Página não encontrada</h1>
      <p className="text-lead text-texto-suave">
        O endereço pode ter mudado ou o veículo já foi vendido.
      </p>
      <ButtonLink to="/">Voltar ao início</ButtonLink>
    </Container>
  );
}
