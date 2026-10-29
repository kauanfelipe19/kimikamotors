import type { Veiculo } from '@/types/veiculo';
import { config } from './config';
import { nomeCompleto } from './veiculo';

/** Dados estruturados schema.org/Car (ou Motorcycle) para o detalhe do veículo. */
export function jsonLdVeiculo(v: Veiculo): Record<string, unknown> {
  const url = new URL(`/estoque/${v.slug}`, config.siteUrl).href;
  const foto = v.fotos[0];

  return {
    '@context': 'https://schema.org',
    '@type': v.carroceria === 'Moto' ? 'Motorcycle' : 'Car',
    name: `${nomeCompleto(v)} ${v.ano}`,
    url,
    ...(foto && { image: new URL(`/img/veiculos/${foto.arquivo}-800.webp`, config.siteUrl).href }),
    brand: { '@type': 'Brand', name: v.marca },
    model: v.modelo,
    vehicleModelDate: String(v.ano),
    bodyType: v.carroceria,
    itemCondition: 'https://schema.org/UsedCondition',
    ...(v.km != null && {
      mileageFromOdometer: { '@type': 'QuantitativeValue', value: v.km, unitCode: 'KMT' },
    }),
    ...(v.cambio && { vehicleTransmission: v.cambio }),
    ...(v.combustivel && { fuelType: v.combustivel }),
    ...(v.preco && {
      offers: {
        '@type': 'Offer',
        url,
        price: v.preco,
        priceCurrency: 'BRL',
        availability:
          v.situacao === 'Reservado'
            ? 'https://schema.org/LimitedAvailability'
            : 'https://schema.org/InStock',
        seller: {
          '@type': 'AutoDealer',
          name: 'Kímika Motors',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Sorocaba',
            addressRegion: 'SP',
            addressCountry: 'BR',
          },
        },
      },
    }),
  };
}

/** Serializa para <script type="application/ld+json"> sem permitir fechar a tag. */
export const serializarJsonLd = (dados: unknown) => JSON.stringify(dados).replace(/</g, '\\u003c');
