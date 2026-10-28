import { forwardRef, useId, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { ariaDescricao, classesControle } from './estilos';
import { Field, type FieldBaseProps } from './Field';

type TextareaProps = FieldBaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, dica, erro, labelOculto, className, id: idProp, rows = 4, ...props },
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
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        aria-invalid={erro ? true : undefined}
        aria-describedby={ariaDescricao(id, erro, dica)}
        className={cn(classesControle(Boolean(erro)), 'resize-y py-3')}
        {...props}
      />
    </Field>
  );
});
