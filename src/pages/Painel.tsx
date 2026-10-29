import { ArrowLeft, Info, Trash2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { flushSync } from 'react-dom';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/layout/Logo';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { useComparacao } from '@/context/comparacao';
import { useFavoritos } from '@/context/favoritos';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useTodosVeiculos } from '@/hooks/useVeiculosAVenda';
import { cn } from '@/lib/cn';
import { formatarKm, formatarPreco } from '@/lib/formatar';
import { nomeCurto, precoOuConsulte } from '@/lib/veiculo';
import {
  adicionarVeiculo,
  alterarSituacao,
  excluirVeiculo,
  type NovoVeiculo,
} from '@/services/veiculos';
import type { Cambio, Carroceria, Combustivel, Situacao, Veiculo } from '@/types/veiculo';

const situacoes: Situacao[] = ['Disponível', 'Reservado', 'Vendido'];

export default function Painel() {
  usePageMeta({
    titulo: 'Painel',
    descricao: 'Área da loja (demonstração).',
    caminho: '/painel',
    noindex: true,
  });

  const veiculos = useTodosVeiculos();

  return (
    <div className="min-h-dvh">
      <header className="border-b border-linha">
        <Container className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="rounded-md" aria-label="Kímika Motors, página inicial">
            {/* No celular, só o selo: o nome não cabe ao lado do botão */}
            <Logo tamanho={40} className="[&>span:last-child]:max-sm:hidden" />
          </Link>
          <ButtonLink to="/" variante="secundario" tamanho="sm" className="whitespace-nowrap">
            <ArrowLeft aria-hidden /> Voltar para a loja
          </ButtonLink>
        </Container>
      </header>

      <main>
        <Container className="flex flex-col gap-8 py-10 sm:py-12">
          <div>
            <p className="rotulo text-destaque-texto">Área da loja</p>
            <h1 className="mt-2 text-display-lg uppercase">Painel</h1>
          </div>

          <p className="flex gap-3 rounded-lg border border-aviso/40 bg-aviso/10 p-4 text-sm">
            <Info className="mt-0.5 size-4 shrink-0 text-aviso" aria-hidden />
            <span>
              Visão de demonstração. No sistema final esta área fica atrás de login e as alterações
              ficam salvas no banco de dados. Por enquanto, elas valem só neste navegador.
            </span>
          </p>

          <Indicadores veiculos={veiculos} />

          <div className="grid items-start gap-8 xl:grid-cols-[1.6fr_1fr]">
            <TabelaVeiculos veiculos={veiculos} />
            <FormNovoVeiculo />
          </div>
        </Container>
      </main>
    </div>
  );
}

