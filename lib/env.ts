/**
 * Controls whether the site allows indexing. This demo defaults to
 * non-indexable (it must not compete with the dealer's real domain while it
 * is a prototype). Set SITE_INDEXABLE=true only once this is deployed as the
 * real production site.
 */
export const SITE_INDEXABLE = process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
