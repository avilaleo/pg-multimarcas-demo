"use client";

import { MessageCircle, Landmark } from "lucide-react";
import type { Vehicle } from "@/lib/domain/vehicle";
import { getVehicleWhatsAppUrl, getFinancingWhatsAppUrl } from "@/lib/whatsapp";
import { trackWhatsAppClick, trackFinancingClick } from "@/components/analytics/track-events";

export function VehicleActions({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
      <a
        href={getVehicleWhatsAppUrl(vehicle)}
        target="_blank"
        rel="noreferrer"
        onClick={() => trackWhatsAppClick("vehicle_page", vehicle.slug)}
        className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-whatsapp text-sm font-semibold text-white hover:bg-whatsapp/90"
      >
        <MessageCircle className="h-4 w-4" aria-hidden />
        Falar no WhatsApp
      </a>
      <a
        href={getFinancingWhatsAppUrl(vehicle)}
        target="_blank"
        rel="noreferrer"
        onClick={() => trackFinancingClick("vehicle_page", vehicle.slug)}
        className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-line text-sm font-semibold text-ink hover:border-ink"
      >
        <Landmark className="h-4 w-4" aria-hidden />
        Simular financiamento
      </a>
    </div>
  );
}
