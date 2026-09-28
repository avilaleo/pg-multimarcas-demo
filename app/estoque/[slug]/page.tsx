import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Gauge,
  Fuel,
  Settings2,
  Car,
  MapPin,
  Wrench,
  Landmark,
  RefreshCcw,
  Store,
  Camera,
  ShieldCheck,
  Sparkles,
  FileCheck2,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { VehicleGallery } from "@/components/vehicle/VehicleGallery";
import { VehicleActions } from "@/components/vehicle/VehicleActions";
import { VehicleViewTracker } from "@/components/vehicle/VehicleViewTracker";
import { StickyMobileCta } from "@/components/vehicle/StickyMobileCta";
import { VehicleLeadForm } from "@/components/forms/VehicleLeadForm";
import { RelatedVehicles, type RelatedVehicleGroup } from "@/components/vehicle/RelatedVehicles";
import {
  FinancingSectionLink,
  TradeInSectionLink,
  EquipmentAccordion,
} from "@/components/vehicle/VdpTrackedLinks";
import { vehicleRepository } from "@/lib/repositories/static-vehicle-repository";
import { formatMileage, formatPrice, formatYear } from "@/lib/format";
import { dealerConfig } from "@/dealer.config";
import { SITE_URL } from "@/lib/env";
import { breadcrumbJsonLd, vehicleJsonLd } from "@/lib/structured-data";
import { getFinancingWhatsAppUrl, getSellVehicleWhatsAppUrl } from "@/lib/whatsapp";
import type { Vehicle } from "@/lib/domain/vehicle";
import type { RelatedVehicleMode } from "@/lib/repositories/vehicle-repository";
import { getVehicleHighlights, getDocumentationBadges, groupFeaturesByCategory } from "@/lib/vehicle-features";

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

/** Compact "resumo comercial" chips — exactly the tese's C: ano, km, câmbio, combustível. */
const QUICK_SPEC_ITEMS = (vehicle: Vehicle) => [
  { icon: Calendar, label: "Ano", value: formatYear(vehicle.manufactureYear, vehicle.modelYear) },
  { icon: Gauge, label: "Km", value: formatMileage(vehicle.mileage) },
  { icon: Settings2, label: "Câmbio", value: vehicle.transmission },
  { icon: Fuel, label: "Combustível", value: vehicle.fuel },
];

/** Fields beyond the quick specs — carroceria/cor when known. */
const EXTRA_SPEC_ITEMS = (vehicle: Vehicle) => [
  { icon: Car, label: "Carroceria", value: vehicle.bodyType },
  ...(vehicle.color ? [{ icon: ShieldCheck, label: "Cor", value: vehicle.color }] : []),
];

/** Fuller "ficha técnica" (section D, desktop) — quick specs plus carroceria/cor when known. */
const FULL_SPEC_ITEMS = (vehicle: Vehicle) => [...QUICK_SPEC_ITEMS(vehicle), ...EXTRA_SPEC_ITEMS(vehicle)];

const RELATED_LIMIT = 10;
const RELATED_MODE_LABELS: Record<RelatedVehicleMode, string> = {
  similar: "Parecidos com este",
  "same-model": "Mesmo modelo",
  "price-range": "Faixa de preço",
};

