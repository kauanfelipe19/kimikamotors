import { Check, ChevronRight, MessageCircle, Repeat } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Simulador } from '@/components/financiamento/Simulador';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Skeleton } from '@/components/ui/Skeleton';
import { VehiclePhoto } from '@/components/vehicle/VehiclePhoto';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useVeiculosAVenda } from '@/hooks/useVeiculosAVenda';
import { formatarKm, formatarPreco } from '@/lib/formatar';
import { urlFoto } from '@/lib/fotos';
import { jsonLdVeiculo, serializarJsonLd } from '@/lib/jsonLd';
import { dadosResumo, ehAntigo, nomeCompleto, nomeCurto } from '@/lib/veiculo';
import { linkWhatsApp, mensagens } from '@/lib/whatsapp';
import type { Veiculo } from '@/types/veiculo';
import NaoEncontrada from './NaoEncontrada';

export default function Detalhe() {
  const { slug } = useParams();
  const veiculos = useVeiculosAVenda();
  // Vendidos saem da loja, então o link deles cai no "não encontrada"
  const v = veiculos?.find((x) => x.slug === slug);

  if (veiculos && !v) return <NaoEncontrada />;
  // key: ao trocar de veículo, o simulador volta aos valores iniciais
  return v ? <ConteudoDetalhe key={v.id} v={v} /> : <DetalheSkeleton />;
}

function ConteudoDetalhe({ v }: { v: Veiculo }) {
  const titulo = `${nomeCompleto(v)} ${v.ano}`;
  const foto = v.fotos[0];
  usePageMeta({
    titulo,
    descricao: `${[titulo, ...dadosResumo(v).slice(1)].join(', ')}${v.preco ? `, por ${formatarPreco(v.preco)}` : ''}. À venda na Kímika Motors, em Sorocaba, SP. Fale com a loja pelo WhatsApp.`,
    caminho: `/estoque/${v.slug}`,
    imagem: foto ? urlFoto(foto, 800) : undefined,
  });

  const ficha: [string, string][] = [
    ['Ano', String(v.ano)],
    ...(v.km != null ? [['Quilometragem', formatarKm(v.km)] as [string, string]] : []),
    ...(v.cambio ? [['Câmbio', v.cambio] as [string, string]] : []),
    ...(v.combustivel ? [['Combustível', v.combustivel] as [string, string]] : []),
    ['Carroceria', v.carroceria],
    ['Situação', v.situacao],
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializarJsonLd(jsonLdVeiculo(v)) }}
      />

      <Container className="py-8 sm:py-12">
        <nav aria-label="Trilha de navegação" className="mb-6 text-sm text-texto-suave">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li className="flex items-center gap-1.5">
              <Link to="/" className="hover:text-texto hover:underline">
                Início
              </Link>
              <ChevronRight aria-hidden className="size-4" />
            </li>
            <li className="flex items-center gap-1.5">
              <Link to="/estoque" className="hover:text-texto hover:underline">
                Estoque
              </Link>
              <ChevronRight aria-hidden className="size-4" />
            </li>
            <li aria-current="page" className="text-texto">
              {nomeCurto(v)}
            </li>
          </ol>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-linha bg-superficie-2 lg:self-start">
            <VehiclePhoto veiculo={v} prioridade sizes="(min-width: 1024px) 660px, 100vw" />
            <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
              {v.situacao === 'Reservado' && <Badge variante="destaque">Reservado</Badge>}
              {v.importado && <Badge>Importado</Badge>}
              {ehAntigo(v) && <Badge>Antigo</Badge>}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <p aria-hidden className="rotulo">
                {v.marca}
              </p>
              <h1 className="mt-1 text-display-lg">
                <span className="sr-only">{v.marca} </span>
                {v.modelo}
              </h1>
              {v.versao && <p className="mt-2 text-lead text-texto-suave">{v.versao}</p>}
            </div>

            <p className="font-display text-display-lg font-bold [font-stretch:92%]">
              {v.preco ? formatarPreco(v.preco) : 'Consulte o valor'}
            </p>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <ButtonLink href={linkWhatsApp(mensagens.interesse(v))} tamanho="lg">
                <MessageCircle aria-hidden /> Chamar no WhatsApp
              </ButtonLink>
              <ButtonLink
                href={linkWhatsApp(mensagens.troca(v))}
                variante="secundario"
                tamanho="lg"
              >
                <Repeat aria-hidden /> Quero dar o meu na troca
              </ButtonLink>
            </div>

            <section aria-labelledby="titulo-ficha">
              <h2 id="titulo-ficha" className="rotulo mb-3">
                Ficha
              </h2>
              {/* gap-px sobre fundo de linha desenha a grade sem bordas duplicadas;
                  flex-1 faz a última linha ocupar a largura toda, sem células vazias */}
              <dl className="flex flex-wrap gap-px overflow-hidden rounded-lg border border-linha bg-linha">
                {ficha.map(([rotulo, valor]) => (
                  <div key={rotulo} className="flex-1 basis-32 bg-fundo p-4">
                    <dt className="text-sm text-texto-suave">{rotulo}</dt>
                    <dd className="mt-0.5 font-semibold">{valor}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {v.itens.length > 0 && (
              <section aria-labelledby="titulo-itens">
                <h2 id="titulo-itens" className="rotulo mb-3">
                  Itens
                </h2>
                <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                  {v.itens.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-destaque-texto" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </Container>

      {v.preco && (
        <section aria-labelledby="titulo-simulador" className="tema-claro py-14 sm:py-16">
          <Container className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div className="flex flex-col gap-3">
              <p className="flex items-center gap-2.5 text-rotulo font-bold uppercase text-destaque-texto">
                <span aria-hidden className="h-px w-6 bg-current" />
                Financiamento
              </p>
              <h2 id="titulo-simulador" className="text-display-md uppercase">
                Simule a parcela deste veículo
              </h2>
              <p className="text-lead text-texto-suave">
                {nomeCompleto(v)} {v.ano} por {formatarPreco(v.preco)}. Escolha a entrada e o prazo;
                o botão envia a simulação pronta para o WhatsApp da loja.
              </p>
            </div>
            <div className="rounded-xl border border-linha bg-superficie p-5 shadow-cartao sm:p-8">
              <Simulador valorFixo={v.preco} rotulo={titulo} />
            </div>
          </Container>
        </section>
      )}
    </>
  );
}

function DetalheSkeleton() {
  return (
    <Container className="py-8 sm:py-12">
      <Skeleton className="mb-6 h-4 w-48" />
      <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
        <Skeleton className="aspect-[4/3] rounded-xl" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-12 w-1/2" />
          <Skeleton className="h-14 w-full" />
        </div>
      </div>
    </Container>
  );
}
