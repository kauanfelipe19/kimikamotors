import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Eleva o card no hover (para cards clicáveis) */
  interativo?: boolean;
  as?: 'div' | 'article' | 'section';
}

export function Card({ interativo, as: Tag = 'div', className, ...props }: CardProps) {
  return (
    <Tag
      className={cn(
        'overflow-hidden rounded-lg border border-linha bg-superficie shadow-cartao',
        interativo &&
          'transition-[transform,box-shadow,border-color] duration-300 ease-suave hover:-translate-y-0.5 hover:border-texto/20 hover:shadow-cartao-hover',
        className,
      )}
      {...props}
    />
  );
}
