const TRACKED_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
] as const;

export type AttributionParam = (typeof TRACKED_PARAMS)[number];

export type AttributionTouch = Partial<Record<AttributionParam, string>> & {
  landingPage: string;
  capturedAt: string;
};

export interface AttributionState {
  firstTouch: AttributionTouch | null;
  lastTouch: AttributionTouch | null;
}

const FIRST_TOUCH_KEY = "pgmm:attribution:first";
const LAST_TOUCH_KEY = "pgmm:attribution:last";

function readParamsFromUrl(url: string): Partial<Record<AttributionParam, string>> {
  const params = new URL(url).searchParams;
  const found: Partial<Record<AttributionParam, string>> = {};
  for (const key of TRACKED_PARAMS) {
    const value = params.get(key);
    if (value) found[key] = value;
  }
  return found;
}

/**
 * Reads UTM/gclid/fbclid from the current URL and persists first-touch (set
 * once) and last-touch (overwritten whenever new attribution params are
 * present) into localStorage. Safe to call on every page load; a no-op when
 * the URL carries no tracked params (last-touch is only updated when there
 * is something new to attribute) or when storage is unavailable.
 */
export function captureAttribution(url: string): void {
  if (typeof window === "undefined") return;
  const params = readParamsFromUrl(url);
  if (Object.keys(params).length === 0) return;

  const touch: AttributionTouch = {
    ...params,
    landingPage: url,
    capturedAt: new Date().toISOString(),
  };

  try {
    if (!window.localStorage.getItem(FIRST_TOUCH_KEY)) {
      window.localStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(touch));
    }
    window.localStorage.setItem(LAST_TOUCH_KEY, JSON.stringify(touch));
  } catch {
    // Storage unavailable (private mode, blocked cookies, etc.) — attribution
    // is best-effort only, so we silently skip persistence.
  }
}

export function getAttribution(): AttributionState {
  if (typeof window === "undefined") {
    return { firstTouch: null, lastTouch: null };
  }
  try {
    const firstTouch = window.localStorage.getItem(FIRST_TOUCH_KEY);
    const lastTouch = window.localStorage.getItem(LAST_TOUCH_KEY);
    return {
      firstTouch: firstTouch ? (JSON.parse(firstTouch) as AttributionTouch) : null,
      lastTouch: lastTouch ? (JSON.parse(lastTouch) as AttributionTouch) : null,
    };
  } catch {
    return { firstTouch: null, lastTouch: null };
  }
}
