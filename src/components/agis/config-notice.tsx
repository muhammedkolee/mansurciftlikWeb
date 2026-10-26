"use client";

import { CircleAlert, Leaf } from "lucide-react";
import { LanguageSwitcher } from "@/components/agis/i18n/language-switcher";
import { useLanguage } from "@/components/agis/i18n/language-provider";
import { pick } from "@/lib/agis/i18n";

export function ConfigNotice() {
  const { locale } = useLanguage();
  return (
    <main className="simple-page">
      <section className="config-card">
        <div className="auth-language"><LanguageSwitcher /></div>
        <div className="brand-mark small"><Leaf aria-hidden="true" /></div>
        <p className="eyebrow">{pick(locale, "Kurulum gerekli", "Setup required")}</p>
        <h1>{pick(locale, "Supabase bağlantısı henüz yapılandırılmadı", "Supabase connection is not configured yet")}</h1>
        <p>
          {pick(locale, <>Proje kökünde <code>.env.local</code> oluşturun ve <code>.env.example</code> içindeki Supabase URL ile publishable key alanlarını doldurun.</>, <>Create <code>.env.local</code> in the project root and fill in the Supabase URL and publishable key values from <code>.env.example</code>.</>)}
        </p>
        <div className="notice-row">
          <CircleAlert size={20} />
          <span>{pick(locale, "Service role veya secret key’i tarayıcı değişkenlerine eklemeyin.", "Do not add the service role or secret key to browser environment variables.")}</span>
        </div>
      </section>
    </main>
  );
}
