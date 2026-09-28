"use client";

import type { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/Button";
import { trackTradeInPhotoAdd, trackTradeInPhotoRemove } from "@/components/analytics/track-events";
import { PhotoSlotUploader } from "./PhotoSlotUploader";
import { PHOTO_SLOTS } from "./types";
import type { PhotoSlotId, PhotosBySlot } from "./types";

let photoIdCounter = 0;
function nextPhotoId() {
  photoIdCounter += 1;
  return `photo-${Date.now()}-${photoIdCounter}`;
}

interface StepPhotosProps {
  photos: PhotosBySlot;
  onPhotosChange: Dispatch<SetStateAction<PhotosBySlot>>;
  onNext: () => void;
  onBack: () => void;
}

export function StepPhotos({ photos, onPhotosChange, onNext, onBack }: StepPhotosProps) {
  function handleSet(slotId: PhotoSlotId, file: File) {
    onPhotosChange((prev) => {
      const previous = prev[slotId];
      if (previous) URL.revokeObjectURL(previous.previewUrl);
      return {
        ...prev,
        [slotId]: { id: nextPhotoId(), file, previewUrl: URL.createObjectURL(file) },
      };
    });
    trackTradeInPhotoAdd(slotId);
  }

  function handleRemove(slotId: PhotoSlotId) {
    onPhotosChange((prev) => {
      const target = prev[slotId];
      if (target) URL.revokeObjectURL(target.previewUrl);
      return { ...prev, [slotId]: null };
    });
    trackTradeInPhotoRemove(slotId);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="font-display text-lg font-semibold text-ink">Fotos do veículo</h2>
        <p className="mt-1 text-sm text-muted">
          As fotos são opcionais, mas ajudam a equipe a entender melhor o veículo antes do contato.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {PHOTO_SLOTS.map((slot) => (
          <PhotoSlotUploader
            key={slot.id}
            slotId={slot.id}
            label={slot.label}
            photo={photos[slot.id]}
            onSet={handleSet}
            onRemove={handleRemove}
          />
        ))}
      </div>

      <div className="mt-2 flex justify-between gap-3">
        <Button type="button" variant="outline" onClick={onBack}>
          Voltar
        </Button>
        <Button type="button" variant="primary" onClick={onNext}>
          Continuar
        </Button>
      </div>
    </div>
  );
}
