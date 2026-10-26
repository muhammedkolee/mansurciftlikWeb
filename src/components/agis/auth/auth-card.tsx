"use client";

import { useActionState, useState } from "react";
import { ArrowLeft, Leaf, LoaderCircle, LockKeyhole, Mail } from "lucide-react";

import {
  requestPasswordReset,
  signIn,
  signUp,
  type AuthState,
} from "@/app/agis/giris/actions";
import { LanguageSwitcher } from "@/components/agis/i18n/language-switcher";
import { useLanguage } from "@/components/agis/i18n/language-provider";
import { pick } from "@/lib/agis/i18n";

const initialState: AuthState = {};

type Mode = "login" | "signup" | "reset";

export function AuthCard() {
  const { locale } = useLanguage();
  const [mode, setMode] = useState<Mode>("login");
  const login = useActionState(signIn, initialState);
  const signup = useActionState(signUp, initialState);
  const reset = useActionState(requestPasswordReset, initialState);
  const [state, formAction, pending] =
    mode === "login" ? login : mode === "signup" ? signup : reset;

  return (
    <main className="auth-shell">
      <section className="auth-story" aria-label={pick(locale, "AGIS tanıtımı", "About AGIS")}>
        <div className="brand-mark"><Leaf aria-hidden="true" /></div>
        <p className="eyebrow">{pick(locale, "Akıllı tarla yönetimi", "Smart field management")}</p>
        <h1>{pick(locale, "Tarlanızın her köşesi artık elinizin altında.", "Every corner of your field is now at your fingertips.")}</h1>
        <p>
          {pick(locale, "Sınırları haritada çizin, ekimi kaydedin ve tüm arazinizi tek bir sade görünümden yönetin.", "Draw boundaries on the map, record plantings, and manage all your land from one clear view.")}
        </p>
        <div className="field-lines" aria-hidden="true" />
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <div className="auth-language"><LanguageSwitcher /></div>
          {mode === "reset" && (
            <button className="text-button back-button" onClick={() => setMode("login")}>
              <ArrowLeft size={17} /> {pick(locale, "Girişe dön", "Back to sign in")}
            </button>
          )}
          <p className="eyebrow">AGIS {pick(locale, "Tarla Takip", "Field Tracking")}</p>
          <h2>
            {mode === "login"
              ? pick(locale, "Tekrar hoş geldiniz", "Welcome back")
              : mode === "signup"
                ? pick(locale, "Hesabınızı oluşturun", "Create your account")
                : pick(locale, "Şifrenizi yenileyin", "Reset your password")}
          </h2>
          <p className="muted">
            {mode === "reset"
              ? pick(locale, "Yenileme bağlantısını göndereceğimiz e-posta adresini yazın.", "Enter the email address where we should send the reset link.")
              : pick(locale, "Tarlalarınıza güvenli biçimde ulaşmak için devam edin.", "Continue to access your fields securely.")}
          </p>

          {mode !== "reset" && (
            <div className="auth-tabs" role="tablist" aria-label={pick(locale, "Hesap işlemleri", "Account actions")}>
              <button
                role="tab"
                aria-selected={mode === "login"}
                className={mode === "login" ? "active" : ""}
                onClick={() => setMode("login")}
              >
                {pick(locale, "Giriş yap", "Sign in")}
              </button>
              <button
                role="tab"
                aria-selected={mode === "signup"}
                className={mode === "signup" ? "active" : ""}
                onClick={() => setMode("signup")}
              >
                {pick(locale, "Hesap oluştur", "Create account")}
              </button>
            </div>
          )}

          <form action={formAction} className="auth-form">
            <input type="hidden" name="locale" value={locale} />
            <label>
              <span>{pick(locale, "E-posta", "Email")}</span>
              <span className="input-with-icon">
                <Mail size={18} aria-hidden="true" />
                <input name="email" type="email" autoComplete="email" required />
              </span>
            </label>

            {mode !== "reset" && (
              <label>
                <span>{pick(locale, "Şifre", "Password")}</span>
                <span className="input-with-icon">
                  <LockKeyhole size={18} aria-hidden="true" />
                  <input
                    name="password"
                    type="password"
                    minLength={6}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    required
                  />
                </span>
              </label>
            )}

            {state.error && <p className="form-message error" role="alert">{state.error}</p>}
            {state.message && <p className="form-message success" role="status">{state.message}</p>}

            <button className="primary-button wide" disabled={pending}>
              {pending && <LoaderCircle className="spin" size={18} />}
              {pending
                ? pick(locale, "İşleniyor…", "Processing…")
                : mode === "login"
                  ? pick(locale, "Giriş yap", "Sign in")
                  : mode === "signup"
                    ? pick(locale, "Hesap oluştur", "Create account")
                    : pick(locale, "Bağlantı gönder", "Send link")}
            </button>
          </form>

          {mode === "login" && (
            <button className="text-button centered" onClick={() => setMode("reset")}>
              {pick(locale, "Şifremi unuttum", "Forgot my password")}
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
