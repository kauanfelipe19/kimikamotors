import { Simulador } from '@/components/financiamento/Simulador';
import { Passos } from '@/components/sections/Passos';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function Financiamento() {
  usePageMeta({
    titulo: 'Simule o financiamento',
    descricao:
      'Simule a parcela do seu carro ou moto: escolha o valor, a entrada e o prazo e envie a simulação para a Kímika Motors pelo WhatsApp.',
    caminho: '/financiamento',
  });

  return (
    <Container className="grid gap-10 py-10 sm:py-14 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:py-20">
      <div className="flex flex-col gap-8">
        <SectionTitle
          nivel={1}
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

      <section
        aria-label="Simulador de financiamento"
        className="tema-claro rounded-xl border border-linha bg-superficie p-5 shadow-cartao sm:p-8 lg:self-start"
      >
        <Simulador />
      </section>
    </Container>
  );
}
