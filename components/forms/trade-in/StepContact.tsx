"use client";

import type { FormEvent } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getSellVehicleWhatsAppUrl } from "@/lib/whatsapp";
import { buildSummaryItems, computeCompletenessLabel } from "./summary";
import type { ContactStepData, TradeInFormData } from "./types";

interface StepContactProps {
  data: ContactStepData;
  onChange: (data: ContactStepData) => void;
  onFieldFocus: () => void;
  onBack: () => void;
  onSubmit: () => void;
  formData: TradeInFormData;
  totalPhotos: number;
}

export function StepContact({
  data,
  onChange,
  onFieldFocus,
  onBack,
  onSubmit,
  formData,
  totalPhotos,
}: StepContactProps) {
  function set<K extends keyof ContactStepData>(key: K, value: ContactStepData[K]) {
    onChange({ ...data, [key]: value });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  const summaryItems = buildSummaryItems(formData, totalPhotos);
  const completenessLabel = computeCompletenessLabel(formData, totalPhotos);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <h2 className="font-display text-lg font-semibold text-ink">Contato</h2>
        <p className="mt-1 text-sm text-muted">Como a equipe pode falar com você?</p>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Nome</span>
        <input
          required
          type="text"
          value={data.name}
          onFocus={onFieldFocus}
          onChange={(e) => set("name", e.target.value)}
          className="h-11 rounded-sm border border-line bg-paper px-3 text-sm text-ink"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Telefone / WhatsApp</span>
        <input
          required
          type="tel"
          value={data.phone}
          onFocus={onFieldFocus}
          onChange={(e) => set("phone", e.target.value)}
          className="h-11 rounded-sm border border-line bg-paper px-3 text-sm text-ink"
        />
      </label>

      <div className="rounded-md border border-line bg-surface p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">O que você já informou</p>
          <span className="shrink-0 rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand">
            {completenessLabel}
          </span>
        </div>
        <ul className="mt-2 flex flex-col gap-1 text-sm text-ink">
          {summaryItems.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </div>

      {totalPhotos > 0 && (
        <p className="rounded-md border border-brand/20 bg-brand/5 p-3 text-sm text-ink">
          Você selecionou {totalPhotos} foto{totalPhotos > 1 ? "s" : ""}. Depois que o WhatsApp abrir,
          anexe {totalPhotos > 1 ? "essas fotos" : "essa foto"} na conversa para completar a avaliação.
        </p>
      )}

      <div className="mt-2 flex flex-col gap-3">
        <div className="flex justify-between gap-3">
          <Button type="button" variant="outline" onClick={onBack}>
            Voltar
          </Button>
          <Button type="submit" variant="whatsapp">
            <MessageCircle className="h-4 w-4" aria-hidden />
            Continuar pelo WhatsApp
          </Button>
        </div>
        <a
          href={getSellVehicleWhatsAppUrl()}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-whatsapp transition-colors duration-[var(--motion-fast)] hover:underline"
        >
          <MessageCircle className="h-4 w-4" aria-hidden />
          Prefiro falar direto pelo WhatsApp
        </a>
      </div>
    </form>
  );
}
