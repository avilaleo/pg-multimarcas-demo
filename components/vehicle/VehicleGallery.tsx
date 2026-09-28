"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

const SWIPE_THRESHOLD = 40;

export function VehicleGallery({
  images,
  alt,
  emptyMessage = "Sem fotos disponíveis",
}: {
  images: string[];
  alt: string;
  /** Overrides the empty-state copy, e.g. for a vehicle still being prepared. */
  emptyMessage?: string;
}) {
  const [active, setActive] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const hasMultiple = images.length > 1;

  function go(delta: number) {
    setActive((current) => (current + delta + images.length) % images.length);
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const deltaX = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(deltaX) > SWIPE_THRESHOLD) go(deltaX < 0 ? 1 : -1);
  }

  // V3.1 (docs/handoff/claude-redesign-v3-1.md P1.3): the fullscreen overlay
  // now uses the native <dialog> element via showModal()/close() instead of
  // a plain `role="dialog"` div. That gets us, for free and without pulling
  // in Base UI here: a real focus trap, an inert background, Escape-to-close,
  // and focus returning to whatever triggered it — the exact criteria the
  // audit asked for. Arrow-key navigation stays custom (onKeyDown below);
  // swipe is unchanged.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (fullscreen && !dialog.open) {
      dialog.showModal();
    } else if (!fullscreen && dialog.open) {
      dialog.close();
    }

    // showModal() alone doesn't guarantee the underlying page can't still be
    // wheel/keyboard-scrolled in every browser — belt-and-suspenders lock,
    // same as the previous implementation had.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = fullscreen ? "hidden" : previousOverflow;
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [fullscreen]);

  function handleDialogKeyDown(e: React.KeyboardEvent<HTMLDialogElement>) {
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  }

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-surface text-sm text-muted sm:aspect-[16/10]">
        {emptyMessage}
      </div>
    );
  }

  // `key={active}` remounts the <Image> on every photo change, so this
  // plays a fresh crossfade-in each time (docs/redesign-v3/vdp.md "Galeria:
  // transição curta") — pure CSS, no state/effect involved.
  const fadeClass = "motion-safe:animate-[vdp-gallery-fade-in_var(--motion-base)_var(--ease-standard)]";

  return (
    <div>
      <div
        className="group relative aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-lg bg-surface sm:aspect-[16/10]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button
          type="button"
          onClick={() => setFullscreen(true)}
          aria-label="Ver foto em tela cheia"
          className="absolute inset-0 z-0"
        >
          <Image
            key={active}
            src={images[active]}
            alt={`${alt} — foto ${active + 1} de ${images.length}`}
            fill
            sizes="(min-width: 1024px) 55vw, 100vw"
            className={`object-cover ${fadeClass}`}
            priority
          />
        </button>

        <span className="pointer-events-none absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white opacity-70 transition-opacity duration-[var(--motion-fast)] group-hover:opacity-100 sm:flex">
          <Maximize2 className="h-4 w-4" aria-hidden />
        </span>

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink opacity-90 shadow-card transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-white hover:opacity-100 motion-safe:hover:scale-105 motion-safe:active:scale-95"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Próxima foto"
              className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink opacity-90 shadow-card transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-white hover:opacity-100 motion-safe:hover:scale-105 motion-safe:active:scale-95"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
            <span className="pointer-events-none absolute bottom-3 right-3 z-10 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
              {active + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(index)}
              className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-sm border-2 transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] motion-safe:hover:scale-[1.03] ${
                index === active
                  ? "border-brand shadow-[0_0_0_2px_rgba(210,14,14,0.25)]"
                  : "border-transparent opacity-80 hover:border-line hover:opacity-100"
              }`}
              aria-label={`Ver foto ${index + 1}`}
              aria-current={index === active}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <dialog
        ref={dialogRef}
        aria-label={`${alt} — galeria em tela cheia`}
        onClose={() => setFullscreen(false)}
        onKeyDown={handleDialogKeyDown}
        className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none flex-col bg-black/95 p-0 open:flex backdrop:bg-black/60"
      >
        <button
          type="button"
          onClick={() => setFullscreen(false)}
          aria-label="Fechar tela cheia"
          className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white transition-colors duration-[var(--motion-fast)] hover:bg-white/25"
        >
          <X className="h-6 w-6" aria-hidden />
        </button>

        <div className="relative flex-1" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          {fullscreen && (
            <Image
              key={active}
              src={images[active]}
              alt={`${alt} — foto ${active + 1} de ${images.length}`}
              fill
              sizes="100vw"
              className={`object-contain ${fadeClass}`}
            />
          )}

          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Foto anterior"
                className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-white/25 motion-safe:hover:scale-105 motion-safe:active:scale-95 sm:left-4"
              >
                <ChevronLeft className="h-6 w-6" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Próxima foto"
                className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-white/25 motion-safe:hover:scale-105 motion-safe:active:scale-95 sm:right-4"
              >
                <ChevronRight className="h-6 w-6" aria-hidden />
              </button>
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
                {active + 1} / {images.length}
              </span>
            </>
          )}
        </div>
      </dialog>
    </div>
  );
}
