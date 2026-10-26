import { describe, expect, it } from "vitest";
import type { Polygon } from "geojson";

import { formatArea, normalizePolygon, validateFieldPolygon } from "./geometry";

const validPolygon: Polygon = {
  type: "Polygon",
  coordinates: [
    [
      [32.85, 39.92],
      [32.851, 39.92],
      [32.851, 39.921],
      [32.85, 39.921],
      [32.85, 39.92],
    ],
  ],
};

describe("tarla geometrisi", () => {
  it("geçerli bir polygonun alanını hesaplar", () => {
    const result = validateFieldPolygon(validPolygon);
    expect(result.valid).toBe(true);
    if (result.valid) expect(result.areaSqm).toBeGreaterThan(1);
  });

  it("açık halkayı otomatik kapatır", () => {
    const open: Polygon = {
      type: "Polygon",
      coordinates: [[[32.85, 39.92], [32.851, 39.92], [32.851, 39.921]]],
    };
    const normalized = normalizePolygon(open);
    expect(normalized.coordinates[0]?.at(-1)).toEqual(normalized.coordinates[0]?.[0]);
  });

  it("üçten az farklı noktayı reddeder", () => {
    const invalid: Polygon = {
      type: "Polygon",
      coordinates: [[[32.85, 39.92], [32.851, 39.92], [32.85, 39.92]]],
    };
    const result = validateFieldPolygon(invalid);
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.error).toContain("en az üç");
  });

  it("kendini kesen sınırı reddeder", () => {
    const bowTie: Polygon = {
      type: "Polygon",
      coordinates: [
        [
          [32.85, 39.92],
          [32.852, 39.922],
          [32.85, 39.922],
          [32.852, 39.92],
          [32.85, 39.92],
        ],
      ],
    };
    const result = validateFieldPolygon(bowTie);
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.error).toContain("kesişemez");
  });

  it("sıfır alanlı polygonu reddeder", () => {
    const flat: Polygon = {
      type: "Polygon",
      coordinates: [
        [[32.85, 39.92], [32.851, 39.92], [32.852, 39.92], [32.85, 39.92]],
      ],
    };
    expect(validateFieldPolygon(flat).valid).toBe(false);
  });

  it("alanı dekar ve metrekare olarak biçimlendirir", () => {
    expect(formatArea(1500)).toContain("da");
    expect(formatArea(850)).toContain("m²");
  });
});
