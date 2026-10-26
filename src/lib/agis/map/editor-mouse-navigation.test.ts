import { beforeEach, describe, expect, it, vi } from "vitest";

import { installEditorMouseNavigation } from "./editor-mouse-navigation";

function pointerEvent(
  type: string,
  values: { button: number; clientX: number; clientY: number; pointerId: number },
) {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    button: values.button,
    clientX: values.clientX,
    clientY: values.clientY,
  });
  Object.defineProperties(event, {
    pointerId: { value: values.pointerId },
    pointerType: { value: "mouse" },
  });
  return event as unknown as PointerEvent;
}

describe("çizim fare navigasyonu", () => {
  let canvas: HTMLCanvasElement;
  let active: boolean;
  const setCenter = vi.fn();
  const stop = vi.fn();
  const unproject = vi.fn(([x, y]: [number, number]) => ({ lng: x, lat: y }));

  beforeEach(() => {
    canvas = document.createElement("canvas");
    active = true;
    setCenter.mockClear();
    stop.mockClear();
    unproject.mockClear();
    vi.spyOn(canvas, "getBoundingClientRect").mockReturnValue({
      width: 400,
      height: 300,
      left: 0,
      right: 400,
      top: 0,
      bottom: 300,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
  });

  it("çizim sırasında sol tuşun MapLibre pan dinleyicisine ulaşmasını engeller", () => {
    const remove = installEditorMouseNavigation({
      canvas,
      map: { setCenter, stop, unproject } as never,
      isEditorActive: () => active,
    });
    const mapPanListener = vi.fn();
    canvas.addEventListener("mousedown", mapPanListener);

    canvas.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, button: 0 }));
    expect(mapPanListener).not.toHaveBeenCalled();

    active = false;
    canvas.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, button: 0 }));
    expect(mapPanListener).toHaveBeenCalledOnce();
    remove();
  });

  it("orta tuş sürüklemesini harita merkez hareketine çevirir", () => {
    const remove = installEditorMouseNavigation({
      canvas,
      map: { setCenter, stop, unproject } as never,
      isEditorActive: () => active,
    });

    canvas.dispatchEvent(
      pointerEvent("pointerdown", {
        button: 1,
        clientX: 100,
        clientY: 80,
        pointerId: 7,
      }),
    );
    canvas.dispatchEvent(
      pointerEvent("pointermove", {
        button: 1,
        clientX: 120,
        clientY: 95,
        pointerId: 7,
      }),
    );

    expect(stop).toHaveBeenCalledOnce();
    expect(unproject).toHaveBeenCalledWith([180, 135]);
    expect(setCenter).toHaveBeenCalledWith({ lng: 180, lat: 135 });
    remove();
  });
});
