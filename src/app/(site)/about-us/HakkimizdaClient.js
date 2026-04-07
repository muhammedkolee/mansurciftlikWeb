'use client';

import { BookOpen, Calendar, ChevronRight, Heart, TrendingUp, Award } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { translations, t } from '@/lib/translations';

const timelineIcons = [
  <Heart key="t1" size={20} />,
  <TrendingUp key="t2" size={20} />,
  <Award key="t3" size={20} />,
  <ChevronRight key="t4" size={20} />,
  <TrendingUp key="t5" size={20} />,
  <Heart key="t6" size={20} />,
];

const timelineColors = [
  { color: 'var(--brand-brown)', bg: 'var(--brand-brown-pale)' },
  { color: 'var(--brand-blue)', bg: 'var(--brand-blue-pale)' },
  { color: 'var(--brand-brown-mid)', bg: 'var(--brand-brown-pale)' },
  { color: 'var(--brand-blue)', bg: 'var(--brand-blue-pale)' },
  { color: 'var(--brand-brown)', bg: 'var(--brand-brown-pale)' },
  { color: 'var(--brand-blue)', bg: 'var(--brand-blue-pale)' },
];

const statsIcons = [
  <Calendar key="s1" size={24} />,
  <Award key="s2" size={24} />,
  <Heart key="s3" size={24} />,
  <TrendingUp key="s4" size={24} />,
];


export default function HakkimizdaClient() {
  const { theme, language, mounted } = useApp();
  const lang = language;
  const tr = translations.about;
  const isDark = mounted && theme === 'dark';

  const S = {
    surface: isDark ? 'var(--bg-surface)' : '#ffffff',
    surfaceAlt: isDark ? 'var(--bg-surface-alt)' : '#F9FAFB',
    altBg: isDark ? 'var(--bg-alt)' : 'var(--brand-cream)',
    textPrimary: 'var(--text-primary)',
    textSecondary: 'var(--text-secondary)',
    border: 'var(--border-color)',
    shadow: 'var(--shadow-card)',
  };

  return (
    <>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--brand-brown-dark) 0%, var(--brand-brown) 50%, var(--brand-blue) 100%)', padding: '80px 24px 100px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', borderRadius: '100px', padding: '8px 18px', marginBottom: '20px' }}>
            <BookOpen size={14} style={{ color: 'rgba(255,255,255,0.9)' }} />
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>{t(tr.header.badge, lang)}</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 700, color: 'white', marginBottom: '16px' }}>
            {t(tr.header.title, lang)}
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
            {t(tr.header.subtitle, lang)}
          </p>
        </div>
      </div>

      {/* Intro Block */}
      <section style={{ background: S.surface, padding: '80px 24px', marginTop: '-24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--brand-brown-pale) 0%, var(--brand-blue-pale) 100%)', borderRadius: '24px', padding: '48px', textAlign: 'center', marginBottom: '64px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 600, color: 'var(--brand-green-moss)', lineHeight: 1.6, fontStyle: 'italic' }}>
              {t(tr.quote.text, lang)}
            </div>
            <div style={{ marginTop: '20px', fontSize: '14px', color: 'var(--brand-brown)', fontWeight: 600 }}>
              {t(tr.quote.author, lang)}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '64px' }}>
            {tr.stats.map((stat, i) => (
              <div key={stat.label.tr} style={{ background: S.altBg, borderRadius: '16px', padding: '24px', textAlign: 'center', border: `1px solid ${S.border}`, boxShadow: S.shadow }}>
                <div style={{ color: 'var(--brand-brown)', marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                  {statsIcons[i]}
                </div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: 700, color: S.textPrimary, lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '13px', color: S.textSecondary, marginTop: '6px' }}>
                  {t(stat.label, lang)}
                </div>
              </div>
            ))}
          </div>

          {/* Blog Text */}
          <div style={{ fontSize: '17px', color: S.textSecondary, lineHeight: 1.9 }}>
            <p style={{ marginBottom: '20px' }}>{t(tr.body.p1, lang)}</p>
            <p style={{ marginBottom: '20px' }}>{t(tr.body.p2, lang)}</p>
            <p style={{ marginBottom: '20px' }}>
              <strong style={{ color: 'var(--brand-brown)' }}>{t(tr.body.simmental, lang)}</strong>
              {t(tr.body.simmentalDesc, lang)}
            </p>
            <p>
              <strong style={{ color: 'var(--brand-blue)' }}>{t(tr.body.angus, lang)}</strong>
              {t(tr.body.angusDesc, lang)}
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: '80px 24px', background: S.altBg }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: S.textPrimary, marginBottom: '12px' }}>
              {t(tr.timeline.title, lang)}
            </h2>
            <p style={{ fontSize: '16px', color: S.textSecondary }}>{t(tr.timeline.subtitle, lang)}</p>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '28px', top: '28px', bottom: '28px', width: '2px', background: 'linear-gradient(180deg, var(--brand-brown) 0%, var(--brand-blue) 100%)', opacity: 0.3 }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              {tr.timeline.events.map((event, index) => (
                <div key={index} style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', position: 'relative' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: timelineColors[index].bg, border: `3px solid ${timelineColors[index].color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative', zIndex: 1, color: timelineColors[index].color, boxShadow: event.isCurrent ? `0 0 0 6px ${timelineColors[index].bg}` : 'none' }}>
                    {timelineIcons[index]}
                  </div>

                  <div style={{ flex: 1, background: S.surface, borderRadius: '16px', padding: '24px 28px', boxShadow: S.shadow, border: event.isCurrent ? `2px solid ${timelineColors[index].color}` : `1px solid ${S.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                      <span style={{ background: timelineColors[index].bg, color: timelineColors[index].color, borderRadius: '100px', padding: '4px 12px', fontSize: '13px', fontWeight: 700 }}>
                        {t(event.year, lang)}
                      </span>
                    </div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 700, color: S.textPrimary, marginBottom: '10px' }}>
                      {t(event.title, lang)}
                    </h3>
                    <p style={{ fontSize: '15px', color: S.textSecondary, lineHeight: 1.7 }}>
                      {t(event.desc, lang)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: '80px 24px', background: S.surface }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: S.textPrimary, textAlign: 'center', marginBottom: '48px' }}>
            {t(tr.values.title, lang)}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {tr.values.items.map((value) => (
              <div key={value.title.tr} className="hover-card-lift" style={{ padding: '32px', borderRadius: '20px', background: value.bg, border: `1px solid transparent`, transition: 'all 0.3s ease' }}>
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>{value.emoji}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 700, color: 'var(--brand-brown-mid)', marginBottom: '10px' }}>
                  {t(value.title, lang)}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--brand-green-moss)', opacity: 0.8, lineHeight: 1.7 }}>
                  {t(value.desc, lang)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
