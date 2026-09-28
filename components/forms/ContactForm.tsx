"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getCustomWhatsAppUrl } from "@/lib/whatsapp";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [whatsAppUrl, setWhatsAppUrl] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // No backend wired up yet. Rather than claim the message was "received"
    // (that was a real bug elsewhere in the app — see
    // docs/handoff/claude-redesign-v3-1.md P0.1/P0.2), this hands off to a
    // real WhatsApp conversation pre-filled with what was typed.
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const lines = ["Olá! Vim pelo site e gostaria de falar com a PG Multimarcas."];
    if (name) lines.push(`- Nome: ${name}`);
    if (phone) lines.push(`- Telefone: ${phone}`);
    if (email) lines.push(`- Email: ${email}`);
    if (message) lines.push(`- Mensagem: ${message}`);

    const url = getCustomWhatsAppUrl(lines.join("\n"));
    setWhatsAppUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-line bg-surface p-8 text-center shadow-card">
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
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-lg border border-line bg-paper p-6 shadow-card"
    >
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Nome</span>
        <input
          required
          type="text"
          name="name"
          className="h-11 rounded-md border border-line px-3 text-sm text-ink outline-none transition-colors focus:border-black-soft"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Email</span>
        <input
          required
          type="email"
          name="email"
          className="h-11 rounded-md border border-line px-3 text-sm text-ink outline-none transition-colors focus:border-black-soft"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Telefone</span>
        <input
          required
          type="tel"
          name="phone"
          className="h-11 rounded-md border border-line px-3 text-sm text-ink outline-none transition-colors focus:border-black-soft"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Mensagem</span>
        <textarea
          required
          name="message"
          rows={4}
          className="rounded-md border border-line px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-black-soft"
        />
      </label>
      <Button type="submit" className="mt-1">
        Enviar mensagem
      </Button>
    </form>
  );
}
