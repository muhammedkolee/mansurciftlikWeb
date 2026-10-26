import area from "@turf/area";
import booleanValid from "@turf/boolean-valid";
import kinks from "@turf/kinks";
import { polygon } from "@turf/helpers";
import type { Feature, Polygon, Position } from "geojson";
import { languageTag, type Locale } from "@/lib/agis/i18n";

const MIN_AREA_SQM = 0.01;

export type GeometryValidation =
  | { valid: true; polygon: Polygon; areaSqm: number }
  | { valid: false; error: string; areaSqm: 0 };

function positionsEqual(a: Position, b: Position) {
  return a[0] === b[0] && a[1] === b[1];
}

function validPosition(position: Position) {
  const [lng, lat] = position;
  return (
    position.length >= 2 &&
    typeof lng === "number" &&
    typeof lat === "number" &&
    Number.isFinite(lng) &&
    Number.isFinite(lat) &&
    lng >= -180 &&
    lng <= 180 &&
    lat >= -90 &&
    lat <= 90
  );
}

export function normalizePolygon(input: Polygon): Polygon {
  const coordinates = input.coordinates.map((ring) => {
    const cleaned = ring.reduce<Position[]>((result, current) => {
      const previous = result.at(-1);
      if (!previous || !positionsEqual(previous, current)) {
        const [lng, lat] = current;
        if (typeof lng === "number" && typeof lat === "number") {
          result.push([lng, lat]);
        }
      }
      return result;
    }, []);

    const first = cleaned[0];
    const last = cleaned.at(-1);
    if (first && last && !positionsEqual(first, last)) {
      cleaned.push([...first]);
    }
    return cleaned;
  });

  return { type: "Polygon", coordinates };
}

export function validateFieldPolygon(input: Polygon): GeometryValidation {
  if (!input || input.type !== "Polygon" || input.coordinates.length === 0) {
    return { valid: false, error: "Kapalı bir tarla sınırı çizin.", areaSqm: 0 };
  }

  const normalized = normalizePolygon(input);
  const outerRing = normalized.coordinates[0];
  if (!outerRing || outerRing.length < 4) {
    return {
      valid: false,
      error: "Tarla sınırı için en az üç farklı nokta gerekli.",
      areaSqm: 0,
    };
  }

  const uniquePoints = new Set(
    outerRing.slice(0, -1).map(([lng, lat]) => `${lng}:${lat}`),
  );
  if (uniquePoints.size < 3) {
    return {
      valid: false,
      error: "Tarla sınırı için en az üç farklı nokta gerekli.",
      areaSqm: 0,
    };
  }

  if (normalized.coordinates.some((ring) => ring.some((p) => !validPosition(p)))) {
    return {
      valid: false,
      error: "Tarla sınırında geçersiz koordinatlar var.",
      areaSqm: 0,
    };
  }

  let feature: Feature<Polygon>;
  try {
    feature = polygon(normalized.coordinates);
  } catch {
    return { valid: false, error: "Tarla sınırı oluşturulamadı.", areaSqm: 0 };
  }

  if (!booleanValid(feature) || kinks(feature).features.length > 0) {
    return {
      valid: false,
      error: "Tarla sınırı kendi üzerinden geçemez veya kesişemez.",
      areaSqm: 0,
    };
  }

  const areaSqm = area(feature);
  if (!Number.isFinite(areaSqm) || areaSqm <= MIN_AREA_SQM) {
    return {
      valid: false,
      error: "Tarla sınırının ölçülebilir bir alanı olmalı.",
      areaSqm: 0,
    };
  }

  return { valid: true, polygon: normalized, areaSqm };
}

export function formatArea(areaSqm: number, locale: Locale = "tr") {
  if (areaSqm >= 1000) {
    return `${new Intl.NumberFormat(languageTag(locale), { maximumFractionDigits: 2 }).format(areaSqm / 1000)} da`;
  }
  return `${new Intl.NumberFormat(languageTag(locale), { maximumFractionDigits: 0 }).format(areaSqm)} m²`;
}
