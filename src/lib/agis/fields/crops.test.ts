import { describe, expect, it } from "vitest";
import type { Polygon } from "geojson";

import {
  canonicalCropName,
  cropSuggestions,
  DEFAULT_CROPS,
  displayCropName,
} from "./crops";
import type { FieldRecord } from "./types";

const geometry: Polygon = {
  type: "Polygon",
  coordinates: [[[32, 39], [32.01, 39], [32, 39.01], [32, 39]]],
};

function field(id: string, cropName: string | null): FieldRecord {
  return {
    id,
    name: null,
    description: null,
    geometry,
    areaSqm: 1000,
    cropName,
    amountKg: null,
    plantedAt: null,
    season: null,
    plantingId: null,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  };
}

describe("ekin önerileri", () => {
  it("sabit ekinleri ve kullanıcının kayıtlı ekinlerini birleştirir", () => {
    const suggestions = cropSuggestions([
      field("1", "Nohut"),
      field("2", "  Buğday  "),
      field("3", "nohut"),
      field("4", null),
    ], ["Fiğ", " nohUT "]);

    expect(suggestions.slice(0, DEFAULT_CROPS.length)).toEqual(DEFAULT_CROPS);
    expect(suggestions).toContain("Fiğ");
    expect(suggestions.filter((name) => name.toLocaleLowerCase("tr-TR") === "nohut")).toHaveLength(1);
    expect(suggestions.filter((name) => name === "Buğday")).toHaveLength(1);
  });

  it("yerleşik ekinleri İngilizce girdiden Türkçe kanonik ada dönüştürür", () => {
    expect(canonicalCropName("wHEAT", "en")).toBe("Buğday");
    expect(canonicalCropName("ALFALFA", "en")).toBe("Yonca");
    expect(canonicalCropName("5-way MIX", "en")).toBe("5'li Mix");
    expect(displayCropName("Buğday", "en")).toBe("Wheat");
    expect(displayCropName("5'li Mix", "en")).toBe("5-Way Mix");
  });

  it("kullanıcı ekinlerini başlık biçimine getirirken yerleşik özel yazımları korur", () => {
    expect(canonicalCropName("  NOHUT   ÇEŞİDİ ")).toBe("Nohut Çeşidi");
    expect(canonicalCropName("italian ryegrass", "en")).toBe("Italian Ryegrass");
    expect(canonicalCropName("5'Lİ MIX")).toBe("5'li Mix");
  });
});
