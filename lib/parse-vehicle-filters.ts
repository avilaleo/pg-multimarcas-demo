import type { FuelType, Transmission, VehicleFilters, VehicleSort } from "@/lib/domain/vehicle";

type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

const VALID_SORTS: VehicleSort[] = ["relevance", "price-asc", "price-desc", "year-desc", "mileage-asc"];
const VALID_TRANSMISSIONS: Transmission[] = ["Manual", "Automático", "Automatizado", "CVT"];
const VALID_FUELS: FuelType[] = ["Flex", "Gasolina", "Diesel", "Híbrido", "Elétrico"];

export function parseVehicleFilters(searchParams: RawSearchParams): VehicleFilters {
  const q = first(searchParams.q)?.trim() || undefined;
  const brand = first(searchParams.brand) || undefined;
  const model = first(searchParams.model) || undefined;
  const minPrice = Number(first(searchParams.minPrice)) || undefined;
  const maxPrice = Number(first(searchParams.maxPrice)) || undefined;
  const minYear = Number(first(searchParams.minYear)) || undefined;
  const maxYear = Number(first(searchParams.maxYear)) || undefined;

  const transmissionRaw = first(searchParams.transmission);
  const transmission = VALID_TRANSMISSIONS.includes(transmissionRaw as Transmission)
    ? (transmissionRaw as Transmission)
    : undefined;

  const fuelRaw = first(searchParams.fuel);
  const fuel = VALID_FUELS.includes(fuelRaw as FuelType) ? (fuelRaw as FuelType) : undefined;

  const sortRaw = first(searchParams.sort);
  const sort = VALID_SORTS.includes(sortRaw as VehicleSort) ? (sortRaw as VehicleSort) : "relevance";

  return { q, brand, model, minPrice, maxPrice, minYear, maxYear, transmission, fuel, sort };
}
