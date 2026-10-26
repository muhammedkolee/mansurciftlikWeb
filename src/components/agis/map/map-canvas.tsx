"use client";

import { useEffect, useRef, useState } from "react";
import bbox from "@turf/bbox";
import { featureCollection } from "@turf/helpers";
import type { Feature, FeatureCollection, LineString, Point, Polygon, Position } from "geojson";
import {
  Check,
  Crosshair,
  LocateFixed,
  Magnet,
  Map as MapIcon,
  Redo2,
  Satellite,
  Undo2,
  X,
} from "lucide-react";
import * as maplibregl from "maplibre-gl";
import type {
  GeoJSONSource,
  Map as MapLibreMap,
  MapLayerMouseEvent,
  StyleSpecification,
} from "maplibre-gl";
import {
  TerraDraw,
  TerraDrawModeUndoRedo,
  TerraDrawPolygonMode,
  TerraDrawSelectMode,
  ValidateNotSelfIntersecting,
  type GeoJSONStoreFeatures,
} from "terra-draw";
import { TerraDrawMapLibreGLAdapter } from "terra-draw-maplibre-gl-adapter";

import { useLanguage } from "@/components/agis/i18n/language-provider";
import {
  fieldFeatureCollection,
  labelFeatureCollection,
} from "@/lib/agis/fields/map-data";
import type { FieldRecord } from "@/lib/agis/fields/types";
import type { MapConfig, MapProvider, PlaceSearchResult } from "@/lib/agis/map/config";
import { installEditorMouseNavigation } from "@/lib/agis/map/editor-mouse-navigation";
import {
  extractHttpStatus,
  providerFallbackMessage,
  registerProviderError,
} from "@/lib/agis/map/provider-health";
import { findFieldSnapPosition } from "@/lib/agis/map/snapping";
import { pick, type Locale } from "@/lib/agis/i18n";

const NORMAL_STYLE = "https://tiles.openfreemap.org/styles/liberty";
const SOURCE_ID = "agis-fields";
const LABEL_SOURCE_ID = "agis-labels";
const DRAFT_SOURCE_ID = "agis-draft";

const OVERLAY_LAYER_IDS = [
  "agis-fields-fill",
  "agis-fields-line-halo",
  "agis-fields-line",
  "agis-field-labels",
  "agis-draft-fill",
  "agis-draft-line",
  "td-polygon",
  "td-polygon-outline",
  "td-linestring",
  "td-point",
  "td-point-marker",
  "agis-draft-points",
] as const;

export type EditorMode = "idle" | "create" | "edit";

type Props = {
  fields: FieldRecord[];
  editorMode: EditorMode;
  editField: FieldRecord | null;
  selectedId: string | null;
  showCropLabels: boolean;
  focusRequest: { id: string; nonce: number } | null;
  placeFocusRequest: { result: PlaceSearchResult; nonce: number } | null;
  mapConfig: MapConfig;
  draftGeometry: Polygon | null;
  onMapNotice: (message: string) => void;
  onDraftChange: (geometry: Polygon | null) => void;
  onDraftComplete: (geometry: Polygon) => void;
  onDrawError: (message: string | null) => void;
  onCancelEditor: () => void;
  onSelectField: (id: string) => void;
};

export function resolveMapStyle(provider: MapProvider, config: MapConfig): StyleSpecification | string {
  if (provider === "normal") return NORMAL_STYLE;
  if (provider === "arcgis") return config.arcgis?.styleUrl ?? NORMAL_STYLE;
  if (!config.mapTiler) return NORMAL_STYLE;
  if (config.mapTiler.styleUrl) return config.mapTiler.styleUrl;
  return {
    version: 8,
    glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
    sources: {
      satellite: {
        type: "raster",
        tiles: [config.mapTiler.tileUrl],
        tileSize: 256,
        attribution: config.mapTiler.attribution,
      },
    },
    layers: [{ id: "satellite", type: "raster", source: "satellite" }],
  };
}

function polygonFromFeature(feature: GeoJSONStoreFeatures | undefined) {
  if (feature?.geometry.type !== "Polygon") return null;
  return { type: "Polygon", coordinates: feature.geometry.coordinates } as Polygon;
}

