"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import type { Polygon } from "geojson";
import Image from "next/image";
import {
  CheckCircle2,
  ChevronRight,
  Layers3,
  Leaf,
  List,
  LogOut,
  MapPinned,
  Plus,
  Sprout,
  X,
} from "lucide-react";

import { signOut } from "@/app/agis/giris/actions";
import { FieldDetails } from "@/components/agis/fields/field-details";
import { FieldForm } from "@/components/agis/fields/field-form";
import { FieldList } from "@/components/agis/fields/field-list";
import { NewPlantingForm } from "@/components/agis/fields/new-planting-form";
import { PlantingHistory } from "@/components/agis/fields/planting-history";
import { useLanguage } from "@/components/agis/i18n/language-provider";
import { LanguageSwitcher } from "@/components/agis/i18n/language-switcher";
import { MapSearch } from "@/components/agis/map/map-search";
import { cropSuggestions } from "@/lib/agis/fields/crops";
import { cropLegendTotals, uniqueCropLegend } from "@/lib/agis/fields/map-data";
import { syncPlantingsWithField } from "@/lib/agis/fields/plantings";
import type { FieldRecord, PlantingRecord } from "@/lib/agis/fields/types";
import { languageTag, pick, type Locale } from "@/lib/agis/i18n";
import type { MapConfig, PlaceSearchResult } from "@/lib/agis/map/config";

const MAIN_SITE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://mansurciftlik.com";

function MapLoading() {
  const { locale } = useLanguage();
  return <div className="map-loading"><Leaf className="pulse" size={32} /><span>{pick(locale, "Harita hazırlanıyor…", "Preparing the map…")}</span></div>;
}

const MapCanvas = dynamic(() => import("@/components/agis/map/map-canvas"), {
  ssr: false,
  loading: () => <MapLoading />,
});

type Panel = "none" | "create" | "edit" | "detail" | "list" | "planting" | "history";

const noSearchProximity = () => null;

function formatDekar(value: number, locale: Locale) {
  return value.toLocaleString(languageTag(locale), {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
    maximumFractionDigits: 1,
  });
}

type Props = {
  initialFields: FieldRecord[];
  initialCropNames: string[];
  initialPlantings: PlantingRecord[];
  userEmail: string;
  initialError?: string;
  mapConfig: MapConfig;
};

