import { dealerConfig } from "@/dealer.config";
import type { Vehicle } from "@/lib/domain/vehicle";

function buildWhatsAppUrl(message: string): string {
  const params = new URLSearchParams({ phone: dealerConfig.contact.phoneE164, text: message });
  return `https://api.whatsapp.com/send?${params.toString()}`;
}

/** Generic WhatsApp link, used outside a vehicle context (header, footer, contact page). */
export function getGeneralWhatsAppUrl(): string {
  return buildWhatsAppUrl(
    `Olá! Encontrei o site da ${dealerConfig.name} e gostaria de mais informações.`
  );
}

/** Vehicle-specific WhatsApp link, with the model named in the pre-filled message. */
export function getVehicleWhatsAppUrl(vehicle: Vehicle): string {
  const title = `${vehicle.brand} ${vehicle.model} ${vehicle.modelYear}`;
  return buildWhatsAppUrl(
    `Olá! Vi o ${title} no site da ${dealerConfig.name} e gostaria de mais informações.`
  );
}

export function getSellVehicleWhatsAppUrl(): string {
  return buildWhatsAppUrl(
    `Olá! Quero vender meu veículo e gostaria de falar com a ${dealerConfig.name}.`
  );
}

export function getFinancingWhatsAppUrl(vehicle: Vehicle): string {
  const title = `${vehicle.brand} ${vehicle.model} ${vehicle.modelYear}`;
  return buildWhatsAppUrl(
    `Olá! Gostaria de simular um financiamento para o ${title} anunciado no site da ${dealerConfig.name}.`
  );
}

/** Financing WhatsApp link with no vehicle in context (e.g. the standalone /financiamento page). */
export function getGeneralFinancingWhatsAppUrl(): string {
  return buildWhatsAppUrl(
    `Olá! Gostaria de simular um financiamento na ${dealerConfig.name}.`
  );
}

/**
 * Generic WhatsApp link with a caller-built message — for flows (like the
 * trade-in wizard) that assemble a multi-field message of their own instead
 * of using one of the fixed templates above.
 */
export function getCustomWhatsAppUrl(message: string): string {
  return buildWhatsAppUrl(message);
}
