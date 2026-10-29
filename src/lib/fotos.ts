import type { FotoVeiculo } from '@/types/veiculo';
import { BUCKET_FOTOS, supabaseConfig } from './supabaseConfig';

export const LARGURAS_FOTO = [400, 800] as const;
export type LarguraFoto = (typeof LARGURAS_FOTO)[number];

/** URL de uma versão da foto (local ou do Storage). */
export function urlFoto(foto: FotoVeiculo, largura: LarguraFoto, ext?: 'avif' | 'webp'): string {
  if (foto.origem === 'storage') {
    return `${supabaseConfig.url}/storage/v1/object/public/${BUCKET_FOTOS}/${foto.arquivo}-${largura}.${foto.ext ?? 'webp'}`;
  }
  return `/img/veiculos/${foto.arquivo}-${largura}.${ext ?? 'webp'}`;
}

export const srcsetFoto = (foto: FotoVeiculo, ext?: 'avif' | 'webp') =>
  LARGURAS_FOTO.map((w) => `${urlFoto(foto, w, ext)} ${w}w`).join(', ');
