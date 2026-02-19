'use client'

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <header className="sticky top-0 left-0 w-full z-[100]">
      <div className="bg-blue-600 text-white py-2 text-center text-xs">
        Bu site şu anda geliştirme aşamasındadır
      </div>
      <div
        className="border-b py-4 px-6"
        style={{
          background: isHome ? "#ffffff" : "#0a1628",
          borderBottom: isHome ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(255,255,255,0.08)"
        }}
      >
      <div className="flex items-center justify-between max-w-7xl mx-auto">

        {/* Sol denge — sadece md ve üstünde görünür */}
        <div className="hidden md:block md:w-[160px]" />

        {/* Logo — mobilde sola, md ve üstünde ortaya */}
        <Link href="/">
          <Image src="/icon.png" alt="Logo" width={66} height={22} />
        </Link>

        {/* Sağ taraf */}
        <div className="md:w-[160px] flex justify-end">
          {isHome && (
            <Link href="/ramadan">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-xl border transition-all"
                style={{
                  background: "rgba(10,22,40,0.97)",
                  border: "1px solid rgba(251,191,36,0.3)",
                  color: "#FDE68A",
                  fontFamily: "'Crimson Text', serif",
                  fontSize: 14,
                  cursor: "pointer"
                }}
              >
                🌙 Ramazan Vakitleri
              </button>
            </Link>
          )}
        </div>

      </div>
      </div>
    </header>
  );
}