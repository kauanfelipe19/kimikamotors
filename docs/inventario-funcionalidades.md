# Inventário de funcionalidades: site atual

Fonte: https://kimikamotors.vercel.app/ (auditado em 28/10/2026).
Cópia do HTML em `docs/site-atual/index.html`; logo e fotos extraídas em `docs/site-atual/imagens/`.

## Como o site é feito

- **Um único arquivo HTML** (~2 MB), com CSS e JavaScript puro embutidos. Não usa framework, build, banco de dados nem API.
- Logo e as 12 fotos estão embutidas no HTML em base64. Por isso o arquivo é tão grande.
- Os dados dos veículos ficam num array fixo no script (`seed`). O painel salva as alterações no `localStorage` do navegador (chave `kimika-proto-v4`). Cada visitante só vê as próprias alterações, e elas não chegam para os outros.
- A "navegação" funciona por âncoras (`#estoque`, `#financiar`, `#vender`, `#contato`). Só `#admin` troca de tela.
- A meta tag `claude:viewport-fit-sides` indica que o site nasceu como protótipo/artifact. O próprio texto do painel o chama de "visão de demonstração".
- Não há `robots.txt` nem `sitemap.xml` (os dois dão 404), favicon, `lang` no `<html>`, meta description, Open Graph ou analytics.

## Páginas e seções

| Seção | Âncora | Conteúdo |
|---|---|---|
| Cabeçalho (fixo no desktop) | — | Logo e nome, nav (Estoque, Financiar, Vender ou trocar, Contato, **Favoritos (n)**, **Painel**), botão WhatsApp |
| Hero | `#` | Linha de apoio "Sorocaba, SP · Carros e motos", H1 "Nacionais, importados e antigos.", texto, CTAs "Ver estoque" e "Simular financiamento", foto da fachada com o Civic |
| Faixa de números | — | Total à venda, preço "a partir de" (menor preço), quantidade de carros e de motos. Tudo calculado a partir do estoque |
| Estoque | `#estoque` | Contador, abas de categoria, busca, filtros, ordenação e grade de cards |
| Financiamento | `#financiar` | 3 passos explicativos e simulador |
| Venda ou troca | `#vender` | 3 passos e formulário de avaliação |
| Rodapé | `#contato` | Logo, slogan, "Onde estamos: Sorocaba, SP", WhatsApp (15) 98185-7291, Instagram @kimikamotors |
| Painel | `#admin` | Área da loja (demo, sem login) |
| Modais | — | Detalhe do veículo, Comparar, Favoritos |
| Barra de comparação | — | Fixa no rodapé quando há veículos selecionados |

## Estoque: busca, filtros e ordenação

- **Abas de categoria:** Todos, Carros, Motos. Duas abas aparecem só quando há veículos que se encaixam: **Importados** (`imp`) e **Antigos** (ano ≤ 1999).
- **Busca livre:** procura em marca, modelo e versão.
- **Filtros:**
  - Marca: lista montada a partir do estoque visível.
  - Carroceria: Hatch, Sedan, SUV, Minivan, Perua.
  - Preço até: 30, 50, 80 ou 120 mil.
  - Ano: 2020+, 2015+, 2010+ ou 2005+.
  - KM até: 30, 60, 100 ou 150 mil.
  - Câmbio: Manual ou Automático.
- **Ordenação:** Mais recentes (id decrescente), Menor preço, Maior preço, Ano mais novo, Menor KM. Veículos sem preço ou sem km vão para o fim.
- **Regra dos filtros:** quem não tem preço some ao filtrar por preço, e quem não tem km some ao filtrar por km.
- **"Remover filtros":** limpa os filtros, mas não a ordenação.
- **No celular:** o botão "Filtros"/"Fechar filtros" (`aria-expanded`) abre e fecha o painel.
- **Sem resultado:** "Nenhum veículo com esses filtros. Tente ampliar o preço ou remover algum filtro."
- **Aviso fixo:** "Dados copiados dos anúncios da loja no Instagram. O que não aparecia no anúncio ficou em branco."
- **Estado do filtro:** fica só na memória. Não vai para a URL nem sobrevive a um recarregamento.
- **Combustível:** existe no estado (`F.fuel`), mas **não tem controle na tela**.

## Card do veículo

