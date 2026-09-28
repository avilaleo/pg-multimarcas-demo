import Link from "next/link";
import { Search } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SelectField } from "@/components/ui/Select";
import { dealerConfig } from "@/dealer.config";
import { formatPrice } from "@/lib/format";

const PRICE_OPTIONS = [30000, 50000, 75000, 100000, 150000, 200000, 350000];

export function Hero({ brands }: { brands: string[] }) {
  const brandItems = brands.map((brand) => ({ value: brand, label: brand }));
  const priceItems = PRICE_OPTIONS.map((price) => ({
    value: String(price),
    label: `até ${formatPrice(price)}`,
  }));

  return (
    <section className="relative overflow-hidden bg-black text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 15%, rgba(210,14,14,0.35), transparent 45%), radial-gradient(circle at 85% 0%, rgba(255,255,255,0.06), transparent 40%)",
        }}
        aria-hidden
      />
      <Container className="relative py-16 sm:py-20 lg:py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
          {dealerConfig.address.city}/{dealerConfig.address.state} · {dealerConfig.legalContext}
        </p>
        <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-tight sm:text-5xl">
          Encontre seu próximo carro na PG.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-white/70">
          Estoque atualizado, fotos reais e atendimento direto no Auto Shopping Praia Grande.
        </p>

        <form
          action="https://avilaleo.github.io/pg-multimarcas-demo/estoque/"
          method="get"
          className="mt-10 grid gap-3 rounded-lg bg-paper p-4 text-ink shadow-elevated sm:grid-cols-[1fr_1fr_1fr_auto]"
        >
          {/* V3.1 (docs/handoff/claude-redesign-v3-1.md P0.3): Marca/Preço
              stay desktop-only in the hero — mobile keeps just the free-text
              search + CTA, with a discreet link to the full filters below.
              Hidden via a wrapper `div` (not the field's own classes) so its
              internal `flex` layout isn't fighting a `hidden` utility on the
              same element. */}
          <div className="hidden sm:block">
            <SelectField
              name="brand"
              items={brandItems}
              defaultValue=""
              placeholder="Todas as marcas"
              label="Marca"
            />
          </div>

          <div className="hidden sm:block">
            <SelectField
              name="maxPrice"
              items={priceItems}
              defaultValue=""
              placeholder="Sem limite"
              label="Preço até"
            />
          </div>

          <label className="flex flex-col gap-1.5 text-left">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">
              Qual carro você procura?
            </span>
            <input
              type="text"
              name="q"
              placeholder="Ex.: Onix, Creta, HR-V..."
              className="h-10 rounded-sm border border-line bg-paper px-3 text-sm text-ink placeholder:text-muted"
            />
          </label>

          <Button type="submit" className="self-end">
            <Search className="h-4 w-4" aria-hidden />
            Ver carros disponíveis
          </Button>
        </form>

        <Link
          href="/estoque"
          className="mt-3 inline-block text-sm font-semibold text-white/70 underline-offset-2 hover:text-white hover:underline sm:hidden"
        >
          Ver filtros no estoque
        </Link>
      </Container>
    </section>
  );
}
