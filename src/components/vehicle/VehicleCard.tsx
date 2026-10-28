import { Calendar, Cog, Fuel, Gauge, Heart, MessageCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/cn';
import { formatarKm, formatarPreco } from '@/lib/formatar';
import { ehAntigo, nomeCurto } from '@/lib/veiculo';
import { linkWhatsApp, mensagens } from '@/lib/whatsapp';
import type { Veiculo } from '@/types/veiculo';
import { VehiclePhoto } from './VehiclePhoto';

interface VehicleCardProps {
  veiculo: Veiculo;
  favorito?: boolean;
  onFavoritar?: (id: number) => void;
  comparando?: boolean;
  onComparar?: (id: number, marcado: boolean) => void;
  /** Carrega a foto com prioridade (primeiros cards visíveis) */
  prioridade?: boolean;
}

export function VehicleCard({
  veiculo: v,
  favorito = false,
  onFavoritar,
  comparando = false,
  onComparar,
  prioridade,
}: VehicleCardProps) {
  const href = `/estoque/${v.slug}`;
  const specs: Array<{ icone: ReactNode; texto: string; rotulo: string }> = [
    { icone: <Calendar />, texto: String(v.ano), rotulo: 'Ano' },
    ...(v.km != null
      ? [{ icone: <Gauge />, texto: formatarKm(v.km), rotulo: 'Quilometragem' }]
      : []),
    ...(v.cambio ? [{ icone: <Cog />, texto: v.cambio, rotulo: 'Câmbio' }] : []),
    ...(v.combustivel ? [{ icone: <Fuel />, texto: v.combustivel, rotulo: 'Combustível' }] : []),
  ];

  return (
    <Card as="article" interativo className="group relative flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-superficie-2">
        <VehiclePhoto
          veiculo={v}
          prioridade={prioridade}
          className="transition-transform duration-700 ease-suave motion-safe:group-hover:scale-[1.04]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-carbono-950/50 to-transparent"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {v.situacao === 'Reservado' && <Badge variante="destaque">Reservado</Badge>}
          {v.importado && <Badge>Importado</Badge>}
          {ehAntigo(v) && <Badge>Antigo</Badge>}
        </div>
        {onFavoritar && (
          <button
            type="button"
            aria-pressed={favorito}
            aria-label={`${favorito ? 'Remover dos' : 'Adicionar aos'} favoritos: ${nomeCurto(v)}`}
            onClick={() => onFavoritar(v.id)}
            className={cn(
              'absolute right-3 top-3 z-10 grid size-10 place-items-center rounded-full backdrop-blur-md transition-colors',
              favorito
                ? 'bg-laranja-500 text-carbono-950'
                : 'bg-carbono-950/55 text-carbono-50 hover:bg-carbono-950/80',
            )}
          >
            <Heart className={cn('size-5', favorito && 'fill-current')} />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
        <div>
          <p className="rotulo">{v.marca}</p>
          <h3 className="mt-1 text-display-sm leading-none">
            {/* Link "esticado": o card inteiro leva ao detalhe */}
            <Link
              to={href}
              className="after:absolute after:inset-0 after:content-[''] focus-visible:ring-0 focus-visible:after:rounded-lg focus-visible:after:ring-2 focus-visible:after:ring-laranja-500"
            >
              {v.modelo}
            </Link>
          </h3>
          {v.versao && <p className="mt-1 text-sm text-texto-suave">{v.versao}</p>}
        </div>

        <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-texto-suave">
          {specs.map((s) => (
            <li
              key={s.rotulo}
              className="flex items-center gap-1.5 [&_svg]:size-4 [&_svg]:text-texto-suave/80"
            >
              {s.icone}
              <span className="sr-only">{s.rotulo}: </span>
              {s.texto}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-linha pt-4">
          {v.preco ? (
            <p className="font-display text-preco font-bold [font-stretch:92%]">
              {formatarPreco(v.preco)}
            </p>
          ) : (
            <p className="font-display text-preco font-bold text-texto-suave [font-stretch:92%]">
              Consulte
            </p>
          )}
          <a
            href={linkWhatsApp(mensagens.interesse(v))}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 inline-flex min-h-10 items-center gap-1.5 rounded-md px-2 text-sm font-semibold text-destaque-texto hover:bg-laranja-500/10"
          >
            <MessageCircle className="size-4" aria-hidden />
            WhatsApp
          </a>
        </div>

        {onComparar && (
          <label className="relative z-10 -mb-1 flex min-h-10 cursor-pointer items-center gap-2.5 text-sm text-texto-suave hover:text-texto">
            <input
              type="checkbox"
              checked={comparando}
              onChange={(e) => onComparar(v.id, e.target.checked)}
              className="size-4 cursor-pointer accent-laranja-500"
            />
            Comparar
          </label>
        )}
      </div>
    </Card>
  );
}

export function VehicleCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-linha bg-superficie" aria-hidden>
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="flex flex-col gap-3 p-5">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-7 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <div className="mt-3 flex justify-between border-t border-linha pt-4">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
}
