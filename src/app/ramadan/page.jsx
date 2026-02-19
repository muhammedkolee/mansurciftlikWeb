'use client'

import { useState, useEffect, useRef, useMemo } from "react";
import { Coordinates, CalculationMethod, PrayerTimes } from "adhan";

// Ramazan 2025: 19 Şubat – 19 Mart (30 gün), Bayram: 20 Mart
const RAMADAN_START = new Date(2025, 1, 19); // 19 Şubat 2025
const RAMADAN_DAYS = 30;

const TURKEY_CITIES = [
  { name: "Adana", lat: 37.0, lng: 35.3213 },
  { name: "Adıyaman", lat: 37.7648, lng: 38.2786 },
  { name: "Afyonkarahisar", lat: 38.7507, lng: 30.5567 },
  { name: "Ağrı", lat: 39.7191, lng: 43.0503 },
  { name: "Aksaray", lat: 38.3687, lng: 34.037 },
  { name: "Amasya", lat: 40.6499, lng: 35.8353 },
  { name: "Ankara", lat: 39.9334, lng: 32.8597 },
  { name: "Antalya", lat: 36.8969, lng: 30.7133 },
  { name: "Ardahan", lat: 41.1105, lng: 42.7022 },
  { name: "Artvin", lat: 41.1828, lng: 41.8183 },
  { name: "Aydın", lat: 37.856, lng: 27.8416 },
  { name: "Balıkesir", lat: 39.6484, lng: 27.8826 },
  { name: "Bartın", lat: 41.6344, lng: 32.3375 },
  { name: "Batman", lat: 37.8812, lng: 41.1351 },
  { name: "Bayburt", lat: 40.2552, lng: 40.2249 },
  { name: "Bilecik", lat: 40.15, lng: 29.9792 },
  { name: "Bingöl", lat: 38.8854, lng: 40.4983 },
  { name: "Bitlis", lat: 38.3938, lng: 42.1232 },
  { name: "Bolu", lat: 40.7359, lng: 31.6061 },
  { name: "Burdur", lat: 37.721, lng: 30.2906 },
  { name: "Bursa", lat: 40.1885, lng: 29.061 },
  { name: "Çanakkale", lat: 40.1553, lng: 26.4142 },
  { name: "Çankırı", lat: 40.6013, lng: 33.6134 },
  { name: "Çorum", lat: 40.5506, lng: 34.9556 },
  { name: "Denizli", lat: 37.7765, lng: 29.0864 },
  { name: "Diyarbakır", lat: 37.9144, lng: 40.2306 },
  { name: "Düzce", lat: 40.8438, lng: 31.1565 },
  { name: "Edirne", lat: 41.6818, lng: 26.5623 },
  { name: "Elazığ", lat: 38.681, lng: 39.2264 },
  { name: "Erzincan", lat: 39.75, lng: 39.5 },
  { name: "Erzurum", lat: 39.9, lng: 41.27 },
  { name: "Eskişehir", lat: 39.7767, lng: 30.5206 },
  { name: "Gaziantep", lat: 37.0662, lng: 37.3833 },
  { name: "Giresun", lat: 40.9128, lng: 38.3895 },
  { name: "Gümüşhane", lat: 40.4386, lng: 39.4814 },
  { name: "Hakkari", lat: 37.5744, lng: 43.7408 },
  { name: "Hatay", lat: 36.4018, lng: 36.3498 },
  { name: "Iğdır", lat: 39.9167, lng: 44.0333 },
  { name: "Isparta", lat: 37.7648, lng: 30.5566 },
  { name: "İstanbul", lat: 41.0082, lng: 28.9784 },
  { name: "İzmir", lat: 38.4192, lng: 27.1287 },
  { name: "Kahramanmaraş", lat: 37.5858, lng: 36.9371 },
  { name: "Karabük", lat: 41.2061, lng: 32.6204 },
  { name: "Karaman", lat: 37.1759, lng: 33.2287 },
  { name: "Kars", lat: 40.6013, lng: 43.0975 },
  { name: "Kastamonu", lat: 41.3887, lng: 33.7827 },
  { name: "Kayseri", lat: 38.7312, lng: 35.4787 },
  { name: "Kilis", lat: 36.7184, lng: 37.1212 },
  { name: "Kırıkkale", lat: 39.8468, lng: 33.5153 },
  { name: "Kırklareli", lat: 41.7333, lng: 27.2167 },
  { name: "Kırşehir", lat: 39.1425, lng: 34.1709 },
  { name: "Kocaeli", lat: 40.8533, lng: 29.8815 },
  { name: "Konya", lat: 37.8746, lng: 32.4932 },
  { name: "Kütahya", lat: 39.4167, lng: 29.9833 },
  { name: "Malatya", lat: 38.3552, lng: 38.3095 },
  { name: "Manisa", lat: 38.6191, lng: 27.4289 },
  { name: "Mardin", lat: 37.3212, lng: 40.7245 },
  { name: "Mersin", lat: 36.8, lng: 34.6333 },
  { name: "Muğla", lat: 37.2153, lng: 28.3636 },
  { name: "Muş", lat: 38.9462, lng: 41.7539 },
  { name: "Nevşehir", lat: 38.6939, lng: 34.6857 },
  { name: "Niğde", lat: 37.9667, lng: 34.6833 },
  { name: "Ordu", lat: 40.9862, lng: 37.8797 },
  { name: "Osmaniye", lat: 37.0742, lng: 36.2464 },
  { name: "Rize", lat: 41.0201, lng: 40.5234 },
  { name: "Sakarya", lat: 40.694, lng: 30.4358 },
  { name: "Samsun", lat: 41.2867, lng: 36.33 },
  { name: "Şanlıurfa", lat: 37.1591, lng: 38.7969 },
  { name: "Siirt", lat: 37.9333, lng: 41.95 },
  { name: "Sinop", lat: 42.0231, lng: 35.1531 },
  { name: "Şırnak", lat: 37.5164, lng: 42.4611 },
  { name: "Sivas", lat: 39.7477, lng: 37.0179 },
  { name: "Tekirdağ", lat: 40.9781, lng: 27.5115 },
  { name: "Tokat", lat: 40.3167, lng: 36.55 },
  { name: "Trabzon", lat: 41.0015, lng: 39.7178 },
  { name: "Tunceli", lat: 39.1079, lng: 39.5401 },
  { name: "Uşak", lat: 38.6823, lng: 29.4082 },
  { name: "Van", lat: 38.4891, lng: 43.4089 },
  { name: "Yalova", lat: 40.655, lng: 29.2769 },
  { name: "Yozgat", lat: 39.8181, lng: 34.8147 },
  { name: "Zonguldak", lat: 41.4564, lng: 31.7987 },
];

