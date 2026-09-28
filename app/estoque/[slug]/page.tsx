import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Gauge, Fuel, Settings2, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { VehicleGallery } from "@/components/vehicle/VehicleGallery";
import { VehicleActions } from "@/components/vehicle/VehicleActions";
import { VehicleViewTracker } from "@/components/vehicle/VehicleViewTracker";
import { StickyMobileCta } from "@/components/vehicle/StickyMobileCta";
import { VehicleLeadForm } from "@/components/forms/VehicleLeadForm";
import { RelatedVehicles } from "@/components/vehicle/RelatedVehicles";
import { vehicleRepository } from "@/lib/repositories/static-vehicle-repository";
import { formatMileage, formatPrice, formatYear } from "@/lib/format";
import { dealerConfig } from "@/dealer.config";
import { SITE_URL } from "@/lib/env";
import { breadcrumbJsonLd, vehicleJsonLd } from "@/lib/structured-data";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const vehicles = await vehicleRepository.getVehicles();
  return vehicles.map((vehicle) => ({ slug: vehicle.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await vehicleRepository.getVehicleBySlug(slug);
  if (!vehicle) return {};

  const title = `${vehicle.brand} ${vehicle.model} ${formatYear(vehicle.manufactureYear, vehicle.modelYear)} — ${formatPrice(vehicle.price)}`;
  const description = `${vehicle.version}, ${formatMileage(vehicle.mileage)}, câmbio ${vehicle.transmission.toLowerCase()}. Veja fotos e fale no WhatsApp com a ${dealerConfig.name}.`;

  return {
    title,
    description,
    alternates: { canonical: `/estoque/${vehicle.slug}` },
    openGraph: {
      title,
      description,
      images: vehicle.images[0] ? [{ url: vehicle.images[0] }] : undefined,
      url: `${SITE_URL}/estoque/${vehicle.slug}`,
      type: "website",
    },
  };
}

const SPEC_ITEMS = (vehicle: Awaited<ReturnType<typeof vehicleRepository.getVehicleBySlug>>) =>
  vehicle
    ? [
        { icon: Calendar, label: "Ano", value: formatYear(vehicle.manufactureYear, vehicle.modelYear) },
        { icon: Gauge, label: "Km", value: formatMileage(vehicle.mileage) },
        { icon: Settings2, label: "Câmbio", value: vehicle.transmission },
        { icon: Fuel, label: "Combustível", value: vehicle.fuel },
      ]
    : [];

export default async function VehiclePage({ params }: { params: Params }) {
  const { slug } = await params;
  const vehicle = await vehicleRepository.getVehicleBySlug(slug);
  if (!vehicle) notFound();

  const related = await vehicleRepository.getRelatedVehicles(vehicle, 3);
  const title = `${vehicle.brand} ${vehicle.model}`;

  const jsonLd = vehicleJsonLd(vehicle);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Estoque", url: `${SITE_URL}/estoque` },
    { name: title, url: `${SITE_URL}/estoque/${vehicle.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
         
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
         
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <VehicleViewTracker slug={vehicle.slug} brand={vehicle.brand} model={vehicle.model} />

      <Container className="py-6 pb-28 lg:pb-12">
        <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>{" "}
          / <Link href="/estoque" className="hover:text-ink">Estoque</Link> /{" "}
          <span className="text-ink">{title}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div className="min-w-0">
            <VehicleGallery images={vehicle.images} alt={title} />

            <div className="mt-8">
              <p className="text-sm font-semibold uppercase tracking-wide text-brand">{vehicle.brand}</p>
              <h1 className="mt-1 font-display text-3xl font-bold text-ink">
                {vehicle.model} <span className="font-normal text-ink/70">{vehicle.version}</span>
              </h1>

              <div className="mt-5 grid grid-cols-2 gap-4 rounded-2xl border border-line p-4 sm:grid-cols-4">
                {SPEC_ITEMS(vehicle).map((spec) => (
                  <div key={spec.label} className="flex flex-col items-start gap-1">
                    <spec.icon className="h-5 w-5 text-brand" aria-hidden />
                    <span className="text-xs text-muted">{spec.label}</span>
                    <span className="text-sm font-semibold text-ink">{spec.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h2 className="font-display text-xl font-semibold text-ink">Descrição</h2>
                <p className="mt-2 text-ink/80">{vehicle.description}</p>
              </div>

              {vehicle.features.length > 0 && (
                <div className="mt-8">
                  <h2 className="font-display text-xl font-semibold text-ink">Características e opcionais</h2>
                  <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
                    {vehicle.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-ink/80">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-8 flex items-start gap-2 rounded-2xl bg-surface p-4 text-sm text-ink/80">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
                <span>
                  Visite e veja de perto: {dealerConfig.address.full}. {dealerConfig.hours.weekdays},{" "}
                  {dealerConfig.hours.saturday}.
                </span>
              </div>
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24 flex flex-col gap-6">
              <div className="rounded-2xl border border-line p-5">
                <p className="font-display text-3xl font-bold text-ink">{formatPrice(vehicle.price)}</p>
                <div className="mt-4">
                  <VehicleActions vehicle={vehicle} />
                </div>
              </div>
              <VehicleLeadForm vehicleSlug={vehicle.slug} vehicleTitle={title} />
            </div>
          </aside>

          <div className="lg:hidden">
            <VehicleLeadForm vehicleSlug={vehicle.slug} vehicleTitle={title} />
          </div>
        </div>

        <RelatedVehicles vehicles={related} />
      </Container>

      <StickyMobileCta vehicle={vehicle} />
    </>
  );
}
