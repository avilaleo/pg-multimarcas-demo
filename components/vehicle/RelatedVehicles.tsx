import { VehicleCard } from "@/components/vehicle/VehicleCard";
import type { Vehicle } from "@/lib/domain/vehicle";

export function RelatedVehicles({ vehicles }: { vehicles: Vehicle[] }) {
  if (vehicles.length === 0) return null;

  return (
    <section className="border-t border-line py-12">
      <h2 className="font-display text-2xl font-bold text-ink">Veículos relacionados</h2>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    </section>
  );
}
