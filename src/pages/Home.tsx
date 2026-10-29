import { ArrowRight, Calculator, Repeat } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Passos } from '@/components/sections/Passos';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Skeleton } from '@/components/ui/Skeleton';
import { VehicleCard, VehicleCardSkeleton } from '@/components/vehicle/VehicleCard';
import { useFavoritos } from '@/context/favoritos';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useVeiculosAVenda } from '@/hooks/useVeiculosAVenda';
import { simulacaoPadrao, simular } from '@/lib/financiamento';
import { formatarNumero, formatarPreco } from '@/lib/formatar';
import { ehMoto, nomeCompleto } from '@/lib/veiculo';
import type { Veiculo } from '@/types/veiculo';

const QTD_DESTAQUES = 6;
/** Veículo da foto do hero (a fachada da loja com o Civic) */
const SLUG_HERO = 'honda-new-civic-lxs-2007';

export default function Home() {
  usePageMeta({
    titulo: 'Kímika Motors | Carros e motos em Sorocaba, SP',
    descricao:
      'Carros e motos nacionais, importados e antigos em Sorocaba, SP. Veja o estoque, simule o financiamento e fale com a loja pelo WhatsApp.',
    caminho: '/',
    imagem: '/img/veiculos/civic-800.webp',
  });

  const veiculos = useVeiculosAVenda();

  return (
    <>
      <Hero veiculos={veiculos} />
      <Destaques veiculos={veiculos} />
      <Financiamento />
      <VendaOuTroca />
    </>
  );
}

function Hero({ veiculos }: { veiculos: Veiculo[] | null }) {
  const civic = veiculos?.find((v) => v.slug === SLUG_HERO);

  return (
    <section aria-labelledby="titulo-hero" className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(60%_80%_at_85%_20%,rgb(242_138_36/0.14),transparent_70%)]"
      />
      <Container className="relative grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-20">
        <div className="flex flex-col gap-6">
          <p className="flex items-center gap-2.5 text-rotulo font-bold uppercase text-destaque-texto">
            <span aria-hidden className="h-px w-6 bg-current" />
            Sorocaba, SP · Carros e motos
          </p>
          <h1 id="titulo-hero" className="text-display-xl uppercase">
            Nacionais, importados e{' '}
            <span className="inline-block -skew-x-[10deg] text-laranja-500 [font-stretch:100%]">
              antigos.
            </span>
          </h1>
          <p className="max-w-xl text-lead text-texto-suave">
            Compra e venda com atendimento direto no WhatsApp. Escolha o veículo, compare, simule a
            parcela e fale com a loja.
          </p>
          <div className="flex flex-wrap gap-3 [&>*]:flex-1 sm:[&>*]:flex-none">
            <ButtonLink to="/estoque" tamanho="lg">
              Ver estoque <ArrowRight aria-hidden />
            </ButtonLink>
            <ButtonLink to="/financiamento" variante="secundario" tamanho="lg">
              <Calculator aria-hidden /> Simular financiamento
            </ButtonLink>
          </div>
          <Numeros veiculos={veiculos} />
        </div>

        <figure className="relative">
          <div className="aspect-[5/4] overflow-hidden rounded-xl border border-linha shadow-cartao lg:aspect-[4/5]">
            <picture>
              <source
                type="image/avif"
                srcSet="/img/veiculos/civic-400.avif 400w, /img/veiculos/civic-800.avif 800w"
                sizes="(min-width: 1024px) 560px, 100vw"
              />
              <source
                type="image/webp"
                srcSet="/img/veiculos/civic-400.webp 400w, /img/veiculos/civic-800.webp 800w"
                sizes="(min-width: 1024px) 560px, 100vw"
              />
              <img
                src="/img/veiculos/civic-800.webp"
                alt="Fachada da Kímika Motors com um Honda Civic na frente"
                width={800}
                height={800}
                {...{ fetchpriority: 'high' }}
                className="size-full object-cover object-[50%_62%]"
              />
            </picture>
          </div>
          {/* No celular a legenda fica abaixo da foto, para não cobrir o carro */}
          <figcaption className="mt-3 rounded-lg border border-linha bg-superficie p-4 sm:absolute sm:bottom-4 sm:left-4 sm:right-4 sm:mt-0 sm:border-white/10 sm:bg-carbono-950/75 sm:backdrop-blur-md">
            {civic ? (
              <Link
                to={`/estoque/${civic.slug}`}
                className="group flex items-center justify-between gap-3 rounded-md"
              >
                <span>
                  <span className="rotulo block text-carbono-300">Em destaque</span>
                  <span className="font-display text-lg font-bold text-carbono-50 group-hover:underline sm:text-xl">
                    {nomeCompleto(civic)}
                  </span>
                </span>
                {civic.preco && (
                  <span className="whitespace-nowrap font-display text-xl font-bold text-carbono-50 [font-stretch:92%] sm:text-2xl">
                    {formatarPreco(civic.preco)}
                  </span>
                )}
              </Link>
            ) : (
              <span className="rotulo flex justify-between gap-3 text-carbono-300">
                <span>Kímika Motors</span>
                <span>Sorocaba-SP</span>
              </span>
            )}
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}

