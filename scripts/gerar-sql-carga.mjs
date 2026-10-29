// Gera o INSERT dos veículos de src/data/veiculos.ts para colar no SQL Editor do Supabase.
// Uso: node scripts/gerar-sql-carga.mjs   (Node 22.18+ lê o .ts direto)
// Grava supabase/carga-inicial.sql em UTF-8.
import { writeFileSync } from 'node:fs';
import { veiculosIniciais } from '../src/data/veiculos.ts';

const texto = (v) => (v == null ? 'null' : `'${String(v).replace(/'/g, "''")}'`);
const numero = (v) => (v == null ? 'null' : String(v));

const linhas = veiculosIniciais.map((v) =>
  [
    v.id,
    texto(v.slug),
    texto(v.marca),
    texto(v.modelo),
    texto(v.versao),
    v.ano,
    numero(v.km),
    numero(v.preco),
    texto(v.cambio),
    texto(v.combustivel),
    texto(v.carroceria),
    texto(v.situacao),
    v.importado,
    texto(v.cor),
    `${texto(JSON.stringify(v.fotos))}::jsonb`,
    `array[${v.itens.map(texto).join(', ')}]::text[]`,
  ].join(', '),
);

const sql = `-- Carga inicial: os ${linhas.length} veículos do site atual.
-- Gerado por scripts/gerar-sql-carga.mjs. Rodar uma vez, depois de schema.sql.
insert into public.veiculos
  (id, slug, marca, modelo, versao, ano, km, preco, cambio, combustivel, carroceria, situacao, importado, cor, fotos, itens)
values
${linhas.map((l) => `  (${l})`).join(',\n')}
on conflict (id) do nothing;

-- Os próximos cadastros continuam a partir do maior id
select setval(pg_get_serial_sequence('public.veiculos', 'id'), (select max(id) from public.veiculos));
`;

writeFileSync('supabase/carga-inicial.sql', sql, 'utf8');
console.log(`supabase/carga-inicial.sql: ${linhas.length} veículos`);
