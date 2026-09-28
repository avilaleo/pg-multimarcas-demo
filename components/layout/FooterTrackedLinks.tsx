"use client";

import { Phone } from "lucide-react";
import { dealerConfig } from "@/dealer.config";
import { trackPhoneClick } from "@/components/analytics/track-events";

export function FooterTrackedLinks() {
  return (
    <li className="flex items-start gap-2">
      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
      <a href={`tel:+${dealerConfig.contact.phoneE164}`} onClick={() => trackPhoneClick("footer")}>
        {dealerConfig.contact.phoneDisplay}
      </a>
    </li>
  );
}
