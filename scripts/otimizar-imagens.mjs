// Gera versões otimizadas (AVIF + WebP, 2 larguras) das fotos de veículos e os ícones da logo.
// Uso: npm run imagens  (lê de docs/site-atual/imagens ou de uma pasta passada como argumento)
import { mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const origem = process.argv[2] ?? 'docs/site-atual/imagens';
const destinoVeiculos = 'public/img/veiculos';
const destinoMarca = 'public/img/marca';
const larguras = [400, 800];

await mkdir(destinoVeiculos, { recursive: true });
await mkdir(destinoMarca, { recursive: true });

const arquivos = (await readdir(origem)).filter((a) => /\.(jpe?g|png|webp)$/i.test(a));

for (const arquivo of arquivos) {
  const nome = path.parse(arquivo).name;
  const entrada = path.join(origem, arquivo);

  if (nome === 'logo') {
    for (const tam of [32, 180, 192, 512]) {
      await sharp(entrada)
        .resize(tam, tam)
        .png()
        .toFile(path.join(destinoMarca, `logo-${tam}.png`));
    }
    for (const tam of [96, 240]) {
      await sharp(entrada)
        .resize(tam, tam)
        .webp({ quality: 90 })
        .toFile(path.join(destinoMarca, `logo-${tam}.webp`));
    }
    console.log('logo: ícones gerados');
    continue;
  }

  for (const largura of larguras) {
    const base = sharp(entrada).resize({ width: largura, withoutEnlargement: true });
    await base
      .clone()
      .avif({ quality: 55 })
      .toFile(path.join(destinoVeiculos, `${nome}-${largura}.avif`));
    await base
      .clone()
      .webp({ quality: 78 })
      .toFile(path.join(destinoVeiculos, `${nome}-${largura}.webp`));
  }
  console.log(`${nome}: ${larguras.join(', ')} px`);
}
