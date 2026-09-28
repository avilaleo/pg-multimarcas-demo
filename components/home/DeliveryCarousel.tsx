"use client";

import { useRef, useState, type TouchEvent } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import {
  instagramProfileUrl,
  trackDeliveryCarouselInteraction,
  trackInstagramClick,
} from "@/components/analytics/track-events";

/**
 * Fotos reais de entrega, arquivadas em public/brand/source/ a partir do
 * carrossel público da PG (ver public/brand/PROVENANCE.md para proveniência
 * e a curadoria que descartou as fotos com crianças em primeiro plano).
 */
const DELIVERIES = [
  {
    src: "/brand/source/banner-20250831191815.jpeg",
    alt: "Entrega de veículo no showroom da PG Multimarcas, com um Hyundai Tucson preto",
  },
  {
    src: "/brand/source/banner-20250831191924.jpeg",
    alt: "Entrega de veículo no showroom da PG Multimarcas, com um Mitsubishi ASX branco",
  },
  {
    src: "/brand/source/banner-20260111115456.jpeg",
    alt: "Entrega de veículo no showroom da PG Multimarcas, com um Honda CR-V prata",
  },
];

const SWIPE_THRESHOLD_PX = 40;

export function DeliveryCarousel() {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  function goTo(nextIndex: number, action: "next" | "previous" | "swipe") {
    const clamped = (nextIndex + DELIVERIES.length) % DELIVERIES.length;
    if (clamped === index) return;
    setIndex(clamped);
    trackDeliveryCarouselInteraction(action, clamped);
  }

  function onTouchStart(event: TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }

  function onTouchEnd(event: TouchEvent<HTMLDivElement>) {
    if (touchStartX.current === null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;

    if (delta > SWIPE_THRESHOLD_PX) {
      goTo(index - 1, "swipe");
    } else if (delta < -SWIPE_THRESHOLD_PX) {
      goTo(index + 1, "swipe");
    }
  }

  return (
    <section className="border-y border-line bg-surface py-16 sm:py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand">Prova real</p>
            <h2 className="mt-1 font-display text-3xl font-bold text-ink">Últimas entregas da PG.</h2>
            <p className="mt-2 max-w-md text-sm text-muted">
              Algumas fotos reais do showroom, sem identificar clientes.
            </p>
          </div>
          <a
            href={instagramProfileUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackInstagramClick("home_deliveries")}
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-ink hover:text-brand"
          >
            <InstagramIcon className="h-4 w-4" />
            Ver mais no Instagram
          </a>
        </div>

        <div
          className="relative mx-auto mt-8 max-w-2xl select-none overflow-hidden rounded-lg border border-line bg-paper shadow-elevated"
          role="group"
          aria-roledescription="carrossel"
          aria-label="Fotos de entregas recentes da PG"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="relative aspect-[4/3] w-full bg-black">
            {DELIVERIES.map((delivery, i) => (
              <Image
                key={delivery.src}
                src={delivery.src}
                alt={delivery.alt}
                fill
                sizes="(min-width: 1024px) 640px, 90vw"
                priority={i === 0}
                aria-hidden={i !== index}
                className={`absolute inset-0 object-cover transition-opacity duration-[var(--motion-base)] ease-[var(--ease-standard)] ${
                  i === index ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label="Entrega anterior"
            onClick={() => goTo(index - 1, "previous")}
            className="absolute left-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-black/80 sm:flex"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Próxima entrega"
            onClick={() => goTo(index + 1, "next")}
            className="absolute right-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-black/80 sm:flex"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>

          <div
            aria-live="polite"
            className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white"
          >
            {index + 1}/{DELIVERIES.length}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1">
          {DELIVERIES.map((delivery, i) => (
            <button
              key={delivery.src}
              type="button"
              aria-label={`Ir para a foto ${i + 1}`}
              aria-current={i === index}
              onClick={() => goTo(i, i > index ? "next" : "previous")}
              // Visual dot stays small; the button itself keeps a >=24px touch
              // target (Lighthouse target-size) via padding around it.
              className="group flex h-6 w-6 items-center justify-center"
            >
              <span
                className={`h-2 rounded-full transition-[width,background-color] duration-[var(--motion-base)] ease-[var(--ease-standard)] ${
                  i === index ? "w-6 bg-brand" : "w-2 bg-line group-hover:bg-ink/30"
                }`}
              />
            </button>
          ))}
        </div>
      </Container>
    </section>
  );
}
