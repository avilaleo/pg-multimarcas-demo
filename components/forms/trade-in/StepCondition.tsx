"use client";

import type { FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import type { ConditionStepData } from "./types";

interface StepConditionProps {
  data: ConditionStepData;
  onChange: (data: ConditionStepData) => void;
  onFieldFocus: () => void;
  onNext: () => void;
  onBack: () => void;
}

const ISSUE_OPTIONS = [
  { value: "no", label: "Não" },
  { value: "yes", label: "Sim" },
] as const;

export function StepCondition({ data, onChange, onFieldFocus, onNext, onBack }: StepConditionProps) {
  function set<K extends keyof ConditionStepData>(key: K, value: ConditionStepData[K]) {
    onChange({ ...data, [key]: value });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <h2 className="font-display text-lg font-semibold text-ink">Estado do veículo</h2>
        <p className="mt-1 text-sm text-muted">Descreva como o veículo está hoje.</p>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Observações</span>
        <textarea
          value={data.notes}
          onFocus={onFieldFocus}
          onChange={(e) => set("notes", e.target.value)}
          rows={4}
          placeholder="Revisões em dia, itens trocados recentemente, funcionamento geral..."
          className="rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink"
        />
      </label>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-xs font-semibold uppercase tracking-wide text-muted">
          O veículo tem alguma avaria relevante?
        </legend>
        <div className="flex gap-3">
          {ISSUE_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`flex h-10 flex-1 cursor-pointer items-center justify-center rounded-sm border text-sm font-medium transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] ${
                data.hasIssue === option.value
                  ? "border-brand bg-brand/5 text-brand"
                  : "border-line text-ink hover:border-ink/40"
              }`}
            >
              <input
                type="radio"
                name="hasIssue"
                className="sr-only"
                checked={data.hasIssue === option.value}
                onFocus={onFieldFocus}
                onChange={() => set("hasIssue", option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      {data.hasIssue === "yes" && (
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">Descreva a avaria</span>
          <textarea
            value={data.issueDetails}
            onFocus={onFieldFocus}
            onChange={(e) => set("issueDetails", e.target.value)}
            rows={3}
            placeholder="Ex.: risco na porta do motorista, amassado no para-choque..."
            className="rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink"
          />
        </label>
      )}

      <div className="mt-2 flex justify-between gap-3">
        <Button type="button" variant="outline" onClick={onBack}>
          Voltar
        </Button>
        <Button type="submit" variant="primary">
          Continuar
        </Button>
      </div>
    </form>
  );
}
