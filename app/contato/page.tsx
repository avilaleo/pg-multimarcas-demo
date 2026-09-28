import type { Metadata } from "next";
import { MapPin, Clock, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { ContactForm } from "@/components/forms/ContactForm";
import { dealerConfig } from "@/dealer.config";
import { instagramProfileUrl } from "@/components/analytics/track-events";

export const metadata: Metadata = {
  title: "Contato",
  description: `Fale com a ${dealerConfig.name}: telefone, WhatsApp, endereço e horário de atendimento em ${dealerConfig.address.city}/${dealerConfig.address.state}.`,
  alternates: { canonical: "/contato" },
};

export default function ContactPage() {
  return (
    <Container className="py-14 sm:py-20">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand">Fale conosco</p>
      <h1 className="mt-1 font-display text-3xl font-bold text-ink sm:text-4xl">Contato</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="space-y-5 text-ink/80">
            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden />
              <div>
                <p className="font-semibold text-ink">Endereço</p>
                <p>{dealerConfig.address.full}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden />
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
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden />
              <div>
                <p className="font-semibold text-ink">Telefone / WhatsApp</p>
                <p>
                  <a href={`tel:+${dealerConfig.contact.phoneE164}`} className="hover:text-brand">
                    {dealerConfig.contact.phoneDisplay}
                  </a>
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <InstagramIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
              <div>
                <p className="font-semibold text-ink">Instagram</p>
                <p>
                  <a href={instagramProfileUrl} target="_blank" rel="noreferrer" className="hover:text-brand">
                    {dealerConfig.instagram.handle}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </Container>
  );
}