- Foto clicável que abre o detalhe. Sem foto, aparece uma ilustração SVG de carro ou moto pintada com a cor `cor` do veículo.
- Coração de favoritar (`aria-pressed`).
- Selos: **Reservado** (laranja), **Importado** e **Antigo**. Hoje não existem selos de Novo, Seminovo ou Destaque.
- Marca e modelo no título, versão ao lado.
- Linha de dados: ano · km · câmbio · combustível. Campo vazio é omitido.
- Preço em R$ (`Intl` pt-BR, sem centavos). Sem preço, mostra "Consulte".
- Link "Detalhes", checkbox "Comparar" e link "WhatsApp".
- No hover, a foto faz um zoom de 3,5%, só quando `prefers-reduced-motion` permite.

## Detalhe do veículo (modal)

- **Foto:** uma só, com a nota "No site final entra a galeria completa". **Não existe galeria.**
- **Dados:** título, versão e preço grande (ou "Consulte o valor").
- **Ficha:** Ano, Quilometragem, Câmbio, Combustível (cada um só se estiver preenchido), Carroceria e Situação.
- **Itens/opcionais:** lista.
- **Botões:**
  - "Chamar no WhatsApp": `Olá! Tenho interesse no {marca modelo versão} {ano} ({preço}).`
  - "Quero dar o meu na troca": `Olá! Quero dar o meu veículo na troca pelo {…} {ano}.`
- **Simulador embutido:** aparece só quando há preço, com o preço do veículo fixo. A mensagem cita o veículo.
- **Acessibilidade e URL:** fecha com o botão, com Esc ou clicando fora. O foco vai para "Fechar" e volta ao elemento de origem. **Não tem focus trap.** **O veículo não tem URL própria**, então não dá para compartilhar o link de um carro.

## Comparar

- Até **3** veículos, mínimo de 2 para abrir. A barra fixa mostra "n de 3 selecionados · escolha ao menos 2". Passando de 3, aparece "Máximo de 3 veículos. Remova um para trocar."
- A tabela compara Preço, Ano, Quilometragem, Câmbio, Carroceria e "Entrada 30% + 36x" (taxa fixa de 1,99% a.m.).
- Botão de limpar a seleção. A barra some no painel.
- A seleção não é salva: recarregou, perdeu.

## Favoritos

- O botão no menu mostra o contador. O modal lista os cards favoritados ou a mensagem "Toque no coração de um veículo para guardar aqui."
- **Não persistem**: só ficam na memória, e recarregar a página zera.

## Simulador de financiamento (seção `#financiar`)

- **Campos:**
  - Valor do veículo (padrão R$ 59.900, mínimo 5.000, passo 1.000).
  - Entrada: slider de 0 a 70%, passo 5, padrão 30%.
  - Prazo: 12, 24, 36, 48 ou 60 (padrão 36).
  - Taxa a.m.: padrão 1,99%, editável.
- **Resultado:** parcela pela fórmula Price (PMT), valor financiado e total pago (parcelas + entrada).
- **Aviso:** "Simulação de exemplo. Taxa e aprovação dependem da análise do banco."
- **WhatsApp:** `Olá! Fiz uma simulação no site: veículo de {valor}, entrada de {…}, {n}x de cerca de {parcela}. Podem me ajudar?`

## Venda ou troca (seção `#vender`)

- **Campos:**
  - O que você quer fazer: Vender meu veículo / Trocar por outro do estoque.
  - Nome, WhatsApp, Marca e modelo e Ano, todos obrigatórios.
  - Quilometragem e Observações, opcionais.
- **Validação:** campos obrigatórios e telefone com pelo menos 10 dígitos. As mensagens de erro aparecem em linha.
- **Ao enviar:** **nada vai para servidor**. Aparece uma caixa de sucesso com o link "Abrir mensagem no WhatsApp", já com a mensagem montada (nome, objetivo, veículo, ano, km, observações e telefone).

## Painel (`#admin`), em modo demonstração