export function MapWorkspace({
  initialFields,
  initialCropNames,
  initialPlantings,
  userEmail,
  initialError,
  mapConfig,
}: Props) {
  const { locale } = useLanguage();
  const [fields, setFields] = useState(initialFields);
  const [plantings, setPlantings] = useState(initialPlantings);
  const [panel, setPanel] = useState<Panel>("none");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draftGeometry, setDraftGeometry] = useState<Polygon | null>(null);
  const [drawError, setDrawError] = useState<string | null>(null);
  const [showCropLabels, setShowCropLabels] = useState(true);
  const [focusRequest, setFocusRequest] = useState<{ id: string; nonce: number } | null>(null);
  const [placeFocusRequest, setPlaceFocusRequest] = useState<{
    result: PlaceSearchResult;
    nonce: number;
  } | null>(null);
  const [toast, setToast] = useState<string | null>(initialError ?? null);

  const selectedField = fields.find((field) => field.id === selectedId) ?? null;
  const selectedPlantings = useMemo(
    () => plantings.filter((planting) => planting.fieldId === selectedId),
    [plantings, selectedId],
  );
  const editorMode = panel === "create" ? "create" : panel === "edit" ? "edit" : "idle";
  const legend = useMemo(() => uniqueCropLegend(fields, locale), [fields, locale]);
  const legendTotal = useMemo(() => cropLegendTotals(legend), [legend]);
  const cropOptions = useMemo(
    () => cropSuggestions(fields, initialCropNames),
    [fields, initialCropNames],
  );

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function beginCreate() {
    setSelectedId(null);
    setDraftGeometry(null);
    setDrawError(null);
    setPanel("create");
  }

  function cancelEditor() {
    setDraftGeometry(null);
    setDrawError(null);
    if (panel === "edit" && selectedField) setPanel("detail");
    else setPanel("none");
  }

  function selectField(id: string, focus = false) {
    setSelectedId(id);
    setPanel("detail");
    setDraftGeometry(null);
    setDrawError(null);
    if (focus) setFocusRequest({ id, nonce: Date.now() });
  }

  function handleSaved(field: FieldRecord) {
    setFields((current) => {
      const exists = current.some((item) => item.id === field.id);
      return exists
        ? current.map((item) => (item.id === field.id ? field : item))
        : [...current, field];
    });
    setPlantings((current) => syncPlantingsWithField(current, field));
    setSelectedId(field.id);
    setDraftGeometry(null);
    setDrawError(null);
    setPanel("detail");
    setFocusRequest({ id: field.id, nonce: Date.now() });
    setToast(panel === "edit" ? pick(locale, "Tarla güncellendi.", "Field updated.") : pick(locale, "Tarla başarıyla kaydedildi.", "Field saved successfully."));
  }

  function handlePlantingSaved(field: FieldRecord, planting: PlantingRecord) {
    setFields((current) => current.map((item) => (item.id === field.id ? field : item)));
    setPlantings((current) => (
      syncPlantingsWithField(current, field)
        .map((item) => (item.id === planting.id ? planting : item))
    ));
    setSelectedId(field.id);
    setPanel("detail");
    setToast(pick(locale, "Yeni ekim kaydı oluşturuldu. Önceki ekim geçmişte korundu.", "New planting record created. The previous planting was preserved in history."));
  }

  function handleDeleted(id: string) {
    setFields((current) => current.filter((field) => field.id !== id));
    setPlantings((current) => current.filter((planting) => planting.fieldId !== id));
    setSelectedId(null);
    setPanel("none");
    setToast(pick(locale, "Tarla silindi.", "Field deleted."));
  }

  return (
    <main className={`workspace ${panel !== "none" ? "panel-open" : ""}`}>
      <header className="workspace-header">
        <a
          href={MAIN_SITE_URL}
          className="farm-home-link"
          title="Mansur Çiftlik ana sayfasına git"
          aria-label="Mansur Çiftlik ana sayfasına git"
        >
          <Image
            src="/mansurciftlik_profil.jpg"
            alt="Mansur Çiftlik"
            width={40}
            height={40}
          />
        </a>
        <button className="workspace-brand" onClick={() => setPanel("none")} aria-label={pick(locale, "Harita ana görünümü", "Main map view")}>
          <span><Leaf size={21} /></span>
          <span><strong>AGIS</strong><small>{pick(locale, "Tarla Takip", "Field Tracking")}</small></span>
        </button>
        {mapConfig.geocodingUrl && (
          <MapSearch
            geocodingUrl={mapConfig.geocodingUrl}
            getProximity={noSearchProximity}
            onSelect={(result) => setPlaceFocusRequest({ result, nonce: Date.now() })}
          />
        )}
        <div className="header-summary">
          <span><MapPinned size={16} /> {fields.length} {pick(locale, "tarla", fields.length === 1 ? "field" : "fields")}</span>
          <LanguageSwitcher />
          <span className="email-chip">{userEmail}</span>
          <form action={signOut}>
            <button className="icon-button" title={pick(locale, "Çıkış yap", "Sign out")} aria-label={pick(locale, "Çıkış yap", "Sign out")}><LogOut size={18} /></button>
          </form>
        </div>
      </header>

      <div className="map-stage">
        <MapCanvas
          fields={fields}
          editorMode={editorMode}
          editField={panel === "edit" ? selectedField : null}
          selectedId={selectedId}
          showCropLabels={showCropLabels}
          focusRequest={focusRequest}
          placeFocusRequest={placeFocusRequest}
          mapConfig={mapConfig}
          draftGeometry={draftGeometry}
          onMapNotice={setToast}
          onDraftChange={setDraftGeometry}
          onDraftComplete={(geometry) => {
            setDraftGeometry(geometry);
            setDrawError(null);
          }}
          onDrawError={setDrawError}
          onCancelEditor={cancelEditor}
          onSelectField={selectField}
        />

        <div className="primary-map-actions">
          <button className="list-button" onClick={() => setPanel("list")}>
            <List size={19} /><span>{pick(locale, "Tarlalarım", "My Fields")}</span><b>{fields.length}</b>
          </button>
          <button className="add-field-button" onClick={beginCreate} disabled={editorMode !== "idle"}>
            <Plus size={26} /><span>{pick(locale, "Yeni tarla", "New field")}</span>
          </button>
        </div>

        <label className="label-toggle">
          <input
            type="checkbox"
            checked={showCropLabels}
            onChange={(event) => setShowCropLabels(event.target.checked)}
          />
          <span className="toggle-track"><i /></span>
          <span><Sprout size={17} /> {pick(locale, "Ekin isimlerini tarla üzerinde göster", "Show crop names on fields")}</span>
        </label>

        {legend.length > 0 && (
          <div className="crop-legend">
            <div><Layers3 size={16} /><strong>{pick(locale, "Ekinler", "Crops")}</strong></div>
            {legend.map((item) => (
              <span key={item.name}>
                <i style={{ background: item.color }} />
                <span>{item.name} ({item.fieldCount} {pick(locale, "Tarla", item.fieldCount === 1 ? "Field" : "Fields")}, {formatDekar(item.totalDekar, locale)} da)</span>
              </span>
            ))}
            <hr />
            <p className="crop-legend-total">
              {pick(locale, "Toplam", "Total")}: {legendTotal.fieldCount} {pick(locale, "Tarla", legendTotal.fieldCount === 1 ? "Field" : "Fields")} | {formatDekar(legendTotal.totalDekar, locale)} da
            </p>
          </div>
        )}

        {fields.length === 0 && panel === "none" && (
          <button className="empty-map-card" onClick={beginCreate}>
            <span><Sprout size={23} /></span>
            <div><strong>{pick(locale, "İlk tarlanızı ekleyin", "Add your first field")}</strong><p>{pick(locale, "Haritada sınırları çizerek başlayın.", "Start by drawing its boundaries on the map.")}</p></div>
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      {panel !== "none" && (
        <aside className="workspace-panel" aria-label={pick(locale, "Tarla işlem paneli", "Field actions panel")}>
          <div className="sheet-handle" aria-hidden="true" />
          {panel === "create" && (
            <FieldForm
              mode="create"
              field={null}
              geometry={draftGeometry}
              drawError={drawError}
              cropOptions={cropOptions}
              onCancel={cancelEditor}
              onSaved={handleSaved}
            />
          )}
          {panel === "edit" && selectedField && (
            <FieldForm
              mode="edit"
              field={selectedField}
              geometry={draftGeometry}
              drawError={drawError}
              cropOptions={cropOptions}
              onCancel={cancelEditor}
              onSaved={handleSaved}
            />
          )}
          {panel === "detail" && selectedField && (
            <FieldDetails
              field={selectedField}
              plantings={selectedPlantings}
              onClose={() => { setPanel("none"); setSelectedId(null); }}
              onEdit={() => { setDraftGeometry(selectedField.geometry); setPanel("edit"); }}
              onNewPlanting={() => setPanel("planting")}
              onDeleted={handleDeleted}
            />
          )}
          {panel === "list" && (
            <FieldList
              fields={fields}
              plantings={plantings}
              onClose={() => setPanel("none")}
              onSelect={(field) => selectField(field.id, true)}
              onHistory={(field) => { setSelectedId(field.id); setPanel("history"); }}
            />
          )}
          {panel === "planting" && selectedField && (
            <NewPlantingForm
              field={selectedField}
              cropOptions={cropOptions}
              onCancel={() => setPanel("detail")}
              onSaved={handlePlantingSaved}
            />
          )}
          {panel === "history" && selectedField && (
            <PlantingHistory
              key={selectedField.id}
              field={selectedField}
              onClose={() => setPanel("list")}
            />
          )}
        </aside>
      )}

      {toast && (
        <div className="toast" role="status">
          {initialError && toast === initialError ? <X size={19} /> : <CheckCircle2 size={19} />}
          <span>{toast}</span>
          <button onClick={() => setToast(null)} aria-label={pick(locale, "Bildirimi kapat", "Dismiss notification")}><X size={16} /></button>
        </div>
      )}
    </main>
  );
}
