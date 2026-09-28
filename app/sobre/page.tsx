import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { dealerConfig } from "@/dealer.config";

export const metadata: Metadata = {
  title: "Sobre",
  description: `Conheça a ${dealerConfig.name}, revenda multimarcas no ${dealerConfig.legalContext}, em ${dealerConfig.address.city}/${dealerConfig.address.state}.`,
  alternates: { canonical: "/sobre" },
};

export default function AboutPage() {
  return (
    <Container className="py-14 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">Sobre a loja</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-ink sm:text-4xl">{dealerConfig.name}</h1>

        <div className="prose prose-neutral mt-6 max-w-none text-ink/80">
          <p>
            A {dealerConfig.name} é uma revenda multimarcas de veículos novos e usados, localizada no{" "}
            {dealerConfig.legalContext}, em {dealerConfig.address.city}/{dealerConfig.address.state}. O
            estoque reúne veículos de diferentes marcas e faixas de preço, com atendimento direto por
            telefone e WhatsApp.
          </p>
          <p>
            Este site é um protótipo comercial: uma nova experiência digital construída a partir de dados
            públicos e reais do estoque da loja, para demonstrar como a presença online da{" "}
            {dealerConfig.name} pode ajudar mais gente a encontrar o carro certo com menos atrito.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-line bg-surface p-6">
          <h2 className="font-display text-lg font-semibold text-ink">Horário de atendimento</h2>
          <p className="mt-2 text-sm text-ink/80">
            {dealerConfig.hours.weekdays}
            <br />
            {dealerConfig.hours.saturday}
          </p>
        </div>
      </div>
    </Container>
  );
}
