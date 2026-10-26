export type Locale = "tr" | "en";

export const DEFAULT_LOCALE: Locale = "tr";

export function isLocale(value: unknown): value is Locale {
  return value === "tr" || value === "en";
}

export function languageTag(locale: Locale) {
  return locale === "en" ? "en-US" : "tr-TR";
}

export function pick<T>(locale: Locale, turkish: T, english: T) {
  return locale === "en" ? english : turkish;
}
