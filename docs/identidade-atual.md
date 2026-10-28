# Identidade visual: site atual

## Logo

`docs/site-atual/imagens/logo.png` (240×240, PNG):

- Círculo preto com anel laranja.
- Silhueta de carro esportivo em traço branco por cima do nome.
- "KÍMIKA" em laranja, com letras itálicas e inclinadas.
- "MOTORS" menor, em branco itálico.

O desenho passa velocidade e esportividade. Por ser circular e cheio de detalhe, a logo fica ilegível abaixo de uns 40 px; no cabeçalho ela aparece com 48 px.

Não existe versão horizontal, monocromática ou vetorial (SVG). Também não existe favicon.

## Cores (tokens do CSS atual)

| Token          | Hex       | Uso                                                   |
| -------------- | --------- | ----------------------------------------------------- |
| `--bg`         | `#0B0B0C` | Fundo geral (preto da logo)                           |
| `--s1`         | `#121213` | Superfície 1                                          |
| `--s2`         | `#19191B` | Superfície 2 / fundo das ilustrações                  |
| `--line`       | `#2B2B2F` | Linhas finas e bordas                                 |
| `--ink`        | `#F3EFE8` | Texto principal (off-white quente)                    |
| `--muted`      | `#9A958C` | Texto secundário (≈ 6,6:1 sobre o fundo, passa no AA) |
| `--accent`     | `#F28A24` | Laranja da logo, usado em ação e destaque             |
| `--accent-ink` | `#140B02` | Texto sobre o laranja                                 |
| hover primário | `#FFA042` |                                                       |
| `--bad`        | `#E5736F` | Erro                                                  |
| `--warn`       | `#F2B35E` | Aviso                                                 |

Não há token de **sucesso**. O tema é só escuro (`color-scheme: dark`).

## Tipografia

- **Títulos:** Barlow Condensed 500/600/700, sempre em CAIXA ALTA, com entrelinha de 0,98. No hero vai até uns 90 px.
- **Texto:** Hanken Grotesk 400–700, corpo de 15 px (16 px no celular), com números tabulares.
- **Rótulos, botões e menu:** 12 px em caixa alta, espaçamento de letra de 0,14–0,16 em.

## Conceito declarado no CSS

> "Showroom noturno. Fundo preto da logo, laranja usado só em ação e destaque, tipografia condensada em caixa alta, fotos grandes sem cantos arredondados, linhas finas no lugar de caixas."

Outras características:

- Botões quase retos (raio de 2 px).
- Cards sem caixa, só com a foto e linhas finas.
- Grade de 3 colunas no desktop.
- Container de 1240 px.

## O que funciona e vale manter

- A paleta preto e laranja sai direto da logo e é coerente com ela.
- O contraste é bom.
- O laranja fica reservado para ação, por isso os botões chamam atenção.
- Os títulos condensados combinam com o lado "motor" da marca.

## O que pesa contra o site hoje

1. **Fotos fracas e todas iguais.** As 12 fotos são do mesmo ângulo, em frente à mesma fachada, tiradas do Instagram. O fundo (loja, cerca, outros carros) disputa atenção com o veículo, e no grid tudo parece a mesma foto. Esse é o maior problema visual, mas depende das fotos da loja, não só do site.
2. **Monotonia de caixa alta.** Título, menu, botão, rótulo, link e nome do carro estão todos em maiúsculas espaçadas. Nada se destaca, e a leitura cansa no celular.
3. **Hierarquia rasa.** Preço, nome e links "Detalhes" e "WhatsApp" têm peso parecido no card. O preço, que é o que mais importa, não domina.
4. **Seções todas iguais.** Fundo preto e linha fina do começo ao fim, sem variação de superfície, sem ritmo, e nenhuma seção ganha destaque.
5. **Cabeçalho quebrando.** Em larguras intermediárias (~800 px) o botão WhatsApp cai para uma linha própria. No celular, o menu vira uma faixa com rolagem lateral, pouco descobrível. "Painel" fica exposto ao público.
6. **Pouca prova de confiança.** Não aparecem endereço, mapa, horário, tempo de mercado, avaliações, fotos da equipe ou da loja (além do hero), nem Instagram clicável. Para concessionária, isso pesa mais que estética.
7. **Detalhe em modal com 1 foto.** Não tem galeria, e o veículo não ganha página própria nem destaque visual. Parece uma janela de formulário.
8. **Logo pequena e sem variações.** Não existe favicon, versão horizontal nem SVG nítido.
9. **Performance como problema de percepção.** São 2 MB de HTML antes de qualquer pixel aparecer, o que no 4G passa sensação de site lento.
10. **Cara de protótipo.** Notas como "No site final entra a galeria completa" e "Visão de demonstração" estão visíveis para o cliente.

## Direção proposta (para validar no styleguide)

Manter a base **preto e laranja**, que é da marca, e subir o nível com estes pontos:

- Variar as superfícies (seções em grafite, faixas claras pontuais).
- Usar caixa alta só em títulos e rótulos curtos.
- Dar ao preço o maior peso dentro do card.
- Criar uma página de detalhe de verdade, com galeria.
- Adicionar provas de confiança.
- Melhorar o recorte das fotos com `object-position` por veículo e proporção fixa.
