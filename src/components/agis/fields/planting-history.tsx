"use client";

import { useEffect, useState } from "react";
import { CalendarDays, History, LoaderCircle, Sprout, Wheat, X } from "lucide-react";

import { getPlantingHistory } from "@/app/agis/actions/fields";
import { useLanguage } from "@/components/agis/i18n/language-provider";
import { displayCropName } from "@/lib/agis/fields/crops";
import { formatSeedRate } from "@/lib/agis/fields/plantings";
import type { FieldRecord, PlantingRecord } from "@/lib/agis/fields/types";
import { languageTag, pick, type Locale } from "@/lib/agis/i18n";

type Props = {
  field: FieldRecord;
  onClose: () => void;
};

type RecordListProps = {
  field: FieldRecord;
  plantings: PlantingRecord[];
};

function dateLabel(value: string | null, locale: Locale) {
  if (!value) return pick(locale, "Ekim tarihi belirtilmedi", "Planting date not specified");
  return new Intl.DateTimeFormat(languageTag(locale), { dateStyle: "long" }).format(
    new Date(`${value}T12:00:00`),
  );
}

export function PlantingRecordList({ field, plantings }: RecordListProps) {
  const { locale } = useLanguage();

  return (
    <>
      <div className="planting-history-list">
        {plantings.map((planting) => (
          <article key={planting.id} className={planting.isCurrent ? "is-current" : ""}>
            <div className="planting-history-heading">
              <span><Wheat size={18} /></span>
              <div>
                <strong>{planting.cropName ? displayCropName(planting.cropName, locale) : pick(locale, "Ürün belirtilmedi", "Crop not specified")}</strong>
                <small><CalendarDays size={13} /> {dateLabel(planting.plantedAt, locale)}</small>
              </div>
              {planting.isCurrent && <b>{pick(locale, "Güncel", "Current")}</b>}
            </div>
            <dl>
              <div><dt>{pick(locale, "Ekim dönemi", "Planting season")}</dt><dd>{planting.season ?? pick(locale, "Belirtilmedi", "Not specified")}</dd></div>
              <div><dt>{pick(locale, "Ekilen Tohum Miktarı (kg)", "Planted Seed Amount (kg)")}</dt><dd>{planting.amountKg === null ? pick(locale, "Belirtilmedi", "Not specified") : `${planting.amountKg.toLocaleString(languageTag(locale))} kg`}</dd></div>
              <div><dt>{pick(locale, "Dekara Düşen Tohum", "Seed per Decare")}</dt><dd>{formatSeedRate(planting.amountKg, field.areaSqm, locale)}</dd></div>
            </dl>
          </article>
        ))}
      </div>
      <p className="history-area-note"><Sprout size={15} /> {pick(locale, "kg/da değerleri tarlanın güncel ölçülen alanına göre hesaplanır.", "kg/da values are calculated using the field’s current measured area.")}</p>
    </>
  );
}

export function PlantingHistory({ field, onClose }: Props) {
  const { locale } = useLanguage();
  const [plantings, setPlantings] = useState<PlantingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getPlantingHistory(field.id, locale).then((result) => {
      if (!active) return;
      if (result.ok) setPlantings(result.plantings);
      else setError(result.error);
      setLoading(false);
    });
    return () => { active = false; };
  }, [field.id, locale]);

  return (
    <section className="panel-content history-content">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">{pick(locale, "Kayıt geçmişi", "Record history")}</p>
          <h2>{field.name ?? pick(locale, "İsimsiz Tarla", "Unnamed Field")}</h2>
        </div>
        <button className="icon-button ghost" onClick={onClose} aria-label={pick(locale, "Ekim geçmişini kapat", "Close planting history")}><X size={20} /></button>
      </div>

      {loading && (
        <div className="history-state"><LoaderCircle className="spin" size={23} /><span>{pick(locale, "Ekim geçmişi yükleniyor…", "Loading planting history…")}</span></div>
      )}
      {error && <p className="form-message error" role="alert">{error}</p>}
      {!loading && !error && plantings.length === 0 && (
        <div className="history-state"><History size={25} /><strong>{pick(locale, "Henüz ekim kaydı bulunmuyor", "No planting records yet")}</strong></div>
      )}

      {!loading && !error && plantings.length > 0 && (
        <PlantingRecordList field={field} plantings={plantings} />
      )}
    </section>
  );
}
