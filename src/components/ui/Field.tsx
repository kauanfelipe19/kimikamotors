import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface FieldBaseProps {
  label: string;
  /** Texto de ajuda abaixo do campo */
  dica?: string;
  erro?: string;
  /** Esconde o label visualmente (continua acessível) */
  labelOculto?: boolean;
}

interface FieldProps extends FieldBaseProps {
  id: string;
  className?: string;
  children: ReactNode;
}

/** Label + controle + dica/erro, com ids ligados por aria. */
export function Field({ id, label, dica, erro, labelOculto, className, children }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className={cn('rotulo', labelOculto && 'sr-only')}>
        {label}
      </label>
      {children}
      {erro ? (
        <p id={`${id}-erro`} className="text-sm text-erro [.tema-claro_&]:text-erro-escuro">
          {erro}
        </p>
      ) : (
        dica && (
          <p id={`${id}-dica`} className="text-sm text-texto-suave">
            {dica}
          </p>
        )
      )}
    </div>
  );
}
