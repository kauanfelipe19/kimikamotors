import { MessageCircle } from 'lucide-react';
import { useId, useState } from 'react';
import { ButtonLink } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { prazos, simulacaoPadrao, simular } from '@/lib/financiamento';
import { formatarPreco } from '@/lib/formatar';
import { linkWhatsApp, mensagens } from '@/lib/whatsapp';

interface SimuladorProps {
  /** Preço do veículo (no detalhe). Sem ele, o valor vira um campo editável. */
  valorFixo?: number;
  /** Nome do veículo, citado na mensagem do WhatsApp */
  rotulo?: string;
}

const opcoesPrazo = prazos.map((n) => ({ valor: String(n), rotulo: `${n} meses` }));

/** Simulador pela tabela Price, com os mesmos campos e padrões do site atual. */
export function Simulador({ valorFixo, rotulo }: SimuladorProps) {
  const idEntrada = useId();
  const [valorDigitado, setValorDigitado] = useState(String(simulacaoPadrao.valor));
  const [entradaPct, setEntradaPct] = useState<number>(simulacaoPadrao.entradaPct);
  const [prazo, setPrazo] = useState<number>(simulacaoPadrao.prazo);
  const [taxaDigitada, setTaxaDigitada] = useState(String(simulacaoPadrao.taxaMensal));

  const valor = valorFixo ?? (Number(valorDigitado) || 0);
  const taxaMensal = Number(taxaDigitada) || 0;
  const r = simular({ valor, entradaPct, prazo, taxaMensal });

  const mensagem = mensagens.simulacao({
    rotulo,
    valor,
    entrada: r.entrada,
    prazo,
    parcela: r.parcela,
  });

  return (
    <div className="flex flex-col gap-5">
      {valorFixo === undefined && (
        <Input
          label="Valor do veículo (R$)"
          type="number"
          inputMode="numeric"
          min={5000}
          step={1000}
          value={valorDigitado}
          onChange={(e) => setValorDigitado(e.target.value)}
        />
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor={idEntrada} className="rotulo">
          Entrada:{' '}
          <span className="normal-case tracking-normal text-texto">
            {entradaPct}% ({formatarPreco(r.entrada)})
          </span>
        </label>
        <input
          id={idEntrada}
          type="range"
          min={0}
          max={70}
          step={5}
          value={entradaPct}
          onChange={(e) => setEntradaPct(Number(e.target.value))}
          aria-valuetext={`${entradaPct}%, ${formatarPreco(r.entrada)}`}
          className="h-11 w-full cursor-pointer accent-laranja-500"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Prazo"
          opcoes={opcoesPrazo}
          value={String(prazo)}
          onChange={(e) => setPrazo(Number(e.target.value))}
        />
        <Input
          label="Taxa ao mês (%)"
          type="number"
          inputMode="decimal"
          min={0}
          step={0.01}
          value={taxaDigitada}
          onChange={(e) => setTaxaDigitada(e.target.value)}
        />
      </div>

      <div className="rounded-lg bg-superficie-2 p-5">
        <p className="rotulo">Parcela estimada</p>
        <output className="mt-1 block font-display text-display-md font-bold text-destaque-texto [font-stretch:85%]">
          {formatarPreco(r.parcela)}
        </output>
        <p className="text-sm text-texto-suave">por mês, em {prazo} parcelas</p>
        <dl className="mt-4 grid gap-2 border-t border-linha pt-4 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-texto-suave">Valor financiado</dt>
            <dd className="font-semibold">{formatarPreco(r.financiado)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-texto-suave">Total pago no prazo</dt>
            <dd className="font-semibold">{formatarPreco(r.total)}</dd>
          </div>
        </dl>
      </div>

      <p className="text-sm text-texto-suave">
        Simulação de exemplo. Taxa e aprovação dependem da análise do banco.
      </p>
      <ButtonLink href={linkWhatsApp(mensagem)} larguraTotal>
        <MessageCircle aria-hidden /> Enviar simulação no WhatsApp
      </ButtonLink>
    </div>
  );
}
