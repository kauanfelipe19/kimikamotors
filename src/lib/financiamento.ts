/** Valores iniciais do simulador, iguais aos do site atual. */
export const simulacaoPadrao = {
  valor: 59900,
  entradaPct: 30,
  prazo: 36,
  taxaMensal: 1.99,
} as const;

export const prazos = [12, 24, 36, 48, 60] as const;

/** Parcela pela tabela Price. `i` é a taxa ao mês em fração (1,99% = 0.0199). */
export function calcularParcela(pv: number, i: number, n: number): number {
  if (pv <= 0) return 0;
  if (i === 0) return pv / n;
  return (pv * i) / (1 - Math.pow(1 + i, -n));
}

export interface Simulacao {
  valor: number;
  entradaPct: number;
  prazo: number;
  /** Em %, como o usuário digita (1.99) */
  taxaMensal: number;
}

export function simular({ valor, entradaPct, prazo, taxaMensal }: Simulacao) {
  const entrada = Math.round((valor * entradaPct) / 100);
  const financiado = valor - entrada;
  const parcela = calcularParcela(financiado, taxaMensal / 100, prazo);
  return { entrada, financiado, parcela, total: parcela * prazo + entrada };
}
