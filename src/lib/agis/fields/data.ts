import { createClient } from "@/lib/agis/supabase/server";
import { sortPlantingsNewestFirst } from "@/lib/agis/fields/plantings";
import { toFieldRecord, toPlantingRecord } from "@/lib/agis/fields/records";
import type { FieldRecord, PlantingRecord } from "@/lib/agis/fields/types";

export async function getFields(): Promise<FieldRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fields_with_current_planting")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw new Error(`Tarlalar yüklenemedi: ${error.message}`);
  return (data ?? []).map(toFieldRecord).filter((field) => field !== null);
}

export async function getCropNames(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("plantings")
    .select("crop_name")
    .not("crop_name", "is", null)
    .order("crop_name", { ascending: true });

  if (error) throw new Error(`Ekin önerileri yüklenemedi: ${error.message}`);

  const names = new Map<string, string>();
  for (const row of data ?? []) {
    const cropName = row.crop_name?.trim();
    if (!cropName) continue;
    const key = cropName.toLocaleLowerCase("tr-TR");
    if (!names.has(key)) names.set(key, cropName);
  }
  return [...names.values()];
}

export async function getPlantings(): Promise<PlantingRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("plantings")
    .select("id, field_id, crop_name, amount_kg, planted_at, season, is_current, created_at, updated_at");

  if (error) throw new Error(`Ekim geçmişi yüklenemedi: ${error.message}`);
  return sortPlantingsNewestFirst((data ?? []).map(toPlantingRecord));
}
