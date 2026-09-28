import Link from "next/link";
import { MapPin, Clock } from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { Container } from "@/components/ui/Container";
import { dealerConfig } from "@/dealer.config";
import { instagramProfileUrl } from "@/components/analytics/track-events";
import { FooterTrackedLinks } from "@/components/layout/FooterTrackedLinks";

const SITE_LINKS = [
  { href: "/", label: "Home" },
  { href: "/estoque", label: "Estoque" },
  { href: "/venda-seu-veiculo", label: "Venda seu Veículo" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-white/80">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-bold text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm text-white">
              {dealerConfig.logo.initials}
            </span>
            {dealerConfig.name}
          </div>
          <p className="mt-3 max-w-xs text-sm text-white/60">
            {dealerConfig.legalContext} — {dealerConfig.address.city}/{dealerConfig.address.state}.
            Protótipo comercial de demonstração.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white/50">Navegação</h3>
          <ul className="mt-4 space-y-2">
            {SITE_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-white/80 hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white/50">Contato</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
              <span>{dealerConfig.address.full}</span>
            </li>
            <FooterTrackedLinks />
            <li className="flex items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
              <span>
                {dealerConfig.hours.weekdays}
                <br />
                {dealerConfig.hours.saturday}
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white/50">Redes sociais</h3>
          <a
            href={instagramProfileUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm text-white/80 hover:text-white"
          >
            <InstagramIcon className="h-4 w-4 text-brand" />
            {dealerConfig.instagram.handle}
          </a>
        </div>
      </Container>

      <div className="border-t border-white/10 py-6">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-white/70 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {dealerConfig.name}. Protótipo de demonstração — não é o site
            oficial da loja.
          </p>
          <Link href="/sobre" className="hover:text-white">
            Sobre este projeto
          </Link>
        </Container>
      </div>
    </footer>
  );
}
