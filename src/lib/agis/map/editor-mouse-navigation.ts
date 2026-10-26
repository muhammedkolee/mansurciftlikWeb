import type { Map as MapLibreMap } from "maplibre-gl";

type EditorMouseNavigationOptions = {
  canvas: HTMLCanvasElement;
  map: Pick<MapLibreMap, "setCenter" | "stop" | "unproject">;
  isEditorActive: () => boolean;
};

type MiddleDrag = {
  pointerId: number;
  clientX: number;
  clientY: number;
};

/**
 * Çizim sırasında sol fare hareketinin MapLibre pan hareketine dönüşmesini
 * engeller. Harita, fare kullanan cihazlarda orta tuş sürüklemesiyle taşınır;
 * dokunmatik MapLibre hareketleri etkilenmez.
 */
export function installEditorMouseNavigation({
  canvas,
  map,
  isEditorActive,
}: EditorMouseNavigationOptions) {
  let middleDrag: MiddleDrag | null = null;

  const handleMouseDown = (event: MouseEvent) => {
    if (!isEditorActive()) return;

    if (event.button === 0) {
      // Terra Draw pointer olaylarını almaya devam eder; yalnızca MapLibre'ın
      // aynı hareketi sol tuşla pan olarak yorumlaması engellenir.
      event.stopImmediatePropagation();
    } else if (event.button === 1) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };

  const handlePointerDown = (event: PointerEvent) => {
    if (!isEditorActive() || event.pointerType !== "mouse" || event.button !== 1) {
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();
    map.stop();
    middleDrag = {
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
    };
    canvas.setPointerCapture?.(event.pointerId);
    canvas.style.cursor = "grabbing";
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (!middleDrag || middleDrag.pointerId !== event.pointerId) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    const deltaX = event.clientX - middleDrag.clientX;
    const deltaY = event.clientY - middleDrag.clientY;
    middleDrag.clientX = event.clientX;
    middleDrag.clientY = event.clientY;

    const bounds = canvas.getBoundingClientRect();
    const nextCenter = map.unproject([
      bounds.width / 2 - deltaX,
      bounds.height / 2 - deltaY,
    ]);
    map.setCenter(nextCenter);
    canvas.style.cursor = "grabbing";
  };

  const endMiddleDrag = (event: PointerEvent) => {
    if (!middleDrag || middleDrag.pointerId !== event.pointerId) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    if (canvas.hasPointerCapture?.(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }
    middleDrag = null;
    canvas.style.cursor = isEditorActive() ? "crosshair" : "";
  };

  const preventMiddleAuxClick = (event: MouseEvent) => {
    if (isEditorActive() && event.button === 1) event.preventDefault();
  };

  canvas.addEventListener("mousedown", handleMouseDown, true);
  canvas.addEventListener("pointerdown", handlePointerDown, true);
  canvas.addEventListener("pointermove", handlePointerMove, true);
  canvas.addEventListener("pointerup", endMiddleDrag, true);
  canvas.addEventListener("pointercancel", endMiddleDrag, true);
  canvas.addEventListener("auxclick", preventMiddleAuxClick, true);

  return () => {
    canvas.removeEventListener("mousedown", handleMouseDown, true);
    canvas.removeEventListener("pointerdown", handlePointerDown, true);
    canvas.removeEventListener("pointermove", handlePointerMove, true);
    canvas.removeEventListener("pointerup", endMiddleDrag, true);
    canvas.removeEventListener("pointercancel", endMiddleDrag, true);
    canvas.removeEventListener("auxclick", preventMiddleAuxClick, true);
  };
}
