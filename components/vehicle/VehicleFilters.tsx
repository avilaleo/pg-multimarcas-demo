"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SlidersHorizontal, Search, X, ChevronDown, ArrowUpDown } from "lucide-react";
import type {
  Transmission,
  FuelType,
  VehicleFilters as VehicleFiltersType,
  VehicleSort,
} from "@/lib/domain/vehicle";
import { analytics } from "@/lib/analytics/adapter";
import { Button, LinkButton } from "@/components/ui/Button";
import { SelectField, type SelectItem } from "@/components/ui/Select";
import { trackFilterDrawerOpen, trackInventorySortChange } from "@/components/analytics/track-events";

const PRICE_OPTIONS = [30000, 50000, 75000, 100000, 150000, 200000, 350000];
const YEAR_OPTIONS = Array.from({ length: 18 }, (_, i) => 2026 - i);
const TRANSMISSION_OPTIONS: Transmission[] = ["Manual", "Automático", "Automatizado", "CVT"];
const FUEL_OPTIONS: FuelType[] = ["Flex", "Gasolina", "Diesel", "Híbrido", "Elétrico"];

const SORT_OPTIONS: SelectItem<VehicleSort>[] = [
  { value: "relevance", label: "Relevância" },
  { value: "price-asc", label: "Menor preço" },
  { value: "price-desc", label: "Maior preço" },
  { value: "year-desc", label: "Ano mais novo" },
  { value: "mileage-asc", label: "Menor km" },
];

const FIELD_LABEL = "text-xs font-semibold uppercase tracking-wide text-muted";

/** Builds `{value: "", label: allLabel}` + one item per option, mirroring the previous native `<option value="">`. */
function priceSelectItems(allLabel: string): SelectItem<string>[] {
  return [
    { value: "", label: allLabel },
    ...PRICE_OPTIONS.map((p) => ({ value: String(p), label: p.toLocaleString("pt-BR") })),
  ];
}

function yearSelectItems(allLabel: string): SelectItem<string>[] {
  return [{ value: "", label: allLabel }, ...YEAR_OPTIONS.map((y) => ({ value: String(y), label: String(y) }))];
}

const TRANSMISSION_ITEMS: SelectItem<string>[] = [
  { value: "", label: "Todos" },
  ...TRANSMISSION_OPTIONS.map((t) => ({ value: t, label: t })),
];

const FUEL_ITEMS: SelectItem<string>[] = [
  { value: "", label: "Todos" },
  ...FUEL_OPTIONS.map((f) => ({ value: f, label: f })),
];

/** First layer: search, brand, model, price ceiling — always visible on desktop and in the mobile drawer. */
function PrimaryFields({
  brands,
  modelsByBrand,
  current,
  searchSpanFull = false,
}: {
  brands: string[];
  modelsByBrand: Record<string, string[]>;
  current: VehicleFiltersType;
  searchSpanFull?: boolean;
}) {
  const [brand, setBrand] = useState(current.brand ?? "");

  const allModels = useMemo(
    () => Array.from(new Set(Object.values(modelsByBrand).flat())).sort(),
    [modelsByBrand]
  );
  const availableModels = brand ? modelsByBrand[brand] ?? [] : allModels;

  const brandItems = useMemo<SelectItem<string>[]>(
    () => [{ value: "", label: "Todas" }, ...brands.map((b) => ({ value: b, label: b }))],
    [brands]
  );
  const modelItems: SelectItem<string>[] = [
    { value: "", label: "Todos" },
    ...availableModels.map((m) => ({ value: m, label: m })),
  ];
  const maxPriceItems = useMemo(() => priceSelectItems("Máx."), []);

  return (
    <>
      <label className={`flex flex-col gap-1 ${searchSpanFull ? "col-span-2" : ""}`}>
        <span className={FIELD_LABEL}>Buscar</span>
        <input
          type="text"
          name="q"
          defaultValue={current.q ?? ""}
          placeholder="Marca ou modelo"
          className="h-10 rounded-sm border border-line bg-paper px-3 text-sm text-ink transition-colors duration-[var(--motion-fast)] focus:border-brand focus:outline-none"
        />
      </label>

      <SelectField
        name="brand"
        label="Marca"
        items={brandItems}
        value={brand}
        onValueChange={setBrand}
        placeholder="Todas"
      />

      <SelectField
        key={brand}
        name="model"
        label="Modelo"
        items={modelItems}
        defaultValue={current.model ?? ""}
        placeholder="Todos"
      />

      <SelectField
        name="maxPrice"
        label="Preço até"
        items={maxPriceItems}
        defaultValue={current.maxPrice !== undefined ? String(current.maxPrice) : ""}
        placeholder="Máx."
      />

      {/* Preserve the current sort when re-submitting the other fields (sort lives in its own separate form). */}
      <input type="hidden" name="sort" value={current.sort ?? "relevance"} />
    </>
  );
}

