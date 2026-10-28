import { cn } from '@/lib/cn';
import { ehMoto, nomeCurto } from '@/lib/veiculo';
import type { Veiculo } from '@/types/veiculo';

interface VehiclePhotoProps {
  veiculo: Veiculo;
  /** Índice da foto em `veiculo.fotos` */
  indice?: number;
  /** Atributo `sizes` do srcset */
  sizes?: string;
  prioridade?: boolean;
  className?: string;
}

const LARGURAS = [400, 800];
const srcset = (arquivo: string, ext: string) =>
  LARGURAS.map((w) => `/img/veiculos/${arquivo}-${w}.${ext} ${w}w`).join(', ');

/** Foto otimizada (AVIF/WebP) ou, se o veículo não tiver foto, a ilustração do site atual. */
export function VehiclePhoto({
  veiculo,
  indice = 0,
  sizes = '(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw',
  prioridade,
  className,
}: VehiclePhotoProps) {
  const foto = veiculo.fotos[indice];
  if (!foto) return <VehicleIllustration veiculo={veiculo} className={className} />;

  return (
    <picture>
      <source type="image/avif" srcSet={srcset(foto.arquivo, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcset(foto.arquivo, 'webp')} sizes={sizes} />
      <img
        src={`/img/veiculos/${foto.arquivo}-800.webp`}
        alt={foto.alt}
        width={800}
        height={800}
        loading={prioridade ? 'eager' : 'lazy'}
        // React 18 só reconhece o atributo em minúsculas
        {...{ fetchpriority: prioridade ? 'high' : 'auto' }}
        decoding="async"
        style={{ objectPosition: foto.foco ?? '50% 50%' }}
        className={cn('size-full object-cover', className)}
      />
    </picture>
  );
}

function VehicleIllustration({ veiculo, className }: { veiculo: Veiculo; className?: string }) {
  const borda = { stroke: 'rgba(255,255,255,.22)', strokeWidth: 1.5 };
  if (ehMoto(veiculo)) {
    return (
      <svg
        viewBox="0 0 240 180"
        role="img"
        aria-label={`Ilustração de moto: ${nomeCurto(veiculo)}`}
        preserveAspectRatio="xMidYMid slice"
        className={cn('size-full', className)}
      >
        <rect width="240" height="180" fill="#19191B" />
        <line x1="0" x2="240" y1="142" y2="142" stroke="#2B2B2F" />
        <circle cx="62" cy="120" r="22" fill="none" stroke="#6B675F" strokeWidth="6" />
        <circle cx="180" cy="120" r="22" fill="none" stroke="#6B675F" strokeWidth="6" />
        <path
          d="M62 120 L98 90 H140 L180 120"
          fill="none"
          stroke="#9A958C"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path d="M96 86 Q116 64 146 80 L150 92 H94 Z" fill={veiculo.cor} {...borda} />
        <path
          d="M150 78 L168 60 L178 62"
          fill="none"
          stroke="#9A958C"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path d="M70 86 H104" stroke="#9A958C" strokeWidth="8" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 240 180"
      role="img"
      aria-label={`Ilustração de carro: ${nomeCurto(veiculo)}`}
      preserveAspectRatio="xMidYMid slice"
      className={cn('size-full', className)}
    >
      <rect width="240" height="180" fill="#19191B" />
      <line x1="0" x2="240" y1="142" y2="142" stroke="#2B2B2F" />
      <path
        d="M16 124 V104 Q16 96 26 94 L62 86 L86 62 Q90 58 96 58 H150 Q156 58 160 62 L184 86 L216 92 Q226 94 226 104 V124 Z"
        fill={veiculo.cor}
        {...borda}
      />
      <path d="M92 66 H148 L168 86 H72 Z" fill="#20252B" opacity=".9" />
      <circle cx="64" cy="124" r="17" fill="#0B0B0C" stroke="#3A3A3F" strokeWidth="2" />
      <circle cx="64" cy="124" r="6" fill="#6B675F" />
      <circle cx="178" cy="124" r="17" fill="#0B0B0C" stroke="#3A3A3F" strokeWidth="2" />
      <circle cx="178" cy="124" r="6" fill="#6B675F" />
    </svg>
  );
}
