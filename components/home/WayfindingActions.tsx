"use client";

import { Navigation2, Waypoints } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { trackGoogleMapsClick, trackWazeClick } from "@/components/analytics/track-events";

export function WayfindingActions({ mapsUrl, wazeUrl }: { mapsUrl: string; wazeUrl: string }) {
  return (
    <div className="flex flex-wrap gap-3">
      <LinkButton
        href={mapsUrl}
        target="_blank"
        rel="noreferrer"
        onClick={() => trackGoogleMapsClick("home_wayfinding")}
        variant="primary"
        size="md"
      >
        <Navigation2 className="h-4 w-4" aria-hidden />
        Ver como chegar
      </LinkButton>
      <LinkButton
        href={wazeUrl}
        target="_blank"
        rel="noreferrer"
        onClick={() => trackWazeClick("home_wayfinding")}
        variant="outline"
        size="md"
      >
        <Waypoints className="h-4 w-4" aria-hidden />
        Abrir no Waze
      </LinkButton>
    </div>
  );
}
