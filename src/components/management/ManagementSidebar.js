'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Beef, Syringe, Home, ChevronRight } from 'lucide-react';

const navLinks = [
  { href: '/management', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { href: '/management/animals', label: 'Hayvanlar', icon: <Beef size={18} /> },
  { href: '/management/vaccines', label: 'Aşılar', icon: <Syringe size={18} /> },
];

export default function ManagementSidebar() {
  const pathname = usePathname();

  return (
    <div className="mgmt-sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <div style={{ padding: '28px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              overflow: 'hidden',
              border: '2px solid rgba(255,255,255,0.25)',
              flexShrink: 0,
            }}
          >
            <Image
              src="/mansurciftlik_profil.jpg"
              alt="Mansur Çiftlik"
              width={40}
              height={40}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              priority
            />
          </div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', fontWeight: 700, color: 'white' }}>
              Mansur Çiftlik
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)' }}>Yönetim Paneli</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: '8px', paddingLeft: '4px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Menü
        </div>
        {navLinks.map((link) => {
          const isActive =
            link.href === '/management'
              ? pathname === '/management'
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`mgmt-nav-link ${isActive ? 'active' : ''}`}
            >
              {link.icon}
              {link.label}
              {isActive && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.6 }} />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <a href="/" className="mgmt-nav-link">
          <Home size={18} />
          Ana Siteye Dön
        </a>
      </div>
    </div>
  );
}
