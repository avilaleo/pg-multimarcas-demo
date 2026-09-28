import { MapPin, Clock, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { dealerConfig } from "@/dealer.config";
import { ContactTrackedLinks } from "@/components/home/ContactTrackedLinks";

export function ContactLocation() {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    dealerConfig.address.mapsQuery
  )}`;

  return (
    <section className="py-16 sm:py-20">
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">Visite a loja</p>
          <h2 className="mt-1 font-display text-3xl font-bold text-ink">Onde estamos</h2>

          <div className="mt-6 space-y-5 text-ink/80">
            <div className="flex gap-3">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-brand" aria-hidden />
              <div>
                <p className="font-semibold text-ink">Endereço</p>
                <p>{dealerConfig.address.full}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Clock className="mt-1 h-5 w-5 shrink-0 text-brand" aria-hidden />
              <div>
                <p className="font-semibold text-ink">Horário</p>
                <p>
                  {dealerConfig.hours.weekdays}
                  <br />
                  {dealerConfig.hours.saturday}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Phone className="mt-1 h-5 w-5 shrink-0 text-brand" aria-hidden />
              <div>
                <p className="font-semibold text-ink">Telefone</p>
                <p>{dealerConfig.contact.phoneDisplay}</p>
              </div>
            </div>
          </div>

          <ContactTrackedLinks mapsUrl={mapsUrl} />
        </div>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="group relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl border border-line bg-surface"
        >
          <div className="flex flex-col items-center gap-3 text-center text-muted">
            <MapPin className="h-10 w-10 text-brand" aria-hidden />
            <p className="max-w-[220px] text-sm">
              {dealerConfig.legalContext}
              <br />
              {dealerConfig.address.city}/{dealerConfig.address.state}
            </p>
            <span className="text-sm font-semibold text-ink underline-offset-4 group-hover:underline">
              Ver no mapa
            </span>
          </div>
        </a>
      </Container>
    </section>
  );
}
