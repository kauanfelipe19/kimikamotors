import type { OpcaoSelect } from '@/components/ui/Select';
import type { Veiculo } from '@/types/veiculo';
import { ehAntigo, ehMoto, nomeCurto } from './veiculo';

/* Busca, filtros e ordenação do estoque, com as mesmas regras do site atual. */

export type Categoria = '' | 'Carros' | 'Motos' | 'Importados' | 'Antigos';
export type Ordem = 'recentes' | 'menor-preco' | 'maior-preco' | 'ano' | 'menor-km';

export interface Filtros {
  busca: string;
  categoria: Categoria;
  marca: string;
  carroceria: string;
  /** Valores numéricos guardados como texto, igual ao value dos selects ('' = qualquer) */
  precoMax: string;
  anoMin: string;
  kmMax: string;
  cambio: string;
}

export const filtrosVazios: Filtros = {
  busca: '',
  categoria: '',
  marca: '',
  carroceria: '',
  precoMax: '',
  anoMin: '',
  kmMax: '',
  cambio: '',
};

export function filtrarVeiculos(lista: Veiculo[], f: Filtros): Veiculo[] {
  const busca = f.busca.trim().toLowerCase();
  return lista.filter((v) => {
    if (busca && !`${nomeCurto(v)} ${v.versao}`.toLowerCase().includes(busca)) return false;
    if (f.categoria === 'Carros' && ehMoto(v)) return false;
    if (f.categoria === 'Motos' && !ehMoto(v)) return false;
    if (f.categoria === 'Importados' && !v.importado) return false;
    if (f.categoria === 'Antigos' && !ehAntigo(v)) return false;
    if (f.carroceria && v.carroceria !== f.carroceria) return false;
    if (f.marca && v.marca !== f.marca) return false;
    // Sem preço ou sem km, o veículo sai quando esse filtro está ativo
    if (f.precoMax && (!v.preco || v.preco > Number(f.precoMax))) return false;
    if (f.anoMin && v.ano < Number(f.anoMin)) return false;
    if (f.kmMax && (v.km == null || v.km > Number(f.kmMax))) return false;
    if (f.cambio && v.cambio !== f.cambio) return false;
    return true;
  });
}

/** Ordena uma cópia. Quem não tem preço ou km vai para o fim. */
export function ordenarVeiculos(lista: Veiculo[], ordem: Ordem): Veiculo[] {
  const SEM = 1e12;
  return [...lista].sort((a, b) => {
    switch (ordem) {
      case 'menor-preco':
        return (a.preco || SEM) - (b.preco || SEM);
      case 'maior-preco':
        return (b.preco || 0) - (a.preco || 0);
      case 'ano':
        return b.ano - a.ano;
      case 'menor-km':
        return (a.km ?? SEM) - (b.km ?? SEM);
      default:
        return b.id - a.id;
    }
  });
}

/** Abas de categoria. Importados e Antigos só aparecem quando há veículos assim. */
export function categoriasDisponiveis(lista: Veiculo[]): { valor: Categoria; rotulo: string }[] {
  const abas: { valor: Categoria; rotulo: string }[] = [
    { valor: '', rotulo: 'Todos' },
    { valor: 'Carros', rotulo: 'Carros' },
    { valor: 'Motos', rotulo: 'Motos' },
  ];
  if (lista.some((v) => v.importado)) abas.push({ valor: 'Importados', rotulo: 'Importados' });
  if (lista.some(ehAntigo)) abas.push({ valor: 'Antigos', rotulo: 'Antigos' });
  return abas;
}

export const opcoesMarca = (lista: Veiculo[]): OpcaoSelect[] => [
  { valor: '', rotulo: 'Todas' },
  ...[...new Set(lista.map((v) => v.marca))].sort().map((m) => ({ valor: m, rotulo: m })),
];

export const opcoesCarroceria: OpcaoSelect[] = [
  { valor: '', rotulo: 'Todas' },
  ...['Hatch', 'Sedan', 'SUV', 'Minivan', 'Perua'].map((c) => ({ valor: c, rotulo: c })),
];

export const opcoesPreco: OpcaoSelect[] = [
  { valor: '', rotulo: 'Qualquer' },
  ...[30, 50, 80, 120].map((mil) => ({ valor: String(mil * 1000), rotulo: `R$ ${mil} mil` })),
];

export const opcoesAno: OpcaoSelect[] = [
  { valor: '', rotulo: 'Qualquer' },
  ...[2020, 2015, 2010, 2005].map((a) => ({ valor: String(a), rotulo: `${a} ou mais novo` })),
];

export const opcoesKm: OpcaoSelect[] = [
  { valor: '', rotulo: 'Qualquer' },
  ...[30, 60, 100, 150].map((mil) => ({ valor: String(mil * 1000), rotulo: `${mil}.000 km` })),
];

export const opcoesCambio: OpcaoSelect[] = [
  { valor: '', rotulo: 'Todos' },
  { valor: 'Manual', rotulo: 'Manual' },
  { valor: 'Automático', rotulo: 'Automático' },
];

export const opcoesOrdem: { valor: Ordem; rotulo: string }[] = [
  { valor: 'recentes', rotulo: 'Mais recentes' },
  { valor: 'menor-preco', rotulo: 'Menor preço' },
  { valor: 'maior-preco', rotulo: 'Maior preço' },
  { valor: 'ano', rotulo: 'Ano mais novo' },
  { valor: 'menor-km', rotulo: 'Menor KM' },
];
