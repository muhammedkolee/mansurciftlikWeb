"use client";

import { useState, useTransition } from "react";
import { CalendarDays, LoaderCircle, Save, Sprout, X } from "lucide-react";

import { createPlanting } from "@/app/agis/actions/fields";
import { useLanguage } from "@/components/agis/i18n/language-provider";
import { canonicalCropName, displayCropName } from "@/lib/agis/fields/crops";
import type { FieldRecord, PlantingFormValues, PlantingRecord } from "@/lib/agis/fields/types";
import { pick } from "@/lib/agis/i18n";

type Props = {
  field: FieldRecord;
  cropOptions: string[];
  onCancel: () => void;
  onSaved: (field: FieldRecord, planting: PlantingRecord) => void;
};

const emptyValues: PlantingFormValues = {
  cropName: "",
  amountKg: "",
  plantedAt: "",
  season: "",
};

export function NewPlantingForm({ field, cropOptions, onCancel, onSaved }: Props) {
  const { locale } = useLanguage();
  const [values, setValues] = useState(emptyValues);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const amountValid = values.amountKg === ""
    || (Number.isFinite(Number(values.amountKg)) && Number(values.amountKg) >= 0);
  const hasMeaningfulValue = Boolean(
    values.cropName.trim() || values.amountKg !== "" || values.plantedAt,
  );
  const canSave = amountValid && hasMeaningfulValue && !pending;

  function update<K extends keyof PlantingFormValues>(key: K, value: PlantingFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSave) return;
    setError(null);
    startTransition(async () => {
      const result = await createPlanting({ fieldId: field.id, ...values, locale });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onSaved(result.field, result.planting);
    });
  }

  return (
    <section className="panel-content">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">{pick(locale, "Yeni dönem", "New season")}</p>
          <h2>{pick(locale, "Yeni Ekim Kaydı Ekle", "Add New Planting Record")}</h2>
          <p className="panel-subtitle">{field.name ?? pick(locale, "İsimsiz Tarla", "Unnamed Field")}</p>
        </div>
        <button className="icon-button ghost" onClick={onCancel} aria-label={pick(locale, "Formu kapat", "Close form")}><X size={20} /></button>
      </div>

      <form className="field-form" onSubmit={submit}>
        <label>
          <span>{pick(locale, "Ekilen Ürün", "Planted Crop")}</span>
          <span className="input-with-icon compact-input">
            <Sprout size={17} />
            <input
              value={values.cropName ? displayCropName(values.cropName, locale) : ""}
              onChange={(event) => update("cropName", event.target.value)}
              onBlur={(event) => update("cropName", displayCropName(canonicalCropName(event.target.value, locale), locale))}
              list="new-planting-crop-options"
              maxLength={120}
              placeholder={pick(locale, "Ekin seçin veya yazın", "Select or enter a crop")}
            />
            <datalist id="new-planting-crop-options">
              {cropOptions.map((cropName) => <option key={cropName} value={displayCropName(cropName, locale)} />)}
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
        {!amountValid && <p className="field-error">{pick(locale, "Tohum miktarı sıfır veya pozitif olmalı.", "Seed amount must be zero or positive.")}</p>}

        <label>
          <span>{pick(locale, "Ekim Tarihi", "Planting Date")}</span>
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
          <span>{pick(locale, "Ekim Dönemi / Sezon", "Planting Period / Season")} <em>{pick(locale, "isteğe bağlı", "optional")}</em></span>
          <input
            value={values.season}
            onChange={(event) => update("season", event.target.value)}
            maxLength={80}
            placeholder={pick(locale, "Örn. 2026 İlkbahar", "e.g. Spring 2026")}
          />
        </label>

        {!hasMeaningfulValue && (
          <p className="form-message info">{pick(locale, "Ürün, tohum miktarı veya ekim tarihinden en az birini girin.", "Enter at least a crop, seed amount, or planting date.")}</p>
        )}
        {error && <p className="form-message error" role="alert">{error}</p>}

        <div className="panel-actions">
          <button type="button" className="secondary-button" onClick={onCancel}>{pick(locale, "Vazgeç", "Cancel")}</button>
          <button type="submit" className="primary-button" disabled={!canSave}>
            {pending ? <LoaderCircle className="spin" size={18} /> : <Save size={18} />}
            {pending ? pick(locale, "Kaydediliyor…", "Saving…") : pick(locale, "Ekim kaydını oluştur", "Create planting record")}
          </button>
        </div>
      </form>
    </section>
  );
}
