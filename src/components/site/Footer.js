'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Instagram, Facebook, Mail, ExternalLink } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { translations, t } from '@/lib/translations';

const TikTokIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export default function SiteFooter() {
  const { theme, language, mounted } = useApp();
  const lang = language;
  const tr = translations.footer;
  const isDark = mounted && theme === 'dark';

  const navLinks = [
    { href: '/', label: t(translations.header.nav.home, lang) },
    { href: '/products', label: t(translations.header.nav.products, lang) },
    { href: '/about-us', label: t(translations.header.nav.about, lang) },
    { href: '/gallery', label: t(translations.header.nav.gallery, lang) },
  ];

  return (
    <footer
      style={{
        background: 'linear-gradient(135deg, var(--brand-brown-dark) 0%, var(--brand-brown) 60%, var(--brand-blue-dark) 100%)',
        color: 'white',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '1280px', margin: '0 auto', padding: '64px 24px 40px',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px',
        }}
      >
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '12px', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.3)', flexShrink: 0 }}>
              <Image src="/mansurciftlik_profil.jpg" alt="Mansur Çiftlik" width={52} height={52} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
            </div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '20px', color: 'white' }}>{t(translations.header.title, lang)}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', marginTop: '2px' }}>Est. 2018</div>
            </div>
          </div>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, maxWidth: '260px' }}>
            {t(tr.description, lang)}
          </p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            {[
              { href: 'https://www.facebook.com/mansurciftligi', Icon: Facebook, label: 'Facebook' },
              { href: 'https://www.instagram.com/mansurciftlikk', Icon: Instagram, label: 'Instagram' },
              { href: 'https://www.tiktok.com/@mansur.ciftlik', Icon: TikTokIcon, label: 'TikTok' },
            ].map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', textDecoration: 'none', transition: 'background 0.2s' }}
                aria-label={label}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Pages Nav */}
        <div>
          <h3 style={{ fontWeight: 700, fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '20px' }}>
            {t(tr.pagesTitle, lang)}
          </h3>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="footer-nav-link" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Management Info */}
        <div>
          <h3 style={{ fontWeight: 700, fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '20px' }}>
            {t(tr.managementTitle, lang)}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>{t(tr.ceoTitle, lang)}</div>
              <div style={{ fontSize: '14px', color: 'white', fontWeight: 600, marginBottom: '2px' }}>Mustafa Köle</div>
              <a href="tel:+905060281318" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>+90 506 028 13 18</a>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>{t(tr.socialManagerTitle, lang)}</div>
              <div style={{ fontSize: '14px', color: 'white', fontWeight: 600, marginBottom: '2px' }}>Mehmet Emre Köle</div>
              <a href="tel:+905439445568" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>+90 543 944 55 68</a>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 style={{ fontWeight: 700, fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '20px' }}>
            {t(tr.contactTitle, lang)}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <Mail size={16} style={{ color: 'var(--brand-brown-light)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '2px' }}>{t(tr.emailTitle, lang)}</div>
                <a href="mailto:mansurciftlikk@gmail.com" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', textDecoration: 'none' }}>
                  mansurciftlikk@gmail.com
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <Phone size={16} style={{ color: 'var(--brand-brown-light)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '2px' }}>{t(tr.phoneTitle, lang)}</div>
                <a href="tel:+905060281318" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', textDecoration: 'none' }}>
                  +90 506 028 13 18
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <MapPin size={16} style={{ color: 'var(--brand-brown-light)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '2px' }}>{t(tr.locationTitle, lang)}</div>
                <a href="https://maps.google.com/?q=Mansur+Ciftlik" target="_blank" rel="noopener noreferrer" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', lineHeight: 1.5, marginBottom: '6px' }}>
                  Mansurlu Mahallesi, 18100 Müsellim/Yapraklı/Çankırı
                </a>
                {/* <a href="https://maps.google.com/?q=Mansur+Ciftlik" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--brand-brown-light)', textDecoration: 'none', fontWeight: 600 }}>
                  {t(tr.getDirections, lang)} <ExternalLink size={12} />
                </a> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '20px 24px', display: 'flex', justifyContent: 'center' }}>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
          {t(tr.copyright, lang).replace('{year}', new Date().getFullYear())}
        </p>
      </div>

      <style>{`
        .footer-nav-link:hover { color: white !important; }
        .footer-social-btn:hover { background: rgba(255,255,255,0.25) !important; }
      `}</style>
    </footer>
  );
}
