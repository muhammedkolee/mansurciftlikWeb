import type { FieldRecord, PlantingRecord } from "@/lib/agis/fields/types";
import { languageTag, type Locale } from "@/lib/agis/i18n";

export function seedKgPerDekar(amountKg: number | null, areaSqm: number) {
  if (amountKg === null || !Number.isFinite(amountKg)) return null;
  if (!Number.isFinite(areaSqm) || areaSqm <= 0) return null;
  return amountKg / (areaSqm / 1000);
}

export function formatSeedRate(amountKg: number | null, areaSqm: number, locale: Locale = "tr") {
  const rate = seedKgPerDekar(amountKg, areaSqm);
  if (rate === null) return locale === "en" ? "Cannot be calculated" : "Hesaplanamıyor";
  return `${rate.toLocaleString(languageTag(locale), { maximumFractionDigits: 2 })} kg/da`;
}

export function sortPlantingsNewestFirst(plantings: PlantingRecord[]) {
  return [...plantings].sort((first, second) => {
    const firstTime = Date.parse(first.plantedAt ?? first.createdAt);
    const secondTime = Date.parse(second.plantedAt ?? second.createdAt);
    return secondTime - firstTime;
  });
}

export function availablePlantingYears(plantings: PlantingRecord[]) {
  return [...new Set(
    plantings
      .map((planting) => planting.plantedAt?.slice(0, 4) ?? null)
      .filter((year): year is string => Boolean(year && /^\d{4}$/.test(year))),
  )].sort((first, second) => Number(second) - Number(first));
}

export type FieldPlantingRow = {
  field: FieldRecord;
  planting: PlantingRecord | null;
};

export function fieldPlantingRows(
  fields: FieldRecord[],
  plantings: PlantingRecord[],
  year: "current" | string,
): FieldPlantingRow[] {
  if (year === "current") {
    return fields.map((field) => ({
      field,
      planting: plantings.find((planting) => (
        planting.fieldId === field.id && planting.isCurrent
      )) ?? null,
    }));
  }

  const fieldsById = new Map(fields.map((field) => [field.id, field]));
  return sortPlantingsNewestFirst(plantings)
    .filter((planting) => planting.plantedAt?.slice(0, 4) === year)
    .flatMap((planting) => {
      const field = fieldsById.get(planting.fieldId);
      return field ? [{ field, planting }] : [];
    });
}

export function syncPlantingsWithField(
  plantings: PlantingRecord[],
  field: FieldRecord,
) {
  let foundCurrent = false;
  const synced = plantings.map((planting) => {
    if (planting.fieldId !== field.id) return planting;
    if (field.plantingId && planting.id === field.plantingId) {
      foundCurrent = true;
      return {
        ...planting,
        cropName: field.cropName,
        amountKg: field.amountKg,
        plantedAt: field.plantedAt,
        season: field.season,
        isCurrent: true,
        updatedAt: field.updatedAt,
      };
    }
    return planting.isCurrent ? { ...planting, isCurrent: false } : planting;
  });

  if (field.plantingId && !foundCurrent) {
    synced.push({
      id: field.plantingId,
      fieldId: field.id,
      cropName: field.cropName,
      amountKg: field.amountKg,
      plantedAt: field.plantedAt,
      season: field.season,
      isCurrent: true,
      createdAt: field.updatedAt,
      updatedAt: field.updatedAt,
    });
  }

  return sortPlantingsNewestFirst(synced);
}
