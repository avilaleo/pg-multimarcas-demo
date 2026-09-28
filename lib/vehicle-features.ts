/**
 * VDP V3 — ranking/categorização de opcionais (docs/redesign-v3/vdp.md,
 * seções "Principais destaques" e "Todos os equipamentos").
 *
 * Extraído de app/estoque/[slug]/page.tsx (V2 tinha essa heurística inline)
 * para poder reutilizar tanto no bloco de destaques quanto no accordion de
 * equipamentos, e para manter as duas listas (Tier A/B e categorias) em um
 * único lugar auditável.
 */

/**
 * Normaliza para comparação: remove acentos e caixa, para casar pequenas
 * variações de grafia entre `data/vehicles.json` e as listas abaixo — o
 * snapshot atual (58 veículos, 78 features distintas) já usa exatamente as
 * strings do briefing, mas isso deixa a comparação resiliente mesmo assim.
 */
function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/** Tier A — diferencial forte, nesta ordem de prioridade (docs/redesign-v3/vdp.md). */
export const HIGHLIGHT_TIER_A = [
  "Garantia de Fábrica",
  "Tração 4x4",
  "Teto panorâmico",
  "Teto solar",
  "Câmera 360",
  "Alerta de ponto cego",
  "Assistente de permanência em faixa",
  "Park Assist",
  "Bancos elétricos",
  "Banco do motorista com ajuste elétrico",
  "Bancos dianteiros com aquecimento",
  "Porta-malas elétrico",
  "Carregador por indução",
  "Apple CarPlay",
  "Android Auto",
  "Farol de LED",
  "Ar condicionado dual zone",
  "Chave presencial",
  "Auto Hold",
  "Freio de mão elétrico",
];

/** Tier B — relevante, usado para completar até o limite quando Tier A não basta. */
export const HIGHLIGHT_TIER_B = [
  "Bancos de Couro",
  "Câmera de ré",
  "Sensor de estacionamento",
  "Piloto automático",
  "Controle de estabilidade",
  "Controle de tração",
  "ISOFIX",
  "Multimídia",
  "GPS",
  "Sensor de chuva",
  "Retrovisor fotocrômico",
  "Assistente de partida em rampa",
  "Airbag de cortina",
  "Start Stop",
  "Rodas de liga leve",
];

export const MAX_HIGHLIGHTS = 8;

/**
 * Itens de documentação/conveniência que não competem como "equipamento do
 * carro" — viram badges/chips próprios ("O que acompanha"), separados dos
 * destaques e (para não duplicar) removidos de "Todos os equipamentos".
 */
export const DOCUMENTATION_BADGES = ["IPVA Pago", "Manual do proprietário", "Chave Reserva"];

/**
 * Até `limit` itens de `vehicle.features` que aparecem nas listas Tier A/B,
 * na ordem de prioridade (Tier A inteiro antes de Tier B), sem duplicar o
 * mesmo item. Retorna a string como veio nos dados do veículo (não a
 * string "canônica" da lista), para nunca exibir algo que não está nos
 * dados reais.
 */
export function getVehicleHighlights(features: string[], limit = MAX_HIGHLIGHTS): string[] {
  const byNormalized = new Map<string, string>();
  for (const feature of features) {
    const key = normalize(feature);
    if (!byNormalized.has(key)) byNormalized.set(key, feature);
  }

  const result: string[] = [];
  for (const candidate of [...HIGHLIGHT_TIER_A, ...HIGHLIGHT_TIER_B]) {
    if (result.length >= limit) break;
    const match = byNormalized.get(normalize(candidate));
    if (match && !result.includes(match)) result.push(match);
  }
  return result;
}

/** Quais dos 3 badges de documentação/conveniência este veículo tem. */
export function getDocumentationBadges(features: string[]): string[] {
  const normalizedSet = new Set(features.map(normalize));
  return DOCUMENTATION_BADGES.filter((badge) => normalizedSet.has(normalize(badge)));
}

export interface FeatureGroup {
  label: string;
  items: string[];
}

/**
 * Categorias exatas pedidas pelo handoff V3 (docs/redesign-v3/vdp.md "Todos
 * os equipamentos"). Os regexes são os mesmos da heurística V2
 * (FEATURE_GROUPS em app/estoque/[slug]/page.tsx), só com os labels
 * ajustados para baterem com o texto exato do handoff.
 */
const FEATURE_CATEGORIES: Array<{ label: string; match: RegExp }> = [
  {
    label: "Segurança",
    match:
      /airbag|freio|abs\b|alerta|isofix|estabilidade|traç[ãa]o|alarme|c[âa]mera|sensor de estacionamento|sensor de chuva|park assist|farol|luz de condu[çc][ãa]o|assistente|auto hold|limitador de velocidade|controle de descida|hdc/i,
  },
  {
    label: "Conforto",
    match:
      /ar condicionado|ar quente|banco|vidro|trava|volante|teto solar|teto panor[âa]mico|ajuste|encosto|retrovisor|limpador|desembaçador|dire[çc][ãa]o el[ée]trica|porta-malas el[ée]trico|carregador por indu[çc][ãa]o|rack de teto|porta copos|start stop/i,
  },
  {
    label: "Multimídia e tecnologia",
    match: /multim[íi]dia|gps|bluetooth|usb|carplay|android auto|som no volante|computador de bordo|piloto autom[áa]tico|dvd player|cd player/i,
  },
  {
    label: "Documentação/itens inclusos",
    match: /ipva|manual do propriet|chave reserva|chave presencial|licenciado/i,
  },
  {
    label: "Rodas/estética",
    match: /roda|p[áa]ra-choques|pintura|insufilm/i,
  },
];

const FALLBACK_LABEL = "Outros";

/**
 * Agrupa `vehicle.features` nas 6 categorias do handoff, sempre excluindo
 * os 3 itens que já viraram badges de documentação (getDocumentationBadges)
 * — evita mostrar "IPVA Pago"/"Manual do proprietário"/"Chave Reserva" tanto
 * como badge quanto dentro do accordion de equipamentos.
 *
 * Retorna só as categorias com pelo menos 1 item, na ordem fixa acima
 * (Segurança, Conforto, Multimídia, Documentação, Rodas, Outros por último).
 */
export function groupFeaturesByCategory(features: string[]): FeatureGroup[] {
  const badgeKeys = new Set(DOCUMENTATION_BADGES.map(normalize));
  const relevant = features.filter((feature) => !badgeKeys.has(normalize(feature)));

  const byLabel = new Map<string, string[]>();
  for (const feature of relevant) {
    const label = FEATURE_CATEGORIES.find((category) => category.match.test(feature))?.label ?? FALLBACK_LABEL;
    if (!byLabel.has(label)) byLabel.set(label, []);
    byLabel.get(label)!.push(feature);
  }

  const order = [...FEATURE_CATEGORIES.map((category) => category.label), FALLBACK_LABEL];
  return order
    .filter((label) => byLabel.has(label))
    .map((label) => ({ label, items: byLabel.get(label)! }));
}
