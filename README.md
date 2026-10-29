# Kímika Motors

Site da Kímika Motors, loja de carros e motos (nacionais, importados e antigos) em Sorocaba, SP.

Feito com Vite, React, TypeScript, Tailwind CSS e React Router. Os dados dos veículos ficam num arquivo do próprio projeto e passam por uma camada de serviço que pode ser trocada por um banco (Supabase, por exemplo) sem mexer nas páginas.

## Páginas

| Endereço         | Conteúdo                                                                         |
| ---------------- | -------------------------------------------------------------------------------- |
| `/`              | Início: hero, números do estoque, veículos recentes, financiamento e venda/troca |
| `/estoque`       | Estoque com abas, busca, filtros, ordenação, favoritos e comparação              |
| `/estoque/:slug` | Detalhe do veículo, com ficha, itens, WhatsApp e simulador                       |
| `/financiamento` | Simulador de parcela (tabela Price)                                              |
| `/vender`        | Pedido de avaliação para vender ou trocar                                        |
| `/painel`        | Painel da loja, **em modo demonstração** (sem login, salva só no navegador)      |
| `/design`        | Guia de estilo (paleta, tipografia e componentes), fora do Google                |

## Como rodar

Requisitos: [Node.js](https://nodejs.org) 20 ou mais novo (o projeto foi feito com o 24) e npm.

```bash
npm install
```

```bash
npm run dev
```

O site abre em http://localhost:5173.

### Variáveis de ambiente

Copie `.env.example` para `.env` e ajuste, se precisar. Nenhuma é obrigatória, e as duas têm valor padrão.

| Variável               | Para quê                                              | Padrão                            |
| ---------------------- | ----------------------------------------------------- | --------------------------------- |
| `VITE_SITE_URL`        | Endereço público (canonical, Open Graph, sitemap)     | `https://kimikamotors.vercel.app` |
| `VITE_WHATSAPP_NUMERO` | Número do WhatsApp da loja, com DDI e DDD, só dígitos | `5515981857291`                   |

## Build e publicação

```bash
npm run build
```

O resultado vai para `dist/`, já com o `sitemap.xml`. Para conferir o build localmente:

```bash
npm run preview
```

A publicação foi pensada para a **Vercel**. O `vercel.json` manda qualquer endereço sem extensão para o `index.html`, para as rotas como `/estoque/...` funcionarem ao abrir o link direto. Em outro serviço (Netlify, Cloudflare Pages), configure a mesma regra de SPA.

### Outros comandos

| Comando                | O que faz                                          |
| ---------------------- | -------------------------------------------------- |
| `npm run typecheck`    | Checa os tipos do TypeScript                       |
| `npm run lint`         | ESLint (inclui regras de acessibilidade)           |
| `npm run format`       | Formata tudo com Prettier                          |
| `npm run format:check` | Só confere a formatação                            |
| `npm run imagens`      | Gera as versões otimizadas das fotos (veja abaixo) |

## Como cadastrar um veículo

Hoje o estoque fica no arquivo `src/data/veiculos.ts`. O painel em `/painel` é só uma demonstração: o que se faz nele vale apenas no navegador de quem usou.

### 1. Prepare a foto

Coloque a foto (JPG, PNG ou WebP, de preferência com 800 px de largura ou mais) numa pasta qualquer, por exemplo `fotos-novas/argo.jpg`, e rode:

```bash
npm run imagens -- fotos-novas
```

O script cria `public/img/veiculos/argo-400.avif`, `argo-400.webp`, `argo-800.avif` e `argo-800.webp`. O nome do arquivo (`argo`) é o que vai no campo `arquivo`.

### 2. Adicione o veículo em `src/data/veiculos.ts`

Copie um item existente e ajuste:

```ts
{
  id: 113, // maior que todos os outros; define a ordem "mais recentes"
  slug: 'fiat-argo-drive-1-0-2020', // vira o endereço /estoque/fiat-argo-drive-1-0-2020
  marca: 'Fiat',
  modelo: 'Argo',
  versao: 'Drive 1.0', // pode ficar ''
  ano: 2020,
  km: 45000, // null se não souber
  preco: 59900, // null mostra "Consulte"
  cambio: 'Manual', // 'Manual' | 'Automático' | null
  combustivel: 'Flex', // 'Flex' | 'Gasolina' | null
  carroceria: 'Hatch', // 'Hatch' | 'Sedan' | 'SUV' | 'Minivan' | 'Perua' | 'Moto'
  situacao: 'Disponível', // 'Disponível' | 'Reservado' | 'Vendido'
  importado: false,
  cor: '#9A3B3B', // cor da ilustração, usada só se não houver foto
  fotos: [{ arquivo: 'argo', alt: 'Fiat Argo Drive 2020 vermelho, de frente', foco: '50% 62%' }],
  itens: ['Ar condicionado', 'Direção elétrica'],
},
```

- **`slug`:** único, só com letras minúsculas, números e hífens (sem acentos).
- **`alt`:** descreve a foto para quem usa leitor de tela.
- **`foco`:** ajusta o recorte da foto no card. É o `object-position` do CSS; `50% 85%` puxa o recorte para baixo.
- **Vendido:** some da loja e do sitemap, e o link dele passa a mostrar "não encontrada". Para tirar de vez, apague o item.

Depois, rode `npm run build` (ou publique) e o veículo aparece no estoque, na Home, no sitemap e com página própria.

### Para um painel de verdade

Para a loja cadastrar pelo celular, sem mexer em código, é preciso um banco e login. Basta reimplementar as funções de `src/services/veiculos.ts` (`listarVeiculos`, `alterarSituacao`, `adicionarVeiculo` etc.) usando, por exemplo, o Supabase. As páginas não precisam mudar. Os detalhes estão em `docs/sugestoes.md`.

## Estrutura

```
src/
  components/
    ui/            Button, Card, Badge, Input, Select, Textarea, Modal, Container, SectionTitle...
    layout/        Cabeçalho, rodapé, logo, layout das páginas, janela de favoritos
    vehicle/       Card, foto e comparação de veículos
    financiamento/ Simulador
    sections/      Blocos reaproveitáveis (passos numerados)
  context/         Favoritos e comparação (em memória)
  data/            Estoque inicial
  hooks/           Meta tags por página, lista de veículos, estado da sessão
  lib/             Formatação, regras do estoque, financiamento, WhatsApp, JSON-LD
  pages/           Uma por rota (carregadas sob demanda, exceto a Home)
  services/        Acesso aos veículos (o ponto de troca para um banco)
  styles/          CSS global e tokens de cor
docs/
  inventario-funcionalidades.md  O que o site antigo fazia (referência de paridade)
  identidade-atual.md            Auditoria visual do site antigo
  decisoes.md                    Decisões tomadas em cada etapa
  sugestoes.md                   Melhorias propostas e ainda não feitas
  revisao-final.md               O que foi verificado na entrega
```

Os tokens de design (cores, fontes, tamanhos) ficam em `tailwind.config.ts` e `src/styles/global.css`. Para ver todos aplicados, abra `/design`.
