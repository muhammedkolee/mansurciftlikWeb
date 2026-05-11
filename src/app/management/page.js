"use client";
import { useState, useEffect } from 'react';
import { supabaseManagement } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{background:#ffffff;font-family:'DM Sans',sans-serif;height:100%;}
  @keyframes spin{to{transform:rotate(360deg);}}
  .dash-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
  @media(min-width:640px){.dash-grid{grid-template-columns:repeat(4,1fr);}}
  .nav-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
  @media(min-width:640px){.nav-grid{grid-template-columns:repeat(3,1fr);}}
  .nav-tile{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:18px 12px;background:#fff;border-radius:14px;border:1.5px solid #e5e7eb;cursor:pointer;text-decoration:none;transition:border-color 0.15s,box-shadow 0.15s;min-height:80px;}
  .nav-tile:hover{border-color:#2c5f2e;box-shadow:0 2px 12px rgba(44,95,46,0.12);}
  .nav-tile:active{transform:scale(0.97);}
  .stat-card{background:#fff;border-radius:14px;padding:16px;border:1.5px solid #e5e7eb;display:flex;flex-direction:column;gap:4px;}
  .alert-item{display:flex;justify-content:space-between;align-items:center;padding:9px 12px;border-radius:10px;margin-bottom:6px;font-size:13px;}
`;

const NAV = [
  { href: '/cows', icon: '🐄', label: 'Gebe İnekler', color: '#dbeafe' },
  { href: '/animals', icon: '🐮', label: 'Tüm Hayvanlar', color: '#d1fae5' },
  { href: '/calves', icon: '🐣', label: 'Buzağılar', color: '#fce7f3' },
  { href: '/heifers', icon: '🌱', label: 'Düveler', color: '#fef3c7' },
  { href: '/bulls', icon: '🐂', label: 'Danalar', color: '#fee2e2' },
  { href: '/vaccines', icon: '💉', label: 'Aşılar', color: '#ede9fe' },
];

const STAT_COLORS = {
  cow: { bg: '#dbeafe', text: '#1e40af', dot: '#3b82f6', label: 'İnek' },
  calf: { bg: '#fce7f3', text: '#9d174d', dot: '#ec4899', label: 'Buzağı' },
  heifer: { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b', label: 'Düve' },
  bull: { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444', label: 'Dana' },
};

export default function ManagementDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({});
  const [upcoming, setUpcoming] = useState([]);
  const [empty, setEmpty] = useState([]);
  const router = useRouter();

  useEffect(() => {
    supabaseManagement.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/login'); return; }
      setUser(session.user);
      const uid = session.user.id;
      await Promise.all([fetchCounts(uid), fetchAlerts(uid)]);
      setLoading(false);
    });
  }, [router]);

  const fetchCounts = async (uid) => {
    const { data } = await supabaseManagement.from('Animals').select('Type').eq('user_id', uid).eq('IsDeleted', false);
    if (!data) return;
    setCounts(data.reduce((a, r) => ({ ...a, [r.Type]: (a[r.Type] || 0) + 1 }), {}));
  };

  const fetchAlerts = async (uid) => {
    const today = new Date();
    const { data: cows } = await supabaseManagement.from('Cows').select('EarringNo,Name,InseminationDate').eq('user_id', uid);
    const up = (cows || []).filter(c => c.InseminationDate).map(c => {
      const d = new Date(c.InseminationDate); d.setDate(d.getDate() + 280);
      return { name: c.Name || c.EarringNo, daysLeft: Math.ceil((d - today) / 86400000) };
    }).filter(c => c.daysLeft <= 30).sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 4);
    setUpcoming(up);

    const { data: heifers } = await supabaseManagement.from('Heifers').select('EarringNo,Name,LastBirthDate').eq('user_id', uid).not('LastBirthDate', 'is', null);
    const emp = (heifers || []).map(h => ({
      name: h.Name || h.EarringNo,
      days: Math.ceil((today - new Date(h.LastBirthDate)) / 86400000),
    })).filter(h => h.days > 60).sort((a, b) => b.days - a.days).slice(0, 4);
    setEmpty(emp);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff', flexDirection: 'column', gap: 12 }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #d1fae5', borderTopColor: '#2c5f2e', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#6b7280', fontSize: 14 }}>Yükleniyor...</p>
    </div>
  );
  if (!user) return null;

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <>
      <style>{STYLES}</style>
      <div style={{ minHeight: '100vh', background: '#ffffff', fontFamily: "'DM Sans',sans-serif" }}>

        {/* Header */}
        <div style={{ background: '#2c5f2e', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Mansur Çiftlik</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 1 }}>Yönetim Paneli</div>
          </div>
          <button
            onClick={async () => { await supabaseManagement.auth.signOut(); router.push('/login'); }}
            style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Çıkış
          </button>
        </div>

        <div style={{ maxWidth: 700, margin: '0 auto', padding: '16px 12px 40px' }}>

          {/* Stat Cards */}
          <div className="dash-grid" style={{ marginBottom: 14 }}>
            {['cow', 'calf', 'heifer', 'bull'].map(t => {
              const col = STAT_COLORS[t];
              return (
                <div key={t} className="stat-card" style={{ background: col.bg }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: col.text, lineHeight: 1 }}>{counts[t] || 0}</div>
                  <div style={{ fontSize: 12, color: col.text, opacity: 0.75 }}>{col.label}</div>
                </div>
              );
            })}
          </div>

          {/* Total */}
          <div style={{ background: '#2c5f2e', borderRadius: 14, padding: '14px 18px', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Toplam Sürü</div>
              <div style={{ color: '#fff', fontSize: 26, fontWeight: 700, lineHeight: 1.2 }}>{total} <span style={{ fontSize: 14, opacity: 0.6 }}>hayvan</span></div>
            </div>
            <div style={{ fontSize: 36, opacity: 0.2 }}>🐄</div>
          </div>

          {/* Nav Tiles */}
          <div className="nav-grid" style={{ marginBottom: 16 }}>
            {NAV.map(({ href, icon, label, color }) => (
              <Link key={href} href={href} className="nav-tile" style={{ background: color }}>
                <span style={{ fontSize: 26 }}>{icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1f2937', textAlign: 'center' }}>{label}</span>
              </Link>
            ))}
          </div>

          {/* Alerts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
            {upcoming.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                <div style={{ background: '#eff6ff', padding: '10px 14px', borderBottom: '1px solid #dbeafe' }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#1e40af' }}>🔔 Yaklaşan Doğumlar (30 gün)</div>
                </div>
                <div style={{ padding: '8px 10px' }}>
                  {upcoming.map((c, i) => (
                    <div key={i} className="alert-item" style={{ background: c.daysLeft < 0 ? '#fef2f2' : c.daysLeft < 7 ? '#fff7ed' : '#f0fdf4' }}>
                      <span style={{ fontWeight: 600 }}>{c.name}</span>
                      <span style={{ fontWeight: 700, color: c.daysLeft < 0 ? '#dc2626' : c.daysLeft < 7 ? '#d97706' : '#16a34a' }}>
                        {c.daysLeft < 0 ? `${Math.abs(c.daysLeft)}g geçti` : `${c.daysLeft} gün`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {empty.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                <div style={{ background: '#fdf4ff', padding: '10px 14px', borderBottom: '1px solid #f3e8ff' }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#7e22ce' }}>⚠️ Boş Hayvanlar (60+ Gün)</div>
                </div>
                <div style={{ padding: '8px 10px' }}>
                  {empty.map((h, i) => (
                    <div key={i} className="alert-item" style={{ background: '#fdf4ff' }}>
                      <span style={{ fontWeight: 600 }}>{h.name}</span>
                      <span style={{ fontWeight: 700, color: '#7e22ce' }}>{h.days} gün</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
