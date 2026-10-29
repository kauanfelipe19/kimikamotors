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

## Etapa 3: Home (28/10/2026)

### Estrutura

- **Páginas próprias:** o estoque, o simulador e o formulário de avaliação saem da Home e ganham páginas (`/estoque`, `/financiamento`, `/vender`), cada uma com título e descrição para o Google. A Home fica mais leve e mostra uma prévia de cada um: os 6 veículos mais recentes, um exemplo de parcela e os passos da avaliação, sempre com botão para a página completa.
- **Contato:** o rodapé (`#contato`) aparece em todas as páginas, então o link "Contato" do menu funciona em qualquer uma.
- **Pular para o conteúdo:** adicionado um link que só aparece ao navegar pelo teclado.

### Cabeçalho e menu

- **Painel:** sai do menu.
- **Celular:** abaixo de 1024 px, o menu vira um botão que abre a lista. No site atual era uma faixa com rolagem lateral. O cabeçalho fica fixo também no celular, e um ponto laranja no botão indica que há favoritos.
- **Favoritos:** a lista abre num `<dialog>` nativo, que prende o foco, fecha com Esc ou clicando fora e devolve o foco a quem abriu. Isso corrige a falta de focus trap do modal atual. Os favoritos continuam só em memória.

### Hero e rodapé

- **Legenda do hero:** se o Civic estiver à venda, mostra "Em destaque", com o preço e o link para o detalhe. Se não estiver, mostra "Kímika Motors · Sorocaba-SP", como hoje. No celular, a legenda fica abaixo da foto para não cobrir o carro.
- **WhatsApp no rodapé:** o número virou link, com a mesma mensagem do cabeçalho.
- **Instagram:** continua como texto. A sugestão de torná-lo clicável está em `docs/sugestoes.md`.

## Etapa 3: Estoque (28/10/2026)

### Regras mantidas

Abas, busca, filtros, ordenação, "Remover filtros" (limpa filtros, aba e busca, mas mantém a ordenação), mensagem de lista vazia, aviso sobre os dados do Instagram e o limite de 2 a 3 veículos na comparação: tudo igual ao site atual. A lógica fica em `src/lib/estoque.ts`.

### Estado em memória

- **Filtros e ordenação:** continuam só em memória, mas agora sobrevivem à troca de página (`useEstadoDaSessao`). Como o detalhe virou página, sem isso abrir um carro e voltar zeraria os filtros, coisa que o modal de hoje não fazia. Recarregar ainda zera tudo, como hoje.
- **Rolagem:** ao voltar do detalhe para o estoque, a página volta à mesma posição. Uma página nova começa do topo, e âncoras como `#contato` continuam funcionando.
- **Comparação:** a seleção também fica em memória. A barra laranja aparece em todas as páginas públicas, como hoje (só some no painel). Os modais fecham sozinhos quando um link leva a outra página.

### Layout

- **Filtros:** no desktop (≥ 1024 px) ficam numa coluna lateral, sempre visíveis. Abaixo disso, o botão "Filtros"/"Fechar filtros" (`aria-expanded`) abre o painel, como hoje.
- **Ordenar:** fica acima da grade, ao lado do contador, e não junto dos filtros.
- **Tabela de comparação:** ganhou a foto de cada veículo, com link para o detalhe. No celular a tabela rola de lado com a coluna de rótulos fixa.
- **Carregamento:** o `Suspense` das páginas fica dentro do layout, para o cabeçalho e o rodapé não piscarem.

## Etapa 3: Detalhe do veículo (28/10/2026)

### Conteúdo mantido

O conteúdo é o mesmo do modal atual:

- Foto, nome, versão e preço (ou "Consulte o valor").
- Ficha com Ano, Quilometragem, Câmbio, Combustível, Carroceria e Situação; os campos vazios são omitidos.
- Itens.
- Botões "Chamar no WhatsApp" e "Quero dar o meu na troca", com as mesmas mensagens.
- Simulador só quando há preço.

### Simulador

- Componente `Simulador`, que será reaproveitado em `/financiamento`.
- No detalhe, o preço vem fixo do veículo.
- Os campos, os padrões (30%, 36x, 1,99% a.m.) e a mensagem do WhatsApp são iguais aos de hoje.
- A entrada é arredondada como no site atual.
- O prazo aparece como "36 meses", em vez de só "36".

### Mudanças na página

- **Texto de protótipo removido:** o aviso "Foto do anúncio da loja. No site final entra a galeria completa." saiu. Era nota de protótipo, não funcionalidade. A galeria continua em `docs/sugestoes.md`.
- **Vendidos:** como saem da loja, o link de um veículo vendido mostra a página "não encontrada" (`noindex`).
- **Trilha de navegação:** "Início › Estoque › Nome" no topo, que serve de caminho de volta.

### SEO

- **JSON-LD:** `Car`, ou `Motorcycle` para motos, com marca, modelo, ano, km, câmbio, carroceria e condição de usado.
- **Oferta:** o `Offer` (preço em BRL e loja `AutoDealer` em Sorocaba-SP) só entra quando há preço. Veículo reservado vira `LimitedAvailability`.
- **Meta:** o título é "Marca Modelo Versão Ano". A descrição é gerada a partir dos dados, a imagem de compartilhamento é a foto do veículo e a página tem `canonical`.
