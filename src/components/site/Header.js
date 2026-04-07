'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun, Globe } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { translations, t } from '@/lib/translations';

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, language, toggleTheme, toggleLanguage, mounted } = useApp();

  const lang = language;
  const tr = translations.header;

  const navLinks = [
    { href: '/', label: t(tr.nav.home, lang) },
    { href: '/products', label: t(tr.nav.products, lang) },
    { href: '/about-us', label: t(tr.nav.about, lang) },
    { href: '/gallery', label: t(tr.nav.gallery, lang) },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDark = mounted && theme === 'dark';

  const headerBg = scrolled
    ? isDark ? 'rgba(13,17,23,0.97)' : 'rgba(250,250,247,0.97)'
    : isDark ? 'rgba(13,17,23,1)' : 'rgba(250,250,247,1)';

  const toggleBtnStyle = {
    background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(107,63,31,0.08)',
    border: '1px solid',
    borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(107,63,31,0.15)',
    borderRadius: '8px',
    padding: '6px 10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '12px',
    fontWeight: 600,
    color: isDark ? 'rgba(240,235,227,0.9)' : 'var(--brand-brown)',
    transition: 'all 0.2s ease',
    flexShrink: 0,
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: headerBg,
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled
          ? isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(107,63,31,0.15)'
          : '1px solid transparent',
        transition: 'all 0.3s ease',
        boxShadow: scrolled
          ? isDark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.08)'
          : 'none',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        {/* Logo & Brand */}
        <Link
          href="/"
          style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', flexShrink: 0 }}
        >
          <div
            style={{
              width: '44px', height: '44px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0,
              border: isDark ? '2px solid rgba(255,255,255,0.15)' : '2px solid rgba(107,63,31,0.2)',
            }}
          >
            <Image
              src="/mansurciftlik_profil.jpg"
              alt="Mansur Çiftlik Logo"
              width={44} height={44}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              priority
            />
          </div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '17px', color: isDark ? 'var(--brand-brown-light)' : 'var(--brand-brown)', lineHeight: 1.2 }}>
              {t(tr.title, lang)}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1, marginTop: '2px' }}>
              {t(tr.subtitle, lang)}
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2px' }} className="hidden-mobile">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px',
                fontWeight: 500, color: isDark ? 'rgba(240,235,227,0.85)' : 'var(--brand-brown)', transition: 'all 0.2s ease',
              }}
              className="nav-link"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Controls: Theme + Lang */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }} className="hidden-mobile">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            style={toggleBtnStyle}
            aria-label={lang === 'tr' ? 'Switch to English' : "Türkçe'ye geç"}
            title={lang === 'tr' ? 'Switch to English' : "Türkçe'ye geç"}
          >
            <Globe size={13} />
            <span>{lang === 'tr' ? 'TR' : 'EN'}</span>
            <span style={{ opacity: 0.4 }}>|</span>
            <span style={{ opacity: 0.55 }}>{lang === 'tr' ? 'EN' : 'TR'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            style={toggleBtnStyle}
            aria-label={isDark ? (lang === 'tr' ? 'Açık mod' : 'Light mode') : (lang === 'tr' ? 'Koyu mod' : 'Dark mode')}
            title={isDark ? (lang === 'tr' ? 'Açık Moda Geç' : 'Switch to Light Mode') : (lang === 'tr' ? 'Koyu Moda Geç' : 'Switch to Dark Mode')}
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none', background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px', color: isDark ? 'var(--text-primary)' : 'var(--brand-brown)',
          }}
          className="show-mobile"
          aria-label="Menüyü aç/kapat"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          style={{
            background: isDark ? 'var(--bg-surface)' : 'var(--brand-white)',
            borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid var(--brand-brown-pale)',
            padding: '16px 24px 24px',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block', padding: '12px 16px', borderRadius: '8px', textDecoration: 'none',
                fontSize: '15px', fontWeight: 500, marginBottom: '4px',
                color: isDark ? 'var(--text-primary)' : 'var(--brand-brown)',
              }}
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile Controls */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '16px', borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(107,63,31,0.1)' }}>
            <button onClick={toggleLanguage} style={{ ...toggleBtnStyle, flex: 1, justifyContent: 'center' }}>
              <Globe size={13} />
              {lang === 'tr' ? 'TR → EN' : 'EN → TR'}
            </button>
            <button onClick={toggleTheme} style={{ ...toggleBtnStyle, flex: 1, justifyContent: 'center' }}>
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
              <span>{isDark ? (lang === 'tr' ? 'Açık' : 'Light') : (lang === 'tr' ? 'Koyu' : 'Dark')}</span>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile   { display: none !important; }
        }
        .nav-link:hover {
          background: var(--brand-brown-pale) !important;
          color: var(--brand-brown-dark) !important;
        }
        [data-theme="dark"] .nav-link:hover {
          background: rgba(107, 63, 31, 0.25) !important;
          color: var(--brand-brown-light) !important;
        }
      `}</style>
    </header>
  );
}
