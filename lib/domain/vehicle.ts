export type VehicleStatus = "available" | "reserved" | "sold";

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
  description: string;
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