function Indicadores({ veiculos }: { veiculos: Veiculo[] | null }) {
  const lista = veiculos ?? [];
  const contar = (s: Situacao) => lista.filter((v) => v.situacao === s).length;
  const valor = lista
    .filter((v) => v.situacao !== 'Vendido')
    .reduce((soma, v) => soma + (v.preco ?? 0), 0);

  const itens = [
    ['Disponíveis', String(contar('Disponível'))],
    ['Reservados', String(contar('Reservado'))],
    ['Vendidos', String(contar('Vendido'))],
    ['Valor em estoque', formatarPreco(valor)],
  ];

  return (
    <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {itens.map(([rotulo, numero]) => (
        <div
          key={rotulo}
          className="flex flex-col-reverse gap-1 rounded-lg border border-linha bg-superficie p-4 sm:p-5"
        >
          <dt className="text-sm text-texto-suave">{rotulo}</dt>
          <dd className="font-display text-2xl font-bold [font-stretch:85%] sm:text-3xl">
            {veiculos ? numero : <Skeleton className="h-8 w-16" />}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function TabelaVeiculos({ veiculos }: { veiculos: Veiculo[] | null }) {
  const { ehFavorito, alternar } = useFavoritos();
  const { marcar } = useComparacao();
  // Excluir pede um segundo clique em "Confirmar", como no site atual
  const [armado, setArmado] = useState<number | null>(null);

  const excluir = (v: Veiculo) => {
    if (armado !== v.id) {
      setArmado(v.id);
      return;
    }
    setArmado(null);
    if (ehFavorito(v.id)) alternar(v.id);
    marcar(v.id, false);
    void excluirVeiculo(v.id);
  };

  const ordenados = [...(veiculos ?? [])].sort((a, b) => b.id - a.id);

  return (
    <section
      aria-label="Veículos cadastrados"
      // min-w-0: sem isso a tabela larga estica a coluna do grid e a página rola de lado
      className="min-w-0 overflow-hidden rounded-xl border border-linha bg-superficie"
    >
      {/* relative: prende os rótulos sr-only (absolutos) dentro da área que rola */}
      <div className="relative overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
          <thead className="border-b border-linha">
            <tr className="[&>th]:rotulo [&>th]:px-4 [&>th]:py-3">
              <th scope="col">Veículo</th>
              <th scope="col">Ano</th>
              <th scope="col">Preço</th>
              <th scope="col">Situação</th>
              <th scope="col">
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {ordenados.map((v) => (
              <tr key={v.id} className="border-b border-linha last:border-b-0">
                <td className="px-4 py-3">
                  <span className="block font-semibold text-texto">{nomeCurto(v)}</span>
                  <span className="text-texto-suave">
                    {[v.versao, v.km != null ? formatarKm(v.km) : ''].filter(Boolean).join(' · ')}
                  </span>
                </td>
                <td className="px-4 py-3">{v.ano}</td>
                <td className="whitespace-nowrap px-4 py-3">{precoOuConsulte(v)}</td>
                <td className="px-4 py-3">
                  <Select
                    label={`Situação de ${nomeCurto(v)}`}
                    labelOculto
                    opcoes={situacoes.map((s) => ({ valor: s, rotulo: s }))}
                    value={v.situacao}
                    onChange={(e) => void alterarSituacao(v.id, e.target.value as Situacao)}
                    className="min-w-36 [&_select]:min-h-10"
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    tamanho="sm"
                    variante={armado === v.id ? 'primario' : 'secundario'}
                    onClick={() => excluir(v)}
                    onBlur={() => setArmado((a) => (a === v.id ? null : a))}
                    aria-label={
                      armado === v.id
                        ? `Confirmar exclusão de ${nomeCurto(v)}`
                        : `Excluir ${nomeCurto(v)}`
                    }
                    className={cn(
                      armado === v.id &&
                        'bg-erro-escuro text-carbono-50 hover:bg-erro-escuro hover:shadow-none',
                    )}
                  >
                    <Trash2 aria-hidden />
                    {armado === v.id ? 'Confirmar' : 'Excluir'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p aria-live="polite" className="sr-only">
        {armado !== null ? 'Clique de novo para confirmar a exclusão.' : ''}
      </p>
    </section>
  );
}

const camposVazios = {
  marca: '',
  modelo: '',
  versao: '',
  ano: '',
  km: '',
  preco: '',
  cambio: '',
  combustivel: '',
  carroceria: 'Hatch',
  origem: '',
};
type Campos = typeof camposVazios;
type Erros = Partial<Record<keyof Campos, string>>;

const soDigitos = (s: string) => s.replace(/\D/g, '');
const ANO_MAX = new Date().getFullYear() + 1;

/** Mesmas regras do site atual: marca, modelo, ano (1900 até o ano que vem) e preço. */
function validar(c: Campos): Erros {
  const erros: Erros = {};
  const ano = Number(soDigitos(c.ano));
  if (!c.marca.trim()) erros.marca = 'Informe a marca.';
  if (!c.modelo.trim()) erros.modelo = 'Informe o modelo.';
  if (!ano || ano < 1900 || ano > ANO_MAX) erros.ano = `Informe um ano entre 1900 e ${ANO_MAX}.`;
  if (!Number(soDigitos(c.preco))) erros.preco = 'Informe o preço.';
  return erros;
}

function FormNovoVeiculo() {
  const [campos, setCampos] = useState<Campos>(camposVazios);
  const [erros, setErros] = useState<Erros>({});
  const [publicado, setPublicado] = useState<Veiculo | null>(null);

  const campo = (chave: keyof Campos) => ({
    value: campos[chave],
    erro: erros[chave],
    onChange: (e: { target: { value: string } }) =>
      setCampos((c) => ({ ...c, [chave]: e.target.value })),
  });

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const novos = validar(campos);
    flushSync(() => {
      setErros(novos);
      setPublicado(null);
    });
    if (Object.keys(novos).length > 0) {
      form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }
    const dados: NovoVeiculo = {
      marca: campos.marca.trim(),
      modelo: campos.modelo.trim(),
      versao: campos.versao.trim(),
      ano: Number(soDigitos(campos.ano)),
      km: soDigitos(campos.km) === '' ? null : Number(soDigitos(campos.km)),
      preco: Number(soDigitos(campos.preco)),
      cambio: (campos.cambio || null) as Cambio | null,
      combustivel: (campos.combustivel || null) as Combustivel | null,
      carroceria: campos.carroceria as Carroceria,
      importado: campos.origem === 'importado',
    };
    const novo = await adicionarVeiculo(dados);
    form.reset();
    setCampos(camposVazios);
    setPublicado(novo);
  };

  return (
    <form
      noValidate
      onSubmit={(e) => void enviar(e)}
      aria-labelledby="titulo-novo"
      className="flex flex-col gap-4 rounded-xl border border-linha bg-superficie p-5 sm:p-6"
    >
      <h2 id="titulo-novo" className="text-display-sm uppercase">
        Novo veículo
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Marca" placeholder="Fiat" {...campo('marca')} />
        <Input label="Modelo" placeholder="Argo" {...campo('modelo')} />
      </div>
      <Input label="Versão" placeholder="1.0 Drive" {...campo('versao')} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Ano" inputMode="numeric" placeholder="2020" {...campo('ano')} />
        <Input label="KM" inputMode="numeric" placeholder="45000" {...campo('km')} />
      </div>
      <Input label="Preço (R$)" inputMode="numeric" placeholder="59900" {...campo('preco')} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Câmbio"
          opcoes={[
            { valor: '', rotulo: 'Não informado' },
            { valor: 'Manual', rotulo: 'Manual' },
            { valor: 'Automático', rotulo: 'Automático' },
          ]}
          {...campo('cambio')}
        />
        <Select
          label="Combustível"
          opcoes={[
            { valor: '', rotulo: 'Não informado' },
            { valor: 'Flex', rotulo: 'Flex' },
            { valor: 'Gasolina', rotulo: 'Gasolina' },
          ]}
          {...campo('combustivel')}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Carroceria"
          opcoes={['Hatch', 'Sedan', 'SUV', 'Minivan', 'Perua', 'Moto'].map((c) => ({
            valor: c,
            rotulo: c,
          }))}
          {...campo('carroceria')}
        />
        <Select
          label="Origem"
          opcoes={[
            { valor: '', rotulo: 'Nacional' },
            { valor: 'importado', rotulo: 'Importado' },
          ]}
          {...campo('origem')}
        />
      </div>
      {/* Campo mantido do site atual; o arquivo é ignorado na demonstração */}
      <Input
        label="Fotos"
        type="file"
        accept="image/*"
        multiple
        dica="No sistema final as fotos sobem direto do celular."
        className="[&_input]:py-2.5 [&_input]:text-sm"
      />
      <Button type="submit">Publicar na loja</Button>

      <p role="status" className="text-sm empty:hidden">
        {publicado && (
          <>
            Publicado na loja:{' '}
            <Link
              to={`/estoque/${publicado.slug}`}
              className="font-semibold text-destaque-texto underline underline-offset-4"
            >
              {nomeCurto(publicado)} {publicado.ano}
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
