import type { TradeInFormData } from "./types";

/**
 * Plain-language list of what has been filled in so far. Used both mid-wizard
 * (step 4, so the submit isn't a black box) and on the success panel (so the
 * mocked submit doesn't silently discard what the person typed).
 *
 * Intentionally never expresses vehicle valuation accuracy or a "score" —
 * only registration completeness (see briefing: no confidence/score copy).
 */
export function buildSummaryItems(formData: TradeInFormData, totalPhotos: number): string[] {
  const { vehicle, condition } = formData;
  const items: string[] = [];

  if (vehicle.brandModel) {
    items.push(`Veículo: ${vehicle.brandModel}${vehicle.year ? ` (${vehicle.year})` : ""}`);
  }
  if (vehicle.mileage) {
    items.push(`Quilometragem: ${vehicle.mileage} km`);
  }
  if (vehicle.expectedValue) {
    items.push(`Valor esperado informado: ${vehicle.expectedValue}`);
  }
  if (condition.notes) {
    items.push("Observações sobre o estado registradas");
  }
  if (condition.hasIssue === "yes") {
    items.push("Avaria relevante informada");
  } else if (condition.hasIssue === "no") {
    items.push("Sem avarias relevantes informadas");
  }
  items.push(
    totalPhotos > 0
      ? `${totalPhotos} foto${totalPhotos > 1 ? "s" : ""} anexada${totalPhotos > 1 ? "s" : ""}`
      : "Nenhuma foto anexada (opcional)"
  );

  return items;
}

/**
 * V3.1 (docs/handoff/claude-redesign-v3-1.md P0.2): there is no backend, so
 * the wizard's final step hands off to a real WhatsApp conversation instead
 * of pretending the data was "received". Builds the pre-filled message from
 * whatever was actually filled in — never invents a value.
 */
export function buildTradeInWhatsAppMessage(formData: TradeInFormData, totalPhotos: number): string {
  const { vehicle, condition, contact } = formData;
  const lines = ["Olá! Quero vender ou trocar meu veículo. Aqui estão os dados que já preenchi:"];

  if (vehicle.brandModel) {
    lines.push(`- Veículo: ${vehicle.brandModel}${vehicle.year ? ` (${vehicle.year})` : ""}`);
  }
  if (vehicle.mileage) lines.push(`- Quilometragem: ${vehicle.mileage} km`);
  if (vehicle.expectedValue) lines.push(`- Valor esperado: ${vehicle.expectedValue}`);
  if (condition.notes) lines.push(`- Observações: ${condition.notes}`);
  if (condition.hasIssue === "yes") {
    lines.push(`- Avaria relevante: ${condition.issueDetails || "sim"}`);
  } else if (condition.hasIssue === "no") {
    lines.push("- Sem avarias relevantes");
  }
  if (contact.name) lines.push(`- Nome: ${contact.name}`);
  if (totalPhotos > 0) {
    lines.push(
      `- Selecionei ${totalPhotos} foto${totalPhotos > 1 ? "s" : ""} do veículo — vou anexar aqui na conversa.`
    );
  }

  return lines.join("\n");
}

const RICHNESS_THRESHOLD = 2;

/**
 * Two-tier completeness label — deliberately NOT a percentage or "confidence"
 * score. Describes how filled-in the registration is, never the accuracy of
 * any valuation.
 */
export function computeCompletenessLabel(formData: TradeInFormData, totalPhotos: number): string {
  const { vehicle, condition } = formData;
  let richness = 0;
  if (vehicle.expectedValue) richness += 1;
  if (condition.notes) richness += 1;
  if (condition.hasIssue !== "") richness += 1;
  if (totalPhotos > 0) richness += 1;

  return richness >= RICHNESS_THRESHOLD ? "Cadastro mais completo" : "Cadastro básico";
}
