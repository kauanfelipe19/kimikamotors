import { cn } from '@/lib/cn';

interface LogoProps {
  tamanho?: number;
  /** Mostra "Kímika Motors" ao lado do selo */
  comNome?: boolean;
  className?: string;
}

export function Logo({ tamanho = 44, comNome = true, className }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <picture>
        <source
          type="image/webp"
          srcSet="/img/marca/logo-96.webp 96w, /img/marca/logo-240.webp 240w"
          sizes={`${tamanho}px`}
        />
        <img
          src="/img/marca/logo-192.png"
          alt={comNome ? '' : 'Kímika Motors'}
          width={tamanho}
          height={tamanho}
          className="rounded-full"
        />
      </picture>
      {comNome && (
        <span className="font-display text-xl font-bold uppercase leading-none tracking-[0.06em] [font-stretch:85%]">
          Kímika <span className="text-destaque-texto">Motors</span>
        </span>
      )}
    </span>
  );
}
