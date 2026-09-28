import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ContactChannels } from "@/components/forms/ContactChannels";
import { ContactForm } from "@/components/forms/ContactForm";
import { dealerConfig } from "@/dealer.config";

export const metadata: Metadata = {
  title: "Contato",
  description: `Fale com a ${dealerConfig.name}: WhatsApp, telefone, endereço, rota e horário de atendimento em ${dealerConfig.address.city}/${dealerConfig.address.state}.`,
  alternates: { canonical: "/contato" },
  openGraph: { url: "/contato" },
};

export default function ContactPage() {
  return (
    <Container className="py-14 sm:py-20">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand">Fale conosco</p>
      <h1 className="mt-1 font-display text-3xl font-bold text-ink sm:text-4xl">Contato</h1>
      <p className="mt-3 max-w-xl text-ink/80">
        Fale direto com a {dealerConfig.name} pelo canal que preferir, ou envie sua mensagem pelo
        formulário abaixo.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-start">
        <ContactChannels />
        <ContactForm />
      </div>
    </Container>
  );
}
