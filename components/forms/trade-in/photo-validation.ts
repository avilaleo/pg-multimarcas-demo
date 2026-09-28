// Client-side-only validation for the trade-in photo upload (no backend to
// validate against — see SellVehicleForm.tsx for the pre-production note).
//
// V3.1 (docs/handoff/claude-redesign-v3-1.md P0.5): one photo per guided
// slot, up to 5 total — down from up to 6/slot (30 total), which
// contradicted the "simple guided collection" goal and grew unbounded
// in-memory object URLs.
//
// Format/size rule (still not specified in the design docs, decided here):
// accept JPG/PNG/WEBP, up to 8MB per file.

export const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8MB
const ACCEPTED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

export interface ValidateFileResult {
  ok: boolean;
  reason?: string;
}

/** Validates a single file for one photo slot (type + size only — there's no count limit anymore, one file replaces whatever was there). */
export function validateSingleFile(file: File): ValidateFileResult {
  if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
    return { ok: false, reason: "formato não suportado (use JPG, PNG ou WEBP)" };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { ok: false, reason: "arquivo maior que 8MB" };
  }
  return { ok: true };
}