/** Faixa de números, calculada a partir do estoque. */
function Numeros({ veiculos }: { veiculos: Veiculo[] | null }) {
  const precos = (veiculos ?? []).flatMap((v) => (v.preco ? [v.preco] : []));
  const motos = (veiculos ?? []).filter(ehMoto).length;
  const itens = [
    [formatarNumero(veiculos?.length ?? 0), 'veículos à venda'],
    [precos.length ? formatarPreco(Math.min(...precos)) : '—', 'a partir de'],
    [formatarNumero((veiculos?.length ?? 0) - motos), 'carros'],
    [formatarNumero(motos), motos === 1 ? 'moto' : 'motos'],
  ];

  return (
    <dl
      aria-label="Resumo do estoque"
      className="mt-4 flex flex-wrap gap-x-10 gap-y-5 border-t border-linha pt-6"
    >
      {itens.map(([valor, rotulo]) => (
        <div key={rotulo} className="flex flex-col-reverse gap-1">
          <dt className="text-sm text-texto-suave">{rotulo}</dt>
          <dd className="whitespace-nowrap font-display text-3xl font-bold [font-stretch:85%]">
            {veiculos ? valor : <Skeleton className="h-9 w-16" />}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Destaques({ veiculos }: { veiculos: Veiculo[] | null }) {
  const { ehFavorito, alternar } = useFavoritos();
  // "Mais recentes" = id decrescente, como a ordenação padrão do estoque
  const destaques = [...(veiculos ?? [])].sort((a, b) => b.id - a.id).slice(0, QTD_DESTAQUES);

  return (
    <section aria-labelledby="titulo-destaques" className="py-16 sm:py-20">
      <Container>
        <div className="mb-8 flex flex-col gap-6 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <SectionTitle
            id="titulo-destaques"
            sobretitulo="Estoque"
            titulo="Chegaram na loja"
            descricao="Os veículos mais recentes. No estoque completo dá para filtrar, comparar e favoritar."
          />
          <ButtonLink
            to="/estoque"
            variante="secundario"
            className="shrink-0 self-start sm:self-auto"
          >
            Ver todo o estoque{veiculos ? ` (${veiculos.length})` : ''} <ArrowRight aria-hidden />
          </ButtonLink>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {veiculos
            ? destaques.map((v) => (
                <VehicleCard
                  key={v.id}
                  veiculo={v}
                  favorito={ehFavorito(v.id)}
                  onFavoritar={alternar}
                />
              ))
            : Array.from({ length: QTD_DESTAQUES }, (_, i) => <VehicleCardSkeleton key={i} />)}
        </div>
      </Container>
    </section>
  );
}

function Financiamento() {
  const exemplo = simular(simulacaoPadrao);

  return (
    <section aria-labelledby="titulo-financiamento" className="tema-claro py-16 sm:py-20">
      <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-8">
          <SectionTitle
            id="titulo-financiamento"
            sobretitulo="Financiamento"
            titulo="Veja a parcela antes de ligar"
            descricao="Escolha o valor, a entrada e o prazo. O botão envia a simulação pronta para o WhatsApp da loja."
          />
          <Passos
            passos={[
              { titulo: 'Simule aqui', texto: 'Taxa de exemplo, que você pode ajustar.' },
              {
                titulo: 'Envie para a loja',
                texto: 'Veículo, entrada e prazo seguem no mesmo texto.',
              },
              { titulo: 'Análise de crédito', texto: 'Aprovação e taxa final dependem do banco.' },
            ]}
          />
        </div>

        <div className="rounded-xl border border-linha bg-superficie p-6 shadow-cartao sm:p-8">
          <p className="rotulo">Exemplo de simulação</p>
          <p className="mt-4 text-texto-suave">
            Veículo de {formatarPreco(simulacaoPadrao.valor)}, entrada de{' '}
            {simulacaoPadrao.entradaPct}%
          </p>
          <p className="mt-1 font-display text-display-md font-bold [font-stretch:85%]">
            {simulacaoPadrao.prazo}x de{' '}
            <span className="text-destaque-texto">{formatarPreco(exemplo.parcela)}</span>
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-linha pt-5 text-sm">
            <div>
              <dt className="text-texto-suave">Entrada</dt>
              <dd className="mt-0.5 font-semibold">{formatarPreco(exemplo.entrada)}</dd>
            </div>
            <div>
              <dt className="text-texto-suave">Taxa ao mês</dt>
              <dd className="mt-0.5 font-semibold">
                {simulacaoPadrao.taxaMensal.toLocaleString('pt-BR')}%
              </dd>
            </div>
          </dl>
          <ButtonLink to="/financiamento" larguraTotal className="mt-6">
            <Calculator aria-hidden /> Fazer minha simulação
          </ButtonLink>
          <p className="mt-4 text-xs text-texto-suave">
            Simulação de exemplo. Taxa e aprovação dependem da análise do banco.
          </p>
        </div>
      </Container>
    </section>
  );
}

function VendaOuTroca() {
  return (
    <section aria-labelledby="titulo-venda" className="py-16 sm:py-20">
      <Container>
        <div className="rounded-xl border border-linha bg-superficie p-6 sm:p-10 lg:p-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionTitle
              id="titulo-venda"
              sobretitulo="Venda ou troca"
              titulo="Quer vender ou trocar o seu?"
              descricao="Preencha os dados do veículo e receba a avaliação pelo WhatsApp, sem compromisso. Vale para carros e motos, nacionais, importados e antigos."
            />
            <ButtonLink to="/vender" tamanho="lg" className="shrink-0 self-start lg:self-auto">
              <Repeat aria-hidden /> Pedir avaliação
            </ButtonLink>
          </div>
          <Passos
            emLinha
            className="mt-10 border-t border-linha pt-8"
            passos={[
              { titulo: 'Conte sobre o veículo', texto: 'Marca, modelo, ano e quilometragem.' },
              { titulo: 'Receba a avaliação', texto: 'A equipe responde pelo WhatsApp.' },
              {
                titulo: 'Venda ou troque',
                texto: 'Use o valor como entrada em outro veículo do estoque.',
              },
            ]}
          />
        </div>
      </Container>
    </section>
  );
}
