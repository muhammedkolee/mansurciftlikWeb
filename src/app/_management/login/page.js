'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, Leaf } from 'lucide-react';
import { signIn } from '@/actions/auth';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await signIn(email, password);
            if (result.success) {
                router.push('/management');
                router.refresh();
            } else {
                setError('E-posta veya şifre hatalı. Lütfen tekrar deneyin.');
            }
        } catch (err) {
            setError('Bağlantı hatası. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                background: 'linear-gradient(135deg, var(--brand-brown-dark) 0%, var(--brand-brown) 40%, var(--brand-blue-dark) 100%)',
            }}
        >
            {/* Left Column - Branding */}
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '60px',
                    color: 'white',
                    display: 'none',
                }}
                className="login-left-panel"
            >
                <div style={{ maxWidth: '400px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
                        <div
                            style={{
                                width: '52px',
                                height: '52px',
                                borderRadius: '14px',
                                overflow: 'hidden',
                                border: '2px solid rgba(255,255,255,0.3)',
                            }}
                        >
                            <Image
                                src="/mansurciftlik_profil.jpg"
                                alt="Mansur Çiftlik"
                                width={52}
                                height={52}
                                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                            />
                        </div>
                        <div>
                            <div
                                style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: '20px',
                                    fontWeight: 700,
                                }}
                            >
                                Mansur Çiftlik
                            </div>
                            <div style={{ fontSize: '12px', opacity: 0.7 }}>Yönetim Paneli</div>
                        </div>
                    </div>

                    <h1
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '42px',
                            fontWeight: 700,
                            lineHeight: 1.2,
                            marginBottom: '16px',
                        }}
                    >
                        Hoş Geldiniz
                    </h1>
                    <p style={{ fontSize: '17px', opacity: 0.8, lineHeight: 1.7 }}>
                        Hayvan takibi, aşı yönetimi ve çiftlik istatistiklerinizi kolayca yönetin.
                    </p>
                </div>
            </div>

            {/* Right Column - Form */}
            <div
                style={{
                    width: '100%',
                    maxWidth: '480px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '40px',
                    background: 'white',
                    margin: 'auto',
                    borderRadius: '24px',
                    boxShadow: '0 32px 80px rgba(0,0,0,0.3)',
                    position: 'relative',
                }}
                className="login-form-container"
            >
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                    <div
                        style={{
                            width: '72px',
                            height: '72px',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            border: '3px solid var(--brand-brown-pale)',
                            margin: '0 auto 16px',
                            boxShadow: '0 8px 24px rgba(107,63,31,0.2)',
                        }}
                    >
                        <Image
                            src="/mansurciftlik_profil.jpg"
                            alt="Mansur Çiftlik"
                            width={72}
                            height={72}
                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                            priority
                        />
                    </div>
                    <h2
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '26px',
                            fontWeight: 700,
                            color: 'var(--brand-brown-dark)',
                            marginBottom: '6px',
                        }}
                    >
                        Yönetim Paneli
                    </h2>
                    <p style={{ fontSize: '14px', color: 'var(--brand-gray)' }}>
                        Devam etmek için giriş yapın
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '14px 16px',
                            background: '#FEF2F2',
                            border: '1px solid #FECACA',
                            borderRadius: '10px',
                            marginBottom: '24px',
                            color: '#DC2626',
                            fontSize: '14px',
                        }}
                    >
                        <AlertCircle size={16} style={{ flexShrink: 0 }} />
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* Email Field */}
                    <div style={{ marginBottom: '16px' }}>
                        <label
                            style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: 600,
                                color: 'var(--brand-brown-dark)',
                                marginBottom: '8px',
                            }}
                        >
                            E-Posta Adresi
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Mail
                                size={18}
                                style={{
                                    position: 'absolute',
                                    left: '14px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--brand-gray)',
                                }}
                            />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="ornek@email.com"
                                style={{
                                    width: '100%',
                                    padding: '13px 16px 13px 44px',
                                    border: '1.5px solid #E5E7EB',
                                    borderRadius: '10px',
                                    fontSize: '15px',
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                    boxSizing: 'border-box',
                                    background: 'var(--brand-cream)',
                                }}
                                onFocus={(e) => (e.target.style.borderColor = 'var(--brand-brown)')}
                                onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div style={{ marginBottom: '28px' }}>
                        <label
                            style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: 600,
                                color: 'var(--brand-brown-dark)',
                                marginBottom: '8px',
                            }}
                        >
                            Şifre
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock
                                size={18}
                                style={{
                                    position: 'absolute',
                                    left: '14px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--brand-gray)',
                                }}
                            />
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                style={{
                                    width: '100%',
                                    padding: '13px 44px 13px 44px',
                                    border: '1.5px solid #E5E7EB',
                                    borderRadius: '10px',
                                    fontSize: '15px',
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                    boxSizing: 'border-box',
                                    background: 'var(--brand-cream)',
                                }}
                                onFocus={(e) => (e.target.style.borderColor = 'var(--brand-brown)')}
                                onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '14px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--brand-gray)',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        id="login-submit-btn"
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: loading
                                ? '#9CA3AF'
                                : 'linear-gradient(135deg, var(--brand-brown) 0%, var(--brand-blue) 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '15px',
                            fontWeight: 700,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'all 0.2s',
                            boxShadow: loading ? 'none' : '0 8px 24px rgba(107,63,31,0.3)',
                        }}
                    >
                        {loading ? (
                            <>
                                <div
                                    style={{
                                        width: '18px',
                                        height: '18px',
                                        border: '2.5px solid rgba(255,255,255,0.3)',
                                        borderTopColor: 'white',
                                        borderRadius: '50%',
                                        animation: 'spin 0.8s linear infinite',
                                    }}
                                />
                                Giriş yapılıyor...
                            </>
                        ) : (
                            <>
                                <LogIn size={18} />
                                Giriş Yap
                            </>
                        )}
                    </button>
                </form>

                {/* Back to Site */}
                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <a
                        href="/"
                        style={{
                            fontSize: '13px',
                            color: 'var(--brand-gray)',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                        }}
                    >
                        <Leaf size={14} />
                        Ana Siteye Geri Dön
                    </a>
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @media (min-width: 900px) {
                    .login-left-panel { display: flex !important; }
                    .login-form-container { 
                        border-radius: 0 !important;
                        max-width: 440px !important;
                        padding: 60px !important;
                    }
                }
            `}</style>
        </div>
    );
}
