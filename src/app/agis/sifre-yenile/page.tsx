"use client";

import { useActionState } from "react";
import { Leaf, LoaderCircle, LockKeyhole } from "lucide-react";

import { updatePassword, type AuthState } from "@/app/agis/giris/actions";
import { LanguageSwitcher } from "@/components/agis/i18n/language-switcher";
import { useLanguage } from "@/components/agis/i18n/language-provider";
import { pick } from "@/lib/agis/i18n";

export default function PasswordUpdatePage() {
  const { locale } = useLanguage();
  const [state, action, pending] = useActionState<AuthState, FormData>(
    updatePassword,
    {},
  );

  return (
    <main className="simple-page">
      <section className="auth-card compact">
        <div className="auth-language"><LanguageSwitcher /></div>
        <div className="brand-mark small"><Leaf aria-hidden="true" /></div>
        <p className="eyebrow">AGIS {pick(locale, "Tarla Takip", "Field Tracking")}</p>
        <h1>{pick(locale, "Yeni şifrenizi belirleyin", "Choose your new password")}</h1>
        <p className="muted">{pick(locale, "En az 6 karakterden oluşan yeni şifrenizi girin.", "Enter a new password containing at least 6 characters.")}</p>
        <form action={action} className="auth-form">
          <input type="hidden" name="locale" value={locale} />
          <label>
            <span>{pick(locale, "Yeni şifre", "New password")}</span>
            <span className="input-with-icon">
              <LockKeyhole size={18} />
              <input name="password" type="password" minLength={6} required />
            </span>
          </label>
          {state.error && <p className="form-message error">{state.error}</p>}
          <button className="primary-button wide" disabled={pending}>
            {pending && <LoaderCircle className="spin" size={18} />}
            {pick(locale, "Şifreyi güncelle", "Update password")}
          </button>
        </form>
      </section>
    </main>
  );
}
