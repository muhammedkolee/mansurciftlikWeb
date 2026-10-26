export type MapTilerConfig = {
  tileUrl: string;
  attribution: string;
  styleUrl: string | null;
};

export type ArcGisConfig = {
  styleUrl: string;
  attribution: string;
};

export type MapConfig = {
  mapTiler: MapTilerConfig | null;
  arcgis: ArcGisConfig | null;
  geocodingUrl: string | null;
};

export type MapProvider = "normal" | "maptiler" | "arcgis";

export function buildArcGisWorldImageryStyleUrl(apiKey: string) {
  const url = new URL(
    "https://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/styles/arcgis/imagery",
  );
  url.searchParams.set("language", "tr");
  url.searchParams.set("token", apiKey);
  return url.toString();
}

export type PlaceSearchResult = {
  id: string;
  name: string;
  center: [number, number];
  bbox: [number, number, number, number] | null;
  type: string | null;
};
