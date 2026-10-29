import { Heart, Menu, MessageCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { useFavoritos } from '@/context/favoritos';
import { cn } from '@/lib/cn';
import { linkWhatsApp, mensagens } from '@/lib/whatsapp';
import { Logo } from './Logo';
import { linksPrincipais } from './navegacao';

const classeLink =
  'inline-flex min-h-11 items-center rounded-md px-3 text-sm font-semibold text-texto-suave transition-colors hover:text-texto aria-[current=page]:text-texto';

interface HeaderProps {
  onAbrirFavoritos: () => void;
}

export function Header({ onAbrirFavoritos }: HeaderProps) {
  const { ids } = useFavoritos();
  const [menuAberto, setMenuAberto] = useState(false);
  const { pathname, hash } = useLocation();

  // Fecha o menu do celular ao trocar de página ou de âncora
  useEffect(() => setMenuAberto(false), [pathname, hash]);

  useEffect(() => {
    if (!menuAberto) return;
    // Com um modal aberto, o Esc é dele
    const fecharComEsc = (e: KeyboardEvent) =>
      e.key === 'Escape' && !document.querySelector('dialog[open]') && setMenuAberto(false);
    window.addEventListener('keydown', fecharComEsc);
    return () => window.removeEventListener('keydown', fecharComEsc);
  }, [menuAberto]);

  const itens = (
    <>
      {linksPrincipais.map((l) => (
        <li key={l.to}>
          <NavLink to={l.to} className={classeLink}>
            {l.rotulo}
          </NavLink>
        </li>
      ))}
      <li>
        <a href="#contato" className={classeLink} onClick={() => setMenuAberto(false)}>
          Contato
        </a>
      </li>
      <li>
        {/* O menu do celular continua aberto por baixo, para o foco voltar a este botão ao fechar */}
        <button type="button" onClick={onAbrirFavoritos} className={cn(classeLink, 'gap-2')}>
          <Heart
            className={cn('size-4', ids.length > 0 && 'fill-laranja-500 text-laranja-500')}
            aria-hidden
          />
          Favoritos ({ids.length})
        </button>
      </li>
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-linha bg-fundo/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-3 lg:h-[72px]">
        <Link to="/" className="shrink-0 rounded-md" aria-label="Kímika Motors, página inicial">
          <Logo tamanho={40} className="[&>span:last-child]:max-[379px]:text-lg" />
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">{itens}</ul>
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink
            href={linkWhatsApp(mensagens.geral())}
            tamanho="sm"
            aria-label="WhatsApp da loja"
          >
            <MessageCircle aria-hidden />
            <span className="hidden sm:inline">WhatsApp</span>
          </ButtonLink>
          <button
            type="button"
            aria-expanded={menuAberto}
            aria-controls="menu-celular"
            onClick={() => setMenuAberto((a) => !a)}
            className="relative grid size-11 place-items-center rounded-md text-texto transition-colors hover:bg-superficie-2 lg:hidden"
          >
            {menuAberto ? (
              <X className="size-6" aria-hidden />
            ) : (
              <Menu className="size-6" aria-hidden />
            )}
            <span className="sr-only">{menuAberto ? 'Fechar menu' : 'Abrir menu'}</span>
            {!menuAberto && ids.length > 0 && (
              <span
                aria-hidden
                className="absolute right-1.5 top-1.5 size-2.5 rounded-full bg-laranja-500 ring-2 ring-fundo"
              />
            )}
          </button>
        </div>
      </Container>

      <nav
        id="menu-celular"
        aria-label="Principal"
        hidden={!menuAberto}
        className="border-t border-linha bg-fundo lg:hidden"
      >
        <Container>
          <ul className="flex flex-col py-2 [&_a]:w-full [&_a]:text-base [&_button]:w-full [&_button]:text-base">
            {itens}
          </ul>
        </Container>
      </nav>
    </header>
  );
}
