import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface SectionTitleProps {
  /** Linha pequena acima do título */
  sobretitulo?: string;
  titulo: ReactNode;
  descricao?: ReactNode;
  alinhamento?: 'esquerda' | 'centro';
  /** Nível do heading (h2 por padrão) */
  nivel?: 1 | 2 | 3;
  tamanho?: 'lg' | 'md';
  id?: string;
  className?: string;
}

export function SectionTitle({
  sobretitulo,
  titulo,
  descricao,
  alinhamento = 'esquerda',
  nivel = 2,
  tamanho = 'lg',
  id,
  className,
}: SectionTitleProps) {
  const Heading = `h${nivel}` as const;
  return (
    <div
      className={cn(
        'flex max-w-2xl flex-col gap-3',
        alinhamento === 'centro' && 'mx-auto items-center text-center',
        className,
      )}
    >
      {sobretitulo && (
        <p className="flex items-center gap-2.5 text-rotulo font-bold uppercase text-destaque-texto">
          <span aria-hidden className="h-px w-6 bg-current" />
          {sobretitulo}
        </p>
      )}
      <Heading
        id={id}
        className={cn('uppercase', tamanho === 'lg' ? 'text-display-lg' : 'text-display-md')}
      >
        {titulo}
      </Heading>
      {descricao && <p className="text-lead text-texto-suave">{descricao}</p>}
    </div>
  );
}
