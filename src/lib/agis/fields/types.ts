import type { Polygon } from "geojson";
import type { Locale } from "@/lib/agis/i18n";

export type FieldRecord = {
  id: string;
  name: string | null;
  description: string | null;
  geometry: Polygon;
  areaSqm: number;
  cropName: string | null;
  amountKg: number | null;
  plantedAt: string | null;
  season: string | null;
  plantingId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PlantingRecord = {
  id: string;
  fieldId: string;
  cropName: string | null;
  amountKg: number | null;
  plantedAt: string | null;
  season: string | null;
  isCurrent: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PlantingFormValues = {
  cropName: string;
  amountKg: string;
  plantedAt: string;
  season: string;
};

export type FieldFormValues = {
  name: string;
  cropName: string;
  amountKg: string;
  plantedAt: string;
  description: string;
};

export type FieldMutationInput = FieldFormValues & {
  id?: string;
  geometry: Polygon;
  locale?: Locale;
};

export type FieldActionResult =
  | { ok: true; field: FieldRecord }
  | { ok: false; error: string };

export type PlantingActionResult =
  | { ok: true; field: FieldRecord; planting: PlantingRecord }
  | { ok: false; error: string };

export type PlantingHistoryResult =
  | { ok: true; plantings: PlantingRecord[] }
  | { ok: false; error: string };

export const emptyFieldForm: FieldFormValues = {
  name: "",
  cropName: "",
  amountKg: "",
  plantedAt: "",
  description: "",
};

export function fieldToForm(field: FieldRecord): FieldFormValues {
  return {
    name: field.name ?? "",
    cropName: field.cropName ?? "",
    amountKg: field.amountKg === null ? "" : String(field.amountKg),
    plantedAt: field.plantedAt ?? "",
    description: field.description ?? "",
  };
}
