import { SearchX, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { VehicleCard, VehicleCardSkeleton } from '@/components/vehicle/VehicleCard';
import { useComparacao } from '@/context/comparacao';
import { useFavoritos } from '@/context/favoritos';
import { useEstadoDaSessao } from '@/hooks/useEstadoDaSessao';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useVeiculosAVenda } from '@/hooks/useVeiculosAVenda';
import { cn } from '@/lib/cn';
import {
  categoriasDisponiveis,
  filtrarVeiculos,
  filtrosVazios,
  opcoesAno,
  opcoesCambio,
  opcoesCarroceria,
  opcoesKm,
  opcoesMarca,
  opcoesOrdem,
  opcoesPreco,
  ordenarVeiculos,
  type Filtros,
  type Ordem,
} from '@/lib/estoque';

export default function Estoque() {
  usePageMeta({
    titulo: 'Estoque de carros e motos',
    descricao:
      'Veja os carros e motos à venda na Kímika Motors, em Sorocaba, SP. Filtre por marca, preço, ano e km, compare e fale com a loja pelo WhatsApp.',
    caminho: '/estoque',
  });

  const veiculos = useVeiculosAVenda();
  const { ehFavorito, alternar } = useFavoritos();
  const comparacao = useComparacao();

  const [filtros, setFiltros] = useEstadoDaSessao<Filtros>('estoque:filtros', filtrosVazios);
  const [ordem, setOrdem] = useEstadoDaSessao<Ordem>('estoque:ordem', 'recentes');
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);

  const definir = <K extends keyof Filtros>(chave: K, valor: Filtros[K]) =>
    setFiltros((f) => ({ ...f, [chave]: valor }));
  // Como no site atual, "Remover filtros" mantém a ordenação
  const removerFiltros = () => setFiltros(filtrosVazios);

  const resultado = useMemo(
    () => (veiculos ? ordenarVeiculos(filtrarVeiculos(veiculos, filtros), ordem) : null),
    [veiculos, filtros, ordem],
  );
  const abas = categoriasDisponiveis(veiculos ?? []);

  return (
    <Container className="py-10 sm:py-14">
      <div className="flex flex-col gap-3">
        <p className="flex items-center gap-2.5 text-rotulo font-bold uppercase text-destaque-texto">
          <span aria-hidden className="h-px w-6 bg-current" />
          Sorocaba, SP · Carros e motos
        </p>
        <h1 className="text-display-lg uppercase">Estoque</h1>
      </div>

      <div
        role="group"
        aria-label="Tipo de veículo"
        className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0"
      >
        {abas.map((a) => (
          <button
            key={a.valor}
            type="button"
            aria-pressed={filtros.categoria === a.valor}
            onClick={() => definir('categoria', a.valor)}
            className="min-h-11 shrink-0 rounded-full border border-linha px-5 text-sm font-semibold text-texto-suave transition-colors hover:border-texto/50 hover:text-texto aria-pressed:border-laranja-500 aria-pressed:bg-laranja-500 aria-pressed:text-carbono-950"
          >
            {a.rotulo}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[17rem_1fr] lg:gap-10">
        <aside aria-label="Busca e filtros" className="flex flex-col gap-4">
          <div className="flex items-end gap-3">
            <Input
              label="Busca"
              type="search"
              placeholder="Marca ou modelo"
              value={filtros.busca}
              onChange={(e) => definir('busca', e.target.value)}
              className="flex-1"
            />
            <Button
              variante="secundario"
              aria-expanded={filtrosAbertos}
              aria-controls="filtros"
              onClick={() => setFiltrosAbertos((a) => !a)}
              className="min-h-12 lg:hidden"
            >
              <SlidersHorizontal aria-hidden />
              {filtrosAbertos ? 'Fechar filtros' : 'Filtros'}
            </Button>
          </div>

          <div
            id="filtros"
            className={cn(
              'grid gap-4 sm:grid-cols-2 lg:grid lg:grid-cols-1',
              !filtrosAbertos && 'hidden',
            )}
          >
            <Select
              label="Marca"
              opcoes={opcoesMarca(veiculos ?? [])}
              value={filtros.marca}
              onChange={(e) => definir('marca', e.target.value)}
            />
            <Select
              label="Carroceria"
              opcoes={opcoesCarroceria}
              value={filtros.carroceria}
              onChange={(e) => definir('carroceria', e.target.value)}
            />
            <Select
              label="Preço até"
              opcoes={opcoesPreco}
              value={filtros.precoMax}
              onChange={(e) => definir('precoMax', e.target.value)}
            />
            <Select
              label="Ano"
              opcoes={opcoesAno}
              value={filtros.anoMin}
              onChange={(e) => definir('anoMin', e.target.value)}
            />
            <Select
              label="KM até"
              opcoes={opcoesKm}
              value={filtros.kmMax}
              onChange={(e) => definir('kmMax', e.target.value)}
            />
            <Select
              label="Câmbio"
              opcoes={opcoesCambio}
              value={filtros.cambio}
              onChange={(e) => definir('cambio', e.target.value)}
            />
            <Button
              variante="fantasma"
              onClick={removerFiltros}
              className="justify-self-start px-0 text-destaque-texto underline-offset-4 hover:bg-transparent hover:underline"
            >
              Remover filtros
            </Button>
          </div>
        </aside>

        <section aria-label="Resultados">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <p aria-live="polite" className="font-display text-2xl font-bold [font-stretch:85%]">
              {resultado
                ? `${resultado.length} ${resultado.length === 1 ? 'veículo' : 'veículos'}`
                : 'Carregando…'}
            </p>
            <Select
              label="Ordenar"
              opcoes={opcoesOrdem}
              value={ordem}
              onChange={(e) => setOrdem(e.target.value as Ordem)}
              className="w-full sm:w-56"
            />
          </div>

          {resultado && resultado.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-linha px-6 py-16 text-center">
              <SearchX className="size-10 text-texto-suave" aria-hidden />
              <div>
                <p className="font-semibold">Nenhum veículo com esses filtros.</p>
                <p className="mt-1 text-texto-suave">
                  Tente ampliar o preço ou remover algum filtro.
                </p>
              </div>
              <Button variante="secundario" onClick={removerFiltros}>
                Remover filtros
              </Button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {resultado
                ? resultado.map((v, i) => (
                    <VehicleCard
                      key={v.id}
                      veiculo={v}
                      prioridade={i < 2}
                      favorito={ehFavorito(v.id)}
                      onFavoritar={alternar}
                      comparando={comparacao.ids.includes(v.id)}
                      onComparar={comparacao.marcar}
                    />
                  ))
                : Array.from({ length: 6 }, (_, i) => <VehicleCardSkeleton key={i} />)}
            </div>
          )}
          <p className="mt-6 text-sm text-texto-suave">
            Dados copiados dos anúncios da loja no Instagram. O que não aparecia no anúncio ficou em
            branco.
          </p>
        </section>
      </div>
    </Container>
  );
}
