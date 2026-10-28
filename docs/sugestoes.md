# Sugestões (fora da paridade)

Itens que o site atual **não tem** ou que funcionam mal. Nenhum deles será implementado sem aprovação.

## Pedidos pelo briefing que não existem hoje

- Selos **Novo / Seminovo / Destaque**. Hoje só existem Reservado, Importado e Antigo.
- Filtros de **modelo, combustível e cor**. Combustível existe no código sem controle na tela, e nenhum veículo tem esse dado preenchido. Cor não existe como dado.
- **Galeria** de fotos no detalhe. Hoje há 1 foto por veículo.
- **Telefone** clicável (`tel:`) e **formulário de interesse** que não dependa do WhatsApp.
- Páginas **Sobre**, **Localização com mapa** e **Horário de funcionamento**. Faltam o endereço completo e o horário.
- **Busca rápida no hero** (tipo, marca, faixa de preço). Hoje a busca fica só na seção Estoque.

## Melhorias de comportamento existente

- Salvar **favoritos** e **comparação** no `localStorage`.
- Colocar o estado dos filtros na URL (`/estoque?marca=Honda&preco=50000`).
- Fazer "Remover filtros" resetar também a ordenação.
- Dar a cada veículo uma **página própria com URL amigável** (`/estoque/renault-duster-dynamique-2014`). Isso permite compartilhar o link e melhora o SEO.
- **Painel real:** login e banco (por exemplo Supabase), upload de fotos pelo celular e alterações visíveis para todos.
- Esconder o link "Painel" do menu público.
- Tornar o Instagram clicável.
- Remover os textos de protótipo visíveis ao cliente.
- Adicionar favicon, `lang="pt-BR"`, meta description, Open Graph, `sitemap.xml`, `robots.txt` e JSON-LD.
- Adicionar analytics (por exemplo Vercel Analytics ou GA4), se a loja quiser medir.
