import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import { veiculosIniciais } from './src/data/veiculos';

/** Gera o sitemap.xml no build: páginas fixas + um endereço por veículo à venda. */
function sitemap(siteUrl: string): Plugin {
  return {
    name: 'kimika-sitemap',
    apply: 'build',
    generateBundle() {
      const hoje = new Date().toISOString().slice(0, 10);
      const caminhos = [
        '/',
        '/estoque',
        '/financiamento',
        '/vender',
        ...veiculosIniciais
          .filter((v) => v.situacao !== 'Vendido')
          .map((v) => `/estoque/${v.slug}`),
      ];
      const urls = caminhos
        .map((c) => `  <url><loc>${new URL(c, siteUrl).href}</loc><lastmod>${hoje}</lastmod></url>`)
        .join('\n');
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const siteUrl = env.VITE_SITE_URL || 'https://kimikamotors.vercel.app';

  return {
    plugins: [react(), sitemap(siteUrl)],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 5173,
    },
  };
});
