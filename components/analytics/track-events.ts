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

// --- V3 additions (docs/redesign-v3/analytics-qa.md section 12) ---
// No PII in any payload: vehicle identifiers here are the public `slug`,
// never a name/phone/photo.

export function trackDeliveryCarouselInteraction(action: "next" | "previous" | "swipe", index?: number) {
  analytics.track("delivery_carousel_interaction", { action, index });
}

export function trackTradeInStepView(step: number, stepName: string) {
  analytics.track("tradein_step_view", { step, stepName });
}

export function trackTradeInPhotoAdd(slot: string) {
  analytics.track("tradein_photo_add", { slot });
}

export function trackTradeInPhotoRemove(slot: string) {
  analytics.track("tradein_photo_remove", { slot });
}

export function trackEquipmentExpand(category: string) {
  analytics.track("equipment_expand", { category });
}

export function trackRelatedModeChange(mode: string, vehicleSlug: string) {
  analytics.track("related_mode_change", { mode, vehicleSlug });
}

export function trackRelatedVehicleClick(mode: string, fromSlug: string, toSlug: string) {
  analytics.track("related_vehicle_click", { mode, fromSlug, toSlug });
}

export function trackCallbackFormOpen(vehicleSlug: string) {
  analytics.track("callback_form_open", { vehicleSlug });
}

export function trackGoogleMapsClick(source: string) {
  analytics.track("google_maps_click", { source });
}

export function trackWazeClick(source: string) {
  analytics.track("waze_click", { source });
}

export function trackInventorySortChange(sort: string) {
  analytics.track("inventory_sort_change", { sort });
}

export function trackFilterDrawerOpen() {
  analytics.track("filter_drawer_open", {});
}

export const instagramProfileUrl = dealerConfig.instagram.url;
