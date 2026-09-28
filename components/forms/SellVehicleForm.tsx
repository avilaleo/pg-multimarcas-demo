"use client";

import { useEffect, useRef, useState } from "react";
import { analytics } from "@/lib/analytics/adapter";
import { trackTradeInStepView } from "@/components/analytics/track-events";
import { getCustomWhatsAppUrl } from "@/lib/whatsapp";
import { StepVehicle } from "./trade-in/StepVehicle";
import { StepCondition } from "./trade-in/StepCondition";
import { StepPhotos } from "./trade-in/StepPhotos";
import { StepContact } from "./trade-in/StepContact";
import { WhatsAppHandoffPanel } from "./trade-in/WhatsAppHandoffPanel";
import { WizardProgress } from "./trade-in/WizardProgress";
import { buildTradeInWhatsAppMessage } from "./trade-in/summary";
import {
  createEmptyPhotos,
  initialTradeInFormData,
  STEP_NAMES,
  TOTAL_STEPS,
} from "./trade-in/types";
import type { PhotosBySlot, TradeInFormData } from "./trade-in/types";

/**
 * "Venda seu veículo" wizard (V3 refinement). Restores the photo-upload
 * capability the legacy public site already has and that a prior redesign
 * pass (V2) had dropped — see docs/redesign-v3 handoff. All state (form
 * fields + photos) lives here, in the parent, so navigating back/forward
 * between steps never loses what was typed or attached.
 *
 * No backend exists for this demo. Rather than claim the data was
 * "received" (V3 did this and it was a real bug — see
 * docs/handoff/claude-redesign-v3-1.md P0.2), the final step hands off to a
 * real WhatsApp conversation with a pre-filled message built from whatever
 * was actually typed. Photos can't travel through a wa.me link, so the
 * message tells the person to attach them once the chat opens — the UI
 * never claims they were sent. A real integration would still need an
 * upload endpoint plus an explicit consent/LGPD step before sending name/
 * phone/photos anywhere — both remain pre-production concerns.
 */
export function SellVehicleForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<TradeInFormData>(initialTradeInFormData);
  const [photos, setPhotos] = useState<PhotosBySlot>(() => createEmptyPhotos());
  const [submitted, setSubmitted] = useState(false);

  const started = useRef(false);
  const lastTrackedStep = useRef(0);

  useEffect(() => {
    if (submitted) return;
    if (lastTrackedStep.current === step) return;
    lastTrackedStep.current = step;
    trackTradeInStepView(step, STEP_NAMES[step - 1]);
  }, [step, submitted]);

  // Revoke every object URL on unmount so previews don't leak memory.
  // Photos are intentionally not persisted anywhere — a refresh loses them,
  // which is expected for this no-backend demo.
  useEffect(() => {
    return () => {
      Object.values(photos).forEach((photo) => {
        if (photo) URL.revokeObjectURL(photo.previewUrl);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFieldFocus() {
    if (started.current) return;
    started.current = true;
    analytics.track("sell_vehicle_start");
  }

  function goNext() {
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  }

  function goBack() {
    setStep((s) => Math.max(1, s - 1));
  }

  function handleSubmit() {
    // No backend — this is a real WhatsApp handoff, not a fake "submit".
    // `sell_vehicle_submit` here represents that handoff click, not a
    // received/persisted lead (see file header).
    const message = buildTradeInWhatsAppMessage(formData, totalPhotos);
    analytics.track("sell_vehicle_submit");
    window.open(getCustomWhatsAppUrl(message), "_blank", "noopener,noreferrer");
    setSubmitted(true);
  }

  const totalPhotos = Object.values(photos).filter(Boolean).length;

  if (submitted) {
    return <WhatsAppHandoffPanel formData={formData} totalPhotos={totalPhotos} />;
  }

  return (
    <div className="rounded-lg border border-line bg-white p-6 shadow-card sm:p-8">
      <WizardProgress step={step} totalSteps={TOTAL_STEPS} stepNames={STEP_NAMES} />

      <div className="mt-6">
        {step === 1 && (
          <StepVehicle
            data={formData.vehicle}
            onChange={(vehicle) => setFormData((f) => ({ ...f, vehicle }))}
            onFieldFocus={handleFieldFocus}
            onNext={goNext}
          />
        )}
        {step === 2 && (
          <StepCondition
            data={formData.condition}
            onChange={(condition) => setFormData((f) => ({ ...f, condition }))}
            onFieldFocus={handleFieldFocus}
            onNext={goNext}
            onBack={goBack}
          />
        )}
        {step === 3 && (
          <StepPhotos photos={photos} onPhotosChange={setPhotos} onNext={goNext} onBack={goBack} />
        )}
        {step === 4 && (
          <StepContact
            data={formData.contact}
            onChange={(contact) => setFormData((f) => ({ ...f, contact }))}
            onFieldFocus={handleFieldFocus}
            onBack={goBack}
            onSubmit={handleSubmit}
            formData={formData}
            totalPhotos={totalPhotos}
          />
        )}
      </div>
    </div>
  );
}
