import { MessageCircle } from "lucide-react";
import { getCustomWhatsAppUrl } from "@/lib/whatsapp";
import { buildSummaryItems, buildTradeInWhatsAppMessage } from "./summary";
import type { TradeInFormData } from "./types";

interface WhatsAppHandoffPanelProps {
  formData: TradeInFormData;
  totalPhotos: number;
}

/**
 * Shown after the wizard's final step opens WhatsApp (docs/handoff/
 * claude-redesign-v3-1.md P0.2 — the previous SuccessPanel falsely claimed
 * "recebemos os dados", but nothing was ever sent anywhere; there's no
 * backend). This panel makes no claim of receipt — it confirms the WhatsApp
 * handoff and gives a manual fallback link in case the browser blocked the
 * popup, plus the same photo-attachment reminder shown before the handoff.
 */
export function WhatsAppHandoffPanel({ formData, totalPhotos }: WhatsAppHandoffPanelProps) {
  const items = buildSummaryItems(formData, totalPhotos);
  const whatsAppUrl = getCustomWhatsAppUrl(buildTradeInWhatsAppMessage(formData, totalPhotos));

  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-line bg-surface p-10 text-center">
      <MessageCircle className="h-10 w-10 text-whatsapp" aria-hidden />
      <p className="font-display text-xl font-semibold text-ink">Abrimos o WhatsApp para você continuar</p>
      <p className="max-w-sm text-sm text-muted">
        Se a conversa não abriu automaticamente,{" "}
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-whatsapp underline"
        >
          toque aqui para abrir o WhatsApp
        </a>
        .
      </p>
      {totalPhotos > 0 && (
        <p className="max-w-sm text-sm text-ink">
          Não esqueça de anexar {totalPhotos > 1 ? "as fotos que você selecionou" : "a foto que você selecionou"} na
          conversa — elas não são enviadas automaticamente.
        </p>
      )}
      <ul className="mt-2 flex w-full max-w-sm flex-col gap-1 rounded-md border border-line bg-paper p-4 text-left text-sm text-ink">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}
