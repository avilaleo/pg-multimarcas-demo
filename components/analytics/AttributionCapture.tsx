"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution/attribution";

/** Mounted once in the root layout; captures UTM/gclid/fbclid on every load. */
export function AttributionCapture() {
  useEffect(() => {
    captureAttribution(window.location.href);
  }, []);

  return null;
}
