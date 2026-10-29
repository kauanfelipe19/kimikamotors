# Kímika Motors

Site da Kímika Motors, loja de carros e motos (nacionais, importados e antigos) em Sorocaba, SP.

Feito com Vite, React, TypeScript, Tailwind CSS e React Router. Os veículos ficam no **Supabase** (banco, login do painel e fotos). Sem Supabase configurado, o site usa o arquivo `src/data/veiculos.ts` e o painel vira uma demonstração.

## Páginas

| Endereço         | Conteúdo                                                                         |
| ---------------- | -------------------------------------------------------------------------------- |
| `/`              | Início: hero, números do estoque, veículos recentes, financiamento e venda/troca |
| `/estoque`       | Estoque com abas, busca, filtros, ordenação, favoritos e comparação              |
| `/estoque/:slug` | Detalhe do veículo, com ficha, itens, WhatsApp e simulador                       |
| `/financiamento` | Simulador de parcela (tabela Price)                                              |
| `/vender`        | Pedido de avaliação para vender ou trocar                                        |
| `/painel`        | Painel da loja: login, cadastro com fotos, edição, situação e exclusão           |
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

Copie `.env.example` para `.env` e preencha. Na Vercel, cadastre as mesmas variáveis em **Settings → Environment Variables**.

| Variável                        | Para quê                                              | Padrão                            |
| ------------------------------- | ----------------------------------------------------- | --------------------------------- |
| `VITE_SITE_URL`                 | Endereço público (canonical, Open Graph, sitemap)     | `https://kimikamotors.vercel.app` |
| `VITE_WHATSAPP_NUMERO`          | Número do WhatsApp da loja, com DDI e DDD, só dígitos | `5515981857291`                   |
| `VITE_SUPABASE_URL`             | URL do projeto Supabase                               | vazio (usa o arquivo local)       |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Chave pública (`sb_publishable_...`) do projeto       | vazio (usa o arquivo local)       |

A chave pública pode ir para o site: quem protege os dados são as regras do banco. **Nunca** use a chave secreta (`sb_secret_...`) aqui.

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

## Supabase: configuração inicial (uma vez)

1. No painel do Supabase, abra **SQL Editor → New query**, cole o conteúdo de [`supabase/schema.sql`](supabase/schema.sql) e clique em **Run**. Isso cria:
   - a tabela de veículos;
   - as regras de segurança: qualquer um vê o que está à venda, só a loja altera;
   - o espaço das fotos.
2. Numa nova query, cole [`supabase/carga-inicial.sql`](supabase/carga-inicial.sql) e rode. Ela traz os 12 veículos do site antigo.
3. Em **Authentication → Users → Add user → Create new user**, crie o login da loja (e-mail e senha) e marque **Auto Confirm User**.
4. No **SQL Editor**, libere esse e-mail para o painel:
   ```sql
   insert into public.admins (email) values ('email-da-loja@exemplo.com');
   ```
5. Recomendado: em **Authentication → Sign In / Providers**, desligue **Allow new users to sign up**. Mesmo ligado, só quem está em `admins` consegue alterar o estoque.

Para dar acesso a mais alguém da loja, repita os passos 3 e 4 com o e-mail da pessoa.

## Como cadastrar um veículo

Entre em `/painel` com o login da loja e preencha **Novo veículo**. Funciona pelo celular, e as fotos podem ser tiradas na hora. Elas são reduzidas no próprio aparelho (400 e 800 px, WebP) antes de subir. O veículo aparece na hora no estoque, na Home (entre os 6 mais recentes) e com página própria.

No painel também dá para:

- mudar a situação. **Reservado** mostra o selo; **Vendido** tira o veículo da loja;
- editar dados, itens e fotos. A primeira foto é a capa;
- excluir, com confirmação. As fotos saem junto.

O `sitemap.xml` é montado no build, com os veículos do banco. Os carros novos entram no sitemap no próximo deploy, mas aparecem no site na hora.

## Sem Supabase (arquivo local)

Sem as variáveis do Supabase, o estoque vem de `src/data/veiculos.ts` e o painel vira uma demonstração: o que se faz nele vale só no navegador de quem usou. Para cadastrar por código nesse modo:

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

Se mudar este arquivo e quiser levar as mudanças para o banco, `node scripts/gerar-sql-carga.mjs` gera de novo o `supabase/carga-inicial.sql`.

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
