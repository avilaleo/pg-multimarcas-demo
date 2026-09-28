import type { Metadata } from "next";
import { VehicleFilters } from "@/components/vehicle/VehicleFilters";
import { VehicleGrid } from "@/components/vehicle/VehicleGrid";
import { Container } from "@/components/ui/Container";
import { ListViewTracker } from "@/components/vehicle/ListViewTracker";
import { vehicleRepository } from "@/lib/repositories/static-vehicle-repository";
import { parseVehicleFilters } from "@/lib/parse-vehicle-filters";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { SITE_URL } from "@/lib/env";

export const metadata: Metadata = {
  title: "Estoque de veículos",
  description:
    "Veja todo o estoque de veículos da PG Multimarcas em Praia Grande/SP, com filtro por marca, preço, ano e câmbio.",
  alternates: { canonical: "/estoque" },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function EstoquePage({ searchParams }: { searchParams: SearchParams }) {
  const rawParams = await searchParams;
  const filters = parseVehicleFilters(rawParams);

  const [vehicles, brands] = await Promise.all([
    vehicleRepository.getVehicles(filters),
    vehicleRepository.getBrands(),
  ]);

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
      <ListViewTracker filters={filters} resultCount={vehicles.length} />

      <div className="border-b border-line bg-surface py-8">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">Estoque</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-ink">Todos os veículos</h1>
        </Container>
      </div>

      <VehicleFilters brands={brands} current={filters} resultCount={vehicles.length} />

      <Container className="py-10">
        <p className="mb-6 hidden text-sm text-muted lg:block">{vehicles.length} veículos encontrados</p>
        <VehicleGrid vehicles={vehicles} />
      </Container>
    </>
  );
}
