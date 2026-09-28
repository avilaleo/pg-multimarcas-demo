import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { InventoryClient } from "@/components/vehicle/InventoryClient";
import { vehicleRepository } from "@/lib/repositories/static-vehicle-repository";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { SITE_URL } from "@/lib/env";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Estoque de veículos",
  description:
    "Veja todo o estoque de veículos da PG Multimarcas em Praia Grande/SP, com filtro por marca, preço, ano e câmbio.",
  alternates: { canonical: "/estoque" },
  openGraph: { url: "/estoque" },
};

export default async function EstoquePage() {
  const vehicles = await vehicleRepository.getVehicles();

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Estoque", url: `${SITE_URL}/estoque` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <div className="border-b border-line bg-surface py-8">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">Estoque</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-ink">Estoque PG</h1>
        </Container>
      </div>

      <InventoryClient vehicles={vehicles} />
    </>
  );
}
