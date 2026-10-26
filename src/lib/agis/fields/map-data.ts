import pointOnFeature from "@turf/point-on-feature";
import { featureCollection, polygon } from "@turf/helpers";
import type { Feature, FeatureCollection, Point, Polygon } from "geojson";

import { displayCropName, normalizeCropName } from "@/lib/agis/fields/crops";
import type { FieldRecord } from "@/lib/agis/fields/types";
import type { Locale } from "@/lib/agis/i18n";

const cropColors = [
  "#c88b2d",
  "#6f9d43",
  "#b4623f",
  "#4b8a76",
  "#8d6ca8",
  "#d3a638",
  "#5282a1",
  "#a76d76",
  "#287f9c",
  "#9a7040",
  "#648b32",
  "#bf5f83",
  "#5e73b4",
  "#a95a34",
  "#3f927e",
  "#81704d",
] as const;

function hash(value: string) {
  let result = 0;
  for (const character of value) {
    result = (result * 31 + character.charCodeAt(0)) >>> 0;
  }
  return result;
}

export function cropColor(cropName: string | null) {
  if (!cropName?.trim()) return "#789184";
  return cropColors[hash(normalizeCropName(cropName)) % cropColors.length]!;
}

export function fieldFeatureCollection(
  fields: FieldRecord[],
  selectedId: string | null,
  excludedId?: string,
): FeatureCollection<Polygon> {
  return featureCollection(
    fields
      .filter((field) => field.id !== excludedId)
      .map((field) => ({
        type: "Feature" as const,
        id: field.id,
        geometry: field.geometry,
        properties: {
          id: field.id,
          selected: field.id === selectedId,
          fill: cropColor(field.cropName),
          line: cropColor(field.cropName),
        },
      })),
  );
}

export function labelFeatureCollection(
  fields: FieldRecord[],
  locale: Locale = "tr",
): FeatureCollection<Point> {
  const labels: Feature<Point>[] = fields.flatMap((field) => {
    if (!field.cropName) return [];
    const point = pointOnFeature(polygon(field.geometry.coordinates));
    return [
      {
        ...point,
        id: `label-${field.id}`,
        properties: {
          crop: displayCropName(field.cropName, locale),
          short: displayCropName(field.cropName, locale).charAt(0).toLocaleUpperCase(locale === "en" ? "en-US" : "tr-TR"),
        },
      },
    ];
  });
  return featureCollection(labels);
}

export function uniqueCropLegend(fields: FieldRecord[], locale: Locale = "tr") {
  const crops = new Map<
    string,
    { name: string; color: string; fieldCount: number; totalAreaSqm: number }
  >();

  for (const field of fields) {
    const name = field.cropName?.trim();
    if (!name) continue;

    const key = normalizeCropName(name);
    const current = crops.get(key);
    if (current) {
      current.fieldCount += 1;
      current.totalAreaSqm += Number.isFinite(field.areaSqm) ? field.areaSqm : 0;
      continue;
    }

    crops.set(key, {
      name: displayCropName(name, locale),
      color: cropColor(name),
      fieldCount: 1,
      totalAreaSqm: Number.isFinite(field.areaSqm) ? field.areaSqm : 0,
    });
  }

  return [...crops.values()]
    .map((crop) => ({ ...crop, totalDekar: crop.totalAreaSqm / 1000 }))
    .sort((first, second) => first.name.localeCompare(second.name, locale === "en" ? "en-US" : "tr-TR"));
}

export function cropLegendTotals(legend: ReturnType<typeof uniqueCropLegend>) {
  return legend.reduce(
    (total, item) => ({
      fieldCount: total.fieldCount + item.fieldCount,
      totalDekar: total.totalDekar + item.totalDekar,
    }),
    { fieldCount: 0, totalDekar: 0 },
  );
}
