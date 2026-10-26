import { describe, expect, it } from "vitest";

import {
  availablePlantingYears,
  fieldPlantingRows,
  formatSeedRate,
  seedKgPerDekar,
  sortPlantingsNewestFirst,
  syncPlantingsWithField,
} from "./plantings";
import type { FieldRecord, PlantingRecord } from "./types";

const field: FieldRecord = {
  id: "11111111-1111-4111-8111-111111111111",
  name: "Kavaklı Tarla",
  description: null,
  geometry: {
    type: "Polygon",
    coordinates: [[[32, 39], [32.01, 39], [32.01, 39.01], [32, 39]]],
  },
  areaSqm: 10_000,
  cropName: "Buğday",
  amountKg: 180,
  plantedAt: "2026-10-01",
  season: "2026 Güz",
  plantingId: "current",
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2026-10-01T00:00:00Z",
};

function planting(
  id: string,
  plantedAt: string | null,
  createdAt: string,
): PlantingRecord {
  return {
    id,
    fieldId: "11111111-1111-4111-8111-111111111111",
    cropName: "Buğday",
    amountKg: 20,
    plantedAt,
    season: null,
    isCurrent: false,
    createdAt,
    updatedAt: createdAt,
  };
}

describe("ekim hesapları", () => {
  it("dekara düşen tohum miktarını gerçek alan üzerinden hesaplar", () => {
    expect(seedKgPerDekar(75, 15_000)).toBe(5);
    expect(formatSeedRate(75, 15_000)).toBe("5 kg/da");
  });

  it("sıfır kg değerini geçerli kabul eder", () => {
    expect(seedKgPerDekar(0, 2_000)).toBe(0);
  });

  it("miktar veya geçerli alan yoksa bölme yapmaz", () => {
    expect(seedKgPerDekar(null, 1_000)).toBeNull();
    expect(seedKgPerDekar(20, 0)).toBeNull();
    expect(seedKgPerDekar(20, Number.NaN)).toBeNull();
  });

  it("ekim tarihini, tarih yoksa oluşturulma zamanını kullanarak yeniden eskiye sıralar", () => {
    const sorted = sortPlantingsNewestFirst([
      planting("old", "2024-10-01", "2025-01-01T00:00:00Z"),
      planting("fallback", null, "2025-11-01T00:00:00Z"),
      planting("new", "2026-03-10", "2026-01-01T00:00:00Z"),
    ]);
    expect(sorted.map((item) => item.id)).toEqual(["new", "fallback", "old"]);
  });

  it("yıl seçeneklerini yeniden eskiye sıralar ve geçmiş kaydı seçilen yılda gösterir", () => {
    const records = [
      { ...planting("current", "2026-10-01", "2026-10-01T00:00:00Z"), isCurrent: true },
      { ...planting("old", "2025-04-23", "2025-04-23T00:00:00Z"), cropName: "Arpa" },
    ];

    expect(availablePlantingYears(records)).toEqual(["2026", "2025"]);
    const rows = fieldPlantingRows([field], records, "2025");
    expect(rows).toHaveLength(1);
    expect(rows[0]?.planting?.id).toBe("old");
    expect(rows[0]?.planting?.cropName).toBe("Arpa");
  });

  it("yeni güncel ekimi eklerken önceki güncel kaydı geçmişte korur", () => {
    const oldCurrent = { ...planting("old-current", "2025-04-23", "2025-04-23T00:00:00Z"), isCurrent: true };
    const nextField = { ...field, plantingId: "new-current", cropName: "Arpa", plantedAt: "2026-04-19" };
    const synced = syncPlantingsWithField([oldCurrent], nextField);

    expect(synced).toHaveLength(2);
    expect(synced.find((item) => item.id === "old-current")?.isCurrent).toBe(false);
    expect(synced.find((item) => item.id === "new-current")).toMatchObject({
      cropName: "Arpa",
      isCurrent: true,
      plantedAt: "2026-04-19",
    });
    expect(synced.filter((item) => item.isCurrent)).toHaveLength(1);
  });
});
