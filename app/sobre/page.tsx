import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Camera, ShieldCheck, Car } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { dealerConfig } from "@/dealer.config";

export const metadata: Metadata = {
  title: "Loja",
  description: `Conheça a loja da ${dealerConfig.name}, no ${dealerConfig.legalContext}, em ${dealerConfig.address.city}/${dealerConfig.address.state}: endereço, horário de atendimento e diferenciais.`,
  alternates: { canonical: "/sobre" },
  openGraph: { url: "/sobre" },
};

const HIGHLIGHTS = [
  {
    icon: Camera,
    title: "Fotos reais",
    description:
      "Cada veículo anunciado no site tem fotos tiradas na própria loja — o carro do anúncio é o carro do pátio.",
  },
  {
    icon: ShieldCheck,
    title: "Veículos revisados",
    description: "Novos e usados passam por revisão antes de irem para o estoque.",
  },
  {
    icon: Car,
    title: "Novos e usados",
    description: "Estoque com veículos de diferentes marcas, modelos e faixas de preço, em um só lugar.",
  },
];

export default function AboutPage() {
  return (
    <Container className="py-14 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">A loja</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-ink sm:text-4xl">{dealerConfig.name}</h1>
        <p className="mt-4 text-ink/80">
          Revenda multimarcas de veículos novos e usados, no {dealerConfig.legalContext}, em{" "}
          {dealerConfig.address.city}/{dealerConfig.address.state}. Atendimento direto, sem intermediários.
        </p>
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            O que você encontra na loja
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex flex-col gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-white text-brand shadow-card">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold text-ink">{title}</h3>
                  <p className="mt-1 text-sm text-muted">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-lg border border-line shadow-elevated sm:max-w-md lg:mx-0">
          <Image
            src="/brand/showroom-hero.jpg"
            alt={`Showroom da ${dealerConfig.name}, no ${dealerConfig.legalContext}`}
            fill
            sizes="(min-width: 1024px) 420px, 90vw"
            className="object-cover object-top"
          />
        </div>
      </div>

      <div className="mt-16 flex flex-col gap-6 rounded-lg border border-black-soft bg-black px-6 py-10 text-white sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <div className="flex items-start gap-4">
          <Image
            src={dealerConfig.logo.badge}
            alt=""
            width={56}
            height={56}
            className="h-14 w-14 shrink-0 rounded-md"
          />
          <div>
            <h2 className="font-display text-xl font-bold sm:text-2xl">Compra com confiança</h2>
            <p className="mt-2 max-w-lg text-white/70">
              Fotos reais, veículos revisados, novos e usados — tudo no {dealerConfig.legalContext}, em{" "}
              {dealerConfig.address.city}/{dealerConfig.address.state}.
            </p>
          </div>
        </div>
        <LinkButton href="/estoque" variant="primary" size="lg" className="shrink-0">
          Ver estoque
        </LinkButton>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <div className="flex gap-3 rounded-lg border border-line bg-surface p-6 shadow-card">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden />
          <div>
            <p className="font-semibold text-ink">Endereço</p>
            <p className="mt-1 text-sm text-ink/80">{dealerConfig.address.full}</p>
          </div>
        </div>
        <div className="flex gap-3 rounded-lg border border-line bg-surface p-6 shadow-card">
          <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden />
          <div>
            <p className="font-semibold text-ink">Horário de atendimento</p>
            <p className="mt-1 text-sm text-ink/80">
              {dealerConfig.hours.weekdays}
              <br />
              {dealerConfig.hours.saturday}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-10 text-center text-sm text-muted">
        Prefere falar antes de visitar?{" "}
        <Link href="/contato" className="font-semibold text-ink hover:text-brand">
          Fale com a loja pelo telefone, WhatsApp ou Instagram
        </Link>
        .
      </p>
    </Container>
  );
}
