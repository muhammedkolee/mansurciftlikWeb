"use client";

import { useLanguage } from "@/components/agis/i18n/language-provider";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="language-switcher" role="group" aria-label={locale === "en" ? "Language" : "Dil"}>
      <button type="button" className={locale === "en" ? "active" : ""} onClick={() => setLocale("en")} aria-pressed={locale === "en"}>EN</button>
      <button type="button" className={locale === "tr" ? "active" : ""} onClick={() => setLocale("tr")} aria-pressed={locale === "tr"}>TR</button>
    </div>
  );
}
