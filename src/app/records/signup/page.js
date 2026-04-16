"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const passwordStrength = (pw) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strength = passwordStrength(password);
  const strengthLabel = ['', 'Zayıf', 'Orta', 'İyi', 'Güçlü'][strength];
  const strengthColor = ['', '#ef4444', '#f97316', '#eab308', '#22c55e'][strength];

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }
    if (strength < 2) {
      setError('Lütfen daha güçlü bir şifre seçin.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (error) {
      console.log(error);
    } else {
      setSuccess(true);
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
          background: #f5f0e8;
        }

        .auth-panel-left {
          flex: 1;
          background: #1a2e1a;
          position: relative;
          overflow: hidden;
          display: none;
        }
        @media (min-width: 900px) { .auth-panel-left { display: flex; flex-direction: column; justify-content: flex-end; padding: 56px; } }

        .panel-bg {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 20% 80%, rgba(74,124,60,0.35) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 80% 20%, rgba(34,60,34,0.6) 0%, transparent 70%),
            #1a2e1a;
        }
        .panel-grain {
          position: absolute; inset: 0; opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 200px;
        }
        .panel-deco {
          position: absolute; top: 48px; left: 48px;
          width: 120px; height: 120px;
          border: 1px solid rgba(255,255,255,0.08); border-radius: 50%;
        }
        .panel-deco::after {
          content: ''; position: absolute; inset: 16px;
          border: 1px solid rgba(255,255,255,0.06); border-radius: 50%;
        }
        .panel-wheat {
          position: absolute; bottom: 0; right: -20px;
          font-size: 280px; line-height: 1; opacity: 0.035;
          user-select: none; filter: blur(1px);
        }
        .panel-content { position: relative; z-index: 1; }
        .panel-tag {
          display: inline-block;
          font-size: 11px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 6px 14px; border-radius: 100px; margin-bottom: 28px;
        }
        .panel-heading {
          font-family: 'Playfair Display', serif;
          font-size: 48px; font-weight: 700; color: #fff; line-height: 1.15; margin-bottom: 20px;
        }
        .panel-heading em { font-style: italic; color: #8ec07c; }
        .panel-sub {
          font-size: 15px; font-weight: 300; color: rgba(255,255,255,0.45);
          max-width: 320px; line-height: 1.7;
        }

        .checklist { margin-top: 40px; display: flex; flex-direction: column; gap: 14px; }
        .check-item { display: flex; align-items: center; gap: 12px; color: rgba(255,255,255,0.55); font-size: 14px; }
        .check-icon {
          width: 24px; height: 24px; background: rgba(142,192,124,0.15);
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .auth-panel-right {
          flex: 0 0 100%;
          display: flex; align-items: center; justify-content: center;
          padding: 48px 24px;
          background: #f5f0e8;
          overflow-y: auto;
        }
        @media (min-width: 900px) { .auth-panel-right { flex: 0 0 500px; } }

        .form-card { width: 100%; max-width: 420px; }

        .form-logo { display: flex; align-items: center; gap: 12px; margin-bottom: 40px; }
        .logo-mark {
          width: 42px; height: 42px; background: #1a2e1a;
          border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px;
        }
        .logo-text { display: flex; flex-direction: column; }
        .logo-name { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 700; color: #1a2e1a; line-height: 1.2; }
        .logo-sub-text { font-size: 11px; color: #8a8070; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 1px; }

        .form-title { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; color: #1a2e1a; margin-bottom: 8px; }
        .form-desc { font-size: 14px; color: #7a7060; margin-bottom: 32px; }

        .field-group { display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px; }
        .field-label { display: block; font-size: 12px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; color: #4a4035; margin-bottom: 8px; }
        .field-wrap { position: relative; }
        .field-icon {
          position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
          color: #9a9080; pointer-events: none; display: flex; align-items: center;
        }
        .field-input {
          width: 100%; padding: 14px 16px 14px 46px;
          border: 1.5px solid #ddd5c0; border-radius: 12px;
          font-size: 15px; font-family: 'DM Sans', sans-serif;
          color: #1a2e1a; background: #fff; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .field-input::placeholder { color: #b5a990; }
        .field-input:focus { border-color: #4a7a3a; box-shadow: 0 0 0 3px rgba(74,122,58,0.1); }
        .field-suffix {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: #9a9080;
          display: flex; align-items: center; padding: 4px; border-radius: 6px; transition: color 0.15s;
        }
        .field-suffix:hover { color: #4a7a3a; }

        .strength-bar-wrap { margin-top: 8px; }
        .strength-track {
          height: 4px; border-radius: 2px; background: #e5ddd0;
          overflow: hidden; margin-bottom: 5px;
        }
        .strength-fill {
          height: 100%; border-radius: 2px;
          transition: width 0.3s, background 0.3s;
        }
        .strength-label { font-size: 12px; font-weight: 500; }

        .form-error {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 16px; background: #fef2f2;
          border: 1px solid #fecaca; border-radius: 10px;
          font-size: 13px; color: #dc2626; margin-bottom: 20px;
        }

        .submit-btn {
          width: 100%; padding: 15px;
          background: #1a2e1a; color: #fff; border: none; border-radius: 12px;
          font-size: 15px; font-weight: 500; font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: background 0.2s, transform 0.1s;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          letter-spacing: 0.02em;
        }
        .submit-btn:hover:not(:disabled) { background: #253d25; }
        .submit-btn:active:not(:disabled) { transform: scale(0.99); }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
          border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .divider { display: flex; align-items: center; gap: 16px; margin: 24px 0; }
        .divider-line { flex: 1; height: 1px; background: #ddd5c0; }
        .divider-text { font-size: 12px; color: #a09080; }

        .switch-row { text-align: center; font-size: 14px; color: #7a7060; }
        .switch-link { color: #2d5a27; font-weight: 500; text-decoration: none; margin-left: 4px; }
        .switch-link:hover { text-decoration: underline; }

        /* Success state */
        .success-box {
          text-align: center; padding: 40px 20px;
          animation: fadeIn 0.4s ease;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .success-icon {
          width: 72px; height: 72px; background: #d1fae5; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px; font-size: 32px;
        }
        .success-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: #1a2e1a; margin-bottom: 12px; }
        .success-desc { font-size: 14px; color: #7a7060; line-height: 1.7; margin-bottom: 32px; }
        .success-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 28px; background: #1a2e1a; color: #fff;
          border-radius: 10px; text-decoration: none; font-size: 14px; font-weight: 500;
          transition: background 0.2s;
        }
        .success-btn:hover { background: #253d25; }
      `}</style>

      <div className="auth-root">
        {/* Left panel */}
        <div className="auth-panel-left">
          <div className="panel-bg" />
          <div className="panel-grain" />
          <div className="panel-deco" />
          <div className="panel-wheat">🌾</div>
          <div className="panel-content">
            <span className="panel-tag">Mansur Çiftlik · Yeni Hesap</span>
            <h1 className="panel-heading">Kayıta<br /><em>başlamak</em><br />kolay.</h1>
            <p className="panel-sub">Dakikalar içinde hesabınızı oluşturun ve çiftliğinizin tüm verilerini yönetmeye başlayın.</p>
            <div className="checklist">
              {[
                'Ücretsiz hesap oluşturun',
                'Anlık veri girişi yapın',
                'Geçmiş kayıtlarınıza ulaşın',
              ].map((item, i) => (
                <div key={i} className="check-item">
                  <div className="check-icon">
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#8ec07c" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right form */}
        <div className="auth-panel-right">
          <div className="form-card">
            <div className="form-logo">
              <div className="logo-mark">🌿</div>
              <div className="logo-text">
                <span className="logo-name">Mansur Çiftlik</span>
                <span className="logo-sub-text">Kayıt Paneli</span>
              </div>
            </div>

            {success ? (
              <div className="success-box">
                <div className="success-icon">✉️</div>
                <h2 className="success-title">E-postanızı kontrol edin</h2>
                <p className="success-desc">
                  <strong>{email}</strong> adresine bir doğrulama bağlantısı gönderdik.
                  Hesabınızı aktive etmek için e-postanızdaki bağlantıya tıklayın.
                </p>
                <Link href="/login" className="success-btn">
                  Giriş sayfasına git
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            ) : (
              <>
                <h2 className="form-title">Hesap oluştur</h2>
                <p className="form-desc">Birkaç adımda çiftlik kayıt sisteminize katılın.</p>

                {error && (
                  <div className="form-error">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSignup}>
                  <div className="field-group">
                    {/* Full name */}
                    <div>
                      <label className="field-label">Ad Soyad</label>
                      <div className="field-wrap">
                        <span className="field-icon">
                          <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                          </svg>
                        </span>
                        <input
                          type="text"
                          placeholder="Ahmet Yılmaz"
                          className="field-input"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          autoComplete="name"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="field-label">E-posta</label>
                      <div className="field-wrap">
                        <span className="field-icon">
                          <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                            <polyline points="22,6 12,13 2,6"/>
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

                    {/* Password */}
                    <div>
                      <label className="field-label">Şifre</label>
                      <div className="field-wrap">
                        <span className="field-icon">
                          <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                          </svg>
                        </span>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Min. 8 karakter"
                          className="field-input"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          autoComplete="new-password"
                        />
                        <button type="button" className="field-suffix" onClick={() => setShowPassword(v => !v)}>
                          {showPassword
                            ? <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                            : <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          }
                        </button>
                      </div>
                      {password && (
                        <div className="strength-bar-wrap">
                          <div className="strength-track">
                            <div
                              className="strength-fill"
                              style={{ width: `${(strength / 4) * 100}%`, background: strengthColor }}
                            />
                          </div>
                          <span className="strength-label" style={{ color: strengthColor }}>{strengthLabel}</span>
                        </div>
                      )}
                    </div>

                    {/* Confirm password */}
                    <div>
                      <label className="field-label">Şifre Tekrar</label>
                      <div className="field-wrap">
                        <span className="field-icon">
                          <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
                            <polyline points="9 11 12 14 22 4"/>
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                          </svg>
                        </span>
                        <input
                          type={showConfirm ? 'text' : 'password'}
                          placeholder="Şifrenizi tekrar girin"
                          className="field-input"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          autoComplete="new-password"
                          style={{
                            borderColor: confirmPassword && confirmPassword !== password ? '#fca5a5' : undefined
                          }}
                        />
                        <button type="button" className="field-suffix" onClick={() => setShowConfirm(v => !v)}>
                          {showConfirm
                            ? <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                            : <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          }
                        </button>
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading
                      ? <><div className="spinner" />Hesap oluşturuluyor...</>
                      : <>
                          Kayıt Ol
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                        </>
                    }
                  </button>
                </form>

                <div className="divider">
                  <span className="divider-line" />
                  <span className="divider-text">veya</span>
                  <span className="divider-line" />
                </div>

                <p className="switch-row">
                  Zaten hesabınız var mı?
                  <Link href="/login" className="switch-link">Giriş yap →</Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}