import { describe, expect, it } from "vitest";

import { buildGeocodingUrl, parseSearchResult } from "@/lib/agis/map/geocoding";

describe("konum araması yardımcıları", () => {
  it("MapTiler sonucunu güvenli uygulama modeline dönüştürür", () => {
    expect(
      parseSearchResult(
        {
          id: "region.ankara",
          place_name: "Ankara, Türkiye",
          place_type: ["region"],
          center: [32.8597, 39.9334],
          bbox: [32.4, 39.5, 33.4, 40.4],
        },
        0,
      ),
    ).toEqual({
      id: "region.ankara",
      name: "Ankara, Türkiye",
      type: "region",
      center: [32.8597, 39.9334],
      bbox: [32.4, 39.5, 33.4, 40.4],
    });
  });

  it("bozuk koordinat içeren sonucu reddeder", () => {
    expect(parseSearchResult({ place_name: "Geçersiz", center: ["x", 39] }, 0)).toBeNull();
  });

  it("Türkçe, yerleşim türleri ve harita yakınlığıyla URL üretir", () => {
    const url = buildGeocodingUrl(
      "https://api.example.test/geocoding/{query}.json?key=public",
      "Çankaya Ankara",
      [32.85, 39.93],
      "https://app.example.test",
    );

    expect(url.pathname).toBe("/geocoding/%C3%87ankaya%20Ankara.json");
    expect(url.searchParams.get("language")).toBe("tr");
    expect(url.searchParams.get("proximity")).toBe("32.85,39.93");
    expect(url.searchParams.get("types")).toContain("locality");
  });
});
