"use client";

import { useState, useTransition } from "react";
import {
  CalendarDays,
  Edit3,
  History,
  LoaderCircle,
  PlusCircle,
  Ruler,
  Sprout,
  Trash2,
  Wheat,
  X,
} from "lucide-react";

import { deleteField } from "@/app/agis/actions/fields";
import { useLanguage } from "@/components/agis/i18n/language-provider";
import { PlantingRecordList } from "@/components/agis/fields/planting-history";
import { displayCropName } from "@/lib/agis/fields/crops";
import { formatArea } from "@/lib/agis/fields/geometry";
import { formatSeedRate, sortPlantingsNewestFirst } from "@/lib/agis/fields/plantings";
import type { FieldRecord, PlantingRecord } from "@/lib/agis/fields/types";
import { languageTag, pick, type Locale } from "@/lib/agis/i18n";

type Props = {
  field: FieldRecord;
  plantings: PlantingRecord[];
  onClose: () => void;
  onEdit: () => void;
  onNewPlanting: () => void;
  onDeleted: (id: string) => void;
};

function dateLabel(value: string | null, locale: Locale) {
  if (!value) return pick(locale, "Belirtilmedi", "Not specified");
  return new Intl.DateTimeFormat(languageTag(locale), { dateStyle: "long" }).format(
    new Date(`${value}T12:00:00`),
  );
}

export function FieldDetails({ field, plantings, onClose, onEdit, onNewPlanting, onDeleted }: Props) {
  const { locale } = useLanguage();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const previousPlantings = sortPlantingsNewestFirst(
    plantings.filter((planting) => planting.fieldId === field.id && !planting.isCurrent),
  );

  function remove() {
    setError(null);
    startTransition(async () => {
      const result = await deleteField(field.id, locale);
      if (!result.ok) {
        setError(result.error ?? pick(locale, "Tarla silinemedi.", "The field could not be deleted."));
        return;
      }
      onDeleted(field.id);
    });
  }

  return (
    <section className="panel-content">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">{pick(locale, "Tarla ayrıntıları", "Field details")}</p>
          <h2>{field.name ?? pick(locale, "İsimsiz Tarla", "Unnamed Field")}</h2>
        </div>
        <button className="icon-button ghost" onClick={onClose} aria-label={pick(locale, "Paneli kapat", "Close panel")}><X size={20} /></button>
      </div>

      <div className="detail-hero">
        <span><Wheat size={24} /></span>
        <div>
          <small>{pick(locale, "Güncel ekin", "Current crop")}</small>
          <strong>{field.cropName ? displayCropName(field.cropName, locale) : pick(locale, "Ekin bilgisi yok", "No crop information")}</strong>
        </div>
      </div>

      <dl className="detail-list">
        <div><dt><Ruler size={17} /> {pick(locale, "Alan", "Area")}</dt><dd>{formatArea(field.areaSqm, locale)}<small>{pick(locale, "Yaklaşık ölçüm", "Approximate measurement")}</small></dd></div>
        <div><dt><Sprout size={17} /> {pick(locale, "Ekilen Tohum Miktarı (kg)", "Planted Seed Amount (kg)")}</dt><dd>{field.amountKg === null ? pick(locale, "Belirtilmedi", "Not specified") : `${field.amountKg.toLocaleString(languageTag(locale))} kg`}</dd></div>
        <div><dt><Wheat size={17} /> {pick(locale, "Dekara Düşen Tohum", "Seed per Decare")}</dt><dd>{formatSeedRate(field.amountKg, field.areaSqm, locale)}</dd></div>
        <div><dt><CalendarDays size={17} /> {pick(locale, "Ekim tarihi", "Planting date")}</dt><dd>{dateLabel(field.plantedAt, locale)}</dd></div>
        {field.season && <div><dt><CalendarDays size={17} /> {pick(locale, "Ekim dönemi", "Planting season")}</dt><dd>{field.season}</dd></div>}
      </dl>

      <div className="description-block">
        <span>{pick(locale, "Açıklama", "Description")}</span>
        <p>{field.description || pick(locale, "Bu tarla için henüz bir açıklama eklenmemiş.", "No description has been added for this field yet.")}</p>
      </div>

      {error && <p className="form-message error" role="alert">{error}</p>}

      {!confirming && (
        <button className="new-planting-button" onClick={onNewPlanting}>
          <PlusCircle size={18} /> {pick(locale, "Yeni Ekim Kaydı Ekle", "Add New Planting Record")}
        </button>
      )}

      {confirming ? (
        <div className="delete-confirm" role="alertdialog" aria-label={pick(locale, "Tarlayı silme onayı", "Confirm field deletion")}>
          <strong>{pick(locale, "Bu tarlayı silmek istiyor musunuz?", "Do you want to delete this field?")}</strong>
          <p>{pick(locale, "Tarla ve bağlı ekim kayıtları kalıcı olarak silinecek.", "The field and its related planting records will be permanently deleted.")}</p>
          <div>
            <button className="secondary-button" onClick={() => setConfirming(false)} disabled={pending}>{pick(locale, "Vazgeç", "Cancel")}</button>
            <button className="danger-button" onClick={remove} disabled={pending}>
              {pending ? <LoaderCircle className="spin" size={17} /> : <Trash2 size={17} />}
              {pick(locale, "Kalıcı olarak sil", "Delete permanently")}
            </button>
          </div>
        </div>
      ) : (
        <div className="panel-actions">
          <button className="danger-text-button" onClick={() => setConfirming(true)}><Trash2 size={17} /> {pick(locale, "Sil", "Delete")}</button>
          <button className="primary-button" onClick={onEdit}><Edit3 size={17} /> {pick(locale, "Düzenle", "Edit")}</button>
        </div>
      )}

      <section className="past-plantings-section" aria-labelledby="past-plantings-title">
        <div className="past-plantings-heading">
          <History size={18} />
          <div>
            <h3 id="past-plantings-title">{pick(locale, "Geçmiş Ekimler", "Past Plantings")}</h3>
            <p>{pick(locale, "Önceki dönem kayıtları değişmeden saklanır.", "Records from previous seasons are preserved unchanged.")}</p>
          </div>
        </div>
        {previousPlantings.length > 0 ? (
          <PlantingRecordList field={field} plantings={previousPlantings} />
        ) : (
          <p className="past-plantings-empty">{pick(locale, "Bu tarla için geçmiş ekim kaydı bulunmuyor.", "There are no past planting records for this field.")}</p>
        )}
      </section>
    </section>
  );
}
