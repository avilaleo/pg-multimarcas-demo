import { dealerConfig } from "@/dealer.config";
import { SITE_URL } from "@/lib/env";
import { vehicleSummary } from "@/lib/format";
import type { Vehicle } from "@/lib/domain/vehicle";

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    name: dealerConfig.name,
    // Real photo of the physical showroom — see public/brand/PROVENANCE.md.
    // (A previous version referenced /og-default.png, a file that never
    // existed in public/, which schema.org consumers would fail to fetch.)
    image: `${SITE_URL}/brand/showroom-hero.jpg`,
    telephone: `+${dealerConfig.contact.phoneE164}`,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: `${dealerConfig.address.line1}, ${dealerConfig.address.line2}`,
      addressLocality: dealerConfig.address.city,
      addressRegion: dealerConfig.address.state,
      addressCountry: "BR",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    sameAs: [dealerConfig.instagram.url],
    url: SITE_URL,
  };
}

export function vehicleJsonLd(vehicle: Vehicle) {
  return {
    "@context": "https://schema.org",
    "@type": ["Product", "Car"],
    name: `${vehicle.brand} ${vehicle.model} ${vehicle.version}`,
    // Real per-vehicle copy when present; otherwise a factual summary built
    // from structured fields — never the removed auto-generated paragraph.
    description: vehicle.description ?? vehicleSummary(vehicle),
    image: vehicle.images,
    brand: {
      "@type": "Brand",
      name: vehicle.brand,
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Ano modelo", value: String(vehicle.modelYear) },
      { "@type": "PropertyValue", name: "Ano fabricação", value: String(vehicle.manufactureYear) },
      { "@type": "PropertyValue", name: "Quilometragem", value: `${vehicle.mileage} km` },
      { "@type": "PropertyValue", name: "Câmbio", value: vehicle.transmission },
      { "@type": "PropertyValue", name: "Combustível", value: vehicle.fuel },
    ],
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: vehicle.price,
      availability:
        vehicle.status === "available" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/estoque/${vehicle.slug}`,
      itemCondition: "https://schema.org/UsedCondition",
      seller: {
        "@type": "AutomotiveBusiness",
        name: dealerConfig.name,
      },
    },
    // `fuelType` (not `vehicleEngine`, which expects an EngineSpecification,
    // not a fuel-type string) is the correct schema.org/Car property here.
    fuelType: vehicle.fuel,
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: vehicle.mileage,
      unitCode: "KMT",
    },
    modelDate: String(vehicle.modelYear),
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
