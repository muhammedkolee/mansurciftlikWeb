import type { FieldRecord } from "@/lib/agis/fields/types";
import type { Locale } from "@/lib/agis/i18n";

export const DEFAULT_CROPS = [
  "Arpa",
  "Buğday",
  "Reygrass",
  "5'li Mix",
  "Yonca",
  "Korunga",
  "Tritikale",
  "Yulaf",
  "Şeker Sorgumu",
  "Mısır",
] as const;

const ENGLISH_CROPS: Record<(typeof DEFAULT_CROPS)[number], string> = {
  Arpa: "Barley",
  Buğday: "Wheat",
  Reygrass: "Ryegrass",
  "5'li Mix": "5-Way Mix",
  Yonca: "Alfalfa",
  Korunga: "Sainfoin",
  Tritikale: "Triticale",
  Yulaf: "Oats",
  "Şeker Sorgumu": "Sweet Sorghum",
  Mısır: "Corn",
};

function lookupKey(value: string) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .normalize("NFC");
}

const CANONICAL_CROP_BY_ALIAS = new Map<string, (typeof DEFAULT_CROPS)[number]>();
for (const cropName of DEFAULT_CROPS) {
  CANONICAL_CROP_BY_ALIAS.set(lookupKey(cropName), cropName);
  CANONICAL_CROP_BY_ALIAS.set(lookupKey(ENGLISH_CROPS[cropName]), cropName);
}

function titleCaseCustomCrop(value: string, locale: Locale) {
  const tag = locale === "en" ? "en-US" : "tr-TR";
  const lower = value.trim().replace(/\s+/g, " ").toLocaleLowerCase(tag);
  return lower.replace(/(^|[\s-])(\p{L})/gu, (_, boundary: string, letter: string) =>
    `${boundary}${letter.toLocaleUpperCase(tag)}`,
  );
}

/** Stores built-in crops in Turkish and normalizes custom crops to title case. */
export function canonicalCropName(value: string, locale: Locale = "tr") {
  const trimmed = value.trim().replace(/\s+/g, " ");
  if (!trimmed) return "";
  return CANONICAL_CROP_BY_ALIAS.get(lookupKey(trimmed)) ?? titleCaseCustomCrop(trimmed, locale);
}

export function normalizeCropName(value: string) {
  return lookupKey(canonicalCropName(value));
}

export function displayCropName(value: string, locale: Locale) {
  const canonical = canonicalCropName(value, locale);
  if (!canonical || locale === "tr") return canonical;
  return ENGLISH_CROPS[canonical as (typeof DEFAULT_CROPS)[number]] ?? canonical;
}

export function cropSuggestions(fields: FieldRecord[], savedCropNames: string[] = []) {
  const suggestions = new Map<string, string>();

  for (const cropName of DEFAULT_CROPS) {
    suggestions.set(normalizeCropName(cropName), cropName);
  }

  const fieldCrops = fields
    .map((field) => field.cropName?.trim())
    .filter((cropName): cropName is string => Boolean(cropName));

  for (const cropName of [...savedCropNames, ...fieldCrops]) {
    const canonical = canonicalCropName(cropName);
    if (!canonical) continue;
    const key = normalizeCropName(canonical);
    if (!suggestions.has(key)) suggestions.set(key, canonical);
  }

  return [...suggestions.values()];
}
