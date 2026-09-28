import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SellVehicleForm } from "@/components/forms/SellVehicleForm";
import { dealerConfig } from "@/dealer.config";
import { getSellVehicleWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Venda seu Veículo",
  description: `Anuncie seu veículo com a ${dealerConfig.name} em ${dealerConfig.address.city}/${dealerConfig.address.state}. Conte os detalhes e receba um contato.`,
  alternates: { canonical: "/venda-seu-veiculo" },
};

export default function SellVehiclePage() {
  return (
    <Container className="py-14 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">Venda seu veículo</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-ink sm:text-4xl">
          Conte sobre o seu carro
        </h1>
        <p className="mt-3 text-ink/70">
          Preencha os dados abaixo ou fale direto pelo WhatsApp — a equipe da {dealerConfig.name} avalia e
          retorna com uma proposta.
        </p>
        <a
          href={getSellVehicleWhatsAppUrl()}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-whatsapp px-6 py-3 text-sm font-semibold text-white hover:bg-whatsapp/90"
        >
          <MessageCircle className="h-4 w-4" aria-hidden />
          Prefiro falar pelo WhatsApp
        </a>
      </div>

      <div className="mx-auto mt-10 max-w-2xl">
        <SellVehicleForm />
      </div>
    </Container>
  );
}
