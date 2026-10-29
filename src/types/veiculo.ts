export type Cambio = 'Manual' | 'Automático';
export type Combustivel = 'Flex' | 'Gasolina';
export type Carroceria = 'Hatch' | 'Sedan' | 'SUV' | 'Minivan' | 'Perua' | 'Moto';
export type Situacao = 'Disponível' | 'Reservado' | 'Vendido';

export interface FotoVeiculo {
  /**
   * Nome base do arquivo, sem tamanho nem extensão. Fotos locais ficam em
   * public/img/veiculos; fotos enviadas pelo painel, no Storage do Supabase.
   */
  arquivo: string;
  /** 'storage' para fotos enviadas pelo painel (só WebP ou JPEG); local se ausente */
  origem?: 'storage';
  /** Extensão das fotos do Storage */
  ext?: 'webp' | 'jpg';
  alt: string;
  /** Ponto focal do recorte (CSS object-position) */
  foco?: string;
}

export interface Veiculo {
  /** Também define a ordem "mais recentes" (maior = mais recente) */
  id: number;
  slug: string;
  marca: string;
  modelo: string;
  versao: string;
  ano: number;
  km: number | null;
  preco: number | null;
  cambio: Cambio | null;
  combustivel: Combustivel | null;
  carroceria: Carroceria;
  situacao: Situacao;
  importado: boolean;
  /** Cor da ilustração usada quando o veículo não tem foto */
  cor: string;
  fotos: FotoVeiculo[];
  itens: string[];
}
