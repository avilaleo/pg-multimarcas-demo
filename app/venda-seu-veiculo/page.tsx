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
  openGraph: { url: "/venda-seu-veiculo" },
};

export default function SellVehiclePage() {
  return (
    <>
      <section className="bg-black text-white">
        <Container className="py-14 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand">Venda ou troca</p>
            <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">
              Quer vender seu carro ou usar na troca?
            </h1>
            <p className="mt-3 text-white/70">
              Conte como está o veículo e, se quiser, envie algumas fotos. Quanto mais completo o
              cadastro, mais informação a equipe tem antes de falar com você.
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
        </Container>
      </section>

      <Container className="py-14 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <SellVehicleForm />
        </div>
      </Container>
    </>
  );
}
