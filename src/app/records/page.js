"use client";
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

// ── Sabitler ──────────────────────────────────────────────────
const MONTHS_TR = [
  'Ocak','Şubat','Mart','Nisan','Mayıs','Haziran',
  'Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık',
];
const DAYS_TR = ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'];

// Supabase tablo adı — farklıysa buradan değiştirin
const TABLE = 'milk_records';

// ── Yardımcılar ───────────────────────────────────────────────
const toISODate = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};
const getTodayStr = () => toISODate(new Date());
const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const getFirstDow = (y, m) => { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1; };
const monthPrefix = (y, m) => `${y}-${String(m + 1).padStart(2, '0')}`;

function formatDateTR(s) {
  if (!s) return '';
  const [y, m, d] = s.split('-');
  return `${parseInt(d)} ${MONTHS_TR[parseInt(m) - 1]} ${y}`;
}

// ── Takvim Bileşeni ───────────────────────────────────────────
function CalendarGrid({ year, month, recordMap, onDayClick, onPrev, onNext, showNav }) {
  const today = getTodayStr();
  const days = getDaysInMonth(year, month);
  const startDow = getFirstDow(year, month);
  const pfx = monthPrefix(year, month);
  const monthRecs = Object.entries(recordMap).filter(([k]) => k.startsWith(pfx));
  const monthKg = monthRecs.reduce((s, [, r]) => s + parseFloat(r.amount || 0), 0);

  return (
    <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid #e8e4dd' }}>
      {/* Ay başlığı */}
      <div style={{ background: 'linear-gradient(135deg, #1a2e1a 0%, #2d4a2d 100%)', padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {showNav ? (
            <button onClick={onPrev} style={navBtnStyle} aria-label="Önceki ay">‹</button>
          ) : <div style={{ width: 40 }} />}

          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 17, letterSpacing: 0.3 }}>
              {MONTHS_TR[month]} {year}
            </div>
            {monthRecs.length > 0 && (
              <div style={{ color: '#8ec07c', fontSize: 12, marginTop: 2 }}>
                {monthRecs.length} kayıt · <strong>{monthKg.toFixed(1)} kg</strong>
              </div>
            )}
          </div>

          {showNav ? (
            <button onClick={onNext} style={navBtnStyle} aria-label="Sonraki ay">›</button>
          ) : <div style={{ width: 40 }} />}
        </div>
      </div>

      {/* Gün isimleri */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: '#f8f6f2', borderBottom: '1px solid #ede9e1' }}>
        {DAYS_TR.map((d, i) => (
          <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, padding: '8px 0', color: i === 6 ? '#e05a5a' : '#8a8070', letterSpacing: 0.5 }}>
            {d}
          </div>
        ))}
      </div>

      {/* Günler */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {Array.from({ length: startDow }, (_, i) => (
          <div key={`e${i}`} style={{ minHeight: 58, borderRight: '1px solid #f0ece6', borderBottom: '1px solid #f0ece6', background: '#faf9f7' }} />
        ))}
        {Array.from({ length: days }, (_, i) => {
          const day = i + 1;
          const dateStr = `${pfx}-${String(day).padStart(2, '0')}`;
          const rec = recordMap[dateStr];
          const isToday = dateStr === today;
          const isPast = dateStr < today && !isToday;
          const isSun = (startDow + i) % 7 === 6;

          return (
            <button
              key={dateStr}
              onClick={() => onDayClick(dateStr)}
              style={{
                minHeight: 58,
                padding: '6px 4px 4px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                border: 'none',
                borderRight: '1px solid #f0ece6',
                borderBottom: '1px solid #f0ece6',
                cursor: 'pointer',
                background: isToday ? '#edf7ea' : rec ? '#f5fbf4' : '#fff',
                transition: 'background 0.15s',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <span style={{
                width: 30, height: 30,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '50%',
                fontSize: 14,
                fontWeight: isToday ? 700 : rec ? 600 : 500,
                background: isToday ? '#1a2e1a' : 'transparent',
                color: isToday ? '#fff' : isSun ? '#e05a5a' : isPast && !rec ? '#c8c0b4' : '#1a1a1a',
              }}>
                {day}
              </span>
              {rec && (
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  color: '#2a6b2a', background: '#d4f0d4',
                  padding: '1px 5px', borderRadius: 10, lineHeight: 1.5,
                  whiteSpace: 'nowrap',
                }}>
                  {rec.amount}kg
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const navBtnStyle = {
  width: 40, height: 40,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 12,
  color: 'rgba(255,255,255,0.85)',
  fontSize: 24, lineHeight: 1,
  cursor: 'pointer',
  transition: 'background 0.15s',
};

// ── Ana Sayfa ─────────────────────────────────────────────────
export default function RecordsDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [viewMonth, setViewMonth] = useState(() => {
    const n = new Date(); return { year: n.getFullYear(), month: n.getMonth() };
  });
  const [viewAll, setViewAll] = useState(false);
  const [modal, setModal] = useState({ open: false, date: '', amount: '', loading: false, error: '', confirmDelete: false });
  const [calc, setCalc] = useState({ start: '', end: '', price: '' });
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/login'); return; }
      setUser(session.user);
      await fetchRecords(session.user.id);
      setLoading(false);
    });
  }, [router]);

  const fetchRecords = useCallback(async (uid) => {
    const { data, error } = await supabase.from(TABLE).select('*').eq('user_id', uid).order('production_date', { ascending: true });
    if (!error && data) setRecords(data);
    else if (error) console.error('Fetch error:', error.message, '— Tablo adı doğru mu? (', TABLE, ')');
  }, []);

  const recordMap = records.reduce((a, r) => ({ ...a, [r.production_date]: r }), {});

  const openModal = (dateStr) => {
    const r = recordMap[dateStr];
    setModal({ open: true, date: dateStr, amount: r ? String(r.amount) : '', loading: false, error: '', confirmDelete: false });
  };
  const closeModal = () => setModal(m => ({ ...m, open: false }));

  const saveRecord = async () => {
    const val = parseFloat(modal.amount);
    if (!modal.amount || isNaN(val) || val <= 0) { setModal(m => ({ ...m, error: 'Geçerli bir miktar girin.' })); return; }
    setModal(m => ({ ...m, loading: true, error: '' }));
    const { error } = await supabase.from("milk_records").upsert({ amount: val, production_date: modal.date, user_id: user.id });
    if (error) { console.log(error) }
    closeModal();
    fetchRecords(user.id);
  };

  const deleteRecord = async () => {
    const r = recordMap[modal.date];
    if (!r) return;
    setModal(m => ({ ...m, loading: true }));
    await supabase.from(TABLE).delete().eq('id', r.id);
    closeModal(); fetchRecords(user.id);
  };

  const prevMonth = () => setViewMonth(({ year, month }) => month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 });
  const nextMonth = () => setViewMonth(({ year, month }) => month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 });

  // Tüm aylar (viewAll)
  const allMonths = (() => {
    if (!viewAll || !records.length) return [];
    const sorted = records.map(r => r.production_date).sort();
    const min = new Date(sorted[0]), max = new Date(sorted[sorted.length - 1]);
    const list = [];
    let y = min.getFullYear(), m = min.getMonth();
    while (y < max.getFullYear() || (y === max.getFullYear() && m <= max.getMonth())) {
      list.push({ year: y, month: m });
      if (++m > 11) { m = 0; y++; }
    }
    return list.reverse();
  })();

  // Bu ay özeti
  const pfx = monthPrefix(viewMonth.year, viewMonth.month);
  const curMonthRecs = records.filter(r => r.production_date.startsWith(pfx));
  const curMonthKg = curMonthRecs.reduce((s, r) => s + parseFloat(r.amount || 0), 0);
  const totalKg = records.reduce((s, r) => s + parseFloat(r.amount || 0), 0);

  // Hesaplayıcı
  const calcRecs = records.filter(r => calc.start && calc.end && r.production_date >= calc.start && r.production_date <= calc.end);
  const calcKg = calcRecs.reduce((s, r) => s + parseFloat(r.amount || 0), 0);
  const calcRevenue = calc.price && parseFloat(calc.price) > 0 ? calcKg * parseFloat(calc.price) : null;

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f5f0e8', gap: 16 }}>
      <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid #d4e8d4', borderTopColor: '#1a2e1a', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color: '#6a6055', fontSize: 14, fontWeight: 500 }}>Yükleniyor...</p>
    </div>
  );
  if (!user) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #f2ede6; font-family: 'DM Sans', sans-serif; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .day-btn:active { transform: scale(0.92); }
        .press-btn:active { transform: scale(0.97); }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        input[type=date]::-webkit-calendar-picker-indicator { opacity: 0.5; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#f2ede6', fontFamily: "'DM Sans', sans-serif" }}>

        {/* ── Header ── */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 40,
          background: 'linear-gradient(135deg, #1a2e1a 0%, #243524 100%)',
          boxShadow: '0 2px 20px rgba(0,0,0,0.2)',
        }}>
          <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 16px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 38, height: 38, background: 'rgba(255,255,255,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0, border: '1px solid rgba(255,255,255,0.12)' }}>🌿</div>
              <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>Süt Kayıt Paneli</div>
                <div style={{ color: 'rgba(142,192,124,0.8)', fontSize: 11, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>{user.email}</div>
              </div>
            </div>
            <button
              onClick={async () => { await supabase.auth.signOut(); router.push('/login'); }}
              style={{ padding: '7px 14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}
            >
              Çıkış
            </button>
          </div>
        </header>

        {/* ── İstatistik Kartları ── */}
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '16px 16px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: '14px 16px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: '1px solid #ede9e1' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#8a8070', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>Bu Ay</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#1a2e1a', lineHeight: 1 }}>{curMonthKg.toFixed(0)}<span style={{ fontSize: 14, fontWeight: 500, color: '#6a8a6a', marginLeft: 4 }}>kg</span></div>
              <div style={{ fontSize: 11, color: '#a09080', marginTop: 3 }}>{curMonthRecs.length} gün kayıt</div>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #1a2e1a 0%, #2d4a2d 100%)', borderRadius: 16, padding: '14px 16px', boxShadow: '0 1px 8px rgba(0,0,0,0.12)' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(142,192,124,0.7)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>Toplam</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{totalKg.toFixed(0)}<span style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.55)', marginLeft: 4 }}>kg</span></div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>{records.length} kayıt</div>
            </div>
          </div>

          {/* ── Aylık Takvim ── */}
          {!viewAll && (
            <div style={{ marginBottom: 12 }}>
              <CalendarGrid
                year={viewMonth.year}
                month={viewMonth.month}
                recordMap={recordMap}
                onDayClick={openModal}
                onPrev={prevMonth}
                onNext={nextMonth}
                showNav={true}
              />
              <p style={{ textAlign: 'center', fontSize: 12, color: '#a49880', marginTop: 10 }}>
                Bir güne dokunarak kayıt ekleyebilirsiniz
              </p>
            </div>
          )}

          {/* ── Tüm Verileri Gör / Geri ── */}
          <button
            className="press-btn"
            onClick={() => setViewAll(v => !v)}
            style={{
              width: '100%', padding: '14px 16px', marginBottom: 12,
              background: '#fff', border: '1px solid #e5e0d8',
              borderRadius: 16, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              fontSize: 14, fontWeight: 600, color: '#2a2a2a',
              boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
              fontFamily: 'inherit', transition: 'transform 0.1s',
            }}
          >
            {viewAll ? (
              <span>← Aylık Görünüme Dön</span>
            ) : (
              <>
                <span>📋 Tüm Verileri Gör</span>
                {records.length > 0 && (
                  <span style={{ background: '#e8f5e3', color: '#2a6b2a', fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>
                    {records.length}
                  </span>
                )}
              </>
            )}
          </button>

          {/* ── Tüm aylar ── */}
          {viewAll && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 12 }}>
              {allMonths.length === 0 ? (
                <div style={{ background: '#fff', borderRadius: 20, padding: '48px 24px', textAlign: 'center', border: '1px solid #ede9e1' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🐄</div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: '#2a2a2a', marginBottom: 6 }}>Henüz kayıt yok</div>
                  <div style={{ fontSize: 13, color: '#a09080' }}>Aşağıdaki + butonu ile bugünkü kaydı ekleyin</div>
                </div>
              ) : allMonths.map(({ year, month }) => (
                <CalendarGrid key={`${year}-${month}`} year={year} month={month} recordMap={recordMap} onDayClick={openModal} showNav={false} />
              ))}
            </div>
          )}

          {/* ── Gelir Hesaplayıcı ── */}
          <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: '1px solid #e5e0d8', marginBottom: 100 }}>
            <div style={{ background: 'linear-gradient(135deg, #1a2e1a 0%, #2d4a2d 100%)', padding: '14px 16px' }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>💰 Gelir Hesaplayıcı</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 }}>Tarih aralığı ve fiyat girerek gelirinizi hesaplayın</div>
            </div>

            <div style={{ padding: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                {[['start', 'Başlangıç'], ['end', 'Bitiş']].map(([key, label]) => (
                  <div key={key}>
                    <label style={labelStyle}>{label}</label>
                    <input
                      type="date"
                      value={calc[key]}
                      onChange={e => setCalc(c => ({ ...c, [key]: e.target.value }))}
                      style={inputStyle}
                    />
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Süt Fiyatı (₺/kg)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#8a8070', fontWeight: 600, fontSize: 15 }}>₺</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={calc.price}
                    onChange={e => setCalc(c => ({ ...c, price: e.target.value }))}
                    min="0" step="0.01" inputMode="decimal"
                    style={{ ...inputStyle, paddingLeft: 30 }}
                  />
                </div>
              </div>

              {calc.start && calc.end && (
                <div style={{
                  borderRadius: 14, padding: '14px 16px',
                  background: calcRecs.length > 0 ? '#f0fdf4' : '#faf9f7',
                  border: `1px solid ${calcRecs.length > 0 ? '#bbf0bb' : '#e5e0d8'}`,
                }}>
                  {calcRecs.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#a09080', fontSize: 13, padding: '8px 0' }}>Bu tarihlerde kayıt bulunamadı.</p>
                  ) : (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 13, color: '#6a6055' }}>Kayıt sayısı</span>
                        <span style={{ fontWeight: 700, color: '#1a1a1a' }}>{calcRecs.length} gün</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: calcRevenue !== null ? 12 : 0 }}>
                        <span style={{ fontSize: 13, color: '#6a6055' }}>Toplam Süt</span>
                        <span style={{ fontSize: 22, fontWeight: 700, color: '#1a2e1a' }}>{calcKg.toFixed(1)} kg</span>
                      </div>
                      {calcRevenue !== null && (
                        <div style={{ borderTop: '1px solid #bbf0bb', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 13, color: '#6a6055', fontWeight: 500 }}>Toplam Gelir</span>
                          <span style={{ fontSize: 26, fontWeight: 700, color: '#1a7a3a' }}>
                            ₺{calcRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── FAB ── */}
        <button
          onClick={() => openModal(getTodayStr())}
          style={{
            position: 'fixed', bottom: 24, right: 20, zIndex: 30,
            width: 60, height: 60, borderRadius: '50%',
            background: 'linear-gradient(135deg, #2a4a2a 0%, #1a2e1a 100%)',
            border: '2px solid rgba(142,192,124,0.3)',
            color: '#fff', fontSize: 28, lineHeight: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 24px rgba(26,46,26,0.45)',
            cursor: 'pointer', transition: 'transform 0.15s',
          }}
          className="press-btn"
          aria-label="Bugünkü kaydı ekle"
        >
          +
        </button>

        {/* ── Modal ── */}
        {modal.open && (
          <>
            <div onClick={closeModal} style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', animation: 'fadeIn 0.2s ease' }} />
            <div style={{
              position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 51,
              background: '#fff', borderRadius: '24px 24px 0 0',
              boxShadow: '0 -8px 40px rgba(0,0,0,0.2)',
              animation: 'slideUp 0.3s ease',
              overflow: 'hidden',
            }}>
              {/* Modal başlık */}
              <div style={{ background: 'linear-gradient(135deg, #1a2e1a 0%, #2d4a2d 100%)', padding: '18px 20px 16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600, marginBottom: 4 }}>Günlük Kayıt</div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 20, fontFamily: "'Playfair Display', serif" }}>{formatDateTR(modal.date)}</div>
                  {recordMap[modal.date] && (
                    <div style={{ color: '#8ec07c', fontSize: 12, marginTop: 3 }}>Mevcut: {recordMap[modal.date].amount} kg</div>
                  )}
                </div>
                <button onClick={closeModal} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, color: 'rgba(255,255,255,0.7)', width: 36, height: 36, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>×</button>
              </div>

              {/* Modal gövde */}
              <div style={{ padding: '20px 20px 32px' }}>
                <label style={{ ...labelStyle, marginBottom: 8, display: 'block' }}>Süt Miktarı</label>
                <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #e0dbd2', borderRadius: 14, overflow: 'hidden', marginBottom: 14, transition: 'border-color 0.2s' }}>
                  <input
                    type="number"
                    placeholder="0"
                    value={modal.amount}
                    onChange={e => setModal(m => ({ ...m, amount: e.target.value }))}
                    min="0" step="0.1" inputMode="decimal" autoFocus
                    style={{ flex: 1, border: 'none', outline: 'none', fontSize: 40, fontWeight: 700, color: '#1a2e1a', textAlign: 'center', padding: '14px 8px', fontFamily: 'inherit', background: 'transparent' }}
                  />
                  <div style={{ padding: '0 20px', fontSize: 18, fontWeight: 600, color: '#8a8070', borderLeft: '2px solid #f0ece6', background: '#faf9f7', alignSelf: 'stretch', display: 'flex', alignItems: 'center' }}>kg</div>
                </div>

                {modal.error && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#dc2626', marginBottom: 12, textAlign: 'center' }}>{modal.error}</div>
                )}

                <button
                  onClick={saveRecord}
                  disabled={modal.loading}
                  className="press-btn"
                  style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #2a4a2a, #1a2e1a)', color: '#fff', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: 'pointer', marginBottom: 10, fontFamily: 'inherit', opacity: modal.loading ? 0.7 : 1, transition: 'transform 0.1s' }}
                >
                  {modal.loading ? 'Kaydediliyor...' : recordMap[modal.date] ? '✓ Güncelle' : '+ Kaydet'}
                </button>

                {recordMap[modal.date] && !modal.confirmDelete && (
                  <button
                    onClick={() => setModal(m => ({ ...m, confirmDelete: true }))}
                    style={{ width: '100%', padding: '13px', background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 14, fontSize: 14, fontWeight: 600, color: '#dc2626', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    Kaydı Sil
                  </button>
                )}

                {modal.confirmDelete && (
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => setModal(m => ({ ...m, confirmDelete: false }))} style={{ flex: 1, padding: '13px', background: '#f5f3ef', border: '1px solid #e0dbd2', borderRadius: 14, fontSize: 14, fontWeight: 600, color: '#6a6055', cursor: 'pointer', fontFamily: 'inherit' }}>İptal</button>
                    <button onClick={deleteRecord} disabled={modal.loading} style={{ flex: 1, padding: '13px', background: '#dc2626', border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: 'inherit', opacity: modal.loading ? 0.7 : 1 }}>
                      {modal.loading ? 'Siliniyor...' : 'Evet, Sil'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

const labelStyle = {
  display: 'block', fontSize: 11, fontWeight: 700,
  color: '#7a7060', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6,
};

const inputStyle = {
  width: '100%', padding: '11px 14px',
  border: '1.5px solid #e0dbd2', borderRadius: 12,
  fontSize: 14, color: '#1a1a1a', background: '#faf9f7',
  outline: 'none', fontFamily: "'DM Sans', sans-serif",
};