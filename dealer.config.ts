/**
 * Central store configuration for this demo. All PG Multimarcas-specific
 * strings (name, contact info, address, hours) live here instead of being
 * scattered across components, so this codebase can later be reused as a
 * starting point for another dealer by editing this one file.
 *
 * Contact details below were confirmed against the live site during the
 * 2026-09-23 baseline capture (see docs/baseline/2026-09-23/baseline.md)
 * and re-confirmed against the live site on 2026-09-27 during the V2
 * brand redesign (see docs/redesign-v2/README.md).
 */
export const dealerConfig = {
  name: "PG Multimarcas",
  legalContext: "Auto Shopping Praia Grande",
  logo: {
    // Official logo file, extracted from the live site — see
    // public/brand/PROVENANCE.md. Designed for a dark background.
    dark: "/brand/pg-logo-dark.png",
    // Official compact badge (black square, white "PG"), used as favicon
    // and wherever the horizontal wordmark doesn't fit.
    badge: "/brand/pg-badge.png",
    initials: "PG",
  },
  brand: {
    // Sampled by pixel from the official logo asset — see
    // public/brand/PROVENANCE.md. Kept in sync with app/globals.css.
    primary: "#D20E0E",
    primaryDark: "#A10B0B",
    ink: "#0B0C0E",
  },
  address: {
    line1: "Av. Ayrton Senna da Silva, 611",
    line2: "Entrada 02 — Loja 13, Sítio do Campo",
    city: "Praia Grande",
    state: "SP",
    full: "Av. Ayrton Senna da Silva, 611, Entrada 02 — Loja 13, Sítio do Campo, Praia Grande - SP",
    mapsQuery: "Auto Shopping Praia Grande, Av. Ayrton Senna da Silva, 611, Praia Grande - SP",
  },
  contact: {
    phoneDisplay: "(13) 97809-8710",
    phoneE164: "5513978098710",
  },
  instagram: {
    handle: "@pgmultimarcas1",
    url: "https://www.instagram.com/pgmultimarcas1/",
  },
  hours: {
    weekdays: "Seg a Sex: 9h às 19h",
    saturday: "Sábado: 9h às 18h",
  },
} as const;

export type DealerConfig = typeof dealerConfig;
