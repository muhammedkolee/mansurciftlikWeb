'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Leaf, Droplets, Award, ChevronRight, Users } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { translations, t } from '@/lib/translations';

const featureIcons = [
  <Leaf key="leaf" size={28} />,
  <Droplets key="drop" size={28} />,
  <Award key="award" size={28} />,
  <Users key="users" size={28} />,
];
const featureColors = [
  { color: 'var(--brand-brown)', bg: 'var(--brand-brown-pale)' },
  { color: 'var(--brand-blue)', bg: 'var(--brand-blue-pale)' },
  { color: 'var(--brand-brown-mid)', bg: 'var(--brand-brown-pale)' },
  { color: 'var(--brand-blue)', bg: 'var(--brand-blue-pale)' },
];

export default function HomeClient() {
  const { theme, language, mounted } = useApp();
  const lang = language;
  const tr = translations.home;
  const isDark = mounted && theme === 'dark';

  const S = {
    pageBg: isDark ? 'var(--bg-page)' : 'var(--brand-white)',
    altBg: isDark ? 'var(--bg-alt)' : 'var(--brand-cream)',
    surface: isDark ? 'var(--bg-surface)' : '#ffffff',
    surfaceAlt: isDark ? 'var(--bg-surface-alt)' : '#F9FAFB',
    textPrimary: 'var(--text-primary)',
    textSecondary: 'var(--text-secondary)',
    border: 'var(--border-color)',
    shadow: 'var(--shadow-card)',
    shadowHover: 'var(--shadow-hover)',
  };

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Image
            src="/mansurciftlik_profil.jpg"
            alt={lang === 'tr' ? 'Mansur Çiftlik - Kapak' : 'Mansur Çiftlik - Cover'}
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            priority quality={85}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(74,37,18,0.88) 0%, rgba(27,79,138,0.70) 60%, rgba(74,37,18,0.75) 100%)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1280px', margin: '0 auto', padding: '80px 24px', width: '100%' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '100px', padding: '8px 16px', marginBottom: '28px' }}>
            <Leaf size={14} style={{ color: '#A8D8A8' }} />
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>{t(tr.hero.badge, lang)}</span>
          </div>

          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(42px, 7vw, 88px)', fontWeight: 700, color: 'white', lineHeight: 1.1, maxWidth: '700px', marginBottom: '24px', textShadow: '0 2px 24px rgba(0,0,0,0.3)' }}>
            {t(tr.hero.title1, lang)}
            <br />
            <span style={{ background: 'linear-gradient(90deg, #C4855A, #FBBF6A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {t(tr.hero.title2, lang)}
            </span>
          </h1>

          <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: 'rgba(255,255,255,0.85)', maxWidth: '540px', lineHeight: 1.7, marginBottom: '40px' }}>
            {t(tr.hero.subtitle, lang)}
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', background: 'linear-gradient(135deg, #C4855A 0%, #6B3F1F 100%)', color: 'white', borderRadius: '12px', textDecoration: 'none', fontWeight: 600, fontSize: '15px', boxShadow: '0 8px 24px rgba(107,63,31,0.4)', transition: 'all 0.2s ease' }}>
              {t(tr.hero.ctaProducts, lang)} <ChevronRight size={18} />
            </Link>
            <Link href="/gallery" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', color: 'white', borderRadius: '12px', textDecoration: 'none', fontWeight: 600, fontSize: '15px', border: '1px solid rgba(255,255,255,0.3)', transition: 'all 0.2s ease' }}>
              {t(tr.hero.ctaGallery, lang)}
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '32px', marginTop: '60px', flexWrap: 'wrap' }}>
            {tr.stats.map((s) => (
              <div key={s.label.tr}>
                <div style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, color: 'white', fontFamily: "'Playfair Display', serif" }}>
                  {t(s.value, lang)}
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', marginTop: '2px' }}>{t(s.label, lang)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT INTRO ──────────────────────────────────────── */}
      <section style={{ background: S.altBg, padding: '96px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ borderRadius: '20px', overflow: 'hidden', aspectRatio: '4/3', boxShadow: '0 24px 64px rgba(107,63,31,0.2)' }}>
                <Image src="/mansurciftlik_profil.jpg" alt={lang === 'tr' ? 'Mansur Çiftlik - İşletme' : 'Mansur Çiftlik - Farm'} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
              <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', background: 'linear-gradient(135deg, var(--brand-brown) 0%, var(--brand-blue) 100%)', borderRadius: '16px', padding: '20px 24px', color: 'white', boxShadow: '0 12px 32px rgba(0,0,0,0.2)', zIndex: 1 }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: 700, lineHeight: 1 }}>8+</div>
                <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.85 }}>{t(tr.about.experience, lang)}</div>
              </div>
            </div>

            <div>
              <div style={{ display: 'inline-block', background: 'var(--brand-brown-pale)', color: 'var(--brand-brown)', borderRadius: '100px', padding: '6px 16px', fontSize: '13px', fontWeight: 600, marginBottom: '20px' }}>
                {t(tr.about.badge, lang)}
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: '20px' }}>
                {t(tr.about.title1, lang)}<br />
                <span style={{ color: 'var(--brand-blue)' }}>{t(tr.about.title2, lang)}</span>
              </h2>
              <p style={{ fontSize: '16px', color: S.textSecondary, lineHeight: 1.8, marginBottom: '16px' }}>{t(tr.about.p1, lang)}</p>
              <p style={{ fontSize: '16px', color: S.textSecondary, lineHeight: 1.8, marginBottom: '32px' }}>{t(tr.about.p2, lang)}</p>
              <Link href="/about-us" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'var(--brand-brown)', color: 'white', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '14px', transition: 'all 0.2s' }}>
                {t(tr.about.readStory, lang)} <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section style={{ padding: '96px 24px', background: S.surface }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: S.textPrimary, marginBottom: '16px' }}>
              {t(tr.features.title, lang)}
            </h2>
            <p style={{ fontSize: '17px', color: S.textSecondary, maxWidth: '480px', margin: '0 auto' }}>{t(tr.features.subtitle, lang)}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {tr.features.items.map((feature, i) => (
              <div
                key={feature.title.tr}
                className="hover-card-lift"
                style={{ padding: '32px', borderRadius: '20px', background: S.surface, border: `1px solid ${S.border}`, boxShadow: S.shadow, transition: 'all 0.3s ease' }}
              >
                <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: featureColors[i].bg, color: featureColors[i].color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  {featureIcons[i]}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '18px', color: S.textPrimary, marginBottom: '10px' }}>{t(feature.title, lang)}</h3>
                <p style={{ fontSize: '14px', color: S.textSecondary, lineHeight: 1.7 }}>{t(feature.description, lang)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS PROMO ───────────────────────────────────── */}
      <section style={{ padding: '96px 24px', background: 'linear-gradient(135deg, var(--brand-brown-pale) 0%, var(--brand-blue-pale) 100%)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: S.textPrimary, marginBottom: '12px' }}>
              {t(tr.productsSection.title, lang)}
            </h2>
            <p style={{ fontSize: '17px', color: S.textSecondary }}>{t(tr.productsSection.subtitle, lang)}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
            {tr.productsSection.items.map((p) => (
              <div
                key={p.name.tr}
                className="hover-card-lift"
                style={{ background: S.surface, borderRadius: '20px', padding: '32px', textAlign: 'center', boxShadow: S.shadow, transition: 'all 0.3s ease', border: `1px solid ${S.border}` }}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>{p.emoji}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 700, color: S.textPrimary, marginBottom: '6px' }}>{t(p.name, lang)}</h3>
                <p style={{ fontSize: '13px', color: S.textSecondary, marginBottom: '16px' }}>{t(p.desc, lang)}</p>
                <div style={{ display: 'inline-block', background: 'var(--brand-brown-pale)', color: 'var(--brand-brown)', borderRadius: '8px', padding: '6px 14px', fontSize: '13px', fontWeight: 700 }}>
                  {t(p.price, lang)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link href="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', background: 'linear-gradient(135deg, var(--brand-brown) 0%, var(--brand-blue) 100%)', color: 'white', borderRadius: '12px', textDecoration: 'none', fontWeight: 600, fontSize: '15px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
              {t(tr.productsSection.viewAll, lang)} <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section style={{ position: 'relative', padding: '96px 24px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, var(--brand-blue-dark) 0%, var(--brand-brown-dark) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: 'white', marginBottom: '16px' }}>
            {t(tr.cta.title, lang)}
          </h2>
          <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.78)', marginBottom: '36px', lineHeight: 1.7 }}>{t(tr.cta.subtitle, lang)}</p>
          <Link href="/gallery" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', background: 'white', color: 'var(--brand-brown-dark)', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, fontSize: '15px' }}>
            {t(tr.cta.button, lang)} <ChevronRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
