import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export type VarianteBadge = 'neutro' | 'destaque' | 'sucesso' | 'contorno';

const variantes: Record<VarianteBadge, string> = {
  neutro: 'bg-carbono-950/80 text-carbono-50 backdrop-blur-sm',
  destaque: 'bg-laranja-500 text-carbono-950',
  sucesso: 'bg-sucesso text-carbono-950',
  contorno: 'border border-linha text-texto-suave',
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variante?: VarianteBadge;
}

export function Badge({ variante = 'neutro', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-sm px-2 py-1 text-[0.6875rem] font-bold uppercase leading-none tracking-[0.12em]',
        variantes[variante],
        className,
      )}
      {...props}
    />
  );
}
