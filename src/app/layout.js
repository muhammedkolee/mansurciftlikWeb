import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
import Footer from "@/components/Footer";
import Header from "@/components/Header";

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
      { url: '/favicon.png' },
      new URL('/favicon.png', 'https://mansurciftlik.com')
    ],
    apple: [
      { url: '/favicon.png' }
    ]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
