# Revisão final (Etapa 4, 28/10/2026)

## Checagens automáticas

| Checagem                        | Resultado                                   |
| ------------------------------- | ------------------------------------------- |
| `npm run typecheck` (TS strict) | Sem erros                                   |
| `npm run lint` (ESLint + a11y)  | Sem erros nem avisos                        |
| `npm run format:check`          | Tudo formatado                              |
| `npm run build`                 | Ok. JS principal 69 KB gzip, CSS 11 KB gzip |

## Lighthouse

Lighthouse 12.2.1 sobre o build de produção (`vite preview`), no Chrome headless.

| Página           | Perfil  | Performance | Acessibilidade | Boas práticas | SEO | LCP   | CLS |
| ---------------- | ------- | ----------- | -------------- | ------------- | --- | ----- | --- |
| Home `/`         | Celular | 92          | 100            | 100           | 100 | 3,3 s | 0   |
| Detalhe (Duster) | Celular | 96          | 100            | 100           | 100 | 2,6 s | 0   |
| Home `/`         | Desktop | 100         | 100            | 100           | 100 | 0,6 s | 0   |
| Detalhe (Duster) | Desktop | 100         | 100            | 100           | 100 | 0,6 s | 0   |

O perfil de celular simula um 4G lento com CPU reduzida. Valores de duas rodadas, que deram iguais.

### Correções feitas para chegar lá

Na primeira medição, a Home ficou em 72 e o Detalhe em 85, com CLS de 0,34 e 0,21.

- **Fontes pré-carregadas:** a Saira e a Manrope (latin) ganharam `<link rel="preload">`, por um plugin no `vite.config.ts`. Antes, o título do hero aparecia numa fonte de reserva mais larga e encolhia ao trocar.
- **Primeira pintura com os dados:** com dados locais, a primeira pintura já sai com os veículos, sem skeleton seguido do conteúdo. Para isso foi criado `veiculosSemEsperar()` no serviço.
- **Espaço reservado com altura de tela:** o espaço reservado enquanto uma página carrega tem altura de tela, para o rodapé não pular.
- **Home no pacote principal:** a Home entrou no pacote principal, que cresceu ~3 KB gzip.
- **Foto do hero mais cedo:** na Home, a foto do hero começa a baixar antes do JS, por um script curto no `index.html`.

## Verificado no navegador

- **Larguras:** 360, 768, 1024 e 1440 px, sem rolagem lateral em nenhuma página.
- **Home:**
  - números calculados do estoque;
  - legenda do hero com fallback quando o Civic sai;
  - menu do celular;
  - favoritos com foco preso no modal, Esc e retorno do foco.
- **Estoque:**
  - filtros e ordenação, incluindo os sem preço ou km no fim;
  - "Remover filtros" mantém a ordenação;
  - limite de 3 na comparação e tabela com parcela (conta conferida à mão);
  - filtros mantidos ao abrir um carro e voltar;
  - rolagem restaurada;
  - âncora `#contato`.
- **Detalhe:**
  - title, description, canonical e og:image;
  - JSON-LD `Car` com `Offer`, ou sem `Offer` quando não há preço;
  - as 4 mensagens de WhatsApp;
  - simulador conferido à mão;
  - 404 com `noindex` para endereço inexistente ou veículo vendido.
- **Financiar:** valor editável e mensagem "veículo de R$ X".
- **Vender ou trocar:**
  - erros por campo e foco no primeiro erro;
  - regra do telefone;
  - mensagem idêntica à do site atual.
- **Painel:**
  - situação, cadastro e exclusão com confirmação;
  - indicadores conferidos;
  - reflexo na loja (Home, estoque, detalhe);
  - persistência após recarregar.
- **Sitemap:** 16 URLs (4 páginas e 12 veículos). O `robots.txt` aponta para ele e bloqueia `/design` e `/painel`.

## Requisitos do briefing

| Requisito                                                             | Situação                                                      |
| --------------------------------------------------------------------- | ------------------------------------------------------------- |
| Nenhuma funcionalidade do site atual sumiu                            | Ok. Conferido contra `docs/inventario-funcionalidades.md`     |
| Mobile-first, 360 a 1440 px                                           | Ok                                                            |
| WebP/AVIF, lazy loading, dimensões definidas                          | Ok. Só a foto principal de cada página carrega com prioridade |
| Code-splitting por rota                                               | Ok. Todas as páginas, exceto a Home (motivo acima)            |
| Lighthouse ≥ 90 em performance, acessibilidade e SEO (Home e Detalhe) | Ok                                                            |
| Title e description por página, Open Graph, URLs amigáveis            | Ok                                                            |
| `sitemap.xml`, `robots.txt`, JSON-LD no detalhe                       | Ok                                                            |
| HTML semântico, teclado, alt, labels                                  | Ok. Lighthouse a11y 100 e eslint-plugin-jsx-a11y              |
| TypeScript strict, ESLint, Prettier                                   | Ok. Sem `any`                                                 |
| `.env` + `.env.example`, sem chaves no código                         | Ok. Só endereço do site e número do WhatsApp, ambos públicos  |
| Textos em pt-BR, formatação com `Intl`                                | Ok                                                            |
| `prefers-reduced-motion`                                              | Ok. Animações e rolagem suave desligadas                      |
| Componentes reutilizáveis antes das páginas                           | Ok. Ver `/design`                                             |
| README (rodar, build, cadastrar veículo)                              | Ok                                                            |

## O que não foi verificado

- **Aparelhos reais (iPhone, Android):** os testes foram em viewport emulado.
- **Leitores de tela reais (NVDA, VoiceOver):** a acessibilidade foi checada pela estrutura (rótulos, `aria-*`, foco), pelo Lighthouse e pelo ESLint.
- **Publicação na Vercel:** o projeto não foi publicado. O `vercel.json` com a regra de SPA está pronto, mas não foi testado no ar.
- **Restauração da rolagem ao voltar:** no painel do navegador oculto, os eventos de rolagem não disparam, então foi validada simulando esses eventos. Vale um teste rápido num navegador comum.
