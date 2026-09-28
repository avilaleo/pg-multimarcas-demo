export type AnalyticsEventName =
  | "vehicle_list_view"
  | "vehicle_view"
  | "vehicle_filter"
  | "vehicle_search"
  | "whatsapp_click"
  | "lead_form_start"
  | "lead_form_submit"
  | "sell_vehicle_start"
  | "sell_vehicle_submit"
  | "financing_click"
  | "phone_click"
  | "instagram_click"
  | "directions_click"
  // V3 additions (docs/redesign-v3/analytics-qa.md section 12) — see
  // components/analytics/track-events.ts for the helpers that fire these.
  | "delivery_carousel_interaction"
  | "tradein_step_view"
  | "tradein_photo_add"
  | "tradein_photo_remove"
  | "equipment_expand"
  | "related_mode_change"
  | "related_vehicle_click"
  | "callback_form_open"
  | "google_maps_click"
  | "waze_click"
  | "inventory_sort_change"
  | "filter_drawer_open";

export type AnalyticsPayload = Record<string, string | number | boolean | undefined>;
