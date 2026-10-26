import type { MapProvider } from "@/lib/agis/map/config";
import type { Locale } from "@/lib/agis/i18n";

const IMMEDIATE_FAILURE_STATUSES = new Set([400, 401, 403, 429]);
const FAILURE_WINDOW_MS = 12_000;
const PERSISTENT_FAILURE_COUNT = 4;
const PERSISTENT_FAILURE_MIN_SPAN_MS = 2_000;

export function extractHttpStatus(error: unknown): number | null {
  if (typeof error === "string") {
    const match = error.match(/\b(400|401|403|429|5\d\d)\b/);
    return match ? Number(match[1]) : null;
  }
  if (!error || typeof error !== "object") return null;
  const candidate = error as Record<string, unknown>;
  for (const key of ["status", "statusCode"]) {
    const value = candidate[key];
    if (typeof value === "number" && Number.isInteger(value)) return value;
  }
  return extractHttpStatus(candidate.error) ?? extractHttpStatus(candidate.message);
}

export function registerProviderError(
  previousErrors: number[],
  status: number | null,
  now: number,
) {
  const recentErrors = previousErrors.filter((timestamp) => now - timestamp <= FAILURE_WINDOW_MS);
  recentErrors.push(now);
  const immediate = status !== null && IMMEDIATE_FAILURE_STATUSES.has(status);
  const firstErrorAt = recentErrors[0] ?? now;
  const persistent = recentErrors.length >= PERSISTENT_FAILURE_COUNT
    && now - firstErrorAt >= PERSISTENT_FAILURE_MIN_SPAN_MS;
  return { errors: recentErrors, shouldFallback: immediate || persistent };
}

export function providerFallbackMessage(provider: Exclude<MapProvider, "normal">, locale: Locale = "tr") {
  const name = provider === "maptiler" ? "MapTiler" : "ArcGIS";
  const alternative = provider === "maptiler" ? "ArcGIS" : "MapTiler";
  if (locale === "en") {
    return `${name} satellite map is unavailable. Switched to the normal map. You can select the ${alternative} satellite map if you wish.`;
  }
  return `${name} uydu haritasına erişilemiyor. Normal haritaya geçildi. Dilerseniz ${alternative} uydu haritasını seçebilirsiniz.`;
}
