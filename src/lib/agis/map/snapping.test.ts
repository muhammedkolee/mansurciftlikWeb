import { describe, expect, it } from "vitest";

import type { FieldRecord } from "@/lib/agis/fields/types";
import { findFieldSnapPosition } from "./snapping";

const field: FieldRecord = {
  id: "11111111-1111-4111-8111-111111111111",
  name: "Komşu Tarla",
  description: null,
  geometry: {
    type: "Polygon",
    coordinates: [[[32, 39], [32.1, 39], [32.1, 39.1], [32, 39]]],
  },
  areaSqm: 1_000,
  cropName: null,
  amountKg: null,
  plantedAt: null,
  season: null,
  plantingId: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("tarla sınırı yakalama hedefleri", () => {
  const project = (lng: number, lat: number) => ({ x: lng * 1_000, y: lat * 1_000 });
  const unproject = (x: number, y: number) => ({ lng: x / 1_000, lat: y / 1_000 });

  it("tolerans içindeki tarla köşesine yakalar", () => {
    expect(findFieldSnapPosition({
      pointer: { x: 32_002, y: 39_001 }, fields: [field], project, unproject,
    })).toEqual([32, 39]);
  });

  it("köşeden uzakta fakat sınır yakınındayken en yakın kenar noktasına yakalar", () => {
    expect(findFieldSnapPosition({
      pointer: { x: 32_050, y: 39_001 }, fields: [field], project, unproject,
    })).toEqual([32.05, 39]);
  });

  it("düzenlenen tarlayı kendi sınırına yakalama hedeflerinden çıkarır", () => {
    expect(findFieldSnapPosition({
      pointer: { x: 32_002, y: 39_001 }, fields: [field], project, unproject,
      excludedId: field.id,
    })).toBeUndefined();
  });

  it("piksel toleransı dışındaki konumu değiştirmez", () => {
    expect(findFieldSnapPosition({
      pointer: { x: 32_500, y: 39_500 }, fields: [field], project, unproject,
    })).toBeUndefined();
  });
});
