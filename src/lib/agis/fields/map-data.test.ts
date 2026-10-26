import { describe, expect, it } from "vitest";
import type { Polygon } from "geojson";

import { cropColor, cropLegendTotals, fieldFeatureCollection, labelFeatureCollection, uniqueCropLegend } from "./map-data";
import type { FieldRecord } from "./types";

const geometry: Polygon = {
  type: "Polygon",
  coordinates: [[[32, 39], [32.01, 39], [32, 39.01], [32, 39]]],
};

function field(id: string, cropName: string | null, areaSqm: number): FieldRecord {
  return {
    id,
    name: null,
    description: null,
    geometry,
    areaSqm,
    cropName,
    amountKg: null,
    plantedAt: null,
    season: null,
    plantingId: null,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  };
}

describe("harita ekin verileri", () => {
  it("tarla dolgu ve sınır rengini ekinden üretir", () => {
    const collection = fieldFeatureCollection([field("1", "Reygrass", 1000)], null);
    expect(collection.features[0]?.properties).toMatchObject({
      fill: cropColor("Reygrass"),
      line: cropColor("Reygrass"),
    });
  });

  it("aynı ekini tarla sayısı ve toplam dekarıyla birleştirir", () => {
    const legend = uniqueCropLegend([
      field("1", "Reygrass", 12_000),
      field("2", " reygrass ", 23_600),
      field("3", "Mısır", 4_000),
      field("4", null, 8_000),
    ]);

    expect(legend).toHaveLength(2);
    expect(legend.find((item) => item.name === "Reygrass")).toMatchObject({
      fieldCount: 2,
      totalAreaSqm: 35_600,
      totalDekar: 35.6,
    });
    expect(cropLegendTotals(legend)).toEqual({ fieldCount: 3, totalDekar: 39.6 });
  });

  it("İngilizce arayüzde yerleşik ekin adlarını çevirir, renk anahtarını değiştirmez", () => {
    const fields = [field("1", "Buğday", 1_000)];
    expect(uniqueCropLegend(fields, "en")[0]).toMatchObject({ name: "Wheat" });
    expect(labelFeatureCollection(fields, "en").features[0]?.properties).toMatchObject({ crop: "Wheat", short: "W" });
    expect(cropColor("Buğday")).toBe(cropColor("Wheat"));
  });
});
