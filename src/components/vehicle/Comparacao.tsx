import { GitCompareArrows, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Modal } from '@/components/ui/Modal';
import { MAX_COMPARAR, MIN_COMPARAR, useComparacao } from '@/context/comparacao';
import { useVeiculosAVenda } from '@/hooks/useVeiculosAVenda';
import { simulacaoPadrao, simular } from '@/lib/financiamento';
import { formatarKm, formatarPreco } from '@/lib/formatar';
import { nomeCurto, precoOuConsulte } from '@/lib/veiculo';
import type { Veiculo } from '@/types/veiculo';
import { VehiclePhoto } from './VehiclePhoto';

/** Barra fixa no rodapé enquanto há veículos selecionados para comparar. */
export function BarraComparacao() {
  const { ids, aviso, limpar, abrir } = useComparacao();
  if (ids.length === 0 && !aviso) return null;

  const texto =
    aviso ??
    `${ids.length} de ${MAX_COMPARAR} selecionados${ids.length < MIN_COMPARAR ? ` · escolha ao menos ${MIN_COMPARAR}` : ''}`;

  return (
    <div
      role="region"
      aria-label="Comparação de veículos"
      className="fixed inset-x-0 bottom-0 z-30 bg-laranja-500 pb-[env(safe-area-inset-bottom)] text-carbono-950 shadow-[0_-8px_24px_rgb(0_0_0/0.35)]"
    >
      <div className="mx-auto flex max-w-conteudo flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 py-3">
        <p aria-live="polite" className="text-sm font-semibold sm:text-base">
          {texto}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={abrir}
            disabled={ids.length < MIN_COMPARAR}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-md bg-carbono-950 px-4 text-sm font-semibold text-carbono-50 transition-colors hover:text-laranja-400 disabled:opacity-40"
          >
            <GitCompareArrows className="size-4" aria-hidden />
            Comparar
          </button>
          <button
            type="button"
            onClick={limpar}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-md border border-carbono-950/30 px-4 text-sm font-semibold transition-colors hover:bg-carbono-950/10"
          >
            <X className="size-4" aria-hidden />
            Limpar
          </button>
        </div>
      </div>
    </div>
  );
}

const parcelaExemplo = (preco: number) => simular({ ...simulacaoPadrao, valor: preco }).parcela;

const linhas: { rotulo: string; valor: (v: Veiculo) => string }[] = [
  { rotulo: 'Preço', valor: (v) => precoOuConsulte(v) },
  { rotulo: 'Ano', valor: (v) => String(v.ano) },
  { rotulo: 'Quilometragem', valor: (v) => (v.km != null ? formatarKm(v.km) : '—') },
  { rotulo: 'Câmbio', valor: (v) => v.cambio ?? '—' },
  { rotulo: 'Carroceria', valor: (v) => v.carroceria },
  {
    rotulo: `Entrada ${simulacaoPadrao.entradaPct}% + ${simulacaoPadrao.prazo}x`,
    valor: (v) => (v.preco ? `${formatarPreco(parcelaExemplo(v.preco))} / mês` : '—'),
  },
];

export function ModalComparacao() {
  const { aberta, fechar } = useComparacao();
  return (
    <Modal aberto={aberta} onFechar={fechar} titulo="Comparar veículos" largura="xl">
      <TabelaComparacao />
    </Modal>
  );
}

function TabelaComparacao() {
  const { ids } = useComparacao();
  const veiculos = useVeiculosAVenda() ?? [];
  const lista = ids.flatMap((id) => veiculos.filter((v) => v.id === id));

  return (
    <>
      <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[34rem] border-collapse text-left text-sm sm:text-base">
          <thead>
            <tr>
              <td className="sticky left-0 z-10 w-28 bg-superficie sm:w-36" />
              {lista.map((v) => (
                <th key={v.id} scope="col" className="px-3 pb-4 align-bottom font-normal">
                  <Link to={`/estoque/${v.slug}`} className="group flex flex-col gap-3 rounded-md">
                    <span className="block aspect-[4/3] overflow-hidden rounded-md bg-superficie-2">
                      <VehiclePhoto veiculo={v} sizes="240px" />
                    </span>
                    <span>
                      <span className="block font-display text-xl font-bold group-hover:underline">
                        {nomeCurto(v)}
                      </span>
                      <span className="text-sm text-texto-suave">{v.versao}</span>
                    </span>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {linhas.map((l) => (
              <tr key={l.rotulo} className="border-t border-linha">
                {/* Rótulos fixos à esquerda enquanto a tabela rola no celular */}
                <th
                  scope="row"
                  className="rotulo sticky left-0 z-10 bg-superficie py-3 pr-3 align-top font-semibold"
                >
                  {l.rotulo}
                </th>
                {lista.map((v) => (
                  <td key={v.id} className="px-3 py-3 align-top font-semibold">
                    {l.valor(v)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-texto-suave">
        Parcela com taxa de exemplo de {simulacaoPadrao.taxaMensal.toLocaleString('pt-BR')}% ao mês.
      </p>
    </>
  );
}
