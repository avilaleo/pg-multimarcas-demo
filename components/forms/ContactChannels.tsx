"use client";

import { MapPin, Clock, Phone, Navigation, MessageCircle } from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { dealerConfig } from "@/dealer.config";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";
import {
  instagramProfileUrl,
  trackPhoneClick,
  trackInstagramClick,
  trackDirectionsClick,
  trackWhatsAppClick,
} from "@/components/analytics/track-events";

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  dealerConfig.address.mapsQuery
)}`;

export function ContactChannels() {
  return (
    <div className="flex flex-col gap-6">
      <a
        href={getGeneralWhatsAppUrl()}
        target="_blank"
        rel="noreferrer"
        onClick={() => trackWhatsAppClick("contact_page")}
        className="flex items-center justify-center gap-3 rounded-lg bg-whatsapp px-6 py-5 text-lg font-semibold text-white shadow-elevated transition-transform hover:scale-[1.01] hover:bg-whatsapp/90"
      >
        <MessageCircle className="h-6 w-6" aria-hidden />
        Falar no WhatsApp
      </a>

      <div className="grid gap-4 sm:grid-cols-2">
        <a
          href={`tel:+${dealerConfig.contact.phoneE164}`}
          onClick={() => trackPhoneClick("contact_page")}
          className="flex items-center gap-3 rounded-lg border border-line bg-surface p-4 transition-colors hover:border-black-soft"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-brand shadow-card">
            <Phone className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Telefone</p>
            <p className="font-semibold text-ink">{dealerConfig.contact.phoneDisplay}</p>
          </div>
        </a>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackDirectionsClick("contact_page")}
          className="flex items-center gap-3 rounded-lg border border-line bg-surface p-4 transition-colors hover:border-black-soft"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-brand shadow-card">
            <Navigation className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Como chegar</p>
            <p className="font-semibold text-ink">Ver rota no mapa</p>
          </div>
        </a>

        <div className="flex items-center gap-3 rounded-lg border border-line bg-surface p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-brand shadow-card">
            <Clock className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Horário</p>
            <p className="text-sm font-semibold text-ink">
              {dealerConfig.hours.weekdays}
              <br />
              {dealerConfig.hours.saturday}
            </p>
          </div>
        </div>

        <a
          href={instagramProfileUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackInstagramClick("contact_page")}
          className="flex items-center gap-3 rounded-lg border border-line bg-surface p-4 transition-colors hover:border-black-soft"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-brand shadow-card">
            <InstagramIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Instagram</p>
            <p className="font-semibold text-ink">{dealerConfig.instagram.handle}</p>
          </div>
        </a>
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-line bg-surface p-4">
        <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden />
        <p className="text-sm text-ink/80">{dealerConfig.address.full}</p>
      </div>
    </div>
  );
}
