import Image from "next/image";
import Link from "next/link";
import { Gauge, Calendar } from "lucide-react";
import type { Vehicle } from "@/lib/domain/vehicle";
import { formatMileage, formatPrice, formatYear } from "@/lib/format";

export function VehicleCard({ vehicle, priority = false }: { vehicle: Vehicle; priority?: boolean }) {
  const cover = vehicle.images[0];

  return (
    <Link
      href={`/estoque/${vehicle.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-lg hover:shadow-black/5"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
        {cover ? (
          <Image
            src={cover}
            alt={`${vehicle.brand} ${vehicle.model} ${vehicle.version}`}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={priority}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">Sem foto</div>
        )}
        {vehicle.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
            Destaque
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">{vehicle.brand}</p>
          <h3 className="font-display text-lg font-semibold leading-tight text-ink">{vehicle.model}</h3>
          <p className="line-clamp-2 text-sm text-muted">{vehicle.version}</p>
        </div>

        <div className="mt-1 flex items-center gap-4 text-sm text-ink/70">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-4 w-4 text-brand" aria-hidden />
            {formatYear(vehicle.manufactureYear, vehicle.modelYear)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Gauge className="h-4 w-4 text-brand" aria-hidden />
            {formatMileage(vehicle.mileage)}
          </span>
        </div>

        <p className="mt-auto pt-2 font-display text-xl font-bold text-ink">{formatPrice(vehicle.price)}</p>
      </div>
    </Link>
  );
}
