import { Search } from "lucide-react";
import { dealerConfig } from "@/dealer.config";

const PRICE_OPTIONS = [30000, 50000, 75000, 100000, 150000, 200000, 350000];

export function Hero({ brands }: { brands: string[] }) {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(210,31,46,0.35), transparent 45%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.08), transparent 40%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
          {dealerConfig.address.city}/{dealerConfig.address.state} · {dealerConfig.legalContext}
        </p>
        <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-tight sm:text-5xl">
          Encontre seu próximo carro na {dealerConfig.name}
        </h1>
        <p className="mt-4 max-w-xl text-lg text-white/70">
          Veículos revisados, com fotos reais e contato direto pelo WhatsApp — sem enrolação para marcar
          sua visita.
        </p>

        <form
          action="/estoque"
          method="get"
          className="mt-10 grid gap-3 rounded-2xl bg-white p-4 text-ink shadow-2xl shadow-black/30 sm:grid-cols-[1fr_1fr_1fr_auto]"
        >
          <label className="flex flex-col gap-1 text-left">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">Marca</span>
            <select
              name="brand"
              defaultValue=""
              className="h-11 rounded-lg border border-line bg-white px-3 text-sm"
            >
              <option value="">Todas as marcas</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-left">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">Preço até</span>
            <select
              name="maxPrice"
              defaultValue=""
              className="h-11 rounded-lg border border-line bg-white px-3 text-sm"
            >
              <option value="">Sem limite</option>
              {PRICE_OPTIONS.map((price) => (
                <option key={price} value={price}>
                  até {price.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-left">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">Buscar</span>
            <input
              type="text"
              name="q"
              placeholder="Ex.: Onix, Creta, HR-V..."
              className="h-11 rounded-lg border border-line bg-white px-3 text-sm placeholder:text-muted"
            />
          </label>

          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-2 self-end rounded-lg bg-brand px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            <Search className="h-4 w-4" aria-hidden />
            Buscar
          </button>
        </form>
      </div>
    </section>
  );
}
