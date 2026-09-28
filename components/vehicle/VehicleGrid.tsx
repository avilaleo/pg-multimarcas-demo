import { SearchX } from "lucide-react";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import type { Vehicle } from "@/lib/domain/vehicle";

export function VehicleGrid({ vehicles }: { vehicles: Vehicle[] }) {
  if (vehicles.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center text-muted">
        <SearchX className="h-10 w-10" aria-hidden />
        <p className="text-lg font-semibold text-ink">Nenhum veículo encontrado</p>
        <p className="max-w-sm text-sm">Tente ajustar os filtros de busca — marca, faixa de preço ou ano.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {vehicles.map((vehicle, index) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} priority={index < 4} />
      ))}
    </div>
  );
}
