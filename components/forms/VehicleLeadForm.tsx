"use client";

import { useId, useRef, useState } from "react";
import { MessageCircle, MessageSquareText, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { analytics } from "@/lib/analytics/adapter";
import { trackCallbackFormOpen } from "@/components/analytics/track-events";
import { getCustomWhatsAppUrl } from "@/lib/whatsapp";

/**
 * V3: "Prefere que a gente te chame?" stopped being a permanently-visible
 * form competing with the WhatsApp CTA (docs/redesign-v3/vdp.md "Painel
 * comercial") — it's now a lightweight secondary trigger that opens a
 * native <dialog> modal. No new dependency: <dialog> gives us focus trap,
 * Escape-to-close and a ::backdrop for free, on both desktop and mobile
 * (a modal can't "stretch" the page the way an inline expand could).
 */
export function VehicleLeadForm({ vehicleSlug, vehicleTitle }: { vehicleSlug: string; vehicleTitle: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [whatsAppUrl, setWhatsAppUrl] = useState<string | null>(null);
  const started = useRef(false);
  const titleId = useId();

  function openDialog() {
    trackCallbackFormOpen(vehicleSlug);
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  function handleDialogClose() {
    setSubmitted(false);
    setWhatsAppUrl(null);
    started.current = false;
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) closeDialog();
  }

  function handleFocus() {
    if (started.current) return;
    started.current = true;
    analytics.track("lead_form_start", { vehicleSlug });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // No backend wired up yet — see README "Como rodar" for where a real
    // integration (API route, CRM, AutoCerto lead endpoint) would go. Rather
    // than claim the proposal was "received" (that was a real bug — see
    // docs/handoff/claude-redesign-v3-1.md P0.1/P0.2), this hands off to a
    // real WhatsApp conversation pre-filled with what was typed.
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const lines = [`Olá! Tenho interesse no ${vehicleTitle} anunciado no site.`];
    if (name) lines.push(`- Nome: ${name}`);
    if (phone) lines.push(`- Telefone: ${phone}`);
    if (message) lines.push(`- Mensagem: ${message}`);

    analytics.track("lead_form_submit", { vehicleSlug });
    const url = getCustomWhatsAppUrl(lines.join("\n"));
    setWhatsAppUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors duration-[var(--motion-fast)] hover:text-brand-dark hover:underline"
      >
        <MessageSquareText className="h-4 w-4" aria-hidden />
        Prefere que a gente te chame?
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClose={handleDialogClose}
        onClick={handleBackdropClick}
        className="fixed top-1/2 left-1/2 m-0 w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-line bg-paper p-0 shadow-elevated backdrop:bg-black/50"
      >
        <div className="p-5">
          {submitted ? (
            <div className="flex flex-col items-center gap-2 py-4 text-center">
              <MessageCircle className="h-8 w-8 text-whatsapp" aria-hidden />
              <p className="font-semibold text-ink">Abrimos o WhatsApp para você continuar</p>
              <p className="text-sm text-muted">
                Se a conversa não abriu automaticamente,{" "}
                {whatsAppUrl && (
                  <a href={whatsAppUrl} target="_blank" rel="noreferrer" className="font-semibold text-whatsapp underline">
                    toque aqui para abrir o WhatsApp
                  </a>
                )}
                .
              </p>
              <Button type="button" variant="outline" size="sm" className="mt-2" onClick={closeDialog}>
                Fechar
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p id={titleId} className="font-display text-lg font-semibold text-ink">
                    Prefere que a gente te chame?
                  </p>
                  <p className="text-sm text-muted">Envie uma proposta sobre o {vehicleTitle}</p>
                </div>
                <button
                  type="button"
                  onClick={closeDialog}
                  aria-label="Fechar"
                  className="shrink-0 rounded-full p-1 text-muted transition-colors hover:bg-surface hover:text-ink"
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </div>

              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted">Nome</span>
                <input
                  required
                  type="text"
                  name="name"
                  onFocus={handleFocus}
                  className="h-10 rounded-sm border border-line bg-paper px-3 text-sm text-ink"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted">Telefone</span>
                <input
                  required
                  type="tel"
                  name="phone"
                  onFocus={handleFocus}
                  className="h-10 rounded-sm border border-line bg-paper px-3 text-sm text-ink"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted">Mensagem</span>
                <textarea
                  name="message"
                  rows={3}
                  onFocus={handleFocus}
                  className="rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink"
                />
              </label>

              <Button type="submit" variant="primary" className="mt-1 w-full">
                Enviar proposta
              </Button>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
