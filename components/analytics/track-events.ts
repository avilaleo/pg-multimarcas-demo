"use client";

import { analytics } from "@/lib/analytics/adapter";
import { dealerConfig } from "@/dealer.config";

export function trackPhoneClick(source: string) {
  analytics.track("phone_click", { source });
}

export function trackInstagramClick(source: string) {
  analytics.track("instagram_click", { source });
}

export function trackDirectionsClick(source: string) {
  analytics.track("directions_click", { source });
}

export function trackWhatsAppClick(source: string, vehicleSlug?: string) {
  analytics.track("whatsapp_click", { source, vehicleSlug });
}

export function trackFinancingClick(source: string, vehicleSlug?: string) {
  analytics.track("financing_click", { source, vehicleSlug });
}

export const instagramProfileUrl = dealerConfig.instagram.url;
