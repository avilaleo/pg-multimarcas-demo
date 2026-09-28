"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { dealerConfig } from "@/dealer.config";
import { trackPhoneClick } from "@/components/analytics/track-events";

const NAV_LINKS = [
  { href: "/estoque", label: "Estoque" },
  { href: "/venda-seu-veiculo", label: "Venda seu Veículo" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/80">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-ink">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
            {dealerConfig.logo.initials}
          </span>
          <span>{dealerConfig.name}</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink/80 transition-colors hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center md:flex">
          <a
            href={`tel:+${dealerConfig.contact.phoneE164}`}
            onClick={() => trackPhoneClick("header")}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ink-soft"
          >
            <Phone className="h-4 w-4" aria-hidden />
            {dealerConfig.contact.phoneDisplay}
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink md:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {open && (
        <div className="border-t border-line bg-paper md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-base font-medium text-ink hover:bg-surface"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:+${dealerConfig.contact.phoneE164}`}
              onClick={() => trackPhoneClick("header_mobile")}
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white"
            >
              <Phone className="h-4 w-4" aria-hidden />
              {dealerConfig.contact.phoneDisplay}
            </a>
          </Container>
        </div>
      )}
    </header>
  );
}
