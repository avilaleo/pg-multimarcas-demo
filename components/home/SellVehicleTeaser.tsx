import Link from "next/link";
import { ArrowRight, Car } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function SellVehicleTeaser() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="flex flex-col items-start gap-6 rounded-lg border border-black-soft bg-black px-6 py-10 text-white sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-brand">
              <Car className="h-6 w-6 text-white" aria-hidden />
            </span>
            <div>
              <h2 className="font-display text-2xl font-bold">Quer vender seu carro ou usar na troca?</h2>
              <p className="mt-2 max-w-lg text-white/70">
                Conte como está o veículo e, se quiser, envie algumas fotos. Quanto mais completo o
                cadastro, mais informação a equipe tem antes de falar com você.
              </p>
            </div>
          </div>
          <Link
            href="/venda-seu-veiculo"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-white/90"
          >
            Enviar meu veículo para avaliação
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </Container>
    </section>
  );
}
