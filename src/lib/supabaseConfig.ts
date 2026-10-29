/** Dados públicos do projeto Supabase. Sem eles, o site usa o arquivo local. */
export const supabaseConfig = {
  url: ((import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? '').replace(/\/$/, ''),
  chave: (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ?? '',
};

export const usaSupabase = Boolean(supabaseConfig.url && supabaseConfig.chave);

export const BUCKET_FOTOS = 'veiculos';
