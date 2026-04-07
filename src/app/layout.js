import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

// ── Favicon ──────────────────────────────────────────────────
// Next.js App Router: put icon.ico in /public, then reference via metadata.icons
// or place it in /app/favicon.ico for automatic detection.

// ── SEO Metadata ─────────────────────────────────────────────
export const metadata = {
  metadataBase: new URL("https://mansurciftlik.com"),
  title: {
    default: "Mansur Çiftlik | Simental Damızlık Düve & Angus Yetiştiriciliği",
    template: "%s | Mansur Çiftlik",
  },
  description:
    "Mansur Simental Damızlık Düve ve Angus Yetiştiriciliği. Doğal ortamda yetiştirilen hayvanlardan elde edilen kaliteli süt, tereyağı ve peynir ürünleri.",
  keywords: [
    "simental damızlık düve",
    "angus yetiştiriciliği",
    "çiftlik",
    "taze süt",
    "doğal tereyağı",
    "el yapımı peynir",
    "hayvancılık",
    "mansur çiftlik",
  ],
  authors: [{ name: "Mansur Çiftlik" }],
  creator: "Mansur Çiftlik",
  publisher: "Mansur Çiftlik",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://mansurciftlik.com",
    siteName: "Mansur Çiftlik",
    title: "Mansur Çiftlik | Simental Damızlık Düve & Angus Yetiştiriciliği",
    description:
      "Doğal ortamda yetiştirilen hayvanlardan elde edilen kaliteli süt, tereyağı ve peynir ürünleri.",
    images: [
      {
        url: "/mansurciftlik_kapak.jpg",
        width: 1200,
        height: 630,
        alt: "Mansur Çiftlik",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mansur Çiftlik | Simental & Angus Yetiştiriciliği",
    description:
      "Doğal ortamda yetiştirilen hayvanlardan elde edilen kaliteli süt, tereyağı ve peynir.",
    images: ["/mansurciftlik_kapak.jpg"],
  },
  icons: {
    icon: "/icon.ico",
    shortcut: "/icon.ico",
    apple: "/icon.ico",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://mansurciftlik.com",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap"
          as="style"
          onLoad="this.onload=null;this.rel='stylesheet'"
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap"
          />
        </noscript>
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Mansur Çiftlik",
              description:
                "Simental Damızlık Düve ve Angus Yetiştiriciliği. Doğal ortamda yetiştirilen hayvanlardan kaliteli ürünler.",
              url: "https://mansurciftlik.com",
              logo: "https://mansurciftlik.com/mansurciftlik_profil.jpg",
              image: "https://mansurciftlik.com/mansurciftlik_kapak.jpg",
              foundingDate: "2010",
              areaServed: "TR",
              "@type": "LocalBusiness",
              priceRange: "₺₺",
            }),
          }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