export default async function VehiclePage({ params }: { params: Params }) {
  const { slug } = await params;
  const vehicle = await vehicleRepository.getVehicleBySlug(slug);
  if (!vehicle) notFound();

  const title = `${vehicle.brand} ${vehicle.model}`;
  const isPreparing = vehicle.status === "preparing";

  // "Principais destaques" + "Todos os equipamentos" (docs/redesign-v3/vdp.md)
  const highlights = getVehicleHighlights(vehicle.features);
  const documentationBadges = getDocumentationBadges(vehicle.features);
  const equipmentGroups = groupFeaturesByCategory(vehicle.features);

  // "Relacionados" — 3 deterministic modes, only kept when non-empty (section
  // 7 of the brief: a mode never shows as an empty tab).
  const relatedModes: RelatedVehicleMode[] = ["similar", "same-model", "price-range"];
  const relatedGroupsRaw = await Promise.all(
    relatedModes.map(async (mode) => ({
      mode,
      label: RELATED_MODE_LABELS[mode],
      vehicles: await vehicleRepository.getRelatedVehiclesByMode(vehicle, mode, RELATED_LIMIT),
    }))
  );
  const relatedGroups: RelatedVehicleGroup[] = relatedGroupsRaw.filter((group) => group.vehicles.length > 0);

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
        {/* A. Contexto */}
        <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>{" "}
          / <Link href="/estoque" className="hover:text-ink">Estoque</Link> /{" "}
          <span className="text-ink">{title}</span>
        </nav>

        {isPreparing && (
          <div className="mb-6 flex items-start gap-3 rounded-md border border-line bg-surface px-4 py-3 text-sm text-ink">
            <Wrench className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden />
            <p>
              <span className="font-semibold">Veículo em preparação</span> — fotos e detalhes completos
              chegam em breve. Você já pode perguntar sobre ele pelo WhatsApp.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div className="min-w-0">
            {/* B. Galeria */}
            <VehicleGallery
              images={vehicle.images}
              alt={title}
              emptyMessage={isPreparing ? "Fotos em preparação — em breve você poderá ver este veículo" : undefined}
            />

            <div className="mt-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-brand">{vehicle.brand}</p>
              <h1 className="mt-1 font-display text-3xl font-bold text-ink sm:text-4xl">
                {vehicle.model} <span className="font-normal text-muted">{vehicle.version}</span>
              </h1>
            </div>

            {/* C. Resumo comercial — mobile only; desktop equivalent is the sticky aside */}
            <div className="mt-6 rounded-lg border border-line bg-paper p-5 shadow-card lg:hidden">
              <p className="font-display text-3xl font-bold text-ink">{formatPrice(vehicle.price)}</p>
              <div className="mt-4 grid grid-cols-2 gap-4 border-t border-line pt-4 sm:grid-cols-4">
                {QUICK_SPEC_ITEMS(vehicle).map((spec) => (
                  <div key={spec.label} className="flex flex-col items-start gap-1">
                    <spec.icon className="h-5 w-5 text-brand" aria-hidden />
                    <span className="text-xs text-muted">{spec.label}</span>
                    <span className="text-sm font-semibold text-ink">{spec.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <VehicleActions vehicle={vehicle} />
              </div>
              <div className="mt-4 border-t border-line pt-4">
                <VehicleLeadForm vehicleSlug={vehicle.slug} vehicleTitle={title} />
              </div>
            </div>

            {/* D. Specs — the mobile commercial card above already shows
                ano/km/câmbio/combustível, so mobile's "Ficha técnica" only
                adds fields not shown there (carroceria/cor), and hides
                entirely when there's nothing extra to add. Desktop has no
                such card duplicating specs, so it keeps the full ficha
                técnica (docs/handoff/claude-redesign-v3-1.md P0.4). */}
            <div className="mt-10 hidden lg:block">
              <h2 className="font-display text-xl font-semibold text-ink">Ficha técnica</h2>
              <div className="mt-4 grid grid-cols-2 gap-4 rounded-lg border border-line p-5 sm:grid-cols-4">
                {FULL_SPEC_ITEMS(vehicle).map((spec) => (
                  <div key={spec.label} className="flex flex-col items-start gap-1">
                    <spec.icon className="h-5 w-5 text-brand" aria-hidden />
                    <span className="text-xs text-muted">{spec.label}</span>
                    <span className="text-sm font-semibold text-ink">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
            {EXTRA_SPEC_ITEMS(vehicle).length > 0 && (
              <div className="mt-10 lg:hidden">
                <h2 className="font-display text-xl font-semibold text-ink">Ficha técnica</h2>
                <div className="mt-4 grid grid-cols-2 gap-4 rounded-lg border border-line p-5 sm:grid-cols-4">
                  {EXTRA_SPEC_ITEMS(vehicle).map((spec) => (
                    <div key={spec.label} className="flex flex-col items-start gap-1">
                      <spec.icon className="h-5 w-5 text-brand" aria-hidden />
                      <span className="text-xs text-muted">{spec.label}</span>
                      <span className="text-sm font-semibold text-ink">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* E. Principais destaques — ranking determinístico (lib/vehicle-features.ts),
                escondido graciosamente quando o veículo não tem nenhum item Tier A/B. */}
            {highlights.length > 0 && (
              <div className="mt-10">
                <h2 className="font-display text-xl font-semibold text-ink">Principais destaques</h2>
                <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 rounded-md border border-line bg-paper px-4 py-3 text-sm font-medium text-ink"
                    >
                      <Sparkles className="h-4 w-4 shrink-0 text-brand" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* "O que acompanha" — IPVA/manual/chave reserva tratados como documentação,
                nunca misturados com equipamento do carro. */}
            {documentationBadges.length > 0 && (
              <div className={highlights.length > 0 ? "mt-5" : "mt-10"}>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">O que acompanha</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {documentationBadges.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-ink/80"
                    >
                      <FileCheck2 className="h-3.5 w-3.5 text-brand" aria-hidden />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* F. Financiamento (secundário) */}
            <section className="mt-10 rounded-lg bg-surface p-6">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-brand shadow-card">
                  <Landmark className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h2 className="font-display text-xl font-semibold text-ink">Quer financiar este carro?</h2>
                  <p className="mt-2 max-w-xl text-sm text-ink/80">
                    Fale com a equipe para simular as condições disponíveis para o seu perfil.
                  </p>
                  <FinancingSectionLink href={getFinancingWhatsAppUrl(vehicle)} vehicleSlug={vehicle.slug} />
                </div>
              </div>
            </section>

            {/* G. Troca / avaliação (terciário) */}
            <section className="mt-6 rounded-lg border border-line p-6">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface text-brand">
                  <RefreshCcw className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h2 className="font-display text-lg font-semibold text-ink">
                    Tem um veículo para dar de entrada?
                  </h2>
                  <p className="mt-2 max-w-xl text-sm text-ink/80">
                    Avaliamos seu usado como parte do pagamento. Fale com a gente pelo WhatsApp e receba
                    uma avaliação.
                  </p>
                  <TradeInSectionLink href={getSellVehicleWhatsAppUrl()} vehicleSlug={vehicle.slug} />
                </div>
              </div>
            </section>

            {/* H. Todos os equipamentos — categorias + contagem, accordion (progressive disclosure) */}
            {equipmentGroups.length > 0 && (
              <div className="mt-10">
                <EquipmentAccordion groups={equipmentGroups} />
              </div>
            )}

            {/* I. Confiança / loja */}
            <section className="mt-10 border-t border-line pt-8">
              <h2 className="font-display text-xl font-semibold text-ink">Sobre este veículo e a loja</h2>
              <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <Store className="h-5 w-5 text-brand" aria-hidden />
                  <p className="font-semibold text-ink">Loja física</p>
                  <p className="text-sm text-muted">
                    {dealerConfig.legalContext}, {dealerConfig.address.city}/{dealerConfig.address.state}.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Camera className="h-5 w-5 text-brand" aria-hidden />
                  <p className="font-semibold text-ink">Fotos reais</p>
                  <p className="text-sm text-muted">
                    As imagens acima são deste veículo, sem fotos ilustrativas.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <ShieldCheck className="h-5 w-5 text-brand" aria-hidden />
                  <p className="font-semibold text-ink">Veículos revisados</p>
                  <p className="text-sm text-muted">Conferidos antes de irem para o showroom.</p>
                </div>
              </div>

              <div className="mt-6 flex items-start gap-2 rounded-md bg-surface p-4 text-sm text-ink/80">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
                <span>
                  Visite e veja de perto: {dealerConfig.address.full}. {dealerConfig.hours.weekdays},{" "}
                  {dealerConfig.hours.saturday}.
                </span>
              </div>
            </section>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24 flex flex-col gap-6">
              <div className="rounded-lg border border-line bg-paper p-5 shadow-card">
                <p className="font-display text-3xl font-bold text-ink">{formatPrice(vehicle.price)}</p>
                <div className="mt-4">
                  <VehicleActions vehicle={vehicle} />
                </div>
                <div className="mt-4 border-t border-line pt-4">
                  <VehicleLeadForm vehicleSlug={vehicle.slug} vehicleTitle={title} />
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* J. Relacionados */}
        <RelatedVehicles groups={relatedGroups} vehicleSlug={vehicle.slug} />
      </Container>

      <StickyMobileCta vehicle={vehicle} />
    </>
  );
}
