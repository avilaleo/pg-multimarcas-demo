import { MessageCircle, SearchX } from "lucide-react";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { LinkButton } from "@/components/ui/Button";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";
import type { Vehicle } from "@/lib/domain/vehicle";

export function VehicleGrid({
  vehicles,
  hasActiveFilters = false,
}: {
  vehicles: Vehicle[];
  hasActiveFilters?: boolean;
}) {
  if (vehicles.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-line bg-paper px-6 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface">
          <SearchX className="h-8 w-8 text-muted" aria-hidden />
        </div>
        <div className="space-y-1">
          <p className="text-lg font-semibold text-ink">Nenhum veículo encontrado</p>
          <p className="max-w-sm text-sm text-muted">
            Não encontramos veículos com esses filtros. Tente ajustar a busca, marca, preço ou ano — ou veja
            todo o nosso estoque.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {hasActiveFilters && (
            <LinkButton href="https://avilaleo.github.io/pg-multimarcas-demo/estoque/" variant="primary" size="sm">
              Limpar filtros
            </LinkButton>
          )}
          <LinkButton href="https://avilaleo.github.io/pg-multimarcas-demo/estoque/" variant="outline" size="sm">
            Ver todo o estoque
          </LinkButton>
        </div>
        <a
          href={getGeneralWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-whatsapp hover:underline"
        >
          <MessageCircle className="h-4 w-4" aria-hidden />
          Procurando algo específico? Fale conosco no WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {vehicles.map((vehicle, index) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} priority={index < 4} />
      ))}
    </div>
  );
}
