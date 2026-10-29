import type { Veiculo } from '@/types/veiculo';
import { config } from './config';
import { formatarPreco } from './formatar';
import { nomeCompleto } from './veiculo';

export const linkWhatsApp = (texto: string) =>
  `https://wa.me/${config.whatsappNumero}?text=${encodeURIComponent(texto)}`;

// Mensagens idênticas às do site atual
export const mensagens = {
  geral: () => 'Olá! Vim pelo site da Kímika Motors.',
  interesse: (v: Veiculo) =>
    `Olá! Tenho interesse no ${nomeCompleto(v)} ${v.ano}${v.preco ? ` (${formatarPreco(v.preco)})` : ''}.`,
  troca: (v: Veiculo) => `Olá! Quero dar o meu veículo na troca pelo ${nomeCompleto(v)} ${v.ano}.`,
  /** `rotulo` é o veículo do detalhe; no simulador geral vai "veículo de R$ X" */
  simulacao: (s: {
    rotulo?: string;
    valor: number;
    entrada: number;
    prazo: number;
    parcela: number;
  }) =>
    `Olá! Fiz uma simulação no site: ${s.rotulo ?? `veículo de ${formatarPreco(s.valor)}`}, entrada de ${formatarPreco(s.entrada)}, ${s.prazo}x de cerca de ${formatarPreco(s.parcela)}. Podem me ajudar?`,
} as const;
