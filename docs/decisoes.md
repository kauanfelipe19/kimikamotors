# Decisões

Detalhes pequenos decididos durante o trabalho. Qualquer um pode ser revisto.

## Etapa 2: setup e design system (28/10/2026)

### Ambiente

- **Node e Git:** não estavam instalados. Foram instalados via winget (Node 24 LTS, Git 2.56), com aprovação do usuário. O git usa uma identidade local do repositório (`Kauan <zkauan63@gmail.com>`).

### Stack

- **Versões:** Vite 5, React 18, React Router 6, Tailwind 3.4, ESLint 9 e TypeScript 5.6. Ficaram em majors estáveis, e o Tailwind 3 foi escolhido porque o briefing pede `tailwind.config` com os tokens.
- **Painel:** continua em modo demonstração, com o mesmo comportamento de hoje, e sai do menu público. Vai para a rota `/painel`, com `noindex` e `Disallow` no `robots.txt`.
- **Detalhe do veículo:** vira página em `/estoque/:slug`. O conteúdo é o mesmo do modal atual.
- **Slugs:** `marca-modelo-versao-ano`, por exemplo `renault-duster-dynamique-2014`.

### Fontes

- **Títulos:** Saira variável, com eixo de largura, usada a 78% (condensada) e em caixa alta nos títulos. A Barlow Condensed atual fica no lugar, mas a Saira tem um desenho mais "automotivo", que conversa com a logo.
- **Texto:** Manrope.
- **Itálico:** a Saira itálica custaria +116 KB por uma palavra. No lugar, o destaque usa inclinação via CSS (`-skew-x-[10deg]`), que ecoa as letras inclinadas da logo.
- **Nomes de modelo:** ficam em caixa normal, não em caixa alta, para respeitar "up!" e "i30" e reduzir a monotonia de maiúsculas apontada na auditoria.
- **Botões:** caixa normal. No site atual eram todos em caixa alta.

### Cores e tema

- **Primária e acento:** a primária é o carbono (preto da logo) e o acento é o laranja `#F28A24`.
- **Laranja em texto:** sobre fundo escuro usa o `laranja-400`. Sobre fundo claro usa o `laranja-700`, porque o 500 não passa no AA.
- **Seções claras:** usam tokens semânticos em variáveis CSS (`--fundo`, `--texto`...) e a classe `.tema-claro`. Os componentes se adaptam sem variante própria.
- **Modo escuro alternável:** não foi feito, como o briefing indicava. O site já é escuro por padrão.

### Fotos

- **Origem:** extraídas do HTML atual (800×800) e convertidas para AVIF e WebP em 400 e 800 px por `npm run imagens`.
- **Recorte:** cada foto tem um `foco` (object-position) próprio. A da moto Nmax usa `50% 85%`.
- **Logo:** só existe em 240×240 PNG. Os ícones e o favicon saem dela.
