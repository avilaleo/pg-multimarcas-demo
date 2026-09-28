"use client";

import { useEffect, useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { ListViewTracker } from "@/components/vehicle/ListViewTracker";
import { VehicleFilters } from "@/components/vehicle/VehicleFilters";
import { VehicleGrid } from "@/components/vehicle/VehicleGrid";
import type { Vehicle, VehicleFilters as VehicleFiltersType } from "@/lib/domain/vehicle";
import { parseVehicleFilters } from "@/lib/parse-vehicle-filters";

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
    case "relevance":
    default:
      return [...filtered].sort((a, b) => Number(b.featured) - Number(a.featured));
  }
}

export function InventoryClient({
  vehicles,
  brands,
}: {
  vehicles: Vehicle[];
  brands: string[];
}) {
  const [filters, setFilters] = useState<VehicleFiltersType>({ sort: "relevance" });

  useEffect(() => {
    const syncFilters = () => setFilters(filtersFromLocation());
    syncFilters();
    window.addEventListener("popstate", syncFilters);
    return () => window.removeEventListener("popstate", syncFilters);
  }, []);

  const filteredVehicles = useMemo(
    () => filterVehicles(vehicles, filters),
    [vehicles, filters]
  );

  const filterKey = JSON.stringify(filters);

  return (
    <>
      <ListViewTracker filters={filters} resultCount={filteredVehicles.length} />
      <VehicleFilters
        key={filterKey}
        brands={brands}
        current={filters}
        resultCount={filteredVehicles.length}
      />

      <Container className="py-10">
        <p className="mb-6 hidden text-sm text-muted lg:block">
          {filteredVehicles.length} veículos encontrados
        </p>
        <VehicleGrid vehicles={filteredVehicles} />
      </Container>
    </>
  );
}
