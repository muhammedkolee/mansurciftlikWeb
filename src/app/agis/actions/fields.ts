"use server";

import type { Polygon } from "geojson";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { Json } from "@/lib/agis/database.types";
import { canonicalCropName } from "@/lib/agis/fields/crops";
import { validateFieldPolygon } from "@/lib/agis/fields/geometry";
import { sortPlantingsNewestFirst } from "@/lib/agis/fields/plantings";
import { isPolygon, toFieldRecord, toPlantingRecord } from "@/lib/agis/fields/records";
import type {
  FieldActionResult,
  FieldMutationInput,
  PlantingActionResult,
  PlantingFormValues,
  PlantingHistoryResult,
  PlantingRecord,
} from "@/lib/agis/fields/types";
import { createClient } from "@/lib/agis/supabase/server";
import { isLocale, type Locale } from "@/lib/agis/i18n";

const message = (locale: Locale, tr: string, en: string) => locale === "en" ? en : tr;

function formSchema(locale: Locale) {
  return z.object({
  id: z.uuid().optional(),
  name: z.string().trim().max(120, message(locale, "Tarla ismi en fazla 120 karakter olabilir.", "The field name can contain at most 120 characters.")),
  cropName: z.string().trim().max(120, message(locale, "Ekin ismi en fazla 120 karakter olabilir.", "The crop name can contain at most 120 characters.")),
  amountKg: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || (Number.isFinite(Number(value)) && Number(value) >= 0),
      message(locale, "Ekilen tohum miktarı sıfır veya pozitif bir sayı olmalı.", "Seed amount must be zero or a positive number."),
    ),
  plantedAt: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || /^\d{4}-\d{2}-\d{2}$/.test(value),
      message(locale, "Geçerli bir ekim tarihi girin.", "Enter a valid planting date."),
    ),
  description: z
    .string()
    .trim()
    .max(2000, message(locale, "Açıklama en fazla 2000 karakter olabilir.", "The description can contain at most 2,000 characters.")),
  geometry: z.custom<Polygon>(isPolygon, message(locale, "Geçerli bir tarla sınırı gerekli.", "A valid field boundary is required.")),
  });
}

function plantingSchema(locale: Locale) {
  return z.object({
  fieldId: z.uuid(message(locale, "Geçerli bir tarla seçin.", "Select a valid field.")),
  cropName: z.string().trim().max(120, message(locale, "Ekin ismi en fazla 120 karakter olabilir.", "The crop name can contain at most 120 characters.")),
  amountKg: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || (Number.isFinite(Number(value)) && Number(value) >= 0),
      message(locale, "Ekilen tohum miktarı sıfır veya pozitif bir sayı olmalı.", "Seed amount must be zero or a positive number."),
    ),
  plantedAt: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || /^\d{4}-\d{2}-\d{2}$/.test(value),
      message(locale, "Geçerli bir ekim tarihi girin.", "Enter a valid planting date."),
    ),
  season: z.string().trim().max(80, message(locale, "Ekim dönemi en fazla 80 karakter olabilir.", "The season can contain at most 80 characters.")),
}).refine(
  (value) => value.cropName !== "" || value.amountKg !== "" || value.plantedAt !== "",
  { message: message(locale, "Ürün, ekilen tohum miktarı veya ekim tarihinden en az birini girin.", "Enter at least a crop, seed amount, or planting date.") },
);
}

function firstIssue(error: z.ZodError, locale: Locale) {
  return error.issues[0]?.message ?? message(locale, "Form bilgilerini kontrol edin.", "Check the form details.");
}

