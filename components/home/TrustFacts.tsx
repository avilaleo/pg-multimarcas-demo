import { MapPin, MessageCircle, ImageIcon, SlidersHorizontal } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { dealerConfig } from "@/dealer.config";

const FACTS = [
  {
    icon: MapPin,
    title: "Loja física",
    description: `${dealerConfig.legalContext}, ${dealerConfig.address.city}/${dealerConfig.address.state}.`,
  },
  {
    icon: ImageIcon,
    title: "Fotos reais",
    description: "Cada veículo do estoque tem galeria própria, sem imagens ilustrativas.",
  },
  {
    icon: SlidersHorizontal,
    title: "Busca por filtro",
    description: "Marca, modelo, preço, ano, câmbio e combustível em poucos cliques.",
  },
  {
    icon: MessageCircle,
    title: "Contato direto",
    description: "Fale no WhatsApp já mencionando o veículo que te interessou.",
  },
];

export function TrustFacts() {
  return (
    <section className="border-y border-line bg-surface py-14">
      <h2 className="sr-only">Por que comprar na {dealerConfig.name}</h2>
      <Container className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {FACTS.map((fact) => (
          <div key={fact.title} className="flex flex-col gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-brand shadow-sm">
              <fact.icon className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h3 className="font-display text-base font-semibold text-ink">{fact.title}</h3>
              <p className="mt-1 text-sm text-muted">{fact.description}</p>
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}
