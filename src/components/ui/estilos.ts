import { cn } from '@/lib/cn';

/* Classes compartilhadas entre componentes de UI (fora dos .tsx para o Fast Refresh). */

export type VarianteBotao = 'primario' | 'secundario' | 'fantasma';
export type TamanhoBotao = 'sm' | 'md' | 'lg';

export interface EstiloBotao {
  variante?: VarianteBotao;
  tamanho?: TamanhoBotao;
  larguraTotal?: boolean;
}

const variantesBotao: Record<VarianteBotao, string> = {
  primario:
    'bg-laranja-500 text-carbono-950 hover:bg-laranja-400 hover:shadow-laranja active:bg-laranja-600',
  secundario:
    'border border-linha bg-transparent text-texto hover:border-texto/60 hover:bg-texto/5',
  fantasma: 'bg-transparent text-texto hover:bg-texto/5',
};

const tamanhosBotao: Record<TamanhoBotao, string> = {
  sm: 'min-h-9 px-3.5 text-sm gap-1.5',
  md: 'min-h-11 px-5 text-[0.9375rem] gap-2',
  lg: 'min-h-14 px-7 text-base gap-2.5',
};

export function classesBotao({
  variante = 'primario',
  tamanho = 'md',
  larguraTotal,
}: EstiloBotao = {}) {
  return cn(
    'inline-flex select-none items-center justify-center rounded-md text-center font-semibold no-underline',
    'transition-[background-color,border-color,box-shadow,color,transform] duration-200 ease-suave',
    'active:translate-y-px disabled:pointer-events-none disabled:opacity-40',
    '[&_svg]:size-[1.15em] [&_svg]:shrink-0',
    variantesBotao[variante],
    tamanhosBotao[tamanho],
    larguraTotal && 'w-full',
  );
}

export const classesControle = (comErro?: boolean) =>
  cn(
    'w-full min-h-12 rounded-md border bg-superficie px-3.5 text-base text-texto',
    'placeholder:text-texto-suave/70 transition-[border-color,box-shadow] duration-200',
    'hover:border-texto/40 focus-visible:border-laranja-500 focus-visible:ring-offset-0',
    comErro ? 'border-erro' : 'border-linha',
  );

export const ariaDescricao = (id: string, erro?: string, dica?: string) =>
  erro ? `${id}-erro` : dica ? `${id}-dica` : undefined;
