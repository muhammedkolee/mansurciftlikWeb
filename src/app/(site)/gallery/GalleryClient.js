'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { X, ZoomIn, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { translations, t } from '@/lib/translations';

// Real photos from /public — HEIC files excluded (photo2, photo4, photo9 are HEIC)
const galleryPhotos = [
  // { src: '/mansurciftlik_kapak.jpg', width: 1200, height: 800 },
  { src: '/photo1.webp', width: 800, height: 1067 },
  { src: '/photo2.jpg', width: 800, height: 1067 },
  { src: '/photo3.jpg', width: 1200, height: 900 },
  { src: '/photo4.jpg', width: 1200, height: 900 },
  { src: '/photo5.webp', width: 800, height: 600 },
  { src: '/photo6.jpg', width: 1200, height: 900 },
  { src: '/photo7.webp', width: 800, height: 600 },
  { src: '/photo8.webp', width: 800, height: 1067 },
  { src: '/photo9.jpg', width: 800, height: 1067 },
  { src: '/photo10.jpg', width: 1200, height: 800 },
  { src: '/mansurciftlik_profil.jpg', width: 800, height: 800 },
];

function GalleryItem({ photo, index, onClick, caption, isDark }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05, rootMargin: '300px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onClick={() => onClick(index)}
      style={{
        breakInside: 'avoid',
        marginBottom: '12px',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        background: isDark ? 'var(--bg-surface)' : '#E5E7EB',
        minHeight: '120px',
        opacity: loaded ? 1 : 0,
        transform: loaded ? 'none' : 'scale(0.97)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
      }}
      className="gallery-item"
      role="button"
      tabIndex={0}
      aria-label={`Fotoğrafı büyüt: ${caption}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(index); }}
    >
      {visible && (
        <>
          <Image
            src={photo.src}
            alt={caption}
            fill
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            sizes="(max-width: 480px) 50vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            quality={80}
            onLoad={() => setLoaded(true)}
          />
        </>
      )}
    </div>
  );
}

function Lightbox({ photos, captions, currentIndex, onClose, onPrev, onNext }) {
  const photo = photos[currentIndex];
  const caption = captions[currentIndex];

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.93)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backdropFilter: 'blur(8px)',
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: '20px', right: '20px',
          background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
          width: '44px', height: '44px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', cursor: 'pointer', color: 'white', zIndex: 1001,
        }}
        aria-label="Kapat"
      >
        <X size={22} />
      </button>

      {currentIndex > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          style={{
            position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
            width: '48px', height: '48px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', color: 'white', zIndex: 1001,
          }}
          aria-label="Önceki fotoğraf"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative', maxWidth: 'min(92vw, 1200px)', maxHeight: '92vh',
          borderRadius: '12px', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
        }}
      >
        <Image
          src={photo.src}
          alt={caption}
          width={photo.width}
          height={photo.height}
          style={{ maxWidth: '90vw', maxHeight: '85vh', width: 'auto', height: 'auto', display: 'block' }}
          quality={90}
          priority
        />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '16px 20px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
          color: 'white', fontSize: '14px', fontWeight: 500,
        }}>
          {caption}
          <span style={{ opacity: 0.6, marginLeft: '8px', fontSize: '12px' }}>
            {currentIndex + 1} / {photos.length}
          </span>
        </div>
      </div>

      {currentIndex < photos.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          style={{
            position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
            width: '48px', height: '48px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', color: 'white', zIndex: 1001,
          }}
          aria-label="Sonraki fotoğraf"
        >
          <ChevronRight size={24} />
        </button>
      )}
    </div>
  );
}

export default function GalleryClient() {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const openLightbox = useCallback((i) => setLightboxIndex(i), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevPhoto = useCallback(() => setLightboxIndex((i) => Math.max(0, i - 1)), []);
  const nextPhoto = useCallback(() => setLightboxIndex((i) => Math.min(galleryPhotos.length - 1, i + 1)), []);

  const { theme, language, mounted } = useApp();
  const lang = language;
  const tr = translations.gallery;
  const isDark = mounted && theme === 'dark';

  const captions = tr.photos.map(p => t(p.caption, lang));

  return (
    <>
      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--brand-brown-dark) 0%, var(--brand-brown) 50%, var(--brand-blue) 100%)',
        padding: '80px 24px 100px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 700, color: 'white', marginBottom: '16px' }}>
            {t(tr.title, lang)}
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
            {t(tr.subtitle, lang)}
          </p>
        </div>
      </div>

      {/* Gallery Grid */}
      <section style={{ background: 'var(--bg-alt)', padding: '60px 24px 80px', marginTop: '-24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
            {t(tr.hint, lang)}
          </p>

          {/* Copyright Warning Box */}
          <div style={{
            background: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(254, 226, 226, 0.8)',
            border: `1px solid ${isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.3)'}`,
            borderRadius: '12px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '40px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}>
            <AlertCircle size={24} style={{ color: isDark ? '#FCA5A5' : '#EF4444', flexShrink: 0 }} />
            <span style={{ fontSize: '14px', color: isDark ? '#FECACA' : '#991B1B', fontWeight: 500, lineHeight: 1.5 }}>
              {t(tr.warning, lang)}
            </span>
          </div>

          <div className="gallery-grid">
            {galleryPhotos.map((photo, index) => (
              <GalleryItem key={photo.src} photo={photo} index={index} onClick={openLightbox} caption={captions[index]} isDark={isDark} />
            ))}
          </div>
        </div>
      </section>

      {lightboxIndex !== null && (
        <Lightbox photos={galleryPhotos} captions={captions} currentIndex={lightboxIndex} onClose={closeLightbox} onPrev={prevPhoto} onNext={nextPhoto} />
      )}
    </>
  );
}
