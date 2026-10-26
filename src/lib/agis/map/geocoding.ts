import type { PlaceSearchResult } from "@/lib/agis/map/config";

type SearchFeature = {
  id?: unknown;
  text?: unknown;
  place_name?: unknown;
  center?: unknown;
  bbox?: unknown;
  place_type?: unknown;
};

function isFiniteCoordinatePair(value: unknown): value is [number, number] {
  return (
    Array.isArray(value) &&
    value.length >= 2 &&
    typeof value[0] === "number" &&
    typeof value[1] === "number" &&
    Number.isFinite(value[0]) &&
    Number.isFinite(value[1])
  );
}

export function parseSearchResult(
  value: unknown,
  index: number,
): PlaceSearchResult | null {
  if (!value || typeof value !== "object") return null;
  const feature = value as SearchFeature;
  if (!isFiniteCoordinatePair(feature.center)) return null;
  const name =
    typeof feature.place_name === "string"
      ? feature.place_name
      : typeof feature.text === "string"
        ? feature.text
        : null;
  if (!name) return null;

  const rawBbox = feature.bbox;
  const bbox =
    Array.isArray(rawBbox) &&
    rawBbox.length >= 4 &&
    rawBbox
      .slice(0, 4)
      .every((coordinate) => typeof coordinate === "number" && Number.isFinite(coordinate))
      ? (rawBbox.slice(0, 4) as [number, number, number, number])
      : null;

  return {
    id: typeof feature.id === "string" ? feature.id : `sonuc-${index}`,
    name,
    center: feature.center,
    bbox,
    type:
      Array.isArray(feature.place_type) && typeof feature.place_type[0] === "string"
        ? feature.place_type[0]
        : null,
  };
}

export function buildGeocodingUrl(
  template: string,
  query: string,
  proximity: [number, number] | null,
  baseUrl: string,
) {
  const url = new URL(template.replace("{query}", encodeURIComponent(query)), baseUrl);
  url.searchParams.set("language", "tr");
  url.searchParams.set("limit", "7");
  url.searchParams.set("autocomplete", "true");
  url.searchParams.set(
    "types",
    "region,subregion,county,municipality,municipal_district,locality,neighbourhood,place",
  );
  if (proximity) url.searchParams.set("proximity", proximity.join(","));
  return url;
}
