import { redirect } from "next/navigation";

import { ConfigNotice } from "@/components/agis/config-notice";
import { MapWorkspace } from "@/components/agis/workspace/map-workspace";
import { getMapConfig, hasSupabaseEnv } from "@/lib/agis/env";
import { getCropNames, getFields, getPlantings } from "@/lib/agis/fields/data";
import type { FieldRecord, PlantingRecord } from "@/lib/agis/fields/types";
import { createClient } from "@/lib/agis/supabase/server";

export default async function HomePage() {
  if (!hasSupabaseEnv) return <ConfigNotice />;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) {
    redirect("/giris");
  }

  let fields: FieldRecord[] = [];
  let cropNames: string[] = [];
  let plantings: PlantingRecord[] = [];
  let initialError: string | undefined;
  const [fieldsResult, cropNamesResult, plantingsResult] = await Promise.allSettled([
    getFields(),
    getCropNames(),
    getPlantings(),
  ]);

  if (fieldsResult.status === "fulfilled") fields = fieldsResult.value;
  else {
    initialError = fieldsResult.reason instanceof Error
      ? fieldsResult.reason.message
      : "Tarlalar yüklenirken bir hata oluştu.";
  }

  if (cropNamesResult.status === "fulfilled") cropNames = cropNamesResult.value;
  else if (!initialError) {
    initialError = cropNamesResult.reason instanceof Error
      ? cropNamesResult.reason.message
      : "Ekin önerileri yüklenirken bir hata oluştu.";
  }

  if (plantingsResult.status === "fulfilled") plantings = plantingsResult.value;
  else if (!initialError) {
    initialError = plantingsResult.reason instanceof Error
      ? plantingsResult.reason.message
      : "Ekim geçmişi yüklenirken bir hata oluştu.";
  }

  return (
    <MapWorkspace
      initialFields={fields}
      initialCropNames={cropNames}
      initialPlantings={plantings}
      userEmail={typeof data.claims.email === "string" ? data.claims.email : "Hesabım"}
      initialError={initialError}
      mapConfig={getMapConfig()}
    />
  );
}
