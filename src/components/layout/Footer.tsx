import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/Container';
import { config } from '@/lib/config';
import { linkWhatsApp, mensagens } from '@/lib/whatsapp';
import { Logo } from './Logo';
import { linksPrincipais } from './navegacao';

export function Footer() {
  return (
    <footer id="contato" className="border-t border-linha bg-carbono-950">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:py-16">
        <div className="flex flex-col gap-4">
          <Logo tamanho={56} />
          <p className="max-w-xs text-texto-suave">
            Compra e venda de carros e motos.
            <br />
            Nacionais, importados e antigos.
          </p>
        </div>

        <div>
          <h2 className="rotulo mb-3">Onde estamos</h2>
          <p>{config.cidade}</p>
        </div>

        <div>
          <h2 className="rotulo mb-3">Contato</h2>
          <ul className="flex flex-col gap-1.5">
            <li>
              WhatsApp{' '}
              <a
                href={linkWhatsApp(mensagens.geral())}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-destaque-texto underline-offset-4 hover:underline"
              >
                {config.whatsappExibicao}
              </a>
            </li>
            <li>Instagram @{config.instagram}</li>
          </ul>
        </div>

        <nav aria-label="Rodapé">
          <h2 className="rotulo mb-3">Navegação</h2>
          <ul className="flex flex-col gap-1.5">
            {linksPrincipais.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="underline-offset-4 hover:text-destaque-texto hover:underline"
                >
                  {l.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>

      <div className="border-t border-linha">
        <Container className="py-5 text-sm text-texto-suave">
          © {new Date().getFullYear()} Kímika Motors · {config.cidade}
        </Container>
      </div>
    </footer>
  );
}
