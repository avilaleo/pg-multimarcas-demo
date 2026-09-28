// Shared types for the "Venda seu veículo" (trade-in) wizard.
// Kept dependency-free (no React imports) so it can be reused by
// non-component helpers like summary.ts and photo-validation.ts.

export const PHOTO_SLOTS = [
  { id: "front", label: "Frente / ¾ dianteiro" },
  { id: "rear", label: "Traseira / ¾ traseiro" },
  { id: "interior", label: "Interior / painel" },
  { id: "odometer", label: "Odômetro" },
  { id: "damage", label: "Avaria relevante (se houver)" },
] as const;

export type PhotoSlotId = (typeof PHOTO_SLOTS)[number]["id"];

export interface SlotPhoto {
  id: string;
  file: File;
  previewUrl: string;
}

// V3.1 P0.5: one photo per guided slot (was up to 6/slot, up to 30 total).
export type PhotosBySlot = Record<PhotoSlotId, SlotPhoto | null>;

export function createEmptyPhotos(): PhotosBySlot {
  return PHOTO_SLOTS.reduce((acc, slot) => {
    acc[slot.id] = null;
    return acc;
  }, {} as PhotosBySlot);
}

export interface VehicleStepData {
  brandModel: string;
  year: string;
  mileage: string;
  expectedValue: string;
}

export interface ConditionStepData {
  notes: string;
  hasIssue: "" | "yes" | "no";
  issueDetails: string;
}

export interface ContactStepData {
  name: string;
  phone: string;
}

export interface TradeInFormData {
  vehicle: VehicleStepData;
  condition: ConditionStepData;
  contact: ContactStepData;
}

export const initialTradeInFormData: TradeInFormData = {
  vehicle: { brandModel: "", year: "", mileage: "", expectedValue: "" },
  condition: { notes: "", hasIssue: "", issueDetails: "" },
  contact: { name: "", phone: "" },
};

export const STEP_NAMES = ["Seu veículo", "Estado do veículo", "Fotos", "Contato"] as const;
export const TOTAL_STEPS = STEP_NAMES.length;
