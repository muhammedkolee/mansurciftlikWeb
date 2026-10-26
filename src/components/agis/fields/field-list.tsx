"use client";

import { useMemo, useState } from "react";
import { CalendarRange, Info, MapPin, Search, Sprout, X } from "lucide-react";

import { useLanguage } from "@/components/agis/i18n/language-provider";
import { displayCropName } from "@/lib/agis/fields/crops";
import { cropColor } from "@/lib/agis/fields/map-data";
import { availablePlantingYears, fieldPlantingRows } from "@/lib/agis/fields/plantings";
import type { FieldRecord, PlantingRecord } from "@/lib/agis/fields/types";
import { languageTag, pick, type Locale } from "@/lib/agis/i18n";

type Props = {
  fields: FieldRecord[];
  plantings: PlantingRecord[];
  onClose: () => void;
  onSelect: (field: FieldRecord) => void;
  onHistory: (field: FieldRecord) => void;
};

function dateLabel(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(languageTag(locale), {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

export function FieldList({ fields, plantings, onClose, onSelect, onHistory }: Props) {
  const { locale } = useLanguage();
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("current");
  const years = useMemo(() => availablePlantingYears(plantings), [plantings]);
  const rows = useMemo(
    () => fieldPlantingRows(fields, plantings, year),
    [fields, plantings, year],
  );
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase(languageTag(locale));
    if (!normalized) return rows;
    return rows.filter(({ field, planting }) => {
      const cropName = planting ? planting.cropName : field.cropName;
      return [field.name ?? pick(locale, "İsimsiz Tarla", "Unnamed Field"), cropName ? displayCropName(cropName, locale) : ""]
        .join(" ")
        .toLocaleLowerCase(languageTag(locale))
        .includes(normalized);
    });
  }, [locale, query, rows]);
  const visibleFieldCount = useMemo(
    () => new Set(filtered.map(({ field }) => field.id)).size,
    [filtered],
  );

  return (
    <section className="panel-content list-content">
      <div className="panel-heading">
        <div><p className="eyebrow">{pick(locale, "Kayıtlarınız", "Your records")}</p><h2>{pick(locale, "Tarlalarım", "My Fields")} <span>{visibleFieldCount}</span></h2></div>
        <button className="icon-button ghost" onClick={onClose} aria-label={pick(locale, "Listeyi kapat", "Close list")}><X size={20} /></button>
      </div>
      <div className="field-list-filters">
        <label className="search-box">
          <Search size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={pick(locale, "Tarla veya ekin ara", "Search fields or crops")} />
        </label>
        <label className="year-filter">
          <span><CalendarRange size={16} /> {pick(locale, "Ekim yılı", "Planting year")}</span>
          <select value={year} onChange={(event) => setYear(event.target.value)}>
            <option value="current">{pick(locale, "Güncel ekimler", "Current plantings")}</option>
            {years.map((availableYear) => (
              <option key={availableYear} value={availableYear}>{availableYear}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="field-list">
        {filtered.map(({ field, planting }) => {
          const cropName = planting ? planting.cropName : field.cropName;
          return (
            <div className="field-list-row" key={`${field.id}-${planting?.id ?? "current"}`}>
              <button className="field-list-main" onClick={() => onSelect(field)}>
                <span className="crop-dot" style={{ background: cropColor(cropName) }} />
                <span className="field-list-copy">
                  <strong>{field.name ?? pick(locale, "İsimsiz Tarla", "Unnamed Field")}</strong>
                  <small>{cropName ? <><Sprout size={13} /> {displayCropName(cropName, locale)}</> : pick(locale, "Ekin bilgisi yok", "No crop information")}</small>
                  {year !== "current" && planting?.plantedAt && (
                    <small className="field-list-meta">
                      {dateLabel(planting.plantedAt, locale)} · {planting.isCurrent ? pick(locale, "Güncel", "Current") : pick(locale, "Geçmiş kayıt", "Past record")}
                    </small>
                  )}
                </span>
                <MapPin size={18} />
              </button>
              <button
                className="field-history-button"
                onClick={() => onHistory(field)}
                aria-label={`${field.name ?? pick(locale, "İsimsiz Tarla", "Unnamed Field")} ${pick(locale, "ekim geçmişini göster", "show planting history")}`}
                title={pick(locale, "Ekim geçmişi", "Planting history")}
              ><Info size={18} /></button>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="empty-list"><Search size={24} /><strong>{pick(locale, "Sonuç bulunamadı", "No results found")}</strong><p>{pick(locale, "Farklı bir tarla veya ekin adı deneyin.", "Try another field or crop name.")}</p></div>
        )}
      </div>
    </section>
  );
}
