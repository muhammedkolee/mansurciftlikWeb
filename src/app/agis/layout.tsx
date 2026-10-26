import type { Metadata, Viewport } from "next";

import { LanguageProvider } from
  "@/components/agis/i18n/language-provider";

import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    absolute: "AGIS | Tarla Takip Sistemi",
  },
  description:
    "Tarlalarınızı harita üzerinde güvenle yönetin.",
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#18392b",
};

export default function AgisLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="agis-root">
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </div>
  );
}