"use client";

import { useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { analytics } from "@/lib/analytics/adapter";

export function VehicleLeadForm({ vehicleSlug, vehicleTitle }: { vehicleSlug: string; vehicleTitle: string }) {
  const [submitted, setSubmitted] = useState(false);
  const started = useRef(false);

  function handleFocus() {
    if (started.current) return;
    started.current = true;
    analytics.track("lead_form_start", { vehicleSlug });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Demo only — no backend wired up yet. See README "Como rodar" for where a
    // real integration (API route, CRM, AutoCerto lead endpoint) would go.
    analytics.track("lead_form_submit", { vehicleSlug });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-surface p-6 text-center">
        <CheckCircle2 className="h-8 w-8 text-brand" aria-hidden />
        <p className="font-semibold text-ink">Proposta enviada!</p>
        <p className="text-sm text-muted">
          Este é um protótipo de demonstração — em produção, um consultor entraria em contato em
          seguida.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-2xl border border-line p-5">
      <p className="font-display text-lg font-semibold text-ink">Envie uma proposta</p>
      <p className="text-sm text-muted">Sobre o {vehicleTitle}</p>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Nome</span>
        <input
          required
          type="text"
          name="name"
          onFocus={handleFocus}
          className="h-10 rounded-lg border border-line px-3 text-sm"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Telefone</span>
        <input
          required
          type="tel"
          name="phone"
          onFocus={handleFocus}
          className="h-10 rounded-lg border border-line px-3 text-sm"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Mensagem</span>
        <textarea
          name="message"
          rows={3}
          onFocus={handleFocus}
          className="rounded-lg border border-line px-3 py-2 text-sm"
        />
      </label>

      <button
        type="submit"
        className="mt-1 inline-flex h-11 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white hover:bg-brand-dark"
      >
        Enviar proposta
      </button>
    </form>
  );
}
