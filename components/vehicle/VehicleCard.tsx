import Image from "next/image";
import Link from "next/link";
import { Gauge, Calendar, Cog } from "lucide-react";
import type { Vehicle } from "@/lib/domain/vehicle";
import { formatMileage, formatPrice, formatYear } from "@/lib/format";

export function VehicleCard({ vehicle, priority = false }: { vehicle: Vehicle; priority?: boolean }) {
  const cover = vehicle.images[0];

  return (
    <Link
      href={`/estoque/${vehicle.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-line bg-paper shadow-card transition-[box-shadow,border-color] duration-[var(--motion-base)] ease-[var(--ease-standard)] hover:border-ink/20 hover:shadow-elevated motion-safe:active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
        {cover ? (
          <Image
            src={cover}
            alt={`${vehicle.brand} ${vehicle.model} ${vehicle.version}`}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-[var(--motion-base)] ease-[var(--ease-standard)] motion-safe:group-hover:scale-105"
            priority={priority}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">Sem foto</div>
        )}
        {vehicle.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white shadow-sm">
            Destaque
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">{vehicle.brand}</p>
          <h3 className="font-display text-lg font-semibold leading-tight text-ink">{vehicle.model}</h3>
          <p className="truncate text-sm text-muted" title={vehicle.version}>
            {vehicle.version}
          </p>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" aria-hidden />
            {formatYear(vehicle.manufactureYear, vehicle.modelYear)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Gauge className="h-3.5 w-3.5" aria-hidden />
            {formatMileage(vehicle.mileage)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Cog className="h-3.5 w-3.5" aria-hidden />
            {vehicle.transmission}
          </span>
        </div>

        <p className="mt-auto pt-2 font-display text-xl font-bold text-ink">{formatPrice(vehicle.price)}</p>
      </div>
    </Link>
  );
}
