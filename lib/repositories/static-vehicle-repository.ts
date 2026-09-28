import type { Vehicle, VehicleFilters } from "@/lib/domain/vehicle";
import type { VehicleRepository } from "@/lib/repositories/vehicle-repository";
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

  async getRelatedVehicles(vehicle: Vehicle, limit = 3): Promise<Vehicle[]> {
    const sameBrand = ALL_VEHICLES.filter(
      (v) => v.id !== vehicle.id && v.status === "available" && v.brand === vehicle.brand
    );
    const rest = ALL_VEHICLES.filter(
      (v) => v.id !== vehicle.id && v.status === "available" && v.brand !== vehicle.brand
    );
    return [...sameBrand, ...rest].slice(0, limit);
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