function editablePolygon(draw: TerraDraw, preferredId?: string) {
  if (preferredId) {
    const preferredFeature = draw.getSnapshotFeature(preferredId);
    const preferred = preferredFeature?.properties.mode === "polygon"
      ? polygonFromFeature(preferredFeature)
      : null;
    if (preferred) return preferred;
  }
  const candidate = draw
    .getSnapshot()
    .filter((feature) => feature.geometry.type === "Polygon" && feature.properties.mode === "polygon")
    .sort((a, b) => {
      const aSize = a.geometry.type === "Polygon" ? a.geometry.coordinates[0]?.length ?? 0 : 0;
      const bSize = b.geometry.type === "Polygon" ? b.geometry.coordinates[0]?.length ?? 0 : 0;
      return bSize - aSize;
    })[0];
  return polygonFromFeature(candidate);
}

function fitGeometry(map: MapLibreMap, geometry: Polygon, padding = 80) {
  const [west, south, east, north] = bbox({
    type: "Feature",
    properties: {},
    geometry,
  });
  map.fitBounds(
    [
      [west, south],
      [east, north],
    ],
    { padding, maxZoom: 17, duration: 700 },
  );
}

function emptyFeatureCollection(): FeatureCollection {
  return { type: "FeatureCollection", features: [] };
}

function draftFeatureCollection(geometry: Polygon | null): FeatureCollection {
  if (!geometry) return emptyFeatureCollection();

  const ring = geometry.coordinates[0] ?? [];
  const seen = new Set<string>();
  const points: Feature<Point>[] = [];
  const coordinates: Position[] = [];

  for (const coordinate of ring) {
    const key = `${coordinate[0]}:${coordinate[1]}`;
    if (seen.has(key)) continue;
    seen.add(key);
    coordinates.push(coordinate as Position);
    points.push({
      type: "Feature",
      properties: { kind: "vertex" },
      geometry: { type: "Point", coordinates: coordinate as Position },
    });
  }

  const shapes: Array<Feature<Polygon> | Feature<LineString>> = [];
  const first = ring[0];
  const last = ring.at(-1);
  const isClosed =
    ring.length >= 4 &&
    first?.[0] === last?.[0] &&
    first?.[1] === last?.[1];

  if (isClosed) {
    shapes.push({
      type: "Feature",
      properties: { kind: "polygon" },
      geometry,
    });
  } else if (coordinates.length >= 2) {
    shapes.push({
      type: "Feature",
      properties: { kind: "line" },
      geometry: { type: "LineString", coordinates },
    });
  }

  return {
    type: "FeatureCollection",
    features: [...shapes, ...points],
  };
}

function setDraftOverlay(map: MapLibreMap, geometry: Polygon | null) {
  const source = map.getSource(DRAFT_SOURCE_ID) as GeoJSONSource | undefined;
  source?.setData(draftFeatureCollection(geometry));
}

function bringOverlaysToFront(map: MapLibreMap) {
  for (const layerId of OVERLAY_LAYER_IDS) {
    if (map.getLayer(layerId)) map.moveLayer(layerId);
  }
}

