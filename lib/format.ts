export function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export function formatMileage(km: number): string {
  return `${km.toLocaleString("pt-BR")} km`;
}

export function formatYear(manufactureYear: number, modelYear: number): string {
  return manufactureYear === modelYear
    ? `${modelYear}`
    : `${manufactureYear}/${modelYear}`;
}

/**
 * Factual one-line summary built purely from structured fields — for SEO
 * (meta description, JSON-LD Product.description) only. Not rendered as
 * visible VDP copy: docs/redesign-v3/vdp.md 10.6 removes the old
 * per-vehicle auto-generated paragraph as redundant, repetitive UI, but
 * metadata can still be built from structured data.
 */
export function vehicleSummary(vehicle: {
  brand: string;
  model: string;
  version: string;
  manufactureYear: number;
  modelYear: number;
  mileage: number;
  transmission: string;
}): string {
  const yearLabel = formatYear(vehicle.manufactureYear, vehicle.modelYear);
  return (
    `${vehicle.brand} ${vehicle.model} ${vehicle.version}, ano ${yearLabel}, ` +
    `${formatMileage(vehicle.mileage)} rodados, câmbio ${vehicle.transmission.toLowerCase()}.`
  );
}