function friendlyDatabaseError(databaseMessage: string, locale: Locale) {
  if (databaseMessage.includes("PGRST202") || databaseMessage.includes("create_planting_record")) {
    return message(locale, "Yeni ekim veritabanı migration'ı henüz uygulanmamış veya şema önbelleği yenilenmemiş. Migration'ları uygulayıp tekrar deneyin.", "The new planting database migration has not been applied yet, or the schema cache has not refreshed. Apply the migrations and try again.");
  }
  if (databaseMessage.includes("Ekilen miktar negatif") || databaseMessage.includes("tohum miktari negatif")) {
    return message(locale, "Ekilen tohum miktarı sıfır veya pozitif olmalı.", "Seed amount must be zero or positive.");
  }
  if (databaseMessage.includes("fields_geometry_valid")) {
    return message(locale, "Tarla sınırı geometrik olarak geçerli değil.", "The field boundary is not geometrically valid.");
  }
  if (databaseMessage.includes("fields_geometry_positive_area")) {
    return message(locale, "Tarla sınırının ölçülebilir bir alanı olmalı.", "The field boundary must have a measurable area.");
  }
  if (databaseMessage.includes("row-level security")) {
    return message(locale, "Bu işlem için yetkiniz yok. Oturumunuzu yenileyip tekrar deneyin.", "You are not authorized for this action. Refresh your session and try again.");
  }
  if (databaseMessage.includes("plantings_one_current_per_field_idx")) {
    return message(locale, "Bu tarla için aynı anda yalnızca bir güncel ekim kaydı oluşturulabilir.", "Only one current planting record can exist for this field.");
  }
  return message(locale, `Kayıt tamamlanamadı: ${databaseMessage}`, `Could not complete the operation: ${databaseMessage}`);
}

async function requireUser(locale: Locale) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) {
    throw new Error(message(locale, "Oturumunuz sona ermiş. Lütfen yeniden giriş yapın.", "Your session has expired. Please sign in again."));
  }
  return supabase;
}

export async function saveField(
  input: FieldMutationInput,
): Promise<FieldActionResult> {
  const locale: Locale = isLocale(input.locale) ? input.locale : "tr";
  const parsed = formSchema(locale).safeParse(input);
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error, locale) };

  const geometryResult = validateFieldPolygon(parsed.data.geometry);
  if (!geometryResult.valid) {
    return { ok: false, error: locale === "en" ? "The field boundary is not valid. Check that it does not intersect itself and has a measurable area." : geometryResult.error };
  }

  try {
    const supabase = await requireUser(locale);
    const cropName = canonicalCropName(parsed.data.cropName, locale);
    const commonArgs = {
      p_geometry: geometryResult.polygon as unknown as Json,
      ...(parsed.data.name ? { p_name: parsed.data.name } : {}),
      ...(parsed.data.description
        ? { p_description: parsed.data.description }
        : {}),
      ...(cropName ? { p_crop_name: cropName } : {}),
      ...(parsed.data.amountKg !== ""
        ? { p_amount_kg: Number(parsed.data.amountKg) }
        : {}),
      ...(parsed.data.plantedAt
        ? { p_planted_at: parsed.data.plantedAt }
        : {}),
    };

    let fieldId: string;
    if (parsed.data.id) {
      const { error } = await supabase.rpc("update_field_with_planting", {
        p_field_id: parsed.data.id,
        ...commonArgs,
      });
      if (error) return { ok: false, error: friendlyDatabaseError(error.message, locale) };
      fieldId = parsed.data.id;
    } else {
      const { data, error } = await supabase.rpc(
        "create_field_with_planting",
        commonArgs,
      );
      if (error) return { ok: false, error: friendlyDatabaseError(error.message, locale) };
      fieldId = data;
    }

    const { data: row, error: readError } = await supabase
      .from("fields_with_current_planting")
      .select("*")
      .eq("id", fieldId)
      .single();
    if (readError) {
      return { ok: false, error: friendlyDatabaseError(readError.message, locale) };
    }

    const field = toFieldRecord(row);
    if (!field) return { ok: false, error: message(locale, "Kaydedilen tarla okunamadı.", "The saved field could not be loaded.") };

    revalidatePath("/agis");
    return { ok: true, field };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : message(locale, "Beklenmeyen bir hata oluştu.", "An unexpected error occurred."),
    };
  }
}

