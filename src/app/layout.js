import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Mansur Çiftlik",
  description: "Mansur Simental Damızlık Düve ve Angus Yetiştiriciliği İşletmesi Resmi Web Sayfası",
  icons: {
    icon: [
      { url: '/icon.png' },
      new URL('/icon.png', 'https://mansurciftlik.com')
    ],
    apple: [
      { url: '/icon.png' }
    ]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