function addFieldLayers(
  map: MapLibreMap,
  fields: FieldRecord[],
  selectedId: string | null,
  showCropLabels: boolean,
  locale: Locale,
  excludedId?: string,
) {
  const fieldData = fieldFeatureCollection(
    fields,
    selectedId,
    excludedId,
  );
  const labelData = labelFeatureCollection(fields.filter((field) => field.id !== excludedId), locale);

  map.addSource(SOURCE_ID, { type: "geojson", data: fieldData });
  map.addLayer({
    id: "agis-fields-fill",
    type: "fill",
    source: SOURCE_ID,
    paint: {
      "fill-color": ["get", "fill"],
      "fill-opacity": ["case", ["boolean", ["get", "selected"], false], 0.48, 0.32],
    },
  });
  map.addLayer({
    id: "agis-fields-line-halo",
    type: "line",
    source: SOURCE_ID,
    paint: {
      "line-color": "#f5f7e9",
      "line-width": ["case", ["boolean", ["get", "selected"], false], 8, 6],
      "line-opacity": 0.82,
    },
  });
  map.addLayer({
    id: "agis-fields-line",
    type: "line",
    source: SOURCE_ID,
    paint: {
      "line-color": ["get", "line"],
      "line-width": ["case", ["boolean", ["get", "selected"], false], 5, 3],
      "line-opacity": 1,
    },
  });

  map.addSource(LABEL_SOURCE_ID, { type: "geojson", data: labelData });
  map.addLayer({
    id: "agis-field-labels",
    type: "symbol",
    source: LABEL_SOURCE_ID,
    layout: {
      visibility: showCropLabels ? "visible" : "none",
      "text-field": ["step", ["zoom"], ["get", "short"], 11, ["get", "crop"]],
      "text-size": ["interpolate", ["linear"], ["zoom"], 7, 11, 15, 14],
      "text-font": ["Noto Sans Regular"],
      "text-allow-overlap": false,
      "text-padding": 8,
    },
    paint: {
      "text-color": "#16362a",
      "text-halo-color": "#f7f5ec",
      "text-halo-width": 2,
    },
  });

  map.addSource(DRAFT_SOURCE_ID, { type: "geojson", data: emptyFeatureCollection() });
  map.addLayer({
    id: "agis-draft-fill",
    type: "fill",
    source: DRAFT_SOURCE_ID,
    filter: ["==", ["geometry-type"], "Polygon"],
    paint: {
      "fill-color": "#7fbe6b",
      "fill-opacity": 0.34,
    },
  });
  map.addLayer({
    id: "agis-draft-line",
    type: "line",
    source: DRAFT_SOURCE_ID,
    paint: {
      "line-color": "#0d6b38",
      "line-width": 4,
      "line-opacity": 1,
    },
  });
  map.addLayer({
    id: "agis-draft-points",
    type: "circle",
    source: DRAFT_SOURCE_ID,
    filter: ["==", ["geometry-type"], "Point"],
    paint: {
      "circle-radius": 8,
      "circle-color": "#fff4ae",
      "circle-stroke-color": "#0d6b38",
      "circle-stroke-width": 3,
      "circle-opacity": 1,
      "circle-stroke-opacity": 1,
    },
  });
}

type DrawCallbacks = Pick<Props, "onDraftChange" | "onDrawError">;

function configureDrawForEditor(
  draw: TerraDraw,
  map: MapLibreMap,
  editorMode: EditorMode,
  editField: FieldRecord | null,
  draftGeometry: Polygon | null,
  callbacks: DrawCallbacks,
  locale: Locale,
) {
  draw.clear();
  setDraftOverlay(map, null);

  if (editorMode === "create") {
    if (draftGeometry && (draftGeometry.coordinates[0]?.length ?? 0) >= 4) {
      const draftId = draw.getFeatureId();
      const [validation] = draw.addFeatures([{
        type: "Feature",
        id: draftId,
        properties: { mode: "polygon" },
        geometry: draftGeometry,
      }]);
      if (validation?.valid) {
        draw.setMode("select");
        draw.selectFeature(draftId);
        setDraftOverlay(map, draftGeometry);
        callbacks.onDraftChange(draftGeometry);
        callbacks.onDrawError(null);
        return;
      }
    }
    draw.setMode("polygon");
    if (draftGeometry) {
      setDraftOverlay(map, draftGeometry);
      callbacks.onDraftChange(draftGeometry);
    } else {
      callbacks.onDraftChange(null);
    }
    callbacks.onDrawError(null);
    return;
  }

  if (editorMode === "edit" && editField) {
    const geometry = draftGeometry ?? editField.geometry;
    const editable: Feature<Polygon> = {
      type: "Feature",
      id: editField.id,
      properties: { mode: "polygon" },
      geometry,
    };
    const [validation] = draw.addFeatures([editable as GeoJSONStoreFeatures]);
    if (validation?.valid) {
      draw.setMode("select");
      draw.selectFeature(editField.id);
      setDraftOverlay(map, geometry);
      callbacks.onDraftChange(geometry);
      callbacks.onDrawError(null);
    } else {
      draw.setMode("static");
      callbacks.onDrawError(pick(locale, "Tarla sınırı düzenleme aracına yüklenemedi.", "The field boundary could not be loaded into the editing tool."));
    }
    return;
  }

  draw.setMode("static");
  callbacks.onDraftChange(null);
}

