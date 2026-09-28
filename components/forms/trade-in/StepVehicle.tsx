"use client";

import type { FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import type { VehicleStepData } from "./types";

interface StepVehicleProps {
  data: VehicleStepData;
  onChange: (data: VehicleStepData) => void;
  onFieldFocus: () => void;
  onNext: () => void;
}

export function StepVehicle({ data, onChange, onFieldFocus, onNext }: StepVehicleProps) {
  function set<K extends keyof VehicleStepData>(key: K, value: VehicleStepData[K]) {
    onChange({ ...data, [key]: value });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <h2 className="font-display text-lg font-semibold text-ink">Seu veículo</h2>
        <p className="mt-1 text-sm text-muted">Conte os dados básicos do carro ou moto.</p>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Marca e modelo</span>
        <input
          required
          type="text"
          value={data.brandModel}
          onFocus={onFieldFocus}
          onChange={(e) => set("brandModel", e.target.value)}
          placeholder="Ex.: Chevrolet Onix"
          className="h-11 rounded-sm border border-line bg-paper px-3 text-sm text-ink"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">Ano</span>
          <input
            required
            type="text"
            inputMode="numeric"
            value={data.year}
            onFocus={onFieldFocus}
            onChange={(e) => set("year", e.target.value)}
            className="h-11 rounded-sm border border-line bg-paper px-3 text-sm text-ink"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">Quilometragem</span>
          <input
            required
            type="text"
            inputMode="numeric"
            value={data.mileage}
            onFocus={onFieldFocus}
            onChange={(e) => set("mileage", e.target.value)}
            className="h-11 rounded-sm border border-line bg-paper px-3 text-sm text-ink"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">
          Valor esperado <span className="normal-case text-muted/70">(opcional)</span>
        </span>
        <input
          type="text"
          inputMode="numeric"
          value={data.expectedValue}
          onFocus={onFieldFocus}
          onChange={(e) => set("expectedValue", e.target.value)}
          placeholder="R$"
          className="h-11 rounded-sm border border-line bg-paper px-3 text-sm text-ink"
        />
      </label>

      <div className="mt-2 flex justify-end">
        <Button type="submit" variant="primary">
          Continuar
        </Button>
      </div>
    </form>
  );
}
