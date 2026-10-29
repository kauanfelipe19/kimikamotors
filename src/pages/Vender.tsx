import { CheckCircle2, MessageCircle } from 'lucide-react';
import { useRef, useState, type FormEvent } from 'react';
import { flushSync } from 'react-dom';
import { Passos } from '@/components/sections/Passos';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Input } from '@/components/ui/Input';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { usePageMeta } from '@/hooks/usePageMeta';
import { linkWhatsApp, mensagens } from '@/lib/whatsapp';

const objetivos = ['Vender meu veículo', 'Trocar por outro do estoque'].map((o) => ({
  valor: o,
  rotulo: o,
}));

const camposVazios = {
  objetivo: objetivos[0]?.valor ?? '',
  nome: '',
  whatsapp: '',
  modelo: '',
  ano: '',
  km: '',
  obs: '',
};
type Campos = typeof camposVazios;
type Erros = Partial<Record<keyof Campos, string>>;

/** Mesmas regras do site atual: nome, WhatsApp, modelo e ano obrigatórios; telefone com DDD. */
function validar(c: Campos): Erros {
  const erros: Erros = {};
  if (!c.nome.trim()) erros.nome = 'Informe seu nome.';
  if (!c.whatsapp.trim()) erros.whatsapp = 'Informe seu WhatsApp.';
  else if (c.whatsapp.replace(/\D/g, '').length < 10)
    erros.whatsapp = 'Confira o número de WhatsApp com DDD.';
  if (!c.modelo.trim()) erros.modelo = 'Informe a marca e o modelo.';
  if (!c.ano.trim()) erros.ano = 'Informe o ano.';
  return erros;
}

export default function Vender() {
  usePageMeta({
    titulo: 'Venda ou troque seu veículo',
    descricao:
      'Quer vender ou trocar seu carro ou moto? Preencha os dados e receba a avaliação da Kímika Motors pelo WhatsApp, sem compromisso.',
    caminho: '/vender',
  });

  const [campos, setCampos] = useState<Campos>(camposVazios);
  const [erros, setErros] = useState<Erros>({});
  const [linkPronto, setLinkPronto] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const sucessoRef = useRef<HTMLDivElement>(null);

  const definir = (chave: keyof Campos) => (valor: string) =>
    setCampos((c) => ({ ...c, [chave]: valor }));

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    const novos = validar(campos);
    if (Object.keys(novos).length > 0) {
      // flushSync atualiza o DOM na hora, para o foco ir ao primeiro campo com erro
      flushSync(() => {
        setErros(novos);
        setLinkPronto(null);
      });
      formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }
    const t = (s: string) => s.trim();
    flushSync(() => {
      setErros({});
      setLinkPronto(
        linkWhatsApp(
          mensagens.avaliacao({
            nome: t(campos.nome),
            objetivo: campos.objetivo,
            modelo: t(campos.modelo),
            ano: t(campos.ano),
            km: t(campos.km),
            obs: t(campos.obs),
            whatsapp: t(campos.whatsapp),
          }),
        ),
      );
    });
    sucessoRef.current?.focus();
  };

  return (
    <Container className="grid gap-10 py-10 sm:py-14 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:py-20">
      <div className="flex flex-col gap-8">
        <SectionTitle
          nivel={1}
          sobretitulo="Venda ou troca"
          titulo="Quer vender ou trocar o seu?"
          descricao="Preencha os dados do veículo e receba a avaliação pelo WhatsApp, sem compromisso. Vale para carros e motos, nacionais, importados e antigos."
        />
        <Passos
          passos={[
            { titulo: 'Conte sobre o veículo', texto: 'Marca, modelo, ano e quilometragem.' },
            { titulo: 'Receba a avaliação', texto: 'A equipe responde pelo WhatsApp.' },
            {
              titulo: 'Venda ou troque',
              texto: 'Use o valor como entrada em outro veículo do estoque.',
            },
          ]}
        />
      </div>

      <form
        ref={formRef}
        noValidate
        onSubmit={enviar}
        aria-label="Pedido de avaliação"
        className="tema-claro flex flex-col gap-5 rounded-xl border border-linha bg-superficie p-5 shadow-cartao sm:p-8 lg:self-start"
      >
        <Select
          label="O que você quer fazer"
          opcoes={objetivos}
          value={campos.objetivo}
          onChange={(e) => definir('objetivo')(e.target.value)}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Seu nome"
            autoComplete="name"
            required
            value={campos.nome}
            erro={erros.nome}
            onChange={(e) => definir('nome')(e.target.value)}
          />
          <Input
            label="WhatsApp"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(15) 90000-0000"
            required
            value={campos.whatsapp}
            erro={erros.whatsapp}
            onChange={(e) => definir('whatsapp')(e.target.value)}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-[1fr_8rem]">
          <Input
            label="Marca e modelo"
            placeholder="Ex.: Fiat Uno 1.0"
            required
            value={campos.modelo}
            erro={erros.modelo}
            onChange={(e) => definir('modelo')(e.target.value)}
          />
          <Input
            label="Ano"
            inputMode="numeric"
            placeholder="2015"
            required
            value={campos.ano}
            erro={erros.ano}
            onChange={(e) => definir('ano')(e.target.value)}
          />
        </div>
        <Input
          label="Quilometragem"
          dica="Opcional"
          inputMode="numeric"
          placeholder="Ex.: 85000"
          value={campos.km}
          onChange={(e) => definir('km')(e.target.value)}
        />
        <Textarea
          label="Observações"
          dica="Opcional"
          placeholder="Estado geral, revisões, financiamento em aberto"
          value={campos.obs}
          onChange={(e) => definir('obs')(e.target.value)}
        />

        <Button type="submit" tamanho="lg">
          Pedir avaliação
        </Button>

        {linkPronto && (
          <div
            ref={sucessoRef}
            tabIndex={-1}
            role="status"
            className="flex flex-col gap-3 rounded-lg border border-sucesso-escuro/30 bg-sucesso/10 p-5 outline-none"
          >
            <p className="flex items-center gap-2 font-semibold text-sucesso-escuro">
              <CheckCircle2 className="size-5" aria-hidden />
              Pedido montado.
            </p>
            <p className="text-sm text-texto-suave">
              Toque no botão para abrir a conversa com a loja. A mensagem já vai pronta, com os
              dados do seu veículo.
            </p>
            <ButtonLink href={linkPronto}>
              <MessageCircle aria-hidden /> Abrir mensagem no WhatsApp
            </ButtonLink>
          </div>
        )}
      </form>
    </Container>
  );
}
