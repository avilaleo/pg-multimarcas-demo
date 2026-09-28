"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { dealerConfig } from "@/dealer.config";
import { trackPhoneClick } from "@/components/analytics/track-events";

const NAV_LINKS = [
  { href: "/estoque", label: "Estoque" },
  { href: "/venda-seu-veiculo", label: "Venda seu Veículo" },
  { href: "/financiamento", label: "Financiamento" },
  { href: "/sobre", label: "Loja" },
  { href: "/contato", label: "Contato" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40">
      <div className="hidden bg-brand text-white sm:block">
        <Container className="flex h-9 items-center justify-end text-xs font-medium">
          <span>
            {dealerConfig.hours.weekdays} | {dealerConfig.hours.saturday}
          </span>
        </Container>
      </div>

      <div className="border-b border-black-soft bg-black">
        <Container className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center" aria-label={dealerConfig.name}>
            <Image
              src={dealerConfig.logo.dark}
              alt={dealerConfig.name}
              width={170}
              height={45}
              priority
              className="h-10 w-auto sm:h-11"
            />
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/85 transition-colors hover:text-brand"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center md:flex">
            <a
              href={`tel:+${dealerConfig.contact.phoneE164}`}
              onClick={() => trackPhoneClick("header")}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              <Phone className="h-4 w-4" aria-hidden />
              {dealerConfig.contact.phoneDisplay}
            </a>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white md:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </Container>
      </div>

      {open && (
        <div className="border-b border-black-soft bg-black md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-base font-medium text-white/90 hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:+${dealerConfig.contact.phoneE164}`}
              onClick={() => trackPhoneClick("header_mobile")}
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white"
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
