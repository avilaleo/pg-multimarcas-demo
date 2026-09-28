import type { Vehicle, VehicleFilters } from "@/lib/domain/vehicle";

/**
 * The 3 "related vehicles" intents from docs/redesign-v3/vdp.md — replaces
 * the old single `getRelatedVehicles` (same-brand-then-rest, no scoring).
 */
export type RelatedVehicleMode = "similar" | "same-model" | "price-range";

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
  getRelatedVehiclesByMode(vehicle: Vehicle, mode: RelatedVehicleMode, limit?: number): Promise<Vehicle[]>;
  getBrands(): Promise<string[]>;
  getModels(brand?: string): Promise<string[]>;
}
