"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ListViewTracker } from "@/components/vehicle/ListViewTracker";
import { VehicleFilters } from "@/components/vehicle/VehicleFilters";
import { VehicleGrid } from "@/components/vehicle/VehicleGrid";
import type { Vehicle, VehicleFilters as VehicleFiltersType } from "@/lib/domain/vehicle";
import { parseVehicleFilters } from "@/lib/parse-vehicle-filters";
import { formatPrice } from "@/lib/format";

const INVENTORY_PATH = "/pg-multimarcas-demo/estoque/";

const FILTER_KEYS = [
  "q",
  "brand",
  "model",
  "minPrice",
  "maxPrice",
  "minYear",
  "maxYear",
  "transmission",
  "fuel",
] as const;

type FilterKey = (typeof FILTER_KEYS)[number];

function filtersFromLocation(): VehicleFiltersType {
  if (typeof window === "undefined") return { sort: "relevance" };
  const raw: Record<string, string> = {};
  new URLSearchParams(window.location.search).forEach((value, key) => {
    raw[key] = value;
  });
  return parseVehicleFilters(raw);
}

function filterVehicles(vehicles: Vehicle[], filters: VehicleFiltersType): Vehicle[] {
  const filtered = vehicles.filter((vehicle) => {
    if (vehicle.status !== "available") return false;
    if (filters.q) {
      const q = filters.q.trim().toLowerCase();
      const haystack = `${vehicle.brand} ${vehicle.model} ${vehicle.version}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (filters.brand && vehicle.brand.toLowerCase() !== filters.brand.toLowerCase()) return false;
    if (filters.model && vehicle.model.toLowerCase() !== filters.model.toLowerCase()) return false;
    if (filters.minPrice !== undefined && vehicle.price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && vehicle.price > filters.maxPrice) return false;
    if (filters.minYear !== undefined && vehicle.modelYear < filters.minYear) return false;
    if (filters.maxYear !== undefined && vehicle.modelYear > filters.maxYear) return false;
    if (filters.transmission && vehicle.transmission !== filters.transmission) return false;
    if (filters.fuel && vehicle.fuel !== filters.fuel) return false;
    return true;
  });

  switch (filters.sort) {
    case "price-asc":
      return [...filtered].sort((a, b) => a.price - b.price);
    case "price-desc":
      return [...filtered].sort((a, b) => b.price - a.price);
    case "year-desc":
      return [...filtered].sort((a, b) => b.modelYear - a.modelYear);
    case "mileage-asc":
      return [...filtered].sort((a, b) => a.mileage - b.mileage);
    default:
      return [...filtered].sort((a, b) => Number(b.featured) - Number(a.featured));
  }
}

function buildFilterHref(filters: VehicleFiltersType, omit?: FilterKey): string {
  const params = new URLSearchParams();
  for (const key of FILTER_KEYS) {
    if (key === omit) continue;
    const value = filters[key];
    if (value !== undefined && value !== "") params.set(key, String(value));
  }
  if (filters.sort && filters.sort !== "relevance") params.set("sort", filters.sort);
  const qs = params.toString();
  return qs ? `${INVENTORY_PATH}?${qs}` : INVENTORY_PATH;
}

function buildActiveChips(filters: VehicleFiltersType): { key: FilterKey; label: string }[] {
  const chips: { key: FilterKey; label: string }[] = [];
  if (filters.q) chips.push({ key: "q", label: `Busca: "${filters.q}"` });
  if (filters.brand) chips.push({ key: "brand", label: `Marca: ${filters.brand}` });
  if (filters.model) chips.push({ key: "model", label: `Modelo: ${filters.model}` });
  if (filters.minPrice !== undefined) chips.push({ key: "minPrice", label: `A partir de ${formatPrice(filters.minPrice)}` });
  if (filters.maxPrice !== undefined) chips.push({ key: "maxPrice", label: `Até ${formatPrice(filters.maxPrice)}` });
  if (filters.minYear !== undefined) chips.push({ key: "minYear", label: `A partir de ${filters.minYear}` });
  if (filters.maxYear !== undefined) chips.push({ key: "maxYear", label: `Até ${filters.maxYear}` });
  if (filters.transmission) chips.push({ key: "transmission", label: `Câmbio: ${filters.transmission}` });
  if (filters.fuel) chips.push({ key: "fuel", label: `Combustível: ${filters.fuel}` });
  return chips;
}

export function InventoryClient({ vehicles }: { vehicles: Vehicle[] }) {
  const [filters, setFilters] = useState<VehicleFiltersType>({ sort: "relevance" });

  useEffect(() => {
    const sync = () => setFilters(filtersFromLocation());
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const brands = useMemo(
    () => Array.from(new Set(vehicles.filter((v) => v.status === "available").map((v) => v.brand))).sort(),
    [vehicles]
  );
  const modelsByBrand = useMemo(() => {
    const result: Record<string, string[]> = {};
    for (const brand of brands) {
      result[brand] = Array.from(
        new Set(vehicles.filter((v) => v.status === "available" && v.brand === brand).map((v) => v.model))
      ).sort();
    }
    return result;
  }, [brands, vehicles]);

  const filteredVehicles = useMemo(() => filterVehicles(vehicles, filters), [vehicles, filters]);
  const chips = buildActiveChips(filters);
  const filterKey = JSON.stringify(filters);

  return (
    <>
      <ListViewTracker filters={filters} resultCount={filteredVehicles.length} />
      <VehicleFilters
        key={filterKey}
        brands={brands}
        modelsByBrand={modelsByBrand}
        current={filters}
        resultCount={filteredVehicles.length}
      />

      <Container className="py-8">
        {chips.length > 0 && (
          <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden">
            {chips.map((chip) => (
              <a
                key={chip.key}
                href={buildFilterHref(filters, chip.key)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-medium text-ink transition-colors duration-[var(--motion-fast)] hover:border-brand hover:text-brand active:bg-surface"
              >
                {chip.label}
                <X className="h-3 w-3" aria-hidden />
                <span className="sr-only"> (remover filtro)</span>
              </a>
            ))}
            <a
              href={INVENTORY_PATH}
              className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap px-2 py-1.5 text-xs font-semibold text-muted hover:text-brand hover:underline"
            >
              Limpar tudo
            </a>
          </div>
        )}
        <h2 className="sr-only">Resultados</h2>
        <VehicleGrid vehicles={filteredVehicles} hasActiveFilters={chips.length > 0} />
      </Container>
    </>
  );
}
