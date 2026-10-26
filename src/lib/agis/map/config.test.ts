import { describe, expect, it } from "vitest";

import { buildArcGisWorldImageryStyleUrl } from "./config";
import { resolveMapStyle } from "@/components/agis/map/map-canvas";

describe("ArcGIS harita yapılandırması", () => {
  it("resmî World Imagery Basemap Styles v2 adresini Türkçe etiketlerle üretir", () => {
    const url = new URL(buildArcGisWorldImageryStyleUrl("anahtar + özel"));
    expect(url.hostname).toBe("basemapstyles-api.arcgis.com");
    expect(url.pathname.endsWith("/styles/arcgis/imagery")).toBe(true);
    expect(url.searchParams.get("language")).toBe("tr");
    expect(url.searchParams.get("token")).toBe("anahtar + özel");
  });
});

describe("harita sağlayıcı seçimi", () => {
  const config = {
    mapTiler: {
      tileUrl: "https://maptiler.test/tiles/{z}/{x}/{y}.jpg",
      styleUrl: "https://maptiler.test/style.json",
      attribution: "MapTiler",
    },
    arcgis: {
      styleUrl: "https://arcgis.test/style.json",
      attribution: "Esri",
    },
    geocodingUrl: null,
  };

  it("Normal, MapTiler ve ArcGIS stillerini ayrı ayrı çözer", () => {
    expect(resolveMapStyle("normal", config)).toBe("https://tiles.openfreemap.org/styles/liberty");
    expect(resolveMapStyle("maptiler", config)).toBe(config.mapTiler.styleUrl);
    expect(resolveMapStyle("arcgis", config)).toBe(config.arcgis.styleUrl);
  });
});
