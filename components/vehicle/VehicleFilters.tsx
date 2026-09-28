"use client";

import { useState } from "react";
import { SlidersHorizontal, Search } from "lucide-react";
import type { VehicleFilters as VehicleFiltersType } from "@/lib/domain/vehicle";
import { analytics } from "@/lib/analytics/adapter";

const PRICE_OPTIONS = [30000, 50000, 75000, 100000, 150000, 200000, 350000];
const YEAR_OPTIONS = Array.from({ length: 18 }, (_, i) => 2026 - i);

export function VehicleFilters({
  brands,
  current,
  resultCount,
}: {
  brands: string[];
  current: VehicleFiltersType;
  resultCount: number;
}) {
  const [open, setOpen] = useState(false);

  function handleSubmit() {
    analytics.track("vehicle_filter", {
      brand: current.brand,
      minPrice: current.minPrice,
      maxPrice: current.maxPrice,
    });
  }

  return (
    <div className="border-b border-line bg-white">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:hidden lg:px-8">
        <p className="text-sm text-muted">{resultCount} veículos encontrados</p>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden />
          Filtros
        </button>
      </div>

      <form
        method="get"
        onSubmit={handleSubmit}
        className={`${open ? "grid" : "hidden"} mx-auto w-full max-w-7xl grid-cols-2 gap-3 px-4 pb-4 sm:px-6 lg:grid lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_1fr_1fr_auto] lg:items-end lg:px-8 lg:py-4`}
      >
        <label className="col-span-2 flex flex-col gap-1 lg:col-span-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">Buscar</span>
          <input
            type="text"
            name="q"
            defaultValue={current.q ?? ""}
            placeholder="Marca ou modelo"
            className="h-10 rounded-lg border border-line px-3 text-sm"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">Marca</span>
          <select name="brand" defaultValue={current.brand ?? ""} className="h-10 rounded-lg border border-line px-2 text-sm">
            <option value="">Todas</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">Preço de</span>
          <select name="minPrice" defaultValue={current.minPrice ?? ""} className="h-10 rounded-lg border border-line px-2 text-sm">
            <option value="">Mín.</option>
            {PRICE_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p.toLocaleString("pt-BR")}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">Preço até</span>
          <select name="maxPrice" defaultValue={current.maxPrice ?? ""} className="h-10 rounded-lg border border-line px-2 text-sm">
            <option value="">Máx.</option>
            {PRICE_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p.toLocaleString("pt-BR")}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">Ano de</span>
          <select name="minYear" defaultValue={current.minYear ?? ""} className="h-10 rounded-lg border border-line px-2 text-sm">
            <option value="">Mín.</option>
            {YEAR_OPTIONS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">Câmbio</span>
          <select name="transmission" defaultValue={current.transmission ?? ""} className="h-10 rounded-lg border border-line px-2 text-sm">
            <option value="">Todos</option>
            <option value="Manual">Manual</option>
            <option value="Automático">Automático</option>
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">Ordenar</span>
          <select name="sort" defaultValue={current.sort ?? "relevance"} className="h-10 rounded-lg border border-line px-2 text-sm">
            <option value="relevance">Relevância</option>
            <option value="price-asc">Menor preço</option>
            <option value="price-desc">Maior preço</option>
            <option value="year-desc">Mais novo</option>
            <option value="mileage-asc">Menor km</option>
          </select>
        </label>

        <button
          type="submit"
          className="col-span-2 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-dark lg:col-span-1"
        >
          <Search className="h-4 w-4" aria-hidden />
          Filtrar
        </button>
      </form>
    </div>
  );
}
