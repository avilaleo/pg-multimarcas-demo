"use client";

import { useState } from "react";
import { Accordion } from "@base-ui/react/accordion";
import { ChevronDown, Landmark } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { trackEquipmentExpand, trackFinancingClick, trackWhatsAppClick } from "@/components/analytics/track-events";
import type { FeatureGroup } from "@/lib/vehicle-features";

/**
 * Server Components (this page) cannot pass event handlers to DOM elements —
 * only Client Components can. These two CTAs need onClick for tracking, so
 * they're split out here, same pattern as ContactChannels/FinancingCtaLinks.
 */
export function FinancingSectionLink({ href, vehicleSlug }: { href: string; vehicleSlug: string }) {
  return (
    <LinkButton
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={() => trackFinancingClick("vehicle_page_financing_section", vehicleSlug)}
      variant="outline"
      size="md"
      className="mt-4"
    >
      <Landmark className="h-4 w-4" aria-hidden />
      Simular financiamento no WhatsApp
    </LinkButton>
  );
}

export function TradeInSectionLink({ href, vehicleSlug }: { href: string; vehicleSlug: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={() => trackWhatsAppClick("vehicle_page_trade_in", vehicleSlug)}
      className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-dark hover:underline"
    >
      Avaliar minha troca no WhatsApp
    </a>
  );
}

/**
 * "Todos os equipamentos" — categorias + contagem, progressive disclosure
 * (docs/redesign-v3/vdp.md). Built on the project's existing Base UI
 * dependency (same primitive already used by components/ui/Select.tsx)
 * instead of a from-scratch accordion.
 *
 * Starts fully closed on every breakpoint: this matches the mobile
 * requirement ("fechados por padrão") literally, keeps the initial
 * server/client render identical (no viewport-dependent default — the
 * project's lint config flags setState-driven effects, which a
 * matchMedia-on-mount default would need), and desktop still gets the
 * "não abrir todas" guidance trivially since nothing is open until the
 * visitor acts. The "Ver todos os equipamentos" control covers the
 * explicit mobile expand action from the brief either way.
 */
export function EquipmentAccordion({ groups }: { groups: FeatureGroup[] }) {
  const [openValues, setOpenValues] = useState<string[]>([]);

  if (groups.length === 0) return null;

  const allOpen = openValues.length === groups.length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">Todos os equipamentos</h2>
        <button
          type="button"
          onClick={() => setOpenValues(allOpen ? [] : groups.map((group) => group.label))}
          className="text-sm font-semibold text-brand transition-colors duration-[var(--motion-fast)] hover:text-brand-dark hover:underline"
        >
          {allOpen ? "Recolher tudo" : "Ver todos os equipamentos"}
        </button>
      </div>

      <Accordion.Root
        value={openValues}
        onValueChange={(value) => setOpenValues(value as string[])}
        multiple
        className="mt-4 divide-y divide-line rounded-lg border border-line"
      >
        {groups.map((group) => (
          <Accordion.Item
            key={group.label}
            value={group.label}
            onOpenChange={(open) => {
              if (open) trackEquipmentExpand(group.label);
            }}
          >
            <Accordion.Header>
              <Accordion.Trigger className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-ink transition-colors duration-[var(--motion-fast)] hover:bg-surface data-[panel-open]:bg-surface">
                <span>
                  {group.label} <span className="font-normal text-muted">({group.items.length})</span>
                </span>
                <ChevronDown
                  className="h-4 w-4 shrink-0 text-muted transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] motion-reduce:transition-none data-[panel-open]:rotate-180"
                  aria-hidden
                />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel className="h-[var(--accordion-panel-height)] overflow-hidden px-5 text-sm text-ink/80 transition-[height] duration-[var(--motion-base)] ease-[var(--ease-standard)] motion-reduce:transition-none data-[starting-style]:h-0 data-[ending-style]:h-0">
              <ul className="grid grid-cols-1 gap-x-4 gap-y-2 pb-4 sm:grid-cols-2">
                {group.items.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  );
}
