import { buildArcGisWorldImageryStyleUrl, type MapConfig } from "@/lib/agis/map/config";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL_FOR_AGIS?.trim();

const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY_FOR_AGIS?.trim();

export const hasSupabaseEnv = Boolean(supabaseUrl && supabasePublishableKey);

export function getSupabaseEnv() {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "Supabase yapılandırması eksik. .env.local içindeki NEXT_PUBLIC_SUPABASE_URL_FOR_AGIS ve NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY_FOR_AGIS değerlerini doldurun.",
    );
  }

  return { supabaseUrl, supabasePublishableKey };
}

function withPublicKey(template: string | undefined, key: string | undefined) {
  if (!template) return null;
  if (template.includes("{key}") && !key) return null;
  return template.replaceAll("{key}", key ?? "");
}

export function getMapConfig(): MapConfig {
  const template = process.env.NEXT_PUBLIC_SATELLITE_TILE_URL_MAPTILER?.trim();
  const key = process.env.NEXT_PUBLIC_SATELLITE_API_KEY?.trim();
  const attribution =
    process.env.NEXT_PUBLIC_SATELLITE_ATTRIBUTION_MAPTILER?.trim() ?? "© Uydu görüntüsü sağlayıcısı";

  const mapTilerAvailable = Boolean(
    template && (!template.includes("{key}") || key),
  );
  const isMapTiler = Boolean(template?.includes("api.maptiler.com"));
  const hybridTemplate =
    process.env.NEXT_PUBLIC_SATELLITE_STYLE_URL_MAPTILER?.trim() ??
    (isMapTiler
      ? "https://api.maptiler.com/maps/hybrid-v4/style.json?key={key}"
      : undefined);
  const geocodingTemplate =
    process.env.NEXT_PUBLIC_GEOCODING_URL?.trim() ??
    (isMapTiler
      ? "https://api.maptiler.com/geocoding/{query}.json?key={key}&country=tr"
      : undefined);

  const arcGisKey = process.env.NEXT_PUBLIC_ARCGIS_API_KEY?.trim();

  return {
    mapTiler: mapTilerAvailable && template
      ? {
          tileUrl: template.replaceAll("{key}", key ?? ""),
          attribution,
          styleUrl: withPublicKey(hybridTemplate, key),
        }
      : null,
    arcgis: arcGisKey
      ? {
          styleUrl: buildArcGisWorldImageryStyleUrl(arcGisKey),
          attribution: "Powered by Esri",
        }
      : null,
    geocodingUrl: withPublicKey(geocodingTemplate, key),
  };
}
