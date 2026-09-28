"use client";

import { useEffect } from "react";
import { analytics } from "@/lib/analytics/adapter";
import type { VehicleFilters } from "@/lib/domain/vehicle";

export function ListViewTracker({
  filters,
  resultCount,
}: {
  filters: VehicleFilters;
  resultCount: number;
}) {
  useEffect(() => {
    analytics.track("vehicle_list_view", { resultCount });
    if (filters.q) {
      analytics.track("vehicle_search", { q: filters.q, resultCount });
    }
     
  }, [filters.q, resultCount]);

  return null;
}