const fmt = (time) =>
  time.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

const getMoonPhase = () => {
  const days = (new Date() - new Date(2000, 0, 6)) / 86400000;
  return ((days % 29.53) / 29.53) * 100;
};

const toHMS = (diff) => {
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

// ——— Moon SVG ———
const MoonIcon = ({ phase }) => {
  const isWaxing = phase < 50;
  const ill = isWaxing ? phase * 2 : (100 - phase) * 2;
  return (
    <svg viewBox="0 0 60 60" width="60" height="60" style={{ filter: "drop-shadow(0 0 12px rgba(255,220,120,0.6))" }}>
      <defs>
        <radialGradient id="mg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="70%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" stopOpacity="0.8" />
        </radialGradient>
        <clipPath id="mc"><circle cx="30" cy="30" r="22" /></clipPath>
      </defs>
      <circle cx="30" cy="30" r="22" fill="url(#mg)" />
      <ellipse cx={isWaxing ? 30 + (22 - ill * 0.22) : 30 - (22 - ill * 0.22)}
        cy="30" rx={Math.max(0.1, 22 - ill * 0.2)} ry="22"
        fill="#0f172a" clipPath="url(#mc)" style={{ opacity: ill < 10 ? 0 : 1 }} />
    </svg>
  );
};

// ——— Stars ———
const STARS = Array.from({ length: 55 }, () => ({
  x: Math.random() * 100, y: Math.random() * 100,
  s: Math.random() * 2 + 0.5, d: Math.random() * 4, o: Math.random() * 0.6 + 0.2,
}));

// ——— Prayer row ———
const PrayerRow = ({ label, time, highlight, icon, delay }) => (
  <div
    className={`flex items-center justify-between rounded-2xl mb-2 cursor-default transition-all duration-300 border
      ${highlight
        ? "px-6 py-[18px] border-amber-400/35 bg-gradient-to-r from-amber-400/[0.18] to-amber-600/[0.08] hover:from-amber-400/25"
        : "px-6 py-[14px] border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06]"
      }`}
    style={{ animation: `slideIn 0.5s ease ${delay}s both`, backdropFilter: "blur(4px)" }}
  >
    <div className="flex items-center gap-3">
      <span className="text-xl">{icon}</span>
      <span className={`font-serif text-base tracking-wide ${highlight ? "text-amber-200 font-semibold text-lg" : "text-white/75"}`}
        style={{ fontFamily: "'Crimson Text', serif" }}>
        {label}
      </span>
      {highlight && (
        <span className="text-[10px] bg-amber-400/20 border border-amber-400/40 text-amber-300 px-2 py-0.5 rounded-full font-mono uppercase tracking-widest">
          {label.includes("Sahur") ? "İmsak" : "İftar"}
        </span>
      )}
    </div>
    <span className={`font-serif tracking-wider tabular-nums ${highlight ? "text-amber-200 text-[22px] font-bold" : "text-white/60 text-[18px]"}`}
      style={{ fontFamily: "'Crimson Text', serif" }}>
      {time}
    </span>
  </div>
);

// ——— City selector ———
const CitySelector = ({ selectedCity, onSelect, onGeolocate, geoLoading }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  const filtered = TURKEY_CITIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <div className="flex gap-2">
        <div
          onClick={() => setOpen(o => !o)}
          className="flex-1 flex items-center justify-between px-4 py-2.5 rounded-xl cursor-pointer bg-white/[0.06] border border-white/[0.12] hover:bg-white/10 transition-all"
        >
          <span className="text-white/85" style={{ fontFamily: "'Crimson Text', serif", fontSize: 15 }}>
            🏙️ {selectedCity || "Şehir seçin..."}
          </span>
          <span className="text-white/40 text-xs transition-transform duration-200" style={{ transform: open ? "rotate(180deg)" : "rotate(0)" }}>▼</span>
        </div>
        <button
          onClick={onGeolocate}
          disabled={geoLoading}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-amber-400/30 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20 transition-all disabled:opacity-60 disabled:cursor-wait whitespace-nowrap"
          style={{ fontFamily: "'Crimson Text', serif", fontSize: 13 }}
        >
          {geoLoading ? "⏳" : "📍"} {geoLoading ? "Alınıyor..." : "Konumum"}
        </button>
      </div>

      {open && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
          style={{ background: "rgba(10,22,40,0.97)", backdropFilter: "blur(20px)", animation: "dropDown 0.15s ease" }}>
          <div className="p-2.5 border-b border-white/[0.07]">
            <input
              autoFocus value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Şehir ara..."
              className="w-full bg-white/[0.06] border border-white/10 rounded-lg px-3 py-2 text-white outline-none placeholder-white/30"
              style={{ fontFamily: "'Crimson Text', serif", fontSize: 14 }}
            />
          </div>
          <div className="max-h-56 overflow-y-auto">
            {filtered.length === 0
              ? <div className="p-4 text-center text-white/30 text-sm" style={{ fontFamily: "'Crimson Text', serif" }}>Şehir bulunamadı</div>
              : filtered.map(city => (
                <div key={city.name}
                  onClick={() => { onSelect(city); setOpen(false); setSearch(""); }}
                  className="px-4 py-2.5 cursor-pointer transition-all duration-150 hover:bg-white/[0.05]"
                  style={{
                    fontFamily: "'Crimson Text', serif", fontSize: 15,
                    color: selectedCity === city.name ? "#FDE68A" : "rgba(255,255,255,0.75)",
                    background: selectedCity === city.name ? "rgba(251,191,36,0.1)" : "",
                    borderLeft: selectedCity === city.name ? "2px solid #FDE68A" : "2px solid transparent",
                  }}
                >
                  {city.name}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ——— Ramadan Calendar Grid ———
const RamadanCalendar = ({ coords, today }) => {
  const [selected, setSelected] = useState(null);

  const schedule = useMemo(() => {
    if (!coords) return [];
    const coordinates = new Coordinates(coords.lat, coords.lng);
    const params = CalculationMethod.Turkey();
    return Array.from({ length: RAMADAN_DAYS }, (_, i) => {
      const date = new Date();
      date.setDate(RAMADAN_START.getDate() + i);
      const pt = new PrayerTimes(coordinates, date, params);
      return {
        date,
        day: i + 1,
        fajr: fmt(pt.fajr),
        sunrise: fmt(pt.sunrise),
        dhuhr: fmt(pt.dhuhr),
        asr: fmt(pt.asr),
        maghrib: fmt(pt.maghrib),
        isha: fmt(pt.isha),
        isToday: isSameDay(date, today),
        isTomorrow: isSameDay(date, new Date(today.getTime() + 86400000)),
        isPast: date < today && !isSameDay(date, today),
        isEid: i === RAMADAN_DAYS - 1, // 30. gün = Bayram arifesi / son gün
      };
    });
  }, [coords]);

  // auto-select today or tomorrow on load
  useEffect(() => {
    if (schedule.length === 0) return;
    const t = schedule.find(d => d.isToday) || schedule.find(d => d.isTomorrow);
    if (t) setSelected(t);
  }, [schedule]);

  const WEEKDAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

  return (
    <div className="mt-6 rounded-3xl border border-white/[0.08] overflow-hidden"
      style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)" }}>

      {/* Başlık */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/[0.07]">
        <span className="text-xl">🗓️</span>
        <div>
          <h2 className="text-amber-300 font-semibold tracking-widest text-sm uppercase"
            style={{ fontFamily: "'Cinzel', serif" }}>
            Ramazan Takvimi 2025
          </h2>
          <p className="text-white/30 text-xs italic mt-0.5" style={{ fontFamily: "'Crimson Text', serif" }}>
            19 Şubat – 19 Mart · Bayram 20 Mart
          </p>
        </div>
      </div>

      {/* Grid: 6 satır × 5 sütun */}
      <div className="grid grid-cols-5 gap-2 p-4">
        {schedule.map((row) => {
          const wd = WEEKDAYS[(row.date.getDay() + 6) % 7];
          const isFri = (row.date.getDay() + 6) % 7 === 4;
          const isSelected = selected && isSameDay(row.date, selected.date);

          let cellClass = "relative rounded-2xl p-2.5 cursor-pointer transition-all duration-200 border select-none ";
          if (row.isToday)
            cellClass += "border-emerald-400/60 bg-gradient-to-b from-emerald-400/20 to-emerald-600/10 shadow-lg shadow-emerald-400/10 ring-1 ring-emerald-400/30";
          else if (row.isTomorrow)
            cellClass += "border-sky-400/50 bg-sky-400/[0.1] hover:bg-sky-400/[0.15]";
          else if (row.isEid)
            cellClass += "border-red-400/50 bg-gradient-to-b from-red-400/15 to-red-600/8 hover:from-red-400/20";
          else if (row.isPast)
            cellClass += "border-white/[0.04] bg-white/[0.02] opacity-35 hover:opacity-50";
          else if (isFri)
            cellClass += "border-violet-400/25 bg-violet-500/[0.07] hover:bg-violet-500/[0.12]";
          else
            cellClass += "border-white/[0.1] bg-white/[0.05] hover:bg-white/[0.09] hover:border-white/[0.18]";

          return (
            <div key={row.day} className={cellClass} onClick={() => setSelected(row)}>
              {/* Gün no + tarih */}
              <div className="flex items-start justify-between mb-1.5">
                <span className={`text-[10px] font-mono font-bold tracking-wider
                  ${row.isToday ? "text-emerald-300" : row.isTomorrow ? "text-sky-300" : row.isEid ? "text-red-300" : row.isPast ? "text-white/25" : "text-white/70"}`}>
                  {row.day}
                </span>
                <span className={`text-[9px] tracking-wide
                  ${row.isToday ? "text-emerald-400/80" : row.isTomorrow ? "text-sky-400/70" : row.isEid ? "text-red-400/80" : row.isPast ? "text-white/20" : isFri ? "text-violet-300/70" : "text-white/50"}`}
                  style={{ fontFamily: "'Crimson Text', serif" }}>
                  {wd}
                </span>
              </div>

              {/* Tarih */}
              <div className={`text-[11px] font-semibold leading-tight mb-2
                ${row.isToday ? "text-white" : row.isTomorrow ? "text-sky-100/90" : row.isEid ? "text-red-100/90" : row.isPast ? "text-white/25" : "text-white/85"}`}
                style={{ fontFamily: "'Crimson Text', serif" }}>
                {row.date.toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
              </div>

              {/* Sahur */}
              <div className="flex items-center gap-1 mb-0.5">
                <span className="text-[8px]">🌙</span>
                <span className={`text-[11px] font-bold tabular-nums
                  ${row.isToday ? "text-emerald-300" : row.isTomorrow ? "text-blue-300/80" : row.isEid ? "text-red-300/80" : row.isPast ? "text-white/20" : "text-blue-300/80"}`}
                  style={{ fontFamily: "'Crimson Text', serif" }}>
                  {row.fajr}
                </span>
              </div>

              {/* İftar */}
              <div className="flex items-center gap-1">
                <span className="text-[8px]">🌇</span>
                <span className={`text-[11px] font-bold tabular-nums
                  ${row.isToday ? "text-emerald-200" : row.isTomorrow ? "text-amber-300/80" : row.isEid ? "text-red-200/80" : row.isPast ? "text-white/20" : "text-amber-300/80"}`}
                  style={{ fontFamily: "'Crimson Text', serif" }}>
                  {row.maghrib}
                </span>
              </div>

              {/* Bugün / Yarın / Bayram badge */}
              {(row.isToday || row.isTomorrow || row.isEid) && (
                <div className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] font-mono px-2 py-0.5 rounded-full border whitespace-nowrap
                  ${row.isToday
                    ? "bg-emerald-400/90 text-slate-900 border-emerald-300 font-bold"
                    : row.isTomorrow
                    ? "bg-sky-500/80 text-white border-sky-400 font-semibold"
                    : "bg-red-500/80 text-white border-red-400 font-semibold"
                  }`}>
                  {row.isToday ? "Bugün" : row.isTomorrow ? "Yarın" : "🌙 Bayram"}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Seçili gün detay paneli */}
      {selected && (
        <div className="mx-4 mb-4 rounded-2xl border border-white/10 overflow-hidden"
          style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(10px)", animation: "fadeDown 0.2s ease" }}>
          {/* Panel başlık */}
          <div className={`flex items-center justify-between px-5 py-3 border-b border-white/[0.07]
            ${selected.isToday ? "bg-emerald-400/10" : selected.isTomorrow ? "bg-sky-400/10" : selected.isEid ? "bg-red-400/10" : ""}`}>
            <div>
              <span className="text-white/90 font-semibold" style={{ fontFamily: "'Crimson Text', serif", fontSize: 16 }}>
                {selected.date.toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" })}
              </span>
              <span className="ml-2 text-white/40 text-sm" style={{ fontFamily: "'Crimson Text', serif" }}>
                · {selected.day}. Ramazan günü
              </span>
            </div>
            {selected.isToday && <span className="text-[10px] bg-emerald-400/80 text-slate-900 font-bold px-2 py-0.5 rounded-full">Bugün</span>}
            {selected.isTomorrow && <span className="text-[10px] bg-sky-500/80 text-white font-semibold px-2 py-0.5 rounded-full">Yarın</span>}
            {selected.isEid && <span className="text-[10px] bg-red-500/80 text-white font-semibold px-2 py-0.5 rounded-full">🌙 Bayram</span>}
          </div>

          {/* Tüm vakitler */}
          <div className="grid grid-cols-3 gap-px bg-white/[0.05]">
            {[
              { label: "Sahur (İmsak)", time: selected.fajr, icon: "🌙", highlight: true },
              { label: "Güneş", time: selected.sunrise, icon: "🌅", highlight: false },
              { label: "Öğle", time: selected.dhuhr, icon: "☀️", highlight: false },
              { label: "İkindi", time: selected.asr, icon: "🌤️", highlight: false },
              { label: "İftar (Akşam)", time: selected.maghrib, icon: "🌇", highlight: true },
              { label: "Yatsı", time: selected.isha, icon: "🌃", highlight: false },
            ].map(({ label, time, icon, highlight }) => (
              <div key={label} className={`flex flex-col items-center justify-center py-4 gap-1
                ${highlight ? "bg-amber-400/[0.08]" : "bg-white/[0.02]"}`}>
                <span className="text-base">{icon}</span>
                <span className={`text-[10px] tracking-wide text-center leading-tight
                  ${highlight ? "text-amber-300/70" : "text-white/35"}`}
                  style={{ fontFamily: "'Crimson Text', serif" }}>
                  {label}
                </span>
                <span className={`tabular-nums font-bold
                  ${highlight ? "text-amber-200 text-base" : "text-white/70 text-sm"}`}
                  style={{ fontFamily: "'Crimson Text', serif" }}>
                  {time}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lejant */}
      <div className="flex flex-wrap items-center gap-4 px-5 py-3 border-t border-white/[0.05]">
        {[
          { color: "bg-emerald-400/40 border-emerald-400/60", label: "Bugün" },
          { color: "bg-sky-400/20 border-sky-400/40", label: "Yarın" },
          { color: "bg-red-500/20 border-red-400/40", label: "Bayram" },
          { color: "bg-violet-500/15 border-violet-400/25", label: "Cuma" },
          { color: "bg-white/[0.05] border-white/[0.06] opacity-40", label: "Geçmiş" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-sm border ${color}`} />
            <span className="text-white/30 text-xs" style={{ fontFamily: "'Crimson Text', serif" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ——— Main ———
export default function RamadanStatus() {
  const [now, setNow] = useState(new Date());
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [coords, setCoords] = useState(null);
  const [countdown, setCountdown] = useState("");
  const [nextPrayer, setNextPrayer] = useState("");
  const [iftarCountdown, setIftarCountdown] = useState("");
  const [iftarPassed, setIftarPassed] = useState(false);
  const [locationName, setLocationName] = useState(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState(null);

  const loadFromCoords = (lat, lng, name) => {
    const coordinates = new Coordinates(lat, lng);
    const params = CalculationMethod.Turkey();
    const pt = new PrayerTimes(coordinates, new Date(), params);
    setPrayerTimes(pt);
    setCoords({ lat, lng });
    setLocationName(name);
  };

  const requestGeolocation = () => {
    if (!navigator.geolocation) { setGeoError("Tarayıcınız konum özelliğini desteklemiyor."); return; }
    setGeoLoading(true); setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=tr`);
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.village || "Konumunuz";
          loadFromCoords(latitude, longitude, city);
        } catch { loadFromCoords(latitude, longitude, "Konumunuz"); }
        setGeoLoading(false);
      },
      () => { setGeoError("Konum izni reddedildi."); setGeoLoading(false); }
    );
  };

  useEffect(() => { requestGeolocation(); }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      const cur = new Date(); setNow(cur);
      if (!prayerTimes) return;
      const times = [
        { name: "Sabah", time: prayerTimes.fajr },
        { name: "Güneş", time: prayerTimes.sunrise },
        { name: "Öğle", time: prayerTimes.dhuhr },
        { name: "İkindi", time: prayerTimes.asr },
        { name: "Akşam", time: prayerTimes.maghrib },
        { name: "Yatsı", time: prayerTimes.isha },
      ];
      const next = times.find(t => t.time > cur);
      if (next) { setCountdown(toHMS(next.time - cur)); setNextPrayer(next.name); }
      if (prayerTimes.maghrib > cur) { setIftarCountdown(toHMS(prayerTimes.maghrib - cur)); setIftarPassed(false); }
      else setIftarPassed(true);
    }, 1000);
    return () => clearInterval(iv);
  }, [prayerTimes]);

  const moonPhase = getMoonPhase();
  const todayStr = now.toLocaleDateString("tr-TR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen relative flex items-start justify-center font-sans overflow-hidden py-2"
      style={{ background: "linear-gradient(170deg, #020817 0%, #0a1628 40%, #0d1f3c 70%, #0a1224 100%)" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&family=Cinzel:wght@400;500;600&display=swap');
        @keyframes twinkle { 0%,100%{transform:scale(1)} 50%{opacity:.1;transform:scale(.7)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes dropDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulseGlow { 0%,100%{box-shadow:0 0 30px rgba(251,191,36,.15)} 50%{box-shadow:0 0 50px rgba(251,191,36,.3)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        .main-card{animation:pulseGlow 4s ease-in-out infinite}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:rgba(251,191,36,.3);border-radius:2px}
      `}</style>

      {/* Stars */}
      {STARS.map((s, i) => (
        <div key={i} className="absolute rounded-full bg-white pointer-events-none"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, opacity: s.o, boxShadow: `0 0 ${s.s * 2}px white`, animation: `twinkle 3s ease-in-out ${s.d}s infinite` }} />
      ))}
      <div className="absolute top-[10%] left-[5%] w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)" }} />
      <div className="absolute bottom-[15%] right-[5%] w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)" }} />

      <div className="w-full max-w-lg relative z-10">

        {/* ——— Ana Kart ——— */}
        <div className="main-card rounded-3xl border border-white/10 overflow-visible"
          style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)" }}>

          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center border-b border-white/[0.07] rounded-t-3xl overflow-hidden">
            <div style={{ animation: "float 5s ease-in-out infinite" }} className="mb-3 flex justify-center">
              <MoonIcon phase={moonPhase} />
            </div>
            <h1 className="text-2xl font-semibold tracking-[0.12em] mb-2"
              style={{
                fontFamily: "'Cinzel', serif",
                background: "linear-gradient(135deg, #FDE68A, #F59E0B, #FDE68A)",
                backgroundSize: "200% auto", WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent", animation: "shimmer 4s linear infinite",
              }}>
              RAMAZAN VAKİTLERİ
            </h1>
            {locationName && (
              <p className="text-white/50 text-sm uppercase tracking-widest mb-1" style={{ fontFamily: "'Crimson Text', serif" }}>
                📍 {locationName}
              </p>
            )}
            <p className="text-white/40 text-sm italic" style={{ fontFamily: "'Crimson Text', serif" }}>{todayStr}</p>
          </div>

          {/* Konum seçici */}
          <div className="px-5 py-4 border-b border-white/[0.07]">
            <CitySelector selectedCity={locationName} onSelect={c => { setGeoError(null); loadFromCoords(c.lat, c.lng, c.name); }}
              onGeolocate={requestGeolocation} geoLoading={geoLoading} />
            {geoError && (
              <p className="text-orange-400/80 text-xs italic text-center mt-2" style={{ fontFamily: "'Crimson Text', serif" }}>
                ⚠️ {geoError}
              </p>
            )}
          </div>

          {/* Geri sayımlar */}
          {nextPrayer && (
            <div className="grid border-b border-white/[0.07]" style={{ gridTemplateColumns: "1fr 1px 1fr", animation: "fadeDown 0.6s ease both" }}>
              <div className="text-center py-5 px-4">
                <p className="text-white/35 text-[11px] uppercase tracking-widest mb-1.5" style={{ fontFamily: "'Crimson Text', serif" }}>
                  {nextPrayer} vaktine kalan
                </p>
                <div className="text-white/80 text-[26px] font-semibold tabular-nums tracking-wide" style={{ fontFamily: "'Cinzel', serif" }}>
                  {countdown}
                </div>
              </div>
              <div className="bg-white/10 self-stretch w-px my-4" />
              <div className="text-center py-5 px-4">
                <p className={`text-[11px] uppercase tracking-widest mb-1.5 ${iftarPassed ? "text-amber-400/50" : "text-white/35"}`} style={{ fontFamily: "'Crimson Text', serif" }}>
                  {iftarPassed ? "İftar yapıldı 🍽️" : "İftara kalan"}
                </p>
                <div className={`text-[26px] font-semibold tabular-nums tracking-wide ${iftarPassed ? "text-amber-400/50" : "text-amber-300"}`}
                  style={{ fontFamily: "'Cinzel', serif", textShadow: iftarPassed ? "none" : "0 0 20px rgba(251,191,36,0.4)" }}>
                  {iftarPassed ? "——" : iftarCountdown}
                </div>
              </div>
            </div>
          )}

          {/* Günlük vakitler */}
          <div className="px-4 py-5">
            {prayerTimes ? (
              <>
                <PrayerRow label="Sahur" time={fmt(prayerTimes.fajr)} highlight icon="🌙" delay={0.1} />
                <PrayerRow label="Güneş Doğuşu" time={fmt(prayerTimes.sunrise)} highlight={false} icon="🌅" delay={0.2} />
                <PrayerRow label="Öğle" time={fmt(prayerTimes.dhuhr)} highlight={false} icon="☀️" delay={0.3} />
                <PrayerRow label="İkindi" time={fmt(prayerTimes.asr)} highlight={false} icon="🌤️" delay={0.4} />
                <PrayerRow label="İftar" time={fmt(prayerTimes.maghrib)} highlight icon="🌇" delay={0.5} />
                <PrayerRow label="Yatsı" time={fmt(prayerTimes.isha)} highlight={false} icon="🌃" delay={0.6} />
              </>
            ) : (
              <p className="text-white/40 text-center py-5" style={{ fontFamily: "'Crimson Text', serif" }}>⏳ Vakitler hesaplanıyor...</p>
            )}
          </div>


        {/* ——— 30 Günlük Takvim ——— */}
        {coords && <RamadanCalendar coords={coords} today={now} />}
        

      </div>
      {/* FOOTER BÖLÜMÜ */}
      <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 block">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            
            {/* Hakkımızda */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Hakkımızda</h3>
              <p className="text-sm leading-relaxed mb-4">
                Genetik, olmazsa olmazımızdır.
              </p>
              <div className="flex gap-3">
                <a href="https://www.facebook.com/mansurciftligi" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                  <a href="https://instagram.com/mansurciftlikk" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                      <path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                <a href="https://tiktok.com/@mansur.ciftlik" target="_blank" rel="noopener noreferrer" class="hover:text-black transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Hızlı Linkler */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Hızlı Linkler</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Ana Sayfa</a></li>
                <li><a href="#" className="hover:text-white transition">Hakkımızda (Yakında)</a></li>
                <li><a href="#" className="hover:text-white transition">Ürünlerimiz (Yakında)</a></li>
                <li><a href="#" className="hover:text-white transition">Galeri (Yakında)</a></li>
                <li><a href="#" className="hover:text-white transition">İletişim (Yakında)</a></li>
              </ul>
            </div>

            {/* İletişim Bilgileri */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">İletişim</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <span>Müsellim Köyü Mansurlu Mah. Yapraklı/Çankırı</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  <a href='tel:+905060281318'>+90 506 028 13 18</a>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  <a href='mailto:mansurciftlikk@gmail.com'>mansurciftlikk@gmail.com</a>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                  </svg>
                  <span>Haftanın 7 günü: 06:00 - 20:00</span>
                </li>
              </ul>
            </div>

            {/* Yönetim Ekibi */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Yönetim Ekibi</h3>
              <div className="space-y-4">
                {/* CEO 1 */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">Mustafa Köle</h4>
                    <p className="text-xs text-gray-400">CEO & Kurucu</p>
                    <a className='text-sm' href='tel:+905060281318'>+90 506 028 13 18</a>
                  </div>
                </div>
                
                {/* CEO 2 */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">Mehmet Emre Köle</h4>
                    <p className="text-xs text-gray-400">CEO & Sosyal Medya Yöneticisi</p>
                    <a className='text-sm' href='tel:+905439445568'>+90 543 944 55 68</a>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Alt Çizgi ve Copyright */}
          <div className="border-t border-gray-800 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
              <p>&copy; 2018 Mansur Çiftlik. Tüm hakları saklıdır.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-white transition">Gizlilik Politikası (Yakında)</a>
                <a href="#" className="hover:text-white transition">Kullanım Şartları (Yakında)</a>
                <a href="#" className="hover:text-white transition">KVKK (Yakında)</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>    </div>
  );
}