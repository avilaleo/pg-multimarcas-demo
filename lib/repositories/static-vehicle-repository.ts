import type { Vehicle, VehicleFilters } from "@/lib/domain/vehicle";
import type { RelatedVehicleMode, VehicleRepository } from "@/lib/repositories/vehicle-repository";
import vehiclesData from "@/data/vehicles.json";

const ALL_VEHICLES = vehiclesData as Vehicle[];

function matches(vehicle: Vehicle, filters?: VehicleFilters): boolean {
  if (!filters) return true;

  if (filters.q) {
    const q = filters.q.trim().toLowerCase();
    const haystack = `${vehicle.brand} ${vehicle.model} ${vehicle.version}`.toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  if (filters.brand && vehicle.brand.toLowerCase() !== filters.brand.toLowerCase()) {
    return false;
  }
  if (filters.model && vehicle.model.toLowerCase() !== filters.model.toLowerCase()) {
    return false;
  }
  if (filters.minPrice !== undefined && vehicle.price < filters.minPrice) return false;
  if (filters.maxPrice !== undefined && vehicle.price > filters.maxPrice) return false;
  if (filters.minYear !== undefined && vehicle.modelYear < filters.minYear) return false;
  if (filters.maxYear !== undefined && vehicle.modelYear > filters.maxYear) return false;
  if (filters.transmission && vehicle.transmission !== filters.transmission) return false;
  if (filters.fuel && vehicle.fuel !== filters.fuel) return false;

  return true;
}

function sortVehicles(vehicles: Vehicle[], sort?: VehicleFilters["sort"]): Vehicle[] {
  const sorted = [...vehicles];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "year-desc":
      return sorted.sort((a, b) => b.modelYear - a.modelYear);
    case "mileage-asc":
      return sorted.sort((a, b) => a.mileage - b.mileage);
    case "relevance":
    default:
      return sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
}

export class StaticVehicleRepository implements VehicleRepository {
  async getVehicles(filters?: VehicleFilters): Promise<Vehicle[]> {
    const filtered = ALL_VEHICLES.filter((v) => v.status === "available" && matches(v, filters));
    return sortVehicles(filtered, filters?.sort);
  }

  async getFeaturedVehicles(limit = 6): Promise<Vehicle[]> {
    const featured = ALL_VEHICLES.filter((v) => v.featured && v.status === "available");
    return featured.slice(0, limit);
  }

  async getVehicleBySlug(slug: string): Promise<Vehicle | null> {
    return ALL_VEHICLES.find((v) => v.slug === slug) ?? null;
  }

  /**
   * V3 related-vehicles algorithms (docs/redesign-v3/vdp.md "Relacionados").
   * Deterministic scoring/sorting only — no ML. Never includes `vehicle`
   * itself. The VDP page calls this once per mode and only renders modes
   * that come back non-empty.
   */
  async getRelatedVehiclesByMode(
    vehicle: Vehicle,
    mode: RelatedVehicleMode,
    limit = 10
  ): Promise<Vehicle[]> {
    const candidates = ALL_VEHICLES.filter((v) => v.id !== vehicle.id && v.status === "available");

    if (mode === "same-model") {
      return candidates
        .filter((v) => v.brand === vehicle.brand && v.model === vehicle.model)
        .sort((a, b) => {
          const yearDiff =
            Math.abs(a.modelYear - vehicle.modelYear) - Math.abs(b.modelYear - vehicle.modelYear);
          if (yearDiff !== 0) return yearDiff;
          return Math.abs(a.price - vehicle.price) - Math.abs(b.price - vehicle.price);
        })
        .slice(0, limit);
    }

    if (mode === "price-range") {
      return candidates
        .filter((v) => Math.abs(v.price - vehicle.price) / vehicle.price <= 0.2)
        .sort((a, b) => Math.abs(a.price - vehicle.price) - Math.abs(b.price - vehicle.price))
        .slice(0, limit);
    }

    // "similar": +50 mesmo bodyType, +25 preço ±15% (senão +15 se ±30%, nunca os dois),
    // +10 modelYear a até 2 anos de diferença, +5 mesma transmissão.
    return candidates
      .map((candidate) => {
        let score = 0;
        if (candidate.bodyType === vehicle.bodyType) score += 50;

        const priceDiffRatio = Math.abs(candidate.price - vehicle.price) / vehicle.price;
        if (priceDiffRatio <= 0.15) score += 25;
        else if (priceDiffRatio <= 0.3) score += 15;

        if (Math.abs(candidate.modelYear - vehicle.modelYear) <= 2) score += 10;
        if (candidate.transmission === vehicle.transmission) score += 5;

        return { candidate, score, priceDiff: Math.abs(candidate.price - vehicle.price) };
      })
      .sort((a, b) => (b.score !== a.score ? b.score - a.score : a.priceDiff - b.priceDiff))
      .slice(0, limit)
      .map((entry) => entry.candidate);
  }

  async getBrands(): Promise<string[]> {
    return Array.from(new Set(ALL_VEHICLES.map((v) => v.brand))).sort();
  }

  async getModels(brand?: string): Promise<string[]> {
    const source = brand
      ? ALL_VEHICLES.filter((v) => v.brand.toLowerCase() === brand.toLowerCase())
      : ALL_VEHICLES;
    return Array.from(new Set(source.map((v) => v.model))).sort();
  }
}

export const vehicleRepository: VehicleRepository = new StaticVehicleRepository();
