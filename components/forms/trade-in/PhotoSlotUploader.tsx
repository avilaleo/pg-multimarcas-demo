"use client";

import { useId, useRef, useState } from "react";
import { Camera, ImagePlus, X } from "lucide-react";
import { validateSingleFile } from "./photo-validation";
import type { PhotoSlotId, SlotPhoto } from "./types";

interface PhotoSlotUploaderProps {
  slotId: PhotoSlotId;
  label: string;
  photo: SlotPhoto | null;
  onSet: (slotId: PhotoSlotId, file: File) => void;
  onRemove: (slotId: PhotoSlotId) => void;
}

/**
 * One upload slot (e.g. "Frente / ¾ dianteiro") — exactly one photo
 * (docs/handoff/claude-redesign-v3-1.md P0.5). Two entry points on purpose —
 * a camera-capture input and a gallery input — rather than one input with
 * both `capture` and `multiple` set, since combining both attributes is
 * unreliable across mobile browsers (some hide the gallery option entirely
 * once `capture` is present). Both stay available even after a photo is
 * selected, so picking a new one replaces it directly — no need to remove
 * first.
 */
export function PhotoSlotUploader({ slotId, label, photo, onSet, onRemove }: PhotoSlotUploaderProps) {
  const cameraInputId = useId();
  const galleryInputId = useId();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0]; // one photo per slot — ignore any extra selection
    const result = validateSingleFile(file);

    setError(result.ok ? null : `${file.name}: ${result.reason}`);
    if (result.ok) onSet(slotId, file);

    if (cameraInputRef.current) cameraInputRef.current.value = "";
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  }

  return (
    <div className="rounded-md border border-line bg-paper p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-ink">{label}</p>
        <span className="shrink-0 text-xs text-muted">{photo ? "1/1" : "0/1"}</span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        {photo && (
          <div className="group relative h-16 w-16 shrink-0 overflow-hidden rounded-sm border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.previewUrl} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onRemove(slotId)}
              aria-label={`Remover foto de ${label}`}
              className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white transition-colors duration-[var(--motion-fast)] hover:bg-black"
            >
              <X className="h-3 w-3" aria-hidden />
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <label
            htmlFor={cameraInputId}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-dashed border-line px-3 py-1.5 text-xs font-semibold text-ink transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-brand hover:text-brand"
          >
            <Camera className="h-3.5 w-3.5" aria-hidden />
            {photo ? "Substituir" : "Câmera"}
            <input
              ref={cameraInputRef}
              id={cameraInputId}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              capture="environment"
              className="sr-only"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>

          <label
            htmlFor={galleryInputId}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-dashed border-line px-3 py-1.5 text-xs font-semibold text-ink transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-brand hover:text-brand"
          >
            <ImagePlus className="h-3.5 w-3.5" aria-hidden />
            Galeria
            <input
              ref={galleryInputRef}
              id={galleryInputId}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>
        </div>
      </div>

      {error && <p className="mt-2 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
