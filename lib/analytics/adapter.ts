import type { AnalyticsEventName, AnalyticsPayload } from "@/lib/analytics/events";
import { getAttribution } from "@/lib/attribution/attribution";

/**
 * Analytics adapter contract. This demo ships a dev-logger implementation
 * only (console, client-side). Swapping in GA4/Meta Pixel/etc. later means
 * implementing this same `track` signature — no call sites change.
 */
export interface AnalyticsAdapter {
  track(event: AnalyticsEventName, payload?: AnalyticsPayload): void;
}

class DevLoggerAdapter implements AnalyticsAdapter {
  track(event: AnalyticsEventName, payload?: AnalyticsPayload): void {
    const attribution = getAttribution();
     
    console.log("[analytics]", event, { ...payload, attribution });
  }
}

export const analytics: AnalyticsAdapter = new DevLoggerAdapter();
