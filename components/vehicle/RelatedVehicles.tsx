"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import type { Vehicle } from "@/lib/domain/vehicle";
import type { RelatedVehicleMode } from "@/lib/repositories/vehicle-repository";
import { trackRelatedModeChange, trackRelatedVehicleClick } from "@/components/analytics/track-events";

export interface RelatedVehicleGroup {
  mode: RelatedVehicleMode;
  label: string;
  vehicles: Vehicle[];
}

/**
 * V3 "Relacionados" (docs/redesign-v3/vdp.md): 3 deterministic modes
 * computed server-side (StaticVehicleRepository.getRelatedVehiclesByMode) —
 * this component only switches which already-computed list is shown and
 * scrolls it. `groups` only contains modes with >=1 vehicle; the caller
 * (app/estoque/[slug]/page.tsx) filters empty modes out before rendering.
 */
export function RelatedVehicles({
  groups,
  vehicleSlug,
}: {
  groups: RelatedVehicleGroup[];
  vehicleSlug: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  if (groups.length === 0) return null;

  const active = groups[activeIndex] ?? groups[0];

  function selectMode(index: number) {
    setActiveIndex(index);
    trackRelatedModeChange(groups[index].mode, vehicleSlug);
    requestAnimationFrame(() => {
      scrollerRef.current?.scrollTo({ left: 0 });
    });
  }

  function scrollByCard(delta: number) {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-related-card]");
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: delta * step, behavior: "smooth" });
  }

  return (
    <section className="border-t border-line pt-12 pb-4 sm:pt-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">Continue vendo</p>
          <h2 className="mt-1 font-display text-2xl font-bold text-ink">Veículos relacionados</h2>
        </div>

        {groups.length > 1 && (
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Modo de veículos relacionados">
            {groups.map((group, index) => (
              <button
                key={group.mode}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                onClick={() => selectMode(index)}
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] ${
                  index === activeIndex
                    ? "border-brand bg-brand text-white"
                    : "border-line bg-white text-ink hover:border-ink"
                }`}
              >
                {group.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative mt-6">
        {active.vehicles.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Ver veículos anteriores"
              className="absolute -left-3 top-[38%] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white shadow-card transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-surface motion-safe:hover:scale-105 motion-safe:active:scale-95 lg:flex"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="Ver próximos veículos"
              className="absolute -right-3 top-[38%] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white shadow-card transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-surface motion-safe:hover:scale-105 motion-safe:active:scale-95 lg:flex"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </>
        )}

        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {active.vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              data-related-card
              onClick={() => trackRelatedVehicleClick(active.mode, vehicleSlug, vehicle.slug)}
              className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[23%]"
            >
              <VehicleCard vehicle={vehicle} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
