import { ChevronDown } from 'lucide-react';
import { forwardRef, useId, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { ariaDescricao, classesControle } from './estilos';
import { Field, type FieldBaseProps } from './Field';

export interface OpcaoSelect {
  valor: string;
  rotulo: string;
}

type SelectProps = FieldBaseProps &
  SelectHTMLAttributes<HTMLSelectElement> & {
    opcoes: OpcaoSelect[];
  };

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, dica, erro, labelOculto, opcoes, className, id: idProp, ...props },
  ref,
) {
  const idGerado = useId();
  const id = idProp ?? idGerado;
  return (
    <Field
      id={id}
      label={label}
      dica={dica}
      erro={erro}
      labelOculto={labelOculto}
      className={className}
    >
      <div className="relative">
        <select
          ref={ref}
          id={id}
          aria-invalid={erro ? true : undefined}
          aria-describedby={ariaDescricao(id, erro, dica)}
          className={cn(classesControle(Boolean(erro)), 'cursor-pointer appearance-none pr-10')}
          {...props}
        >
          {opcoes.map((o) => (
            <option key={o.valor} value={o.valor}>
              {o.rotulo}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-texto-suave"
        />
      </div>
    </Field>
  );
});
