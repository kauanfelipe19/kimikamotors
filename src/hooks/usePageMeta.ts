import { useEffect } from 'react';
import { config } from '@/lib/config';

interface PageMeta {
  titulo: string;
  descricao: string;
  /** Caminho da página, para canonical e og:url */
  caminho?: string;
  imagem?: string;
  noindex?: boolean;
}

function definirMeta(atributo: 'name' | 'property', chave: string, valor: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${atributo}="${chave}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(atributo, chave);
    document.head.appendChild(el);
  }
  el.content = valor;
}

/** Define title, description, canonical e Open Graph da página atual. */
export function usePageMeta({ titulo, descricao, caminho, imagem, noindex }: PageMeta) {
  useEffect(() => {
    const tituloCompleto = titulo.includes('Kímika') ? titulo : `${titulo} | Kímika Motors`;
    document.title = tituloCompleto;
    definirMeta('name', 'description', descricao);
    definirMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    definirMeta('property', 'og:title', tituloCompleto);
    definirMeta('property', 'og:description', descricao);
    if (imagem) definirMeta('property', 'og:image', new URL(imagem, config.siteUrl).href);

    if (caminho !== undefined) {
      const url = new URL(caminho, config.siteUrl).href;
      definirMeta('property', 'og:url', url);
      let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = url;
    }
  }, [titulo, descricao, caminho, imagem, noindex]);
}
