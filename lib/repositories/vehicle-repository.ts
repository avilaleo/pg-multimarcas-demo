import type { Vehicle, VehicleFilters } from "@/lib/domain/vehicle";

/**
 * Repository contract for vehicle data. `StaticVehicleRepository` (this demo)
 * reads from local fixtures; a future `AutoCertoVehicleRepository` would
 * implement the same interface against the AutoCerto API without requiring
 * any change to the pages/components that consume it.
 */
export interface VehicleRepository {
  getVehicles(filters?: VehicleFilters): Promise<Vehicle[]>;
  getFeaturedVehicles(limit?: number): Promise<Vehicle[]>;
  getVehicleBySlug(slug: string): Promise<Vehicle | null>;
  getRelatedVehicles(vehicle: Vehicle, limit?: number): Promise<Vehicle[]>;
  getBrands(): Promise<string[]>;
  getModels(brand?: string): Promise<string[]>;
}
