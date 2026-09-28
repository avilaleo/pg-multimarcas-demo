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