- Aviso: "Visão de demonstração. No sistema final esta área fica atrás de login e as alterações ficam salvas no banco de dados."
- **Não tem login.** O link "Painel" fica visível para qualquer visitante no menu.
- **Indicadores:** Disponíveis, Reservados, Vendidos e Valor em estoque (soma do que não foi vendido).
- **Tabela:** veículo (com versão e km), ano, preço, **select de situação** (Disponível, Reservado, Vendido) e botão **Excluir**, que pede um segundo clique em "Confirmar".
  - "Vendido" tira o veículo da loja.
  - "Reservado" mostra o selo no card.
- **Formulário "Novo veículo":**
  - Marca, Modelo, Versão, Ano (1900–2027), KM e Preço.
  - Câmbio: não informado, Manual ou Automático.
  - Combustível: não informado, Flex ou Gasolina.
  - Carroceria: Hatch, Sedan, SUV, Minivan, Perua ou Moto.
  - Origem: Nacional ou Importado.
  - Fotos: o campo de upload existe, mas **é ignorado** ("No sistema final as fotos sobem direto do celular").
  - Botão "Publicar na loja".
- O veículo novo ganha uma cor aleatória para a ilustração.
- Tudo é salvo só no `localStorage` do navegador de quem usou o painel.

## Dados de cada veículo

| Campo | Tipo | Observação |
|---|---|---|
| `id` | número | Também define a ordem "mais recentes" |
| `fk` | string | Chave da foto |
| `marca`, `modelo`, `ver` | string | `ver` pode vir vazio |
| `ano` | número | |
| `km` | número \| null | 6 de 12 sem km |
| `preco` | número \| null | 2 sem preço ("Consulte") |
| `cambio` | "Manual" \| "Automático" \| null | |
| `comb` | string \| null | **Todos null hoje** |
| `body` | Hatch \| Sedan \| SUV \| Minivan \| Perua \| Moto | Moto define a categoria |
| `st` | Disponível \| Reservado \| Vendido | |
| `imp` | 0/1 | Importado |
| `cor` | hex | Só para a ilustração |
| `itens` | string[] | Opcionais |

Estoque atual: 12 veículos (11 carros e 1 moto, a Yamaha Nmax). Todos disponíveis, sem importados nem antigos.

## Integrações

- **WhatsApp** (`wa.me/5515981857291`), com mensagem pré-preenchida em:
  - cabeçalho (`Olá! Vim pelo site da Kímika Motors.`);
  - card;
  - detalhe;
  - "dar na troca";
  - simulador geral;
  - simulador do detalhe;
  - formulário de avaliação.
- **Google Fonts:** Barlow Condensed e Hanken Grotesk.
- **Não existem:**
  - mapa, endereço completo ou horário de funcionamento;
  - link `tel:`;
  - link clicável do Instagram (é só texto);
  - analytics;
  - formulário que envie para e-mail ou servidor;
  - página "Sobre".

## Responsividade e acessibilidade já existentes

- Breakpoints em 900, 700 e 360 px. Abaixo de 700 px:
  - o menu vira uma faixa com rolagem horizontal;
  - a foto do hero some;
  - o cabeçalho deixa de ser fixo.
- **O que já está bom:**
  - foco visível (contorno laranja);
  - alvos de toque com pelo menos 44 px;
  - `aria-label` nos botões de ícone;
  - `aria-pressed` nas abas e favoritos;
  - `alt` nas fotos;
  - Esc fecha o modal;
  - safe-area para iPhone;
  - `prefers-reduced-motion` respeitado.
- **Problemas encontrados:**
  - dois `<h1>` na página (hero e "Painel");
  - logo do cabeçalho com `alt=""` dentro de um link sem texto alternativo próprio (o nome ao lado resolve);
  - modal sem focus trap;
  - sem `lang="pt-BR"`;
  - em 800 px, o botão WhatsApp do cabeçalho cai para uma segunda linha.

## Comportamentos com defeito ou fracos

Manter o comportamento e propor melhoria; vai para `docs/sugestoes.md`.

1. Favoritos e comparação se perdem ao recarregar.
2. O painel não tem login e não salva para os outros visitantes. As alterações não aparecem para os clientes.
3. Upload de fotos ignorado. Veículo novo entra com ilustração.
4. Veículo sem URL própria, o que impede compartilhar o link e prejudica o SEO.
5. HTML de 2 MB com imagens em base64, ruim para performance no celular.
6. "Remover filtros" não reseta a ordenação.
7. Combustível sem filtro na tela e sem dados preenchidos.