export async function deleteField(
  fieldId: string,
  locale: Locale = "tr",
): Promise<{ ok: boolean; error?: string }> {
  const parsedId = z.uuid().safeParse(fieldId);
  if (!parsedId.success) return { ok: false, error: message(locale, "Geçersiz tarla kimliği.", "Invalid field identifier.") };

  try {
    const supabase = await requireUser(locale);
    const { data, error } = await supabase
      .from("fields")
      .delete()
      .eq("id", parsedId.data)
      .select("id")
      .maybeSingle();

    if (error) return { ok: false, error: friendlyDatabaseError(error.message, locale) };
    if (!data) return { ok: false, error: message(locale, "Tarla bulunamadı veya silme yetkiniz yok.", "The field was not found or you are not authorized to delete it.") };

    revalidatePath("/agis");
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : message(locale, "Tarla silinemedi.", "The field could not be deleted."),
    };
  }
}

export async function createPlanting(
  input: PlantingFormValues & { fieldId: string; locale?: Locale },
): Promise<PlantingActionResult> {
  const locale: Locale = isLocale(input.locale) ? input.locale : "tr";
  const parsed = plantingSchema(locale).safeParse(input);
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error, locale) };

  try {
    const supabase = await requireUser(locale);
    const cropName = canonicalCropName(parsed.data.cropName, locale);
    const { data: plantingId, error } = await supabase.rpc("create_planting_record", {
      p_field_id: parsed.data.fieldId,
      p_crop_name: cropName || null,
      p_amount_kg: parsed.data.amountKg === "" ? null : Number(parsed.data.amountKg),
      p_planted_at: parsed.data.plantedAt || null,
      p_season: parsed.data.season || null,
    });
    if (error) return { ok: false, error: friendlyDatabaseError(error.message, locale) };
    if (!plantingId) return { ok: false, error: message(locale, "Yeni ekim kaydı oluşturulamadı.", "The new planting record could not be created.") };

    const { data: row, error: readError } = await supabase
      .from("fields_with_current_planting")
      .select("*")
      .eq("id", parsed.data.fieldId)
      .single();
    if (readError) return { ok: false, error: friendlyDatabaseError(readError.message, locale) };

    const field = toFieldRecord(row);
    if (!field) return { ok: false, error: message(locale, "Yeni ekim kaydı okunamadı.", "The new planting record could not be loaded.") };

    const { data: plantingRow, error: plantingReadError } = await supabase
      .from("plantings")
      .select("id, field_id, crop_name, amount_kg, planted_at, season, is_current, created_at, updated_at")
      .eq("id", plantingId)
      .single();
    if (plantingReadError) return { ok: false, error: friendlyDatabaseError(plantingReadError.message, locale) };

    revalidatePath("/agis");
    return { ok: true, field, planting: toPlantingRecord(plantingRow) };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : message(locale, "Yeni ekim kaydı oluşturulamadı.", "The new planting record could not be created."),
    };
  }
}

export async function getPlantingHistory(fieldId: string, locale: Locale = "tr"): Promise<PlantingHistoryResult> {
  const parsedId = z.uuid().safeParse(fieldId);
  if (!parsedId.success) return { ok: false, error: message(locale, "Geçersiz tarla kimliği.", "Invalid field identifier.") };

  try {
    const supabase = await requireUser(locale);
    const { data: ownedField, error: fieldError } = await supabase
      .from("fields")
      .select("id")
      .eq("id", parsedId.data)
      .maybeSingle();
    if (fieldError) return { ok: false, error: friendlyDatabaseError(fieldError.message, locale) };
    if (!ownedField) return { ok: false, error: message(locale, "Tarla bulunamadı veya görüntüleme yetkiniz yok.", "The field was not found or you are not authorized to view it.") };

    const { data, error } = await supabase
      .from("plantings")
      .select("id, field_id, crop_name, amount_kg, planted_at, season, is_current, created_at, updated_at")
      .eq("field_id", parsedId.data);
    if (error) return { ok: false, error: friendlyDatabaseError(error.message, locale) };

    const plantings: PlantingRecord[] = (data ?? []).map(toPlantingRecord);

    return { ok: true, plantings: sortPlantingsNewestFirst(plantings) };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : message(locale, "Ekim geçmişi yüklenemedi.", "Planting history could not be loaded."),
    };
  }
}
