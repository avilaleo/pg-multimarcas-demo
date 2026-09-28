"use client";

import { MessageCircle } from "lucide-react";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";
import { trackWhatsAppClick } from "@/components/analytics/track-events";

export function WhatsAppFloatingButton() {
  return (
    <a
      href={getGeneralWhatsAppUrl()}
      target="_blank"
      rel="noreferrer"
      onClick={() => trackWhatsAppClick("floating_button")}
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg shadow-black/20 transition-transform hover:scale-105"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle className="h-7 w-7" aria-hidden />
    </a>
  );
}
