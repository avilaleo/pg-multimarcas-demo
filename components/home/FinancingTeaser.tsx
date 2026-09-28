import Link from "next/link";
import { ArrowRight, Landmark } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function FinancingTeaser() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="flex flex-col items-start gap-6 rounded-lg border border-line bg-surface px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-white text-brand shadow-card">
              <Landmark className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">
                Vai financiar? Faça a simulação com a equipe.
              </h2>
              <p className="mt-2 max-w-lg text-muted">
                Escolha o carro e fale com a PG para consultar as condições disponíveis para o seu perfil.
              </p>
            </div>
          </div>
          <Link
            href="/financiamento"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Ver como funciona
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </Container>
    </section>
  );
}
