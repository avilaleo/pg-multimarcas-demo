import type { Metadata } from "next";
import { CarFront, MessageSquare, FileCheck2, Repeat } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { dealerConfig } from "@/dealer.config";
import { FinancingCtaLinks } from "@/components/financing/FinancingCtaLinks";

export const metadata: Metadata = {
  title: "Financiamento",
  description: `Financie seu veículo na ${dealerConfig.name}, sujeito a análise de crédito, com carro ou moto aceitos na troca. Simulação real direto com um consultor pelo WhatsApp.`,
  alternates: { canonical: "/financiamento" },
  openGraph: { url: "/financiamento" },
};

const STEPS = [
  {
    icon: CarFront,
    title: "Escolha o veículo",
    description: "Navegue pelo estoque real da loja e encontre o carro ou moto ideal para você.",
  },
  {
    icon: MessageSquare,
    title: "Fale com um consultor",
    description: "Chame no WhatsApp com o veículo em mente e conte se tem algo para dar na troca.",
  },
  {
    icon: FileCheck2,
    title: "Simule e feche negócio",
    description: "A equipe da loja faz a análise de crédito e apresenta as condições disponíveis para você.",
  },
];

export default function FinancingPage() {
  return (
    <>
      <section className="bg-black text-white">
        <Container className="py-14 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">Financiamento</p>
          <h1 className="mt-1 max-w-2xl font-display text-3xl font-bold sm:text-4xl">
            Financiamento facilitado para o seu próximo veículo
          </h1>
          <p className="mt-4 max-w-xl text-white/70">
            A {dealerConfig.name} facilita o financiamento do seu carro ou moto, sujeito a análise de
            crédito, e aceita veículo na troca como parte do negócio. A simulação real é feita direto
            com um consultor da loja — sem robôs, sem letras miúdas.
          </p>
          <div className="mt-8">
            <FinancingCtaLinks />
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">Como funciona</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <div key={step.title} className="flex flex-col gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-surface text-brand">
                  <step.icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Passo {index + 1}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-semibold text-ink">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-surface py-16 sm:py-20">
        <Container className="flex flex-col items-start gap-6 rounded-lg sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-white text-brand shadow-card">
              <Repeat className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <h2 className="font-display text-xl font-bold text-ink">
                Tem um carro ou moto para dar na troca?
              </h2>
              <p className="mt-2 max-w-lg text-muted">
                A PG aceita veículo na troca como parte do pagamento, dentro das condições avaliadas pela
                equipe. Conte os detalhes e receba uma avaliação real.
              </p>
            </div>
          </div>
          <FinancingCtaLinks />
        </Container>
      </section>
    </>
  );
}
