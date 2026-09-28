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
  | "directions_click";

export type AnalyticsPayload = Record<string, string | number | boolean | undefined>;
