"use client";

import { MessageCircle } from "lucide-react";
import type { Vehicle } from "@/lib/domain/vehicle";
import { formatPrice } from "@/lib/format";
import { getVehicleWhatsAppUrl } from "@/lib/whatsapp";
import { trackWhatsAppClick } from "@/components/analytics/track-events";

export function StickyMobileCta({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 p-3 backdrop-blur lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-lg font-bold text-ink">{formatPrice(vehicle.price)}</p>
        <a
          href={getVehicleWhatsAppUrl(vehicle)}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackWhatsAppClick("vehicle_sticky_cta", vehicle.slug)}
          className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-3 text-sm font-semibold text-white"
        >
          <MessageCircle className="h-4 w-4" aria-hidden />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
