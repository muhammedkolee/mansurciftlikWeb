"use client";
import { useState } from 'react';
import { supabaseManagement } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function ManagementLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabaseManagement.auth.signInWithPassword({ email, password });
    console.log(error);
    if (error) {
      setError(error.message);
    } else {
      router.push('/');
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-root {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          background: #ffffff;
          position: relative;
          overflow: hidden;
        }

        .auth-panel-left {
          flex: 1;
          background: linear-gradient(160deg, #0f2027 0%, #1a3a2a 50%, #203a43 100%);
          position: relative;
          overflow: hidden;
          display: none;
        }
        @media (min-width: 900px) { .auth-panel-left { display: flex; flex-direction: column; justify-content: flex-end; padding: 56px; } }

        .panel-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 20% 80%, rgba(34,197,94,0.2) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 80% 20%, rgba(20,83,45,0.5) 0%, transparent 70%);
        }

        .panel-grain {
          position: absolute;
          inset: 0;
          opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 200px;
        }

        .panel-deco {
          position: absolute;
          top: 48px;
          left: 48px;
          width: 120px;
          height: 120px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 50%;
        }
        .panel-deco::after {
          content: '';
          position: absolute;
          inset: 16px;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 50%;
        }

        .panel-icon {
          position: absolute;
          bottom: 0;
          right: -20px;
          font-size: 260px;
          line-height: 1;
          opacity: 0.04;
          user-select: none;
          filter: blur(1px);
        }

        .panel-content {
          position: relative;
          z-index: 1;
        }
        .panel-tag {
          display: inline-block;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 6px 14px;
          border-radius: 100px;
          margin-bottom: 28px;
        }
        .panel-heading {
          font-family: 'Playfair Display', serif;
          font-size: 46px;
          font-weight: 700;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 20px;
        }
        .panel-heading em {
          font-style: italic;
          color: #4ade80;
        }
        .panel-sub {
          font-size: 15px;
          font-weight: 300;
          color: rgba(255,255,255,0.45);
          max-width: 320px;
          line-height: 1.7;
        }
        .panel-stats {
          display: flex;
          gap: 40px;
          margin-top: 52px;
          padding-top: 32px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 700;
          color: #4ade80;
        }
        .stat-label {
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          margin-top: 2px;
          letter-spacing: 0.05em;
        }

        .auth-panel-right {
          flex: 0 0 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
          background: #ffffff;
          position: relative;
        }
        @media (min-width: 900px) { .auth-panel-right { flex: 0 0 480px; } }

        .form-card {
          width: 100%;
          max-width: 400px;
        }

        .form-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 48px;
        }
        .logo-mark {
          width: 42px;
          height: 42px;
          background: linear-gradient(135deg, #1a3a2a, #0f2027);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }
        .logo-text {
          display: flex;
          flex-direction: column;
        }
        .logo-name {
          font-family: 'Playfair Display', serif;
          font-size: 17px;
          font-weight: 700;
          color: #1a3a2a;
          line-height: 1.2;
        }
        .logo-sub-text {
          font-size: 11px;
          color: #6b7280;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-top: 1px;
        }

        .form-title {
          font-family: 'Playfair Display', serif;
          font-size: 34px;
          font-weight: 700;
          color: #1a3a2a;
          margin-bottom: 8px;
        }
        .form-desc {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 36px;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .field-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #374151;
          margin-bottom: 8px;
        }

        .field-wrap {
          position: relative;
        }

        .field-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          pointer-events: none;
          display: flex;
          align-items: center;
        }

        .field-input {
          width: 100%;
          padding: 14px 16px 14px 46px;
          border: 1.5px solid #d1d5db;
          border-radius: 12px;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          color: #1a3a2a;
          background: #fff;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .field-input::placeholder { color: #9ca3af; }
        .field-input:focus {
          border-color: #1a3a2a;
          box-shadow: 0 0 0 3px rgba(26,58,42,0.1);
        }

        .field-suffix {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #9ca3af;
          display: flex;
          align-items: center;
          padding: 4px;
          border-radius: 6px;
          transition: color 0.15s;
        }
        .field-suffix:hover { color: #1a3a2a; }

        .form-error {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 10px;
          font-size: 13px;
          color: #dc2626;
          margin-bottom: 20px;
        }

        .submit-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #1a3a2a, #0f2027);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: opacity 0.2s, transform 0.1s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          letter-spacing: 0.02em;
        }
        .submit-btn:hover:not(:disabled) { opacity: 0.9; }
        .submit-btn:active:not(:disabled) { transform: scale(0.99); }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="auth-root">
        {/* Left decorative panel */}
        <div className="auth-panel-left">
          <div className="panel-bg" />
          <div className="panel-grain" />
          <div className="panel-deco" />
          <div className="panel-icon">🐄</div>
          <div className="panel-content">
            <span className="panel-tag">Mansur Çiftlik · Yönetim Sistemi</span>
            <h1 className="panel-heading">Sürünüzün<br /><em>dijital</em><br />rehberi.</h1>
            <p className="panel-sub">
              Tüm hayvan kayıtlarınızı tek bir sistemde yönetin. İnekler, buzağılar, düveler ve daha fazlası.
            </p>
            <div className="panel-stats">
              <div>
                <div className="stat-num">100%</div>
                <div className="stat-label">Güvenli Veri</div>
              </div>
              <div>
                <div className="stat-num">7/24</div>
                <div className="stat-label">Erişim</div>
              </div>
              <div>
                <div className="stat-num">∞</div>
                <div className="stat-label">Kayıt Kapasitesi</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="auth-panel-right">
          <div className="form-card">
            <div className="form-logo">
              <div className="logo-mark">🐄</div>
              <div className="logo-text">
                <span className="logo-name">Mansur Çiftlik</span>
                <span className="logo-sub-text">Yönetim Paneli</span>
              </div>
            </div>

            <h2 className="form-title">Hoş geldiniz</h2>
            <p className="form-desc">Devam etmek için hesabınıza giriş yapın.</p>

            {error && (
              <div className="form-error">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="field-group">
                <div>
                  <label className="field-label">E-posta</label>
                  <div className="field-wrap">
                    <span className="field-icon">
                      <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </span>
                    <input
                      type="email"
                      placeholder="ornek@email.com"
                      className="field-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div>
                  <label className="field-label">Şifre</label>
                  <div className="field-wrap">
                    <span className="field-icon">
                      <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="field-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                    <button type="button" className="field-suffix" onClick={() => setShowPassword(v => !v)}>
                      {showPassword
                        ? <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                        : <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                      }
                    </button>
                  </div>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading
                  ? <><div className="spinner" />Giriş yapılıyor...</>
                  : <>
                    Giriş Yap
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                }
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
