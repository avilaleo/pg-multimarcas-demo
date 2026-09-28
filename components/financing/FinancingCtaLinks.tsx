"use client";

import { MessageCircle, Phone } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { dealerConfig } from "@/dealer.config";
import { getGeneralFinancingWhatsAppUrl } from "@/lib/whatsapp";
import { trackFinancingClick, trackPhoneClick } from "@/components/analytics/track-events";

export function FinancingCtaLinks() {
  return (
    <div className="flex flex-wrap gap-3">
      <LinkButton
        href={getGeneralFinancingWhatsAppUrl()}
        target="_blank"
        rel="noreferrer"
        onClick={() => trackFinancingClick("financing_page")}
        variant="whatsapp"
        size="lg"
      >
        <MessageCircle className="h-4 w-4" aria-hidden />
        Simular financiamento
      </LinkButton>
      <LinkButton
        href={`tel:+${dealerConfig.contact.phoneE164}`}
        onClick={() => trackPhoneClick("financing_page")}
        variant="outline-invert"
        size="lg"
      >
        <Phone className="h-4 w-4" aria-hidden />
        {dealerConfig.contact.phoneDisplay}
      </LinkButton>
    </div>
  );
}