/** Second layer ("Mais filtros"): price floor, year, transmission, fuel. */
function SecondaryFields({ current }: { current: VehicleFiltersType }) {
  const minPriceItems = useMemo(() => priceSelectItems("Mín."), []);
  const minYearItems = useMemo(() => yearSelectItems("Mín."), []);

  return (
    <>
      <SelectField
        name="minPrice"
        label="Preço de"
        items={minPriceItems}
        defaultValue={current.minPrice !== undefined ? String(current.minPrice) : ""}
        placeholder="Mín."
      />
      <SelectField
        name="minYear"
        label="Ano de"
        items={minYearItems}
        defaultValue={current.minYear !== undefined ? String(current.minYear) : ""}
        placeholder="Mín."
      />
      <SelectField
        name="transmission"
        label="Câmbio"
        items={TRANSMISSION_ITEMS}
        defaultValue={current.transmission ?? ""}
        placeholder="Todos"
      />
      <SelectField
        name="fuel"
        label="Combustível"
        items={FUEL_ITEMS}
        defaultValue={current.fuel ?? ""}
        placeholder="Todos"
      />
    </>
  );
}

/** Desktop inline form: primary layer always visible, secondary layer behind a "Mais filtros" disclosure. */
function DesktopFilterForm({
  brands,
  modelsByBrand,
  current,
  onSubmit,
}: {
  brands: string[];
  modelsByBrand: Record<string, string[]>;
  current: VehicleFiltersType;
  onSubmit: () => void;
}) {
  const hasSecondaryActive = Boolean(
    current.minPrice !== undefined || current.minYear !== undefined || current.transmission || current.fuel
  );
  const [moreOpen, setMoreOpen] = useState(hasSecondaryActive);

  return (
    <form action="/estoque" method="get" onSubmit={onSubmit} className="mt-4 hidden lg:block">
      <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto_auto] lg:items-end">
        <PrimaryFields brands={brands} modelsByBrand={modelsByBrand} current={current} />
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={() => setMoreOpen((v) => !v)}
          aria-expanded={moreOpen}
          aria-controls="filters-more-desktop"
        >
          Mais filtros
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] ${
              moreOpen ? "rotate-180" : ""
            }`}
            aria-hidden
          />
        </Button>
        <Button type="submit" variant="primary" size="md">
          <Search className="h-4 w-4" aria-hidden />
          Ver resultados
        </Button>
      </div>

      <div
        id="filters-more-desktop"
        className={moreOpen ? "mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" : "hidden"}
      >
        <SecondaryFields current={current} />
      </div>
    </form>
  );
}

/** Standalone GET form: changing the sort auto-submits while preserving every other active filter. */
function SortControl({ current }: { current: VehicleFiltersType }) {
  const formRef = useRef<HTMLFormElement>(null);

  function handleSortChange(value: VehicleSort) {
    trackInventorySortChange(value);
    formRef.current?.requestSubmit();
  }

  return (
    <form ref={formRef} action="/estoque" method="get" className="flex items-center gap-2">
      {current.q && <input type="hidden" name="q" value={current.q} />}
      {current.brand && <input type="hidden" name="brand" value={current.brand} />}
      {current.model && <input type="hidden" name="model" value={current.model} />}
      {current.minPrice !== undefined && <input type="hidden" name="minPrice" value={current.minPrice} />}
      {current.maxPrice !== undefined && <input type="hidden" name="maxPrice" value={current.maxPrice} />}
      {current.minYear !== undefined && <input type="hidden" name="minYear" value={current.minYear} />}
      {current.maxYear !== undefined && <input type="hidden" name="maxYear" value={current.maxYear} />}
      {current.transmission && <input type="hidden" name="transmission" value={current.transmission} />}
      {current.fuel && <input type="hidden" name="fuel" value={current.fuel} />}

      <ArrowUpDown className="hidden h-4 w-4 shrink-0 text-muted sm:block" aria-hidden />
      <SelectField
        name="sort"
        items={SORT_OPTIONS}
        defaultValue={current.sort ?? "relevance"}
        onValueChange={handleSortChange}
        aria-label="Ordenar por"
        placeholder="Ordenar por"
        triggerClassName="w-[9.5rem] sm:w-44"
      />
      {/* Base UI's popup needs JS to open; without it the hidden input still carries the SSR-rendered
          default sort, so this fallback only re-submits the current value (no way to pick another one
          without JS). Documented trade-off — see final report. */}
      <noscript>
        <button type="submit" className="h-10 rounded-sm border border-line px-3 text-sm text-ink">
          Aplicar
        </button>
      </noscript>
    </form>
  );
}

/** Mobile bottom-sheet form: both layers stacked (no disclosure), sticky footer with clear/apply. */
function MobileFilterForm({
  brands,
  modelsByBrand,
  current,
  resultCount,
  onSubmit,
}: {
  brands: string[];
  modelsByBrand: Record<string, string[]>;
  current: VehicleFiltersType;
  resultCount: number;
  onSubmit: () => void;
}) {
  return (
    <form
      action="/estoque"
      method="get"
      onSubmit={onSubmit}
      className="grid flex-1 grid-cols-2 gap-3 overflow-y-auto px-4 py-4"
    >
      <PrimaryFields brands={brands} modelsByBrand={modelsByBrand} current={current} searchSpanFull />
      <SecondaryFields current={current} />

      <div className="col-span-2 sticky bottom-0 -mx-4 mt-2 flex gap-3 border-t border-line bg-paper px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
        <LinkButton href="/estoque" variant="outline" size="md" className="flex-1">
          Limpar
        </LinkButton>
        <Button type="submit" variant="primary" size="md" className="flex-1">
          {/* The count reflects the currently applied filters (server-rendered), not a live recount of
              the in-progress form edits — a client-side live count would need a data fetch this app
              doesn't have today. Documented trade-off — see final report. */}
          Ver {resultCount} {resultCount === 1 ? "veículo" : "veículos"}
        </Button>
      </div>
    </form>
  );
}

export function VehicleFilters({
  brands,
  modelsByBrand,
  current,
  resultCount,
}: {
  brands: string[];
  modelsByBrand: Record<string, string[]>;
  current: VehicleFiltersType;
  resultCount: number;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function handleSubmit() {
    analytics.track("vehicle_filter", {
      brand: current.brand,
      minPrice: current.minPrice,
      maxPrice: current.maxPrice,
    });
  }

  function handleOpenDrawer() {
    trackFilterDrawerOpen();
    setOpen(true);
  }

  return (
    <div className="border-b border-line bg-paper">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">
            <span className="font-semibold text-ink">{resultCount}</span>{" "}
            {resultCount === 1 ? "veículo encontrado" : "veículos encontrados"}
          </p>

          <div className="flex items-center gap-3">
            <SortControl current={current} />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleOpenDrawer}
              className="lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden />
              Filtros
            </Button>
          </div>
        </div>

        <DesktopFilterForm
          brands={brands}
          modelsByBrand={modelsByBrand}
          current={current}
          onSubmit={handleSubmit}
        />
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Fechar filtros"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/50"
          />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[90vh] flex-col rounded-t-lg bg-paper shadow-elevated">
            <div className="flex items-center justify-between border-b border-line px-4 py-4">
              <div>
                <p className="font-display text-lg font-semibold text-ink">Filtros</p>
                <p className="text-sm text-muted">
                  {resultCount} {resultCount === 1 ? "veículo encontrado" : "veículos encontrados"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar"
                className="rounded-full p-2 text-muted transition-colors duration-[var(--motion-fast)] hover:bg-surface hover:text-ink"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <MobileFilterForm
              brands={brands}
              modelsByBrand={modelsByBrand}
              current={current}
              resultCount={resultCount}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
}
