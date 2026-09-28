"use client";

import { MessageCircle } from "lucide-react";
import type { Vehicle } from "@/lib/domain/vehicle";
import { LinkButton } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";
import { getVehicleWhatsAppUrl } from "@/lib/whatsapp";
import { trackWhatsAppClick } from "@/components/analytics/track-events";

export function StickyMobileCta({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 p-3 shadow-elevated backdrop-blur lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-lg font-bold text-ink">{formatPrice(vehicle.price)}</p>
        <LinkButton
          href={getVehicleWhatsAppUrl(vehicle)}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackWhatsAppClick("vehicle_sticky_cta", vehicle.slug)}
          variant="whatsapp"
          size="md"
        >
          <MessageCircle className="h-4 w-4" aria-hidden />
          WhatsApp
        </LinkButton>
      </div>
    </div>
  );
}
