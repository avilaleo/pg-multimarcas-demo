/**
 * "preparing" mirrors the AutoCerto/PG operational state where a vehicle is
 * confirmed in stock but not yet ready to show (no final photos/details) —
 * see docs/product/architecture.md. It is excluded from listings the same
 * way "sold"/"reserved" are (StaticVehicleRepository), but its VDP still
 * renders with a real "em preparação" state instead of a fake gallery.
 */
export type VehicleStatus = "available" | "reserved" | "sold" | "preparing";

export type Transmission = "Manual" | "Automático" | "Automatizado" | "CVT";

export type FuelType = "Flex" | "Gasolina" | "Diesel" | "Híbrido" | "Elétrico";

export interface Vehicle {
  id: string;
  slug: string;
  brand: string;
  model: string;
  version: string;
  /** Model year, e.g. 2023 in "2022/2023" */
  modelYear: number;
  /** Manufacture year, e.g. 2022 in "2022/2023" */
  manufactureYear: number;
  price: number;
  /** Odometer reading, in kilometers */
  mileage: number;
  transmission: Transmission;
  fuel: FuelType;
  /** Not publicly exposed on the source listing for every unit; omitted when unknown. */
  color?: string;
  bodyType: string;
  /**
   * Free-text copy, e.g. from AutoCerto or a future CMS. Optional: the
   * sync script no longer fabricates a repetitive auto-generated paragraph
   * from the structured fields (docs/redesign-v3/vdp.md 10.6) — most
   * vehicles have none. Never used for SEO; see lib/format.ts
   * vehicleSummary() for that.
   */
  description?: string;
  features: string[];
  images: string[];
  featured: boolean;
  status: VehicleStatus;
}

export interface VehicleFilters {
  q?: string;
  brand?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  transmission?: Transmission;
  fuel?: FuelType;
  sort?: VehicleSort;
}

export type VehicleSort =
  | "relevance"
  | "price-asc"
  | "price-desc"
  | "year-desc"
  | "mileage-asc";
