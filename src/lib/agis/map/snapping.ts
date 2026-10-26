import type { FieldRecord } from "@/lib/agis/fields/types";

type PixelPoint = { x: number; y: number };
type Project = (lng: number, lat: number) => PixelPoint;
type Unproject = (x: number, y: number) => { lng: number; lat: number };

function squaredDistance(a: PixelPoint, b: PixelPoint) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

function closestPointOnSegment(point: PixelPoint, start: PixelPoint, end: PixelPoint) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared === 0) return start;
  const ratio = Math.max(0, Math.min(1,
    ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared,
  ));
  return { x: start.x + ratio * dx, y: start.y + ratio * dy };
}

export function findFieldSnapPosition({
  pointer,
  fields,
  project,
  unproject,
  tolerancePx = 24,
  excludedId,
}: {
  pointer: PixelPoint;
  fields: FieldRecord[];
  project: Project;
  unproject: Unproject;
  tolerancePx?: number;
  excludedId?: string;
}): [number, number] | undefined {
  const toleranceSquared = tolerancePx * tolerancePx;
  let closestVertex: PixelPoint | null = null;
  let closestVertexDistance = toleranceSquared;
  let closestEdge: PixelPoint | null = null;
  let closestEdgeDistance = toleranceSquared;

  for (const field of fields) {
    if (field.id === excludedId) continue;
    for (const ring of field.geometry.coordinates) {
      const projected = ring.flatMap((coordinate) => {
        const lng = coordinate[0];
        const lat = coordinate[1];
        return typeof lng === "number" && typeof lat === "number"
          ? [project(lng, lat)]
          : [];
      });
      for (const vertex of projected) {
        const distance = squaredDistance(pointer, vertex);
        if (distance <= closestVertexDistance) {
          closestVertex = vertex;
          closestVertexDistance = distance;
        }
      }
      for (let index = 0; index < projected.length - 1; index += 1) {
        const start = projected[index];
        const end = projected[index + 1];
        if (!start || !end) continue;
        const candidate = closestPointOnSegment(pointer, start, end);
        const distance = squaredDistance(pointer, candidate);
        if (distance <= closestEdgeDistance) {
          closestEdge = candidate;
          closestEdgeDistance = distance;
        }
      }
    }
  }

  const snapped = closestVertex ?? closestEdge;
  if (!snapped) return undefined;
  const coordinate = unproject(snapped.x, snapped.y);
  return [coordinate.lng, coordinate.lat];
}
