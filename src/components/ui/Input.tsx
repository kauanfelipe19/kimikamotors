import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { ariaDescricao, classesControle } from './estilos';
import { Field, type FieldBaseProps } from './Field';

type InputProps = FieldBaseProps & InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, dica, erro, labelOculto, className, id: idProp, ...props },
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
      <input
        ref={ref}
        id={id}
        aria-invalid={erro ? true : undefined}
        aria-describedby={ariaDescricao(id, erro, dica)}
        className={cn(classesControle(Boolean(erro)))}
        {...props}
      />
    </Field>
  );
});
