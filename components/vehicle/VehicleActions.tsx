"use client";

import { MessageCircle, Landmark } from "lucide-react";
import type { Vehicle } from "@/lib/domain/vehicle";
import { LinkButton } from "@/components/ui/Button";
import { getVehicleWhatsAppUrl, getFinancingWhatsAppUrl } from "@/lib/whatsapp";
import { trackWhatsAppClick, trackFinancingClick } from "@/components/analytics/track-events";

/**
 * Primary + secondary CTA pair shown near the price (desktop aside and the
 * mobile "resumo comercial" block). WhatsApp is the primary path; financing
 * here is a lightweight secondary shortcut — the full financing pitch lives
 * further down the page as its own section.
 */
export function VehicleActions({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="flex flex-col gap-3">
      <LinkButton
        href={getVehicleWhatsAppUrl(vehicle)}
        target="_blank"
        rel="noreferrer"
        onClick={() => trackWhatsAppClick("vehicle_page", vehicle.slug)}
        variant="whatsapp"
        size="lg"
        className="w-full"
      >
        <MessageCircle className="h-5 w-5" aria-hidden />
        Falar no WhatsApp sobre este carro
      </LinkButton>
      <LinkButton
        href={getFinancingWhatsAppUrl(vehicle)}
        target="_blank"
        rel="noreferrer"
        onClick={() => trackFinancingClick("vehicle_page", vehicle.slug)}
        variant="outline"
        size="md"
        className="w-full"
      >
        <Landmark className="h-4 w-4" aria-hidden />
        Simular financiamento
      </LinkButton>
    </div>
  );
}
