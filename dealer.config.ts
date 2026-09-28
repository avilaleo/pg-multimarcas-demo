/**
 * Central store configuration for this demo. All PG Multimarcas-specific
 * strings (name, contact info, address, hours) live here instead of being
 * scattered across components, so this codebase can later be reused as a
 * starting point for another dealer by editing this one file.
 *
 * Contact details below were confirmed against the live site during the
 * 2026-09-23 baseline capture (see docs/baseline/2026-09-23/baseline.md).
 */
export const dealerConfig = {
  name: "PG Multimarcas",
  legalContext: "Auto Shopping Praia Grande",
  logo: {
    // No dedicated logo asset was captured; the header renders a text
    // wordmark styled after the brand colors observed on-site (red/black).
    initials: "PG",
  },
  brand: {
    primary: "#D4162C",
    primaryDark: "#A10E20",
    ink: "#15181C",
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
