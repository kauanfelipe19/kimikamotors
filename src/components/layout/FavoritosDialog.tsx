import { Heart } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { VehicleCard } from '@/components/vehicle/VehicleCard';
import { useFavoritos } from '@/context/favoritos';
import { useVeiculosAVenda } from '@/hooks/useVeiculosAVenda';

interface FavoritosDialogProps {
  aberto: boolean;
  onFechar: () => void;
}

export function FavoritosDialog({ aberto, onFechar }: FavoritosDialogProps) {
  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo="Favoritos" largura="xl">
      <ListaFavoritos />
    </Modal>
  );
}

function ListaFavoritos() {
  const { ids, ehFavorito, alternar } = useFavoritos();
  const veiculos = useVeiculosAVenda();
  const lista = (veiculos ?? []).filter((v) => ids.includes(v.id));

  if (veiculos && lista.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center text-texto-suave">
        <Heart className="size-8" aria-hidden />
        <p>Toque no coração de um veículo para guardar aqui.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {lista.map((v) => (
        <VehicleCard key={v.id} veiculo={v} favorito={ehFavorito(v.id)} onFavoritar={alternar} />
      ))}
    </div>
  );
}
