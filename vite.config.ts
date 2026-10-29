import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import { veiculosIniciais } from './src/data/veiculos';

/** Slugs dos veículos à venda: do Supabase, se configurado; senão do arquivo local. */
async function slugsAVenda(supabaseUrl?: string, chave?: string): Promise<string[]> {
  if (supabaseUrl && chave) {
    try {
      const resposta = await fetch(
        `${supabaseUrl.replace(/\/$/, '')}/rest/v1/veiculos?select=slug&situacao=neq.Vendido`,
        { headers: { apikey: chave } },
      );
      if (resposta.ok) return ((await resposta.json()) as { slug: string }[]).map((v) => v.slug);
      console.warn(`sitemap: Supabase respondeu ${resposta.status}; usando o arquivo local`);
    } catch (erro) {
      console.warn('sitemap: Supabase indisponível; usando o arquivo local', erro);
    }
  }
  return veiculosIniciais.filter((v) => v.situacao !== 'Vendido').map((v) => v.slug);
}

/**
 * Gera o sitemap.xml no build: páginas fixas + um endereço por veículo à venda.
 * Com o Supabase, veículos cadastrados depois do build entram no próximo deploy.
 */
function sitemap(siteUrl: string, supabaseUrl?: string, chave?: string): Plugin {
  return {
    name: 'kimika-sitemap',
    apply: 'build',
    async generateBundle() {
      const hoje = new Date().toISOString().slice(0, 10);
      const caminhos = [
        '/',
        '/estoque',
        '/financiamento',
        '/vender',
        ...(await slugsAVenda(supabaseUrl, chave)).map((s) => `/estoque/${s}`),
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

/**
 * Pré-carrega as fontes latinas usadas acima da dobra. Sem isso o título do hero aparece
 * primeiro numa fonte de reserva mais larga e "encolhe" quando a Saira chega (CLS).
 */
function preloadFontes(): Plugin {
  const padroes = [/saira-latin-wdth-normal-.*\.woff2$/, /manrope-latin-wght-normal-.*\.woff2$/];
  return {
    name: 'kimika-preload-fontes',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        const arquivos = Object.keys(ctx.bundle ?? {}).filter((f) =>
          padroes.some((p) => p.test(f)),
        );
        return arquivos.map((f) => ({
          tag: 'link',
          attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `/${f}`, crossorigin: '' },
          injectTo: 'head-prepend' as const,
        }));
      },
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const siteUrl = env.VITE_SITE_URL || 'https://kimikamotors.vercel.app';

  return {
    plugins: [
      react(),
      sitemap(siteUrl, env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY),
      preloadFontes(),
    ],
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
