"use client";

import { MessageCircle, Navigation } from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";
import { instagramProfileUrl } from "@/components/analytics/track-events";
import { trackWhatsAppClick, trackInstagramClick, trackDirectionsClick } from "@/components/analytics/track-events";

export function ContactTrackedLinks({ mapsUrl }: { mapsUrl: string }) {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <a
        href={getGeneralWhatsAppUrl()}
        target="_blank"
        rel="noreferrer"
        onClick={() => trackWhatsAppClick("home_contact_section")}
        className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-2.5 text-sm font-semibold text-white hover:bg-whatsapp/90"
      >
        <MessageCircle className="h-4 w-4" aria-hidden />
        WhatsApp
      </a>
      <a
        href={instagramProfileUrl}
        target="_blank"
        rel="noreferrer"
        onClick={() => trackInstagramClick("home_contact_section")}
        className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink hover:border-ink"
      >
        <InstagramIcon className="h-4 w-4" />
        Instagram
      </a>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noreferrer"
        onClick={() => trackDirectionsClick("home_contact_section")}
        className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink hover:border-ink"
      >
        <Navigation className="h-4 w-4" aria-hidden />
        Como chegar
      </a>
    </div>
  );
}
