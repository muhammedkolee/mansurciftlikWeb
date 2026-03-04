'use client'

import { useState, useEffect, useRef, useMemo } from "react";
import { Coordinates, CalculationMethod, PrayerTimes } from "adhan";

// Ramazan 2026: 19 Şubat – 19 Mart (29 gün), Bayram: 20 Mart
const RAMADAN_START = new Date(2026, 1, 19);
const RAMADAN_DAYS = 30;

const TURKEY_CITIES = [
  { name: "Adana", lat: 37.0, lng: 35.3213 }, { name: "Adıyaman", lat: 37.7648, lng: 38.2786 }, { name: "Afyonkarahisar", lat: 38.7507, lng: 30.5567 }, { name: "Ağrı", lat: 39.7191, lng: 43.0503 }, { name: "Aksaray", lat: 38.3687, lng: 34.037 }, { name: "Amasya", lat: 40.6499, lng: 35.8353 }, { name: "Ankara", lat: 39.9334, lng: 32.8597 }, { name: "Antalya", lat: 36.8969, lng: 30.7133 }, { name: "Ardahan", lat: 41.1105, lng: 42.7022 }, { name: "Artvin", lat: 41.1828, lng: 41.8183 }, { name: "Aydın", lat: 37.856, lng: 27.8416 }, { name: "Balıkesir", lat: 39.6484, lng: 27.8826 }, { name: "Bartın", lat: 41.6344, lng: 32.3375 }, { name: "Batman", lat: 37.8812, lng: 41.1351 }, { name: "Bayburt", lat: 40.2552, lng: 40.2249 }, { name: "Bilecik", lat: 40.15, lng: 29.9792 }, { name: "Bingöl", lat: 38.8854, lng: 40.4983 }, { name: "Bitlis", lat: 38.3938, lng: 42.1232 }, { name: "Bolu", lat: 40.7359, lng: 31.6061 }, { name: "Burdur", lat: 37.721, lng: 30.2906 }, { name: "Bursa", lat: 40.1885, lng: 29.061 }, { name: "Çanakkale", lat: 40.1553, lng: 26.4142 }, { name: "Çankırı", lat: 40.6013, lng: 33.6134 }, { name: "Çorum", lat: 40.5506, lng: 34.9556 }, { name: "Denizli", lat: 37.7765, lng: 29.0864 }, { name: "Diyarbakır", lat: 37.9144, lng: 40.2306 }, { name: "Düzce", lat: 40.8438, lng: 31.1565 }, { name: "Edirne", lat: 41.6818, lng: 26.5623 }, { name: "Elazığ", lat: 38.681, lng: 39.2264 }, { name: "Erzincan", lat: 39.75, lng: 39.5 }, { name: "Erzurum", lat: 39.9, lng: 41.27 }, { name: "Eskişehir", lat: 39.7767, lng: 30.5206 }, { name: "Gaziantep", lat: 37.0662, lng: 37.3833 }, { name: "Giresun", lat: 40.9128, lng: 38.3895 }, { name: "Gümüşhane", lat: 40.4386, lng: 39.4814 }, { name: "Hakkari", lat: 37.5744, lng: 43.7408 }, { name: "Hatay", lat: 36.4018, lng: 36.3498 }, { name: "Iğdır", lat: 39.9167, lng: 44.0333 }, { name: "Isparta", lat: 37.7648, lng: 30.5566 }, { name: "İstanbul", lat: 41.0082, lng: 28.9784 }, { name: "İzmir", lat: 38.4192, lng: 27.1287 }, { name: "Kahramanmaraş", lat: 37.5858, lng: 36.9371 }, { name: "Karabük", lat: 41.2061, lng: 32.6204 }, { name: "Karaman", lat: 37.1759, lng: 33.2287 }, { name: "Kars", lat: 40.6013, lng: 43.0975 }, { name: "Kastamonu", lat: 41.3887, lng: 33.7827 }, { name: "Kayseri", lat: 38.7312, lng: 35.4787 }, { name: "Kilis", lat: 36.7184, lng: 37.1212 }, { name: "Kırıkkale", lat: 39.8468, lng: 33.5153 }, { name: "Kırklareli", lat: 41.7333, lng: 27.2167 }, { name: "Kırşehir", lat: 39.1425, lng: 34.1709 }, { name: "Kocaeli", lat: 40.8533, lng: 29.8815 }, { name: "Konya", lat: 37.8746, lng: 32.4932 }, { name: "Kütahya", lat: 39.4167, lng: 29.9833 }, { name: "Malatya", lat: 38.3552, lng: 38.3095 }, { name: "Manisa", lat: 38.6191, lng: 27.4289 }, { name: "Mardin", lat: 37.3212, lng: 40.7245 }, { name: "Mersin", lat: 36.8, lng: 34.6333 }, { name: "Muğla", lat: 37.2153, lng: 28.3636 }, { name: "Muş", lat: 38.9462, lng: 41.7539 }, { name: "Nevşehir", lat: 38.6939, lng: 34.6857 }, { name: "Niğde", lat: 37.9667, lng: 34.6833 }, { name: "Ordu", lat: 40.9862, lng: 37.8797 }, { name: "Osmaniye", lat: 37.0742, lng: 36.2464 }, { name: "Rize", lat: 41.0201, lng: 40.5234 }, { name: "Sakarya", lat: 40.694, lng: 30.4358 }, { name: "Samsun", lat: 41.2867, lng: 36.33 }, { name: "Şanlıurfa", lat: 37.1591, lng: 38.7969 }, { name: "Siirt", lat: 37.9333, lng: 41.95 }, { name: "Sinop", lat: 42.0231, lng: 35.1531 }, { name: "Şırnak", lat: 37.5164, lng: 42.4611 }, { name: "Sivas", lat: 39.7477, lng: 37.0179 }, { name: "Tekirdağ", lat: 40.9781, lng: 27.5115 }, { name: "Tokat", lat: 40.3167, lng: 36.55 }, { name: "Trabzon", lat: 41.0015, lng: 39.7178 }, { name: "Tunceli", lat: 39.1079, lng: 39.5401 }, { name: "Uşak", lat: 38.6823, lng: 29.4082 }, { name: "Van", lat: 38.4891, lng: 43.4089 }, { name: "Yalova", lat: 40.655, lng: 29.2769 }, { name: "Yozgat", lat: 39.8181, lng: 34.8147 }, { name: "Zonguldak", lat: 41.4564, lng: 31.7987 },
];

