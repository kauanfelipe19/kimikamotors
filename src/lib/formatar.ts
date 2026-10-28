const moeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});
const numero = new Intl.NumberFormat('pt-BR');

export const formatarPreco = (valor: number) => moeda.format(valor);
export const formatarNumero = (valor: number) => numero.format(valor);
export const formatarKm = (km: number) => `${numero.format(km)} km`;
