import type { MetadataRoute } from "next";
import { vehicleRepository } from "@/lib/repositories/static-vehicle-repository";
import { SITE_URL } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const vehicles = await vehicleRepository.getVehicles();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/estoque`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/venda-seu-veiculo`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/financiamento`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/sobre`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/contato`, changeFrequency: "monthly", priority: 0.4 },
  ];

  const vehicleRoutes: MetadataRoute.Sitemap = vehicles.map((vehicle) => ({
    url: `${SITE_URL}/estoque/${vehicle.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...vehicleRoutes];
}
