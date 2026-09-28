import type { MetadataRoute } from "next";
import { SITE_INDEXABLE, SITE_URL } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: SITE_INDEXABLE ? "/" : undefined,
      disallow: SITE_INDEXABLE ? undefined : "/",
    },
    sitemap: SITE_INDEXABLE ? `${SITE_URL}/sitemap.xml` : undefined,
  };
}
