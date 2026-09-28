"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";
import { trackWhatsAppClick } from "@/components/analytics/track-events";

export function WhatsAppFloatingButton() {
  const pathname = usePathname();
  // Vehicle detail pages already have their own primary WhatsApp CTA
  // (VehicleActions on desktop, StickyMobileCta — fixed bottom-0, full
  // width — on mobile). This global bottom-right bubble would visually
  // overlap StickyMobileCta on mobile and duplicate the same action.
  const isVehicleDetailPage = pathname !== "/estoque" && pathname?.startsWith("/estoque/");
  if (isVehicleDetailPage) return null;

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