export default function MapCanvas({
  fields,
  editorMode,
  editField,
  selectedId,
  showCropLabels,
  focusRequest,
  placeFocusRequest,
  mapConfig,
  draftGeometry,
  onMapNotice,
  onDraftChange,
  onDraftComplete,
  onDrawError,
  onCancelEditor,
  onSelectField,
}: Props) {
  const { locale } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const drawRef = useRef<TerraDraw | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const searchMarkerRef = useRef<maplibregl.Marker | null>(null);
  const locationRef = useRef<[number, number] | null>(null);
  const cameraRef = useRef<{
    center: [number, number];
    zoom: number;
    bearing: number;
    pitch: number;
  } | null>(null);
  const callbacksRef = useRef({
    onDraftChange,
    onDraftComplete,
    onDrawError,
    onSelectField,
    onMapNotice,
  });
  const [snappingEnabled, setSnappingEnabled] = useState(true);
  const dataRef = useRef({
    fields,
    selectedId,
    showCropLabels,
    editorMode,
    editField,
    draftGeometry,
    snappingEnabled,
    locale,
  });
  const [baseMap, setBaseMap] = useState<MapProvider>(
    mapConfig.mapTiler ? "maptiler" : mapConfig.arcgis ? "arcgis" : "normal",
  );
  const [locationState, setLocationState] = useState<"idle" | "loading" | "ready" | "denied">("idle");
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    callbacksRef.current = {
      onDraftChange,
      onDraftComplete,
      onDrawError,
      onSelectField,
      onMapNotice,
    };
  }, [onDraftChange, onDraftComplete, onDrawError, onSelectField, onMapNotice]);

  useEffect(() => {
    dataRef.current = {
      fields,
      selectedId,
      showCropLabels,
      editorMode,
      editField,
      draftGeometry,
      snappingEnabled,
      locale,
    };
  }, [fields, selectedId, showCropLabels, editorMode, editField, draftGeometry, snappingEnabled, locale]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    delete container.dataset.mapReady;
    const savedCamera = cameraRef.current;
    maplibregl.setWorkerUrl("/maplibre-gl-worker.mjs");
    const map = new maplibregl.Map({
      container,
      style: resolveMapStyle(baseMap, mapConfig),
      center: savedCamera?.center ?? [35.25, 39],
      zoom: savedCamera?.zoom ?? 5.25,
      bearing: savedCamera?.bearing ?? 0,
      pitch: savedCamera?.pitch ?? 0,
      minZoom: 3,
      maxZoom: 20,
      attributionControl: baseMap === "arcgis" && mapConfig.arcgis
        ? { compact: true, customAttribution: mapConfig.arcgis.attribution }
        : { compact: true },
      cooperativeGestures: false,
    });
    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
    const removeEditorMouseNavigation = installEditorMouseNavigation({
      canvas: map.getCanvas(),
      map,
      isEditorActive: () => dataRef.current.editorMode !== "idle",
    });
    let providerErrorTimes: number[] = [];
    let providerFallbackHandled = false;
    map.on("error", (event) => {
      if (baseMap === "normal" || providerFallbackHandled || mapRef.current !== map) return;
      const result = registerProviderError(
        providerErrorTimes,
        extractHttpStatus(event.error),
        Date.now(),
      );
      providerErrorTimes = result.errors;
      if (!result.shouldFallback) return;

      providerFallbackHandled = true;
      callbacksRef.current.onMapNotice(providerFallbackMessage(baseMap, dataRef.current.locale));
      setBaseMap("normal");
    });
    const handleLoad = () => {
      const current = dataRef.current;
      addFieldLayers(
        map,
        current.fields,
        current.selectedId,
        current.showCropLabels,
        current.locale,
        current.editorMode === "edit" ? current.editField?.id : undefined,
      );

      const adapter = new TerraDrawMapLibreGLAdapter<MapLibreMap>({ map });
      const snapping = {
        toCustom: (
          event: { containerX: number; containerY: number },
          context: {
            project: (lng: number, lat: number) => { x: number; y: number };
            unproject: (x: number, y: number) => { lng: number; lat: number };
          },
        ) => {
          const latest = dataRef.current;
          if (!latest.snappingEnabled) return undefined;
          return findFieldSnapPosition({
            pointer: { x: event.containerX, y: event.containerY },
            fields: latest.fields,
            project: context.project,
            unproject: context.unproject,
            tolerancePx: 24,
            excludedId: latest.editorMode === "edit" ? latest.editField?.id : undefined,
          });
        },
        showSnappingPoint: true,
      };
      const draw = new TerraDraw({
        adapter,
        modes: [
          new TerraDrawPolygonMode({
            validation: ValidateNotSelfIntersecting,
            pointerDistance: 28,
            showCoordinatePoints: true,
            snapping,
            styles: {
              fillColor: "#7cab68",
              fillOpacity: 0.28,
              outlineColor: "#205c3b",
              outlineWidth: 3,
              coordinatePointColor: "#f7f4e8",
              coordinatePointWidth: 7,
              coordinatePointOutlineColor: "#205c3b",
              coordinatePointOutlineWidth: 3,
              closingPointColor: "#f2bd3a",
              closingPointWidth: 9,
              snappingPointColor: "#f2bd3a",
              snappingPointWidth: 9,
              snappingPointOutlineColor: "#173e2d",
              snappingPointOutlineWidth: 3,
            },
          }),
          new TerraDrawSelectMode({
            flags: {
              polygon: {
                feature: {
                  draggable: false,
                  rotateable: false,
                  scaleable: false,
                  selfIntersectable: false,
                  coordinates: {
                    snappable: snapping,
                    draggable: true,
                    deletable: true,
                    midpoints: { draggable: true },
                  },
                },
              },
            },
            styles: {
              selectedPolygonColor: "#7cab68",
              selectedPolygonFillOpacity: 0.28,
              selectedPolygonOutlineColor: "#173e2d",
              selectedPolygonOutlineWidth: 3,
              selectionPointColor: "#fffdf5",
              selectionPointWidth: 7,
              selectionPointOutlineColor: "#205c3b",
              selectionPointOutlineWidth: 3,
              midPointColor: "#f2bd3a",
              midPointWidth: 6,
            },
          }),
        ],
        undoRedo: { modeLevel: new TerraDrawModeUndoRedo() },
      });
      drawRef.current = draw;
      draw.start();

      const syncDraft = () => {
        const geometry = editablePolygon(draw, dataRef.current.editField?.id);
        setDraftOverlay(map, geometry);
        callbacksRef.current.onDraftChange(geometry);
      };
      draw.on("change", syncDraft);
      draw.on("history", () => setCanRedo(draw.canRedo()));
      draw.on("finish", (id) => {
        const geometry = polygonFromFeature(draw.getSnapshotFeature(id));
        if (!geometry) return;
        setDraftOverlay(map, geometry);
        callbacksRef.current.onDraftChange(geometry);
        callbacksRef.current.onDraftComplete(geometry);
        callbacksRef.current.onDrawError(null);
        queueMicrotask(() => {
          if (draw.enabled) {
            draw.setMode("select");
            draw.selectFeature(id);
          }
        });
      });

      configureDrawForEditor(
        draw,
        map,
        current.editorMode,
        current.editField,
        current.draftGeometry,
        callbacksRef.current,
        current.locale,
      );
      container.dataset.editorReady = current.editorMode;
      bringOverlaysToFront(map);

      if (!savedCamera && current.fields.length > 0 && current.editorMode === "idle") {
        const collection = featureCollection(
          current.fields.map((field) => ({
            type: "Feature" as const,
            properties: {},
            geometry: field.geometry,
          })),
        );
        const [west, south, east, north] = bbox(collection);
        map.fitBounds(
          [
            [west, south],
            [east, north],
          ],
          { padding: 90, maxZoom: 15, duration: 0 },
        );
      } else if (!savedCamera && current.editField) {
        fitGeometry(map, current.editField.geometry);
      }

      if (locationRef.current) {
        markerRef.current = new maplibregl.Marker({ color: "#2878d3" })
          .setLngLat(locationRef.current)
          .addTo(map);
      }
      container.dataset.mapReady = "true";
    };

    map.on("load", handleLoad);
    map.on("click", "agis-fields-fill", (event: MapLayerMouseEvent) => {
      if (dataRef.current.editorMode !== "idle") return;
      const id = event.features?.[0]?.properties?.id;
      if (typeof id === "string") callbacksRef.current.onSelectField(id);
    });
    map.on("mouseenter", "agis-fields-fill", () => {
      if (dataRef.current.editorMode === "idle") map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "agis-fields-fill", () => {
      map.getCanvas().style.cursor = "";
    });

    return () => {
      removeEditorMouseNavigation();
      markerRef.current?.remove();
      markerRef.current = null;
      searchMarkerRef.current?.remove();
      searchMarkerRef.current = null;
      const center = map.getCenter();
      cameraRef.current = {
        center: [center.lng, center.lat],
        zoom: map.getZoom(),
        bearing: map.getBearing(),
        pitch: map.getPitch(),
      };
      if (drawRef.current?.enabled) drawRef.current.stop();
      drawRef.current = null;
      mapRef.current = null;
      map.remove();
    };
  }, [baseMap, mapConfig]);

  useEffect(() => {
    const map = mapRef.current;
    const draw = drawRef.current;
    if (!map?.isStyleLoaded() || !draw?.enabled) return;
    delete containerRef.current?.dataset.editorReady;

    const animationFrame = requestAnimationFrame(() => map.resize());
    const resizeTimer = window.setTimeout(() => map.resize(), 360);
    configureDrawForEditor(
      draw,
      map,
      editorMode,
      editField,
      dataRef.current.draftGeometry,
      callbacksRef.current,
      locale,
    );
    if (containerRef.current) containerRef.current.dataset.editorReady = editorMode;
    bringOverlaysToFront(map);
    setCanRedo(false);

    if (editorMode === "edit" && editField) {
      fitGeometry(map, editField.geometry);
    }

    return () => {
      cancelAnimationFrame(animationFrame);
      window.clearTimeout(resizeTimer);
    };
  }, [editorMode, editField, locale]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map?.isStyleLoaded() || !map.getSource(SOURCE_ID)) return;
    const excludedId = editorMode === "edit" ? editField?.id : undefined;
    (map.getSource(SOURCE_ID) as GeoJSONSource).setData(
      fieldFeatureCollection(fields, selectedId, excludedId),
    );
    (map.getSource(LABEL_SOURCE_ID) as GeoJSONSource).setData(
      labelFeatureCollection(fields.filter((field) => field.id !== excludedId), locale),
    );
    map.setLayoutProperty(
      "agis-field-labels",
      "visibility",
      showCropLabels ? "visible" : "none",
    );
    bringOverlaysToFront(map);
  }, [fields, selectedId, showCropLabels, editorMode, editField?.id, locale]);

  useEffect(() => {
    if (!focusRequest || !mapRef.current) return;
    const field = fields.find((item) => item.id === focusRequest.id);
    if (field) fitGeometry(mapRef.current, field.geometry, 110);
  }, [focusRequest, fields]);

  useEffect(() => {
    if (!placeFocusRequest) return;
    const map = mapRef.current;
    if (!map) return;
    const { result } = placeFocusRequest;

    searchMarkerRef.current?.remove();
    searchMarkerRef.current = new maplibregl.Marker({ color: "#d6a72e" })
      .setLngLat(result.center)
      .addTo(map);

    if (result.bbox) {
      const [west, south, east, north] = result.bbox;
      map.fitBounds(
        [
          [west, south],
          [east, north],
        ],
        { padding: 90, maxZoom: 15, duration: 850 },
      );
      return;
    }

    map.flyTo({ center: result.center, zoom: 14, duration: 850 });
  }, [baseMap, placeFocusRequest]);

  function requestLocation() {
    if (!navigator.geolocation) {
      setLocationState("denied");
      return;
    }
    setLocationState("loading");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const location: [number, number] = [coords.longitude, coords.latitude];
        locationRef.current = location;
        markerRef.current?.remove();
        if (mapRef.current) {
          markerRef.current = new maplibregl.Marker({ color: "#2878d3" })
            .setLngLat(location)
            .addTo(mapRef.current);
          mapRef.current.flyTo({ center: location, zoom: 15, duration: 900 });
        }
        setLocationState("ready");
      },
      () => setLocationState("denied"),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 },
    );
  }

  function focusLocation() {
    if (!locationRef.current) return requestLocation();
    mapRef.current?.flyTo({ center: locationRef.current, zoom: 16, duration: 700 });
  }

  function finishDrawing() {
    const draw = drawRef.current;
    const existingGeometry = draw ? editablePolygon(draw) : null;
    if (draw && draw.getModeState() !== "drawing" && existingGeometry) {
      callbacksRef.current.onDraftComplete(existingGeometry);
      callbacksRef.current.onDrawError(null);
      return;
    }
    if (!draw || draw.getModeState() !== "drawing") {
      callbacksRef.current.onDrawError(pick(locale, "Önce haritada en az üç nokta oluşturun.", "First add at least three points on the map."));
      return;
    }
    const canvas = mapRef.current?.getCanvas();
    canvas?.focus();
    canvas?.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter", bubbles: true }));
    queueMicrotask(() => {
      const geometry = editablePolygon(draw);
      if (!geometry || (geometry.coordinates[0]?.length ?? 0) < 4) {
        callbacksRef.current.onDrawError(pick(locale, "Çizimi tamamlamak için en az üç farklı nokta gerekli.", "At least three distinct points are required to finish the drawing."));
      }
    });
  }

  function undo() {
    if (!drawRef.current?.undo()) {
      callbacksRef.current.onDrawError(pick(locale, "Geri alınacak bir nokta yok.", "There is no point to undo."));
    } else {
      callbacksRef.current.onDrawError(null);
      setCanRedo(Boolean(drawRef.current?.canRedo()));
    }
  }

  function redo() {
    drawRef.current?.redo();
    setCanRedo(Boolean(drawRef.current?.canRedo()));
  }

  return (
    <div className={`map-root ${editorMode !== "idle" ? "is-editor" : ""}`}>
      <div ref={containerRef} className="map-container" aria-label={pick(locale, "Tarla haritası", "Field map")} />

      <div className="map-type-control" role="group" aria-label={pick(locale, "Harita türü", "Map type")}>
        <button className={baseMap === "normal" ? "active" : ""} onClick={() => setBaseMap("normal")}>
          <MapIcon size={16} /> {pick(locale, "Normal", "Normal")}
        </button>
        {mapConfig.mapTiler && (
          <button className={baseMap === "maptiler" ? "active" : ""} onClick={() => setBaseMap("maptiler")}>
            <Satellite size={16} /> MapTiler
          </button>
        )}
        {mapConfig.arcgis && (
          <button className={baseMap === "arcgis" ? "active" : ""} onClick={() => setBaseMap("arcgis")}>
            <Satellite size={16} /> ArcGIS
          </button>
        )}
      </div>

      <div className="location-control">
        {locationState === "idle" || locationState === "denied" ? (
          <button className="map-pill" onClick={requestLocation}>
            <LocateFixed size={18} />
            {locationState === "denied" ? pick(locale, "Konum izni ver", "Allow location") : pick(locale, "Konumumu göster", "Show my location")}
          </button>
        ) : (
          <button className="map-icon-button" onClick={focusLocation} aria-label={pick(locale, "Konumuma odaklan", "Focus on my location")}>
            <Crosshair size={20} />
          </button>
        )}
      </div>

      {editorMode !== "idle" && (
        <>
          <div className="draw-toolbar" role="toolbar" aria-label={pick(locale, "Çizim araçları", "Drawing tools")}>
            <button onClick={undo} title={pick(locale, "Son noktayı geri al", "Undo last point")}><Undo2 size={19} /><span>{pick(locale, "Geri al", "Undo")}</span></button>
            <button
              onClick={redo}
              title={pick(locale, "Yinele", "Redo")}
              disabled={!canRedo}
            ><Redo2 size={19} /><span>{pick(locale, "Yinele", "Redo")}</span></button>
            <button
              className={snappingEnabled ? "snap active" : "snap"}
              onClick={() => setSnappingEnabled((enabled) => !enabled)}
              aria-pressed={snappingEnabled}
              title={`${pick(locale, "Sınır Yakalama", "Boundary Snapping")} ${snappingEnabled ? pick(locale, "Açık", "On") : pick(locale, "Kapalı", "Off")}`}
            >
              <Magnet size={18} /><span>{pick(locale, "Sınır Yakalama", "Boundary Snapping")}: {snappingEnabled ? pick(locale, "Açık", "On") : pick(locale, "Kapalı", "Off")}</span>
            </button>
            {editorMode === "create" && (
              <button className="complete" onClick={finishDrawing}><Check size={19} /><span>{pick(locale, "Çizimi tamamla", "Finish drawing")}</span></button>
            )}
            <button className="cancel" onClick={onCancelEditor}><X size={19} /><span>{pick(locale, "İptal", "Cancel")}</span></button>
          </div>
          <div className="map-interaction-hint" role="note">
            <span className="desktop-draw-hint">
              <b>{pick(locale, "Sol tık:", "Left click:")}</b> {pick(locale, "nokta ekle", "add point")} <i /> <b>{pick(locale, "Orta tuş + sürükle:", "Middle button + drag:")}</b> {pick(locale, "haritayı taşı", "move map")} <i />
              <b>{pick(locale, "Tekerlek:", "Wheel:")}</b> {pick(locale, "yakınlaştır", "zoom")}
            </span>
            <span className="mobile-draw-hint">
              <b>{pick(locale, "Dokun:", "Tap:")}</b> {pick(locale, "nokta ekle", "add point")} <i /> <b>{pick(locale, "İki parmak:", "Two fingers:")}</b> {pick(locale, "haritayı taşı", "move map")}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
