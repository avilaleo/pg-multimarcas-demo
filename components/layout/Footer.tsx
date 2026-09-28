import Link from "next/link";
import Image from "next/image";
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
  { href: "/financiamento", label: "Financiamento" },
  { href: "/sobre", label: "Loja" },
  { href: "/contato", label: "Contato" },
];

export function Footer() {
  return (
    <footer className="border-t border-black-soft bg-black text-white/80">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image
            src={dealerConfig.logo.dark}
            alt={dealerConfig.name}
            width={150}
            height={40}
            className="h-9 w-auto"
          />
          <p className="mt-3 max-w-xs text-sm text-white/60">
            {dealerConfig.legalContext} — {dealerConfig.address.city}/{dealerConfig.address.state}.
            Veículos novos e usados, revisados e com fotos reais.
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
        <Container className="text-center text-xs text-white/70">
          <p>
            © {new Date().getFullYear()} {dealerConfig.name}. Todos os direitos reservados.
          </p>
        </Container>
      </div>
    </footer>
  );
}
