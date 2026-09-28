"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Demo only — no backend wired up yet.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-surface p-8 text-center">
        <CheckCircle2 className="h-8 w-8 text-brand" aria-hidden />
        <p className="font-semibold text-ink">Mensagem enviada!</p>
        <p className="text-sm text-muted">Protótipo de demonstração — em produção, a loja responderia em breve.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-line p-6">
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Nome</span>
        <input required type="text" name="name" className="h-11 rounded-lg border border-line px-3 text-sm" />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Email</span>
        <input required type="email" name="email" className="h-11 rounded-lg border border-line px-3 text-sm" />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Telefone</span>
        <input required type="tel" name="phone" className="h-11 rounded-lg border border-line px-3 text-sm" />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Mensagem</span>
        <textarea required name="message" rows={4} className="rounded-lg border border-line px-3 py-2 text-sm" />
      </label>
      <button
        type="submit"
        className="inline-flex h-11 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white hover:bg-brand-dark"
      >
        Enviar mensagem
      </button>
    </form>
  );
}
