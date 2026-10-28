import type { Veiculo } from '@/types/veiculo';
import { formatarKm, formatarPreco } from './formatar';

/** "Renault Duster" */
export const nomeCurto = (v: Veiculo) => `${v.marca} ${v.modelo}`;

/** "Renault Duster Dynamique" */
export const nomeCompleto = (v: Veiculo) => nomeCurto(v) + (v.versao ? ` ${v.versao}` : '');

export const ehMoto = (v: Veiculo) => v.carroceria === 'Moto';
export const ehAntigo = (v: Veiculo) => v.ano <= 1999;

/** Ano, km, câmbio e combustível, omitindo o que não foi informado. */
export function dadosResumo(v: Veiculo): string[] {
  return [
    String(v.ano),
    v.km != null ? formatarKm(v.km) : '',
    v.cambio ?? '',
    v.combustivel ?? '',
  ].filter(Boolean);
}

export const precoOuConsulte = (v: Veiculo, consulte = 'Consulte') =>
  v.preco ? formatarPreco(v.preco) : consulte;
