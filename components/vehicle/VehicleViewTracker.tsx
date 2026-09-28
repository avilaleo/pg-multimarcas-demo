"use client";

import { useEffect } from "react";
import { analytics } from "@/lib/analytics/adapter";

export function VehicleViewTracker({
  slug,
  brand,
  model,
}: {
  slug: string;
  brand: string;
  model: string;
}) {
  useEffect(() => {
    analytics.track("vehicle_view", { vehicleSlug: slug, brand, model });
  }, [slug, brand, model]);

  return null;
}
