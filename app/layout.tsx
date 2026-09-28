import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloatingButton } from "@/components/layout/WhatsAppFloatingButton";
import { AttributionCapture } from "@/components/analytics/AttributionCapture";
import { dealerConfig } from "@/dealer.config";
import { SITE_INDEXABLE, SITE_URL } from "@/lib/env";
import { localBusinessJsonLd } from "@/lib/structured-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${dealerConfig.name} — Veículos em ${dealerConfig.address.city}/${dealerConfig.address.state}`,
    template: `%s — ${dealerConfig.name}`,
  },
  description:
    `${dealerConfig.name}, no ${dealerConfig.legalContext}, em ${dealerConfig.address.city}/${dealerConfig.address.state}. ` +
    "Encontre seu próximo carro com fotos, ficha completa e contato direto pelo WhatsApp.",
  robots: SITE_INDEXABLE
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: dealerConfig.name,
    url: SITE_URL,
    images: [{ url: "/brand/showroom-hero.jpg", width: 900, height: 1600 }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <script
          type="application/ld+json"
           
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
        />
        <AttributionCapture />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloatingButton />
      </body>
    </html>
  );
}
