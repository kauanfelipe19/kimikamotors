import { cn } from '@/lib/cn';

interface Passo {
  titulo: string;
  texto: string;
}

interface PassosProps {
  passos: Passo[];
  /** Em linha (3 colunas) a partir do `md` */
  emLinha?: boolean;
  className?: string;
}

/** Lista numerada de etapas ("1 Simule aqui · 2 Envie para a loja · 3 ..."). */
export function Passos({ passos, emLinha, className }: PassosProps) {
  return (
    <ol className={cn('grid gap-5', emLinha && 'md:grid-cols-3 md:gap-8', className)}>
      {passos.map((p, i) => (
        <li key={p.titulo} className="flex gap-4">
          <span
            aria-hidden
            className="grid size-10 shrink-0 place-items-center rounded-full border border-linha font-display text-lg font-bold text-destaque-texto"
          >
            {i + 1}
          </span>
          <div className="pt-1.5">
            <p className="font-semibold">{p.titulo}</p>
            <p className="mt-0.5 text-sm text-texto-suave">{p.texto}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
