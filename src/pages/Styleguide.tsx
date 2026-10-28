import { ArrowRight, Calculator, MessageCircle, Search } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Logo } from '@/components/layout/Logo';
import { Badge } from '@/components/ui/Badge';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Input } from '@/components/ui/Input';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { VehicleCard, VehicleCardSkeleton } from '@/components/vehicle/VehicleCard';
import { VehiclePhoto } from '@/components/vehicle/VehiclePhoto';
import { veiculosIniciais } from '@/data/veiculos';
import { usePageMeta } from '@/hooks/usePageMeta';
import { cn } from '@/lib/cn';
import { linkWhatsApp, mensagens } from '@/lib/whatsapp';
import type { Veiculo } from '@/types/veiculo';

/* ---------- contraste WCAG ---------- */
function luminancia(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contraste(a: string, b: string) {
  const [l1, l2] = [luminancia(a), luminancia(b)].sort((x, y) => y - x) as [number, number];
  return (l1 + 0.05) / (l2 + 0.05);
}
const PRETO = '#0B0B0C';
const MARFIM = '#F6F4F1';

const carbono = {
  50: '#F6F4F1',
  100: '#ECE8E2',
  200: '#D6D1C8',
  300: '#B5AFA5',
  400: '#8F897F',
  500: '#6E6961',
  600: '#4E4A45',
  700: '#34322F',
  800: '#222120',
  900: '#161616',
  950: '#0B0B0C',
};
const laranja = {
  50: '#FFF4E8',
  100: '#FFE4C6',
  200: '#FFC88C',
  300: '#FFAA55',
  400: '#FA9535',
  500: '#F28A24',
  600: '#D96F0E',
  700: '#A34F05',
  800: '#7A3B06',
  900: '#4D2604',
};

function Escala({ nome, cores }: { nome: string; cores: Record<string, string> }) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-11">
      {Object.entries(cores).map(([peso, hex]) => {
        const sobrePreto = contraste(hex, PRETO);
        const textoEscuro = sobrePreto > contraste(hex, '#FFFFFF');
        return (
          <div key={peso} className="overflow-hidden rounded-md border border-linha">
            <div
              className="flex h-16 items-end p-2 text-[0.6875rem] font-semibold"
              style={{ background: hex, color: textoEscuro ? PRETO : '#FFFFFF' }}
            >
              {nome}-{peso}
            </div>
            <div className="bg-superficie px-2 py-1.5 font-mono text-[0.6875rem] text-texto-suave">
              {hex}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ParContraste({
  frente,
  fundo,
  rotulo,
  uso,
}: {
  frente: string;
  fundo: string;
  rotulo: string;
  uso: string;
}) {
  const r = contraste(frente, fundo);
  const nivel = r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'AA grande' : 'Reprova';
  return (
    <div className="flex items-center gap-4 rounded-md border border-linha p-3">
      <div
        className="grid size-14 shrink-0 place-items-center rounded font-display text-2xl font-bold"
        style={{ background: fundo, color: frente }}
      >
        Aa
      </div>
      <div className="min-w-0 text-sm">
        <p className="font-semibold">{rotulo}</p>
        <p className="text-texto-suave">{uso}</p>
      </div>
      <div className="ml-auto text-right">
        <p className="font-display text-xl font-bold">{r.toFixed(1).replace('.', ',')}:1</p>
        <p className={cn('text-xs font-bold', nivel === 'Reprova' ? 'text-erro' : 'text-sucesso')}>
          {nivel}
        </p>
      </div>
    </div>
  );
}

function Bloco({
  id,
  titulo,
  descricao,
  children,
}: {
  id: string;
  titulo: string;
  descricao?: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="border-t border-linha py-14 sm:py-20">
      <Container>
        <div className="mb-8 flex flex-col gap-2 sm:mb-10">
          <h2 id={id} className="text-display-md uppercase">
            {titulo}
          </h2>
          {descricao && <p className="max-w-2xl text-texto-suave">{descricao}</p>}
        </div>
        {children}
      </Container>
    </section>
  );
}

function GradeCards({ lista }: { lista: Veiculo[] }) {
  const [favoritos, setFavoritos] = useState<number[]>([lista[1]?.id ?? 0]);
  const [comparar, setComparar] = useState<number[]>([]);
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {lista.map((v, i) => (
        <VehicleCard
          key={v.id}
          veiculo={v}
          prioridade={i === 0}
          favorito={favoritos.includes(v.id)}
          onFavoritar={(id) =>
            setFavoritos((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]))
          }
          comparando={comparar.includes(v.id)}
          onComparar={(id, marcado) =>
            setComparar((c) => (marcado ? [...c, id] : c.filter((x) => x !== id)))
          }
        />
      ))}
    </div>
  );
}

export default function Styleguide() {
  usePageMeta({
    titulo: 'Guia de estilo',
    descricao: 'Paleta, tipografia e componentes do site da Kímika Motors.',
    caminho: '/design',
    noindex: true,
  });

  const porId = (id: number) => veiculosIniciais.find((v) => v.id === id) as Veiculo;
  const amostra = [porId(111), { ...porId(106), situacao: 'Reservado' as const }, porId(102)];
  const amostraClara = [porId(107), porId(109), { ...porId(101), fotos: [] }];
  const civic = porId(103);

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-linha bg-fundo/85 backdrop-blur-md">
        <Container className="flex h-16 items-center justify-between gap-4">
          <Logo tamanho={40} />
          <p className="rotulo hidden sm:block">Guia de estilo · v1 · para aprovação</p>
        </Container>
      </header>

      <main>
        {/* Prévia da direção */}
        <section aria-labelledby="previa" className="relative overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(60%_80%_at_85%_20%,rgb(242_138_36/0.14),transparent_70%)]"
          />
          <Container className="relative grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-24">
            <div className="flex flex-col gap-6">
              <p className="flex items-center gap-2.5 text-rotulo font-bold uppercase text-destaque-texto">
                <span aria-hidden className="h-px w-6 bg-current" />
                Sorocaba, SP · Carros e motos
              </p>
              <h1 id="previa" className="text-display-xl uppercase">
                Nacionais, importados e{' '}
                <span className="inline-block -skew-x-[10deg] text-laranja-500 [font-stretch:100%]">
                  antigos.
                </span>
              </h1>
              <p className="max-w-xl text-lead text-texto-suave">
                Compra e venda com atendimento direto no WhatsApp. Escolha o veículo, compare,
                simule a parcela e fale com a loja.
              </p>
              <div className="flex flex-wrap gap-3">
                <ButtonLink to="/design" tamanho="lg">
                  Ver estoque <ArrowRight aria-hidden />
                </ButtonLink>
                <ButtonLink to="/design" variante="secundario" tamanho="lg">
                  <Calculator aria-hidden /> Simular financiamento
                </ButtonLink>
              </div>
              <dl className="mt-4 flex flex-wrap gap-x-10 gap-y-5 border-t border-linha pt-6">
                {[
                  ['12', 'veículos à venda'],
                  ['R$ 19.900', 'a partir de'],
                  ['11', 'carros'],
                  ['1', 'moto'],
                ].map(([valor, rotulo]) => (
                  <div key={rotulo} className="flex flex-col-reverse gap-1">
                    <dt className="text-sm text-texto-suave">{rotulo}</dt>
                    <dd className="whitespace-nowrap font-display text-3xl font-bold [font-stretch:85%]">
                      {valor}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <figure className="relative">
              <div className="aspect-[4/5] overflow-hidden rounded-xl border border-linha shadow-cartao sm:aspect-[5/4] lg:aspect-[4/5]">
                <VehiclePhoto veiculo={civic} prioridade sizes="(min-width: 1024px) 560px, 100vw" />
              </div>
              <figcaption className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-carbono-950/75 p-4 backdrop-blur-md">
                <div>
                  <p className="rotulo text-carbono-300">Em destaque</p>
                  <p className="font-display text-xl font-bold text-carbono-50">
                    Honda New Civic LXS
                  </p>
                </div>
                <p className="font-display text-2xl font-bold text-carbono-50 [font-stretch:92%]">
                  R$ 45.900
                </p>
              </figcaption>
            </figure>
          </Container>
        </section>

        <Bloco
          id="direcao"
          titulo="Direção visual"
          descricao="Base preta e laranja tirada da logo, agora com mais ritmo: superfícies em grafite, seções claras pontuais, caixa alta só nos títulos e o preço como protagonista do card."
        >
          <div className="grid gap-4 md:grid-cols-3">
            {[
              [
                'Confiança',
                'Contraste alto, informações completas e preço sempre visível. Nada de texto de protótipo para o cliente.',
              ],
              [
                'Modernidade',
                'Tipografia variável (Saira) que vai do condensado ao normal, cantos suaves e transições curtas.',
              ],
              [
                'Proximidade',
                'WhatsApp a um toque em todo lugar, linguagem direta e botões em caixa normal, que leem como conversa.',
              ],
            ].map(([t, d]) => (
              <Card key={t} className="p-6">
                <h3 className="text-display-sm uppercase">{t}</h3>
                <p className="mt-2 text-texto-suave">{d}</p>
              </Card>
            ))}
          </div>
        </Bloco>

        <Bloco
          id="paleta"
          titulo="Paleta"
          descricao="Primária: carbono (o preto da logo, em escala quente). Acento: laranja Kímika, só para ação e destaque. Os contrastes abaixo são calculados ao vivo."
        >
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <h3 className="rotulo">Primária · carbono</h3>
              <Escala nome="carbono" cores={carbono} />
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="rotulo">Acento · laranja</h3>
              <Escala nome="laranja" cores={laranja} />
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="rotulo">Estados</h3>
              <div className="flex flex-wrap gap-2">
                <Escala nome="sucesso" cores={{ base: '#3FB97A', escuro: '#1E7A4C' }} />
                <Escala nome="erro" cores={{ base: '#F07067', escuro: '#B4322A' }} />
                <Escala nome="aviso" cores={{ base: '#F2B35E', escuro: '#8A5A0C' }} />
              </div>
              <p className="text-sm text-texto-suave">
                "Base" é usada sobre fundo escuro; "escuro", sobre as seções claras.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="rotulo">Contraste (WCAG)</h3>
              <div className="grid gap-3 md:grid-cols-2">
                <ParContraste
                  frente="#F3EFE8"
                  fundo={PRETO}
                  rotulo="Texto sobre fundo"
                  uso="Corpo de texto, tema escuro"
                />
                <ParContraste
                  frente="#A8A299"
                  fundo={PRETO}
                  rotulo="Texto suave sobre fundo"
                  uso="Legendas, dados secundários"
                />
                <ParContraste
                  frente={PRETO}
                  fundo="#F28A24"
                  rotulo="Botão primário"
                  uso="Carbono sobre laranja-500"
                />
                <ParContraste
                  frente="#FA9535"
                  fundo={PRETO}
                  rotulo="Link/destaque no escuro"
                  uso="laranja-400 sobre fundo"
                />
                <ParContraste
                  frente="#161616"
                  fundo={MARFIM}
                  rotulo="Texto na seção clara"
                  uso="carbono-900 sobre marfim"
                />
                <ParContraste
                  frente="#A34F05"
                  fundo={MARFIM}
                  rotulo="Link/destaque no claro"
                  uso="laranja-700 sobre marfim"
                />
              </div>
            </div>
          </div>
        </Bloco>

        <Bloco
          id="tipografia"
          titulo="Tipografia"
          descricao="Saira (variável, eixo de largura) para títulos: condensada e em caixa alta, com o itálico ecoando a logo em pontos de destaque. Manrope para texto: legível no celular e com números tabulares para preços e km."
        >
          <div className="flex flex-col divide-y divide-linha border-y border-linha">
            {[
              ['display-xl', 'Hero da Home', 'text-display-xl uppercase', 'Nacionais e importados'],
              ['display-lg', 'Título de seção', 'text-display-lg uppercase', 'Estoque completo'],
              [
                'display-md',
                'Título de página interna',
                'text-display-md uppercase',
                'Renault Duster',
              ],
              [
                'display-sm',
                'Nome no card (caixa normal: "up!", "i30")',
                'text-display-sm',
                'Citroën C4 Cactus',
              ],
              [
                'preco',
                'Preço',
                'font-display text-preco font-bold [font-stretch:92%]',
                'R$ 54.900',
              ],
              [
                'lead',
                'Texto de apoio',
                'text-lead text-texto-suave',
                'Simule a parcela e fale com a loja pelo WhatsApp.',
              ],
              [
                'base',
                'Corpo (16px)',
                'text-base',
                'Ar condicionado, direção hidráulica, vidro e trava elétricos.',
              ],
              ['rotulo', 'Rótulos e campos', 'rotulo', 'Quilometragem'],
            ].map(([token, uso, classe, exemplo]) => (
              <div
                key={token}
                className="grid gap-2 py-5 md:grid-cols-[180px_1fr] md:items-baseline md:gap-8"
              >
                <div>
                  <p className="font-mono text-sm text-destaque-texto">{token}</p>
                  <p className="text-sm text-texto-suave">{uso}</p>
                </div>
                <p className={cn(classe, 'min-w-0 break-words')}>{exemplo}</p>
              </div>
            ))}
          </div>
        </Bloco>

        <Bloco
          id="botoes"
          titulo="Botões"
          descricao="Caixa normal (não mais tudo em maiúsculas). Laranja só na ação principal de cada bloco. Altura mínima de 44px para toque."
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <Button>Primário</Button>
              <Button variante="secundario">Secundário</Button>
              <Button variante="fantasma">Fantasma</Button>
              <Button disabled>Desabilitado</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button tamanho="sm">Pequeno</Button>
              <Button tamanho="md">Médio</Button>
              <Button tamanho="lg">Grande</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <ButtonLink href={linkWhatsApp(mensagens.geral())} tamanho="lg">
                <MessageCircle aria-hidden /> Chamar no WhatsApp
              </ButtonLink>
              <Button variante="secundario" tamanho="lg">
                <Search aria-hidden /> Buscar veículos
              </Button>
            </div>
          </div>
        </Bloco>

        <Bloco
          id="selos"
          titulo="Selos"
          descricao="Os mesmos do site atual (Reservado, Importado, Antigo). Novo/Seminovo/Destaque ficam como sugestão."
        >
          <div className="flex flex-wrap gap-3">
            <Badge variante="destaque">Reservado</Badge>
            <Badge>Importado</Badge>
            <Badge>Antigo</Badge>
            <Badge variante="sucesso">Disponível</Badge>
            <Badge variante="contorno">Vendido</Badge>
          </div>
        </Bloco>

        <Bloco
          id="formularios"
          titulo="Formulários"
          descricao="Label sempre visível, foco laranja, erro em texto e ligado ao campo por aria-describedby."
        >
          <Card className="grid gap-5 p-5 sm:grid-cols-2 sm:p-8">
            <Input label="Seu nome" placeholder="Como podemos te chamar?" autoComplete="name" />
            <Input
              label="WhatsApp"
              type="tel"
              placeholder="(15) 99999-9999"
              dica="Com DDD"
              autoComplete="tel"
            />
            <Select
              label="O que você quer fazer"
              opcoes={[
                { valor: 'Vender meu veículo', rotulo: 'Vender meu veículo' },
                { valor: 'Trocar por outro do estoque', rotulo: 'Trocar por outro do estoque' },
              ]}
            />
            <Input
              label="Ano"
              inputMode="numeric"
              defaultValue="20"
              erro="Informe o ano com 4 dígitos."
            />
            <Textarea
              label="Observações"
              className="sm:col-span-2"
              placeholder="Estado de conservação, revisões, detalhes..."
            />
            <div className="sm:col-span-2">
              <Button tamanho="lg">Pedir avaliação</Button>
            </div>
          </Card>
        </Bloco>

        <Bloco
          id="cards"
          titulo="Card de veículo"
          descricao="Foto 4:3 com recorte controlado, selo, favorito, marca + modelo, dados com ícones, preço em destaque e WhatsApp direto. O card inteiro leva ao detalhe; o hover eleva o card e aproxima a foto."
        >
          <div className="flex flex-col gap-8">
            <GradeCards lista={amostra} />
            <div className="flex flex-col gap-3">
              <h3 className="rotulo">Carregando (skeleton)</h3>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                <VehicleCardSkeleton />
                <VehicleCardSkeleton />
                <div className="hidden lg:block">
                  <VehicleCardSkeleton />
                </div>
              </div>
            </div>
          </div>
        </Bloco>

        <section aria-labelledby="secao-clara" className="tema-claro py-14 sm:py-20">
          <Container className="flex flex-col gap-10">
            <SectionTitle
              id="secao-clara"
              sobretitulo="Seção clara"
              titulo="O mesmo sistema em fundo claro"
              descricao="Usada para quebrar o ritmo (ex.: estoque ou venda/troca). Os componentes se adaptam sozinhos via tokens. O terceiro card mostra a ilustração de quando não há foto."
            />
            <GradeCards lista={amostraClara} />
          </Container>
        </section>

        <Bloco id="forma" titulo="Forma e profundidade">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['rounded-sm · 4px', 'Selos', 'rounded-sm'],
              ['rounded-md · 8px', 'Botões e campos', 'rounded-md'],
              ['rounded-lg · 12px', 'Cards', 'rounded-lg'],
              ['rounded-xl · 18px', 'Fotos grandes', 'rounded-xl'],
            ].map(([t, uso, r]) => (
              <div
                key={t}
                className={cn(
                  'flex h-32 flex-col justify-end border border-linha bg-superficie p-4 shadow-cartao',
                  r,
                )}
              >
                <p className="font-mono text-sm">{t}</p>
                <p className="text-sm text-texto-suave">{uso}</p>
              </div>
            ))}
          </div>
        </Bloco>
      </main>

      <footer className="border-t border-linha py-10">
        <Container className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <Logo tamanho={36} />
          <p className="text-sm text-texto-suave">
            Guia de estilo interno, fora do sitemap e com noindex.
          </p>
        </Container>
      </footer>
    </div>
  );
}
