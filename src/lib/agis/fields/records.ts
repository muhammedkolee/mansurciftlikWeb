import type { Polygon } from "geojson";

import type { Database } from "@/lib/agis/database.types";
import type { FieldRecord, PlantingRecord } from "@/lib/agis/fields/types";

type FieldViewRow =
  Database["public"]["Views"]["fields_with_current_planting"]["Row"];
type PlantingRow = Database["public"]["Tables"]["plantings"]["Row"];

export function isPolygon(value: unknown): value is Polygon {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<Polygon>;
  return candidate.type === "Polygon" && Array.isArray(candidate.coordinates);
}

export function toFieldRecord(row: FieldViewRow): FieldRecord | null {
  if (
    !row.id ||
    !row.created_at ||
    !row.updated_at ||
    !isPolygon(row.geometry)
  ) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    geometry: row.geometry,
    areaSqm: Number(row.area_sqm ?? 0),
    cropName: row.crop_name,
    amountKg: row.amount_kg === null ? null : Number(row.amount_kg),
    plantedAt: row.planted_at,
    season: row.season,
    plantingId: row.planting_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toPlantingRecord(row: PlantingRow): PlantingRecord {
  return {
    id: row.id,
    fieldId: row.field_id,
    cropName: row.crop_name,
    amountKg: row.amount_kg === null ? null : Number(row.amount_kg),
    plantedAt: row.planted_at,
    season: row.season,
    isCurrent: row.is_current,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
