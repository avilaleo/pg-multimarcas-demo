"use client";

import { useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { analytics } from "@/lib/analytics/adapter";

export function SellVehicleForm() {
  const [submitted, setSubmitted] = useState(false);
  const started = useRef(false);

  function handleFocus() {
    if (started.current) return;
    started.current = true;
    analytics.track("sell_vehicle_start");
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Demo only — no backend wired up yet; see README for where a real
    // integration would receive this submission.
    analytics.track("sell_vehicle_submit");
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface p-10 text-center">
        <CheckCircle2 className="h-10 w-10 text-brand" aria-hidden />
        <p className="font-display text-xl font-semibold text-ink">Recebemos seus dados!</p>
        <p className="max-w-sm text-sm text-muted">
          Este é um protótipo de demonstração — em produção, a equipe da loja entraria em contato para
          avaliar seu veículo.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl border border-line p-6 sm:grid-cols-2">
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Nome</span>
        <input required type="text" name="name" onFocus={handleFocus} className="h-11 rounded-lg border border-line px-3 text-sm" />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Telefone</span>
        <input required type="tel" name="phone" onFocus={handleFocus} className="h-11 rounded-lg border border-line px-3 text-sm" />
      </label>

      <label className="flex flex-col gap-1 sm:col-span-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Veículo (marca e modelo)</span>
        <input required type="text" name="vehicle" onFocus={handleFocus} className="h-11 rounded-lg border border-line px-3 text-sm" />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Ano</span>
        <input required type="text" inputMode="numeric" name="year" onFocus={handleFocus} className="h-11 rounded-lg border border-line px-3 text-sm" />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Quilometragem</span>
        <input required type="text" inputMode="numeric" name="mileage" onFocus={handleFocus} className="h-11 rounded-lg border border-line px-3 text-sm" />
      </label>

      <label className="flex flex-col gap-1 sm:col-span-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Valor esperado</span>
        <input type="text" name="expectedValue" onFocus={handleFocus} className="h-11 rounded-lg border border-line px-3 text-sm" />
      </label>

      <label className="flex flex-col gap-1 sm:col-span-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Observação</span>
        <textarea name="notes" rows={4} onFocus={handleFocus} className="rounded-lg border border-line px-3 py-2 text-sm" />
      </label>

      <button
        type="submit"
        className="inline-flex h-12 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white hover:bg-brand-dark sm:col-span-2"
      >
        Enviar dados do veículo
      </button>
    </form>
  );
}
