"use client";

import { useMemo, useState, useTransition } from "react";
import type { Polygon } from "geojson";
import { CalendarDays, LoaderCircle, Ruler, Save, Sprout, X } from "lucide-react";

import { saveField } from "@/app/agis/actions/fields";
import { useLanguage } from "@/components/agis/i18n/language-provider";
import { canonicalCropName, displayCropName } from "@/lib/agis/fields/crops";
import { formatArea, validateFieldPolygon } from "@/lib/agis/fields/geometry";
import {
  emptyFieldForm,
  fieldToForm,
  type FieldFormValues,
  type FieldRecord,
} from "@/lib/agis/fields/types";
import { languageTag, pick } from "@/lib/agis/i18n";

type Props = {
  mode: "create" | "edit";
  field: FieldRecord | null;
  geometry: Polygon | null;
  drawError: string | null;
  cropOptions: string[];
  onCancel: () => void;
  onSaved: (field: FieldRecord) => void;
};

export function FieldForm({
  mode,
  field,
  geometry,
  drawError,
  cropOptions,
  onCancel,
  onSaved,
}: Props) {
  const { locale } = useLanguage();
  const [values, setValues] = useState<FieldFormValues>(() =>
    field ? fieldToForm(field) : emptyFieldForm,
  );
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const geometryResult = useMemo(
    () => (geometry ? validateFieldPolygon(geometry) : null),
    [geometry],
  );
  const amountValid =
    values.amountKg === "" ||
    (Number.isFinite(Number(values.amountKg)) && Number(values.amountKg) >= 0);
  const canSave = Boolean(geometryResult?.valid && amountValid && !pending);

  function update<K extends keyof FieldFormValues>(key: K, value: FieldFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!geometry || !canSave) return;
    setServerError(null);
    startTransition(async () => {
      const result = await saveField({
        ...(mode === "edit" && field ? { id: field.id } : {}),
        ...values,
        geometry,
        locale,
      });
      if (!result.ok) {
        setServerError(result.error);
        return;
      }
      onSaved(result.field);
    });
  }

  return (
    <section className="panel-content">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">{mode === "create" ? pick(locale, "Yeni kayıt", "New record") : pick(locale, "Tarla düzenleme", "Edit field")}</p>
          <h2>{mode === "create" ? pick(locale, "Yeni tarla ekle", "Add new field") : field?.name ?? pick(locale, "İsimsiz Tarla", "Unnamed Field")}</h2>
        </div>
        <button className="icon-button ghost" onClick={onCancel} aria-label={pick(locale, "Paneli kapat", "Close panel")}><X size={20} /></button>
      </div>

      <div className={`geometry-status ${geometryResult?.valid ? "valid" : "waiting"}`}>
        <span className="status-icon"><Ruler size={19} /></span>
        <div>
          <strong>
            {geometryResult?.valid
              ? `${formatArea(geometryResult.areaSqm, locale)} ${pick(locale, "yaklaşık alan", "approximate area")}`
              : mode === "create"
                ? pick(locale, "Haritada tarla sınırını çizin", "Draw the field boundary on the map")
                : pick(locale, "Köşe noktalarını sürükleyerek düzenleyin", "Drag corner points to edit")}
          </strong>
          <p>
            {geometryResult?.valid
              ? `${new Intl.NumberFormat(languageTag(locale), { maximumFractionDigits: 0 }).format(geometryResult.areaSqm)} m² · ${(geometryResult.areaSqm / 1000).toLocaleString(languageTag(locale), { maximumFractionDigits: 2 })} da`
              : locale === "en" && geometryResult?.error ? "The boundary is not valid yet." : geometryResult?.error ?? pick(locale, "En az üç nokta belirleyip çizimi tamamlayın.", "Add at least three points and finish the drawing.")}
          </p>
        </div>
      </div>

      {mode === "create" && (
        <p className="drawing-completion-note" role="note">
          {pick(locale, "İpucu: En az üç nokta ekledikten sonra ilk noktaya tekrar tıklayarak veya dokunarak sınırı kapatabilirsiniz. İsterseniz “Çizimi tamamla” düğmesini de kullanabilirsiniz.", "Tip: After adding at least three points, click or tap the first point again to close the boundary. You can also use the “Finish drawing” button.")}
        </p>
      )}

      <form className="field-form" onSubmit={submit}>
        <label>
          <span>{pick(locale, "Tarla ismi", "Field name")} <em>{pick(locale, "isteğe bağlı", "optional")}</em></span>
          <input
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            maxLength={120}
            placeholder={pick(locale, "Örn. Dere Kenarı", "e.g. Riverside")}
          />
        </label>

        <div className="form-grid">
          <label>
            <span>{pick(locale, "Ekilen ekin", "Planted crop")}</span>
            <span className="input-with-icon compact-input">
              <Sprout size={17} />
              <input
                value={values.cropName ? displayCropName(values.cropName, locale) : ""}
                onChange={(event) => update("cropName", event.target.value)}
                onBlur={(event) => update("cropName", displayCropName(canonicalCropName(event.target.value, locale), locale))}
                list={`crop-options-${mode}`}
                maxLength={120}
                placeholder={pick(locale, "Ekin seçin veya yazın", "Select or enter a crop")}
              />
              <datalist id={`crop-options-${mode}`}>
                {cropOptions.map((cropName) => (
                  <option key={cropName} value={displayCropName(cropName, locale)} />
                ))}
              </datalist>
            </span>
          </label>
          <label>
            <span>{pick(locale, "Ekilen Tohum Miktarı (kg)", "Planted Seed Amount (kg)")}</span>
            <input
              value={values.amountKg}
              onChange={(event) => update("amountKg", event.target.value)}
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              placeholder="0"
              aria-invalid={!amountValid}
            />
          </label>
        </div>
        {!amountValid && <p className="field-error">{pick(locale, "Tohum miktarı sıfır veya pozitif olmalı.", "Seed amount must be zero or positive.")}</p>}

        <label>
          <span>{pick(locale, "Ekim tarihi", "Planting date")}</span>
          <span className="input-with-icon compact-input">
            <CalendarDays size={17} />
            <input
              value={values.plantedAt}
              onChange={(event) => update("plantedAt", event.target.value)}
              type="date"
            />
          </span>
        </label>

        <label>
          <span>{pick(locale, "Açıklama", "Description")}</span>
          <textarea
            value={values.description}
            onChange={(event) => update("description", event.target.value)}
            rows={3}
            maxLength={2000}
            placeholder={pick(locale, "Toprak, sulama veya bakım notları…", "Soil, irrigation, or maintenance notes…")}
          />
        </label>

        {(drawError || serverError) && (
          <p className="form-message error" role="alert">{serverError ?? drawError}</p>
        )}

        <div className="panel-actions">
          <button type="button" className="secondary-button" onClick={onCancel}>{pick(locale, "Vazgeç", "Cancel")}</button>
          <button type="submit" className="primary-button" disabled={!canSave}>
            {pending ? <LoaderCircle className="spin" size={18} /> : <Save size={18} />}
            {pending ? pick(locale, "Kaydediliyor…", "Saving…") : mode === "create" ? pick(locale, "Tarlayı kaydet", "Save field") : pick(locale, "Değişiklikleri kaydet", "Save changes")}
          </button>
        </div>
      </form>
    </section>
  );
}
