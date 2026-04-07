'use client';

import Image from 'next/image';
import { ShoppingBag, Check, AlertCircle, Star, Truck, Shield } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { translations, t } from '@/lib/translations';

const infoIcons = { Truck: <Truck size={28} />, Shield: <Shield size={28} />, Star: <Star size={28} /> };

export default function UrunlerClient() {
  const { theme, language, mounted } = useApp();
  const lang = language;
  const tr = translations.products;
  const isDark = mounted && theme === 'dark';

  const S = {
    surface:    isDark ? 'var(--bg-surface)'     : '#ffffff',
    surfaceAlt: isDark ? 'var(--bg-surface-alt)' : '#F9FAFB',
    altBg:      isDark ? 'var(--bg-alt)'         : 'var(--brand-cream)',
    textPrimary:   'var(--text-primary)',
    textSecondary: 'var(--text-secondary)',
    border:     'var(--border-color)',
    shadow:     'var(--shadow-card)',
  };

  return (
    <>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--brand-brown-dark) 0%, var(--brand-brown) 50%, var(--brand-blue) 100%)', padding: '80px 24px 100px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', borderRadius: '100px', padding: '8px 18px', marginBottom: '20px' }}>
            <ShoppingBag size={14} style={{ color: 'rgba(255,255,255,0.9)' }} />
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>{t(tr.header.badge, lang)}</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 700, color: 'white', marginBottom: '16px' }}>
            {t(tr.header.title, lang)}
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
            {t(tr.header.subtitle, lang)}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <section style={{ background: S.altBg, padding: '80px 24px', marginTop: '-24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {tr.items.map((product) => (
              <div
                key={product.id}
                className="hover-card-lift"
                style={{ background: S.surface, borderRadius: '24px', overflow: 'hidden', boxShadow: S.shadow, border: `1px solid ${S.border}`, display: 'grid', gridTemplateColumns: 'auto 1fr', transition: 'all 0.3s ease' }}
              >
                {/* Color strip */}
                <div style={{ width: '8px', background: product.inStock ? `linear-gradient(180deg, ${product.color} 0%, ${product.color}88 100%)` : '#D1D5DB' }} />

                {/* Content */}
                <div style={{ padding: '36px 40px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', alignItems: 'center' }}>
                    {/* Left: Info */}
                    <div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: product.badgeColor, color: product.color, borderRadius: '100px', padding: '5px 12px', fontSize: '12px', fontWeight: 600, marginBottom: '16px' }}>
                        <Star size={12} />{t(product.badgeText, lang)}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '52px' }}>{product.emoji}</span>
                        <div>
                          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: 700, color: S.textPrimary, margin: 0 }}>{t(product.name, lang)}</h2>
                          <p style={{ fontSize: '14px', color: product.color, fontWeight: 600, margin: 0 }}>{t(product.subtitle, lang)}</p>
                        </div>
                      </div>
                      <p style={{ fontSize: '15px', color: S.textSecondary, lineHeight: 1.7, marginBottom: '24px', maxWidth: '420px' }}>{t(product.description, lang)}</p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        {t(product.features, lang).map((feature) => (
                          <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: S.textPrimary }}>
                            <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: product.inStock ? product.bgColor : 'var(--bg-surface-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <Check size={10} style={{ color: product.color }} />
                            </div>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Pricing */}
                    <div style={{ background: product.bgColor, borderRadius: '16px', padding: '28px', textAlign: 'center' }}>
                      {product.inStock ? (
                        <>
                          <div style={{ fontSize: '13px', color: product.color, fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t(product.priceUnit, lang)}</div>
                          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', fontWeight: 700, color: S.textPrimary, lineHeight: 1, marginBottom: '8px' }}>{product.priceMain}</div>
                          <div style={{ fontSize: '15px', color: product.color, fontWeight: 600, marginBottom: '20px', padding: '6px 12px', background: 'rgba(255,255,255,0.7)', borderRadius: '8px', display: 'inline-block' }}>{t(product.pricePerUnit, lang)}</div>
                          <br />
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#DCFCE7', color: '#16A34A', borderRadius: '100px', padding: '6px 14px', fontSize: '13px', fontWeight: 600 }}>
                            <Check size={14} />{t(tr.inStock, lang)}
                          </div>
                        </>
                      ) : (
                        <>
                          <div style={{ fontSize: '48px', marginBottom: '12px' }}>⏳</div>
                          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 700, color: S.textPrimary, marginBottom: '8px' }}>{t(product.outOfStockTitle, lang)}</div>
                          <p style={{ fontSize: '14px', color: S.textSecondary, lineHeight: 1.6, marginBottom: '20px' }}>{t(product.outOfStockDesc, lang)}</p>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FEF3C7', color: '#D97706', borderRadius: '100px', padding: '6px 14px', fontSize: '13px', fontWeight: 600 }}>
                            <AlertCircle size={14} />{t(tr.outOfStock, lang)}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section style={{ background: S.surface, padding: '80px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {tr.info.map((info) => (
              <div key={info.key} style={{ padding: '28px', borderRadius: '16px', background: info.bg, textAlign: 'center' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: S.surface, color: info.color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: S.shadow }}>
                  {infoIcons[info.icon]}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '16px', color: S.textPrimary, marginBottom: '8px' }}>{t(info.title, lang)}</h3>
                <p style={{ fontSize: '14px', color: S.textSecondary, lineHeight: 1.6 }}>{t(info.desc, lang)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
