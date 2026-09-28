import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import type { Vehicle } from "@/lib/domain/vehicle";

export function FeaturedVehicles({ vehicles }: { vehicles: Vehicle[] }) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand">Estoque</p>
            <h2 className="mt-1 font-display text-3xl font-bold text-ink">Últimas novidades</h2>
          </div>
          <Link
            href="/estoque"
            className="inline-flex items-center gap-1 text-sm font-semibold text-ink hover:text-brand"
          >
            Ver estoque completo
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {vehicles.map((vehicle, index) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} priority={index < 2} />
          ))}
        </div>
      </Container>
    </section>
  );
}
