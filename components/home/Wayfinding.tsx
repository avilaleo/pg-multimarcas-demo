import { MapPin, Clock, Phone, DoorOpen, Store, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { dealerConfig } from "@/dealer.config";
import { WayfindingActions } from "@/components/home/WayfindingActions";

export function Wayfinding() {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    dealerConfig.address.mapsQuery
  )}`;
  const wazeUrl = `https://waze.com/ul?q=${encodeURIComponent(dealerConfig.address.mapsQuery)}&navigate=yes`;

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">Como chegar</p>
        <h2 className="mt-1 font-display text-3xl font-bold text-ink">Estamos na Entrada 02, Loja 13.</h2>
        <p className="mt-3 max-w-2xl text-muted">
          A PG fica dentro do Auto Shopping Praia Grande. Veja por onde entrar e como chegar até a loja.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-stretch">
          {/* Camada 1 — chegando ao Auto Shopping */}
          <div className="flex flex-col gap-5 rounded-lg border border-line bg-surface p-6 shadow-card sm:p-8">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-white">
                1
              </span>
              Chegando ao Auto Shopping
            </div>

            <div className="flex gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-brand shadow-card">
                <MapPin className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="font-semibold text-ink">{dealerConfig.legalContext}</p>
                <p className="text-sm text-ink/80">{dealerConfig.address.full}</p>
              </div>
            </div>

            <p className="text-sm text-muted">
              O Auto Shopping reúne mais de 30 lojas — por isso vale conferir a entrada certa antes de
              seguir até a PG.
            </p>

            <WayfindingActions mapsUrl={mapsUrl} wazeUrl={wazeUrl} />

            <div className="mt-2 grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
              <div className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white text-brand shadow-card">
                  <Clock className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">Horário</p>
                  <p className="text-sm text-ink">
                    {dealerConfig.hours.weekdays}
                    <br />
                    {dealerConfig.hours.saturday}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white text-brand shadow-card">
                  <Phone className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">Telefone</p>
                  <p className="text-sm text-ink">{dealerConfig.contact.phoneDisplay}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Camada 2 — já dentro do Auto Shopping */}
          <div className="flex flex-col justify-center gap-6 rounded-lg border border-line-invert bg-black p-6 text-white shadow-elevated sm:p-8">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/60">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white">
                2
              </span>
              Já dentro do Auto Shopping
            </div>

            <div className="flex items-center justify-center gap-4 sm:gap-6">
              <div className="flex flex-col items-center gap-2">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-brand text-2xl font-bold">
                  02
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-white/70">
                  <DoorOpen className="h-4 w-4" aria-hidden />
                  Entrada
                </span>
              </div>

              <ArrowRight className="h-6 w-6 shrink-0 text-brand" aria-hidden />

              <div className="flex flex-col items-center gap-2">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand text-2xl font-bold text-white">
                  13
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-white/70">
                  <Store className="h-4 w-4" aria-hidden />
                  Loja PG
                </span>
              </div>
            </div>

            <p className="text-center text-sm text-white/70">
              Entre pela Entrada 02 e siga até a Loja 13 — é lá que fica a {dealerConfig.name}.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
