import { X } from 'lucide-react';
import { useEffect, useId, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface ModalProps {
  aberto: boolean;
  onFechar: () => void;
  titulo: ReactNode;
  children: ReactNode;
  largura?: 'md' | 'lg' | 'xl';
  className?: string;
}

const larguras = {
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-3xl',
  xl: 'sm:max-w-6xl',
};

/**
 * Janela modal sobre o `<dialog>` nativo: o navegador cuida do foco preso dentro dela,
 * do Esc e de devolver o foco a quem abriu. Clicar fora também fecha, como no site atual.
 */
export function Modal({
  aberto,
  onFechar,
  titulo,
  children,
  largura = 'lg',
  className,
}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const tituloId = useId();

  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;
    if (aberto && !dialogo.open) dialogo.showModal();
    if (!aberto && dialogo.open) dialogo.close();
  }, [aberto]);

  return (
    // O clique no próprio <dialog> só acontece no fundo escurecido; o teclado já fecha com Esc
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={ref}
      aria-labelledby={tituloId}
      onClose={onFechar}
      onClick={(e) => {
        if (e.target === e.currentTarget) onFechar();
      }}
      className={cn(
        'm-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-hidden rounded-xl border border-linha bg-superficie p-0 text-texto shadow-cartao',
        'backdrop:bg-carbono-950/75 backdrop:backdrop-blur-sm',
        larguras[largura],
        className,
      )}
    >
      {aberto && (
        <div className="flex max-h-[calc(100dvh-2rem)] flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-linha px-5 py-3 sm:px-6">
            <h2 id={tituloId} className="text-display-sm uppercase">
              {titulo}
            </h2>
            <button
              type="button"
              onClick={onFechar}
              aria-label="Fechar"
              className="-mr-2 grid size-11 place-items-center rounded-md text-texto-suave transition-colors hover:bg-superficie-2 hover:text-texto"
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="overflow-y-auto p-5 sm:p-6">{children}</div>
        </div>
      )}
    </dialog>
  );
}