const fmt = (time) => time.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

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
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

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

const STARS = Array.from({ length: 55 }, () => ({
  x: Math.random() * 100, y: Math.random() * 100,
  s: Math.random() * 2 + 0.5, d: Math.random() * 4, o: Math.random() * 0.6 + 0.2,
}));

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

const CitySelector = ({ selectedCity, onSelect, onGeolocate, geoLoading }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  const filtered = TURKEY_CITIES.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <div className="flex gap-2">
        <div onClick={() => setOpen(o => !o)}
          className="flex-1 flex items-center justify-between px-4 py-2.5 rounded-xl cursor-pointer bg-white/[0.06] border border-white/[0.12] hover:bg-white/10 transition-all">
          <span className="text-white/85" style={{ fontFamily: "'Crimson Text', serif", fontSize: 15 }}>
            🏙️ {selectedCity || "Şehir seçin..."}
          </span>
          <span className="text-white/40 text-xs transition-transform duration-200" style={{ transform: open ? "rotate(180deg)" : "rotate(0)" }}>▼</span>
        </div>
        <button onClick={onGeolocate} disabled={geoLoading}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-amber-400/30 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20 transition-all disabled:opacity-60 disabled:cursor-wait whitespace-nowrap"
          style={{ fontFamily: "'Crimson Text', serif", fontSize: 13 }}>
          {geoLoading ? "⏳" : "📍"} {geoLoading ? "Alınıyor..." : "Konumum"}
        </button>
      </div>
      {open && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
          style={{ background: "rgba(10,22,40,0.97)", backdropFilter: "blur(20px)", animation: "dropDown 0.15s ease" }}>
          <div className="p-2.5 border-b border-white/[0.07]">
            <input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Şehir ara..."
              className="w-full bg-white/[0.06] border border-white/10 rounded-lg px-3 py-2 text-white outline-none placeholder-white/30"
              style={{ fontFamily: "'Crimson Text', serif", fontSize: 14 }} />
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {filtered.length === 0 ? <div className="p-4 text-center text-white/30 text-sm" style={{ fontFamily: "'Crimson Text', serif" }}>Şehir bulunamadı</div>
              : filtered.map(city => (
                <div key={city.name} onClick={() => { onSelect(city); setOpen(false); setSearch(""); }}
                  className="px-4 py-2.5 cursor-pointer transition-all duration-150 hover:bg-white/[0.05]"
                  style={{
                    fontFamily: "'Crimson Text', serif", fontSize: 15,
                    color: selectedCity === city.name ? "#FDE68A" : "rgba(255,255,255,0.75)",
                    background: selectedCity === city.name ? "rgba(251,191,36,0.1)" : "",
                    borderLeft: selectedCity === city.name ? "2px solid #FDE68A" : "2px solid transparent",
                  }}>
                  {city.name}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

const RamadanCalendar = ({ coords, today }) => {
  const [selected, setSelected] = useState(null);
  const schedule = useMemo(() => {
    if (!coords) return [];
    const coordinates = new Coordinates(coords.lat, coords.lng);
    const params = CalculationMethod.Turkey();
    return Array.from({ length: RAMADAN_DAYS }, (_, i) => {
      const date = new Date(RAMADAN_START);
      date.setDate(RAMADAN_START.getDate() + i);
      const pt = new PrayerTimes(coordinates, date, params);
      return {
        date, day: i + 1, fajr: fmt(pt.fajr), sunrise: fmt(pt.sunrise), dhuhr: fmt(pt.dhuhr), asr: fmt(pt.asr), maghrib: fmt(pt.maghrib), isha: fmt(pt.isha),
        isToday: isSameDay(date, today), isTomorrow: isSameDay(date, new Date(today.getTime() + 86400000)), isPast: date < today && !isSameDay(date, today), isEid: i === RAMADAN_DAYS - 1,
      };
    });
  }, [coords]);

  useEffect(() => {
    if (schedule.length === 0) return;
    const t = schedule.find(d => d.isToday) || schedule.find(d => d.isTomorrow);
    if (t) setSelected(t);
  }, [schedule]);

  const WEEKDAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

  return (
    <div className="rounded-3xl border border-white/[0.08] overflow-hidden w-full" style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)" }}>
      <div className="flex items-center  gap-3 px-6 py-5 border-b border-white/[0.07]">
        <span className="text-xl">🗓️</span>
        <div>
          <h2 className="text-amber-300 font-semibold tracking-widest text-sm uppercase" style={{ fontFamily: "'Cinzel', serif" }}>Ramazan Takvimi 2026</h2>
          <p className="text-white/30 text-xs italic mt-0.5" style={{ fontFamily: "'Crimson Text', serif" }}>19 Şubat – 19 Mart · Bayram 20 Mart</p>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2 p-4">
        {schedule.map((row) => {
          const wd = WEEKDAYS[(row.date.getDay() + 6) % 7];
          const isFri = (row.date.getDay() + 6) % 7 === 4;
          let cellClass = "relative rounded-2xl p-2.5 cursor-pointer transition-all duration-200 border select-none ";
          if (row.isToday) cellClass += "border-emerald-400/60 bg-emerald-400/20 shadow-lg shadow-emerald-400/10 ring-1 ring-emerald-400/30";
          else if (row.isTomorrow) cellClass += "border-sky-400/50 bg-sky-400/[0.1] hover:bg-sky-400/[0.15]";
          else if (row.isEid) cellClass += "border-red-400/50 bg-red-400/15 hover:bg-red-400/20";
          else if (row.isPast) cellClass += "border-white/[0.04] bg-white/[0.02] opacity-35 hover:opacity-50";
          else if (isFri) cellClass += "border-violet-400/25 bg-violet-500/[0.07] hover:bg-violet-500/[0.12]";
          else cellClass += "border-white/[0.1] bg-white/[0.05] hover:bg-white/[0.09]";

          return (
            <div key={row.day} className={cellClass} onClick={() => setSelected(row)}>
              <div className="flex items-start justify-between mb-1.5">
                <span className={`text-[10px] font-mono font-bold ${row.isToday ? "text-emerald-300" : row.isTomorrow ? "text-sky-300" : "text-white/70"}`}>{row.day}</span>
                <span className="text-[9px] text-white/40">{wd}</span>
              </div>
              <div className="text-[11px] font-semibold text-white/90 mb-2 truncate" style={{ fontFamily: "'Crimson Text', serif" }}>
                {row.date.toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
              </div>
              <div className="text-[10px] tabular-nums font-bold text-blue-300/80">🌙 {row.fajr}</div>
              <div className="text-[10px] tabular-nums font-bold text-amber-300/80">🌇 {row.maghrib}</div>
            </div>
          );
        })}
      </div>
      {selected && (
        <div className="mx-4 mb-4 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md">
          <div className="px-5 py-3 border-b border-white/[0.07] flex justify-between">
            <span className="text-white/90 font-semibold" style={{ fontFamily: "'Crimson Text', serif" }}>{selected.date.toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" })}</span>
            <span className="text-white/40 text-xs">Ramazan {selected.day}</span>
          </div>
          <div className="grid grid-cols-3 gap-px bg-white/[0.05]">
            {[{ label: "İmsak", time: selected.fajr, icon: "🌙" }, { label: "Güneş", time: selected.sunrise, icon: "🌅" }, { label: "Öğle", time: selected.dhuhr, icon: "☀️" }, { label: "İkindi", time: selected.asr, icon: "🌤️" }, { label: "İftar", time: selected.maghrib, icon: "🌇" }, { label: "Yatsı", time: selected.isha, icon: "🌃" }].map(v => (
              <div key={v.label} className="bg-white/[0.02] py-3 text-center">
                <div className="text-xs">{v.icon}</div>
                <div className="text-[10px] text-white/40">{v.label}</div>
                <div className="text-xs font-bold text-white/80">{v.time}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

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
    const pt = new PrayerTimes(new Coordinates(lat, lng), new Date(), CalculationMethod.Turkey());
    setPrayerTimes(pt); setCoords({ lat, lng }); setLocationName(name);
  };

  const requestGeolocation = () => {
    if (!navigator.geolocation) { setGeoError("Desteklenmiyor."); return; }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=tr`);
          const data = await res.json();
          loadFromCoords(latitude, longitude, data.address?.city || data.address?.town || "Konumunuz");
        } catch { loadFromCoords(latitude, longitude, "Konumunuz"); }
        setGeoLoading(false);
      },
      () => { setGeoError("İzin reddedildi."); setGeoLoading(false); }
    );
  };

  useEffect(() => { requestGeolocation(); }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      const cur = new Date(); setNow(cur);
      if (!prayerTimes) return;
      const times = [{ name: "Sabah", time: prayerTimes.fajr }, { name: "Güneş", time: prayerTimes.sunrise }, { name: "Öğle", time: prayerTimes.dhuhr }, { name: "İkindi", time: prayerTimes.asr }, { name: "Akşam", time: prayerTimes.maghrib }, { name: "Yatsı", time: prayerTimes.isha }];
      const next = times.find(t => t.time > cur);
      if (next) { setCountdown(toHMS(next.time - cur)); setNextPrayer(next.name); }
      if (prayerTimes.maghrib > cur) { setIftarCountdown(toHMS(prayerTimes.maghrib - cur)); setIftarPassed(false); }
      else setIftarPassed(true);
    }, 1000);
    return () => clearInterval(iv);
  }, [prayerTimes]);

  return (
    <div className="min-h-screen relative flex flex-col items-center font-sans overflow-x-hidden" style={{ background: "linear-gradient(170deg, #020817 0%, #0a1628 40%, #0d1f3c 70%, #0a1224 100%)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&family=Cinzel:wght@400;500;600&display=swap');
        @keyframes twinkle { 0%,100%{transform:scale(1)} 50%{opacity:.1;transform:scale(.7)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes pulseGlow { 0%,100%{box-shadow:0 0 30px rgba(251,191,36,.15)} 50%{box-shadow:0 0 50px rgba(251,191,36,.3)} }
        .main-card{animation:pulseGlow 4s ease-in-out infinite}
      `}</style>

      {/* Stars */}
      {STARS.map((s, i) => (
        <div key={i} className="absolute rounded-full bg-white pointer-events-none" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, opacity: s.o, animation: `twinkle 3s ease-in-out ${s.d}s infinite` }} />
      ))}

      {/* Content Section */}
      <div className="w-full max-w-7xl px-4 py-8 relative z-10 flex-1">
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">

          {/* ANA KART */}
          <div className="w-full lg:w-[450px] main-card rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl overflow-visible">
            <div className="px-8 pt-8 pb-6 text-center border-b border-white/[0.07]">
              <div className="mb-3 flex justify-center"><MoonIcon phase={getMoonPhase()} /></div>
              <h1 className="text-2xl font-semibold tracking-widest text-amber-300" style={{ fontFamily: "'Cinzel', serif" }}>RAMAZAN VAKİTLERİ</h1>
              {locationName && <p className="text-white/50 text-sm uppercase mt-2">📍 {locationName}</p>}
            </div>

            <div className="px-5 py-4 border-b border-white/[0.07]">
              <CitySelector selectedCity={locationName} onSelect={c => loadFromCoords(c.lat, c.lng, c.name)} onGeolocate={requestGeolocation} geoLoading={geoLoading} />
            </div>

            {nextPrayer && (
              <div className="grid border-b border-white/[0.07] grid-cols-2">
                <div className="text-center py-5 border-r border-white/10">
                  <p className="text-white/35 text-[10px] uppercase tracking-widest">{nextPrayer} VAKTİNE</p>
                  <div className="text-white/80 text-2xl font-semibold tabular-nums" style={{ fontFamily: "'Cinzel', serif" }}>{countdown}</div>
                </div>
                <div className="text-center py-5">
                  <p className="text-white/35 text-[10px] uppercase tracking-widest">{iftarPassed ? "İFTAR YAPILDI" : "İFTARA KALAN"}</p>
                  <div className="text-amber-300 text-2xl font-semibold tabular-nums" style={{ fontFamily: "'Cinzel', serif" }}>{iftarPassed ? "——" : iftarCountdown}</div>
                </div>
              </div>
            )}

            <div className="px-4 py-5">
              {prayerTimes ? (
                <>
                  <PrayerRow label="Sahur" time={fmt(prayerTimes.fajr)} highlight icon="🌙" delay={0.1} />
                  <PrayerRow label="Güneş" time={fmt(prayerTimes.sunrise)} highlight={false} icon="🌅" delay={0.2} />
                  <PrayerRow label="Öğle" time={fmt(prayerTimes.dhuhr)} highlight={false} icon="☀️" delay={0.3} />
                  <PrayerRow label="İkindi" time={fmt(prayerTimes.asr)} highlight={false} icon="🌤️" delay={0.4} />
                  <PrayerRow label="İftar" time={fmt(prayerTimes.maghrib)} highlight icon="🌇" delay={0.5} />
                  <PrayerRow label="Yatsı" time={fmt(prayerTimes.isha)} highlight={false} icon="🌃" delay={0.6} />
                </>
              ) : <div className="text-white/40 text-center py-5">Vakitler yükleniyor...</div>}
            </div>
          </div>

          {/* TAKVİM */}
          <div className="w-full lg:flex-1 max-w-2xl">
            {coords && <RamadanCalendar coords={coords} today={now} />}
          </div>
        </div>
      </div>
    </div>
  );
}