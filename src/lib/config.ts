export const config = {
  siteUrl:
    (import.meta.env.VITE_SITE_URL as string | undefined) ?? 'https://kimikamotors.vercel.app',
  whatsappNumero: (import.meta.env.VITE_WHATSAPP_NUMERO as string | undefined) ?? '5515981857291',
  whatsappExibicao: '(15) 98185-7291',
  instagram: 'kimikamotors',
  cidade: 'Sorocaba, SP',
} as const;
