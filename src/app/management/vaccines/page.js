"use client";
import { useState, useEffect } from 'react';
import { supabaseManagement } from '@/lib/supabase';
import { ManagementHeader, useAuth, GLOBAL_STYLES } from '../_components/shared';

const EXTRA = `
  .vax-table{width:100%;border-collapse:collapse;font-size:13px;}
  .vax-table thead th{background:#374151;color:#fff;padding:10px;text-align:left;font-weight:600;font-size:12px;letter-spacing:0.03em;white-space:nowrap;}
  .vax-table tbody tr{border-bottom:1px solid #e5e7eb;}
  .vax-table tbody td{padding:8px 10px;color:#1f2937;vertical-align:middle;}
  .vax-table tbody tr:hover td{background:#f9fafb;}
  .vax-badge{display:inline-block;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600;background:#ede9fe;color:#7c3aed;white-space:nowrap;margin-bottom:2px;}
`;

function Spinner() {
  return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff' }}>
    <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #d1fae5', borderTopColor: '#2c5f2e', animation: 'spin 0.8s linear infinite' }} />
  </div>;
}

export default function VaccinesPage() {
  const { user, loading, signOut } = useAuth();
  const [vaccines, setVaccines] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [grouped, setGrouped] = useState({});
  const [vaccineTypes, setVaccineTypes] = useState([]);

  useEffect(() => { if (user) fetchVaccines(); }, [user]);

  const fetchVaccines = async () => {
    setDataLoading(true);
    const { data } = await supabaseManagement.from('Vaccines')
      .select(`*, Animals!inner(EarringNo,Name)`)
      .eq('user_id', user.id)
      .order('VaccineDate', { ascending: true });
    if (data) {
      setVaccines(data);
      const byAnimal = {};
      const typeSet = new Set();
      data.forEach(v => {
        const key = v.AnimalId;
        if (!byAnimal[key]) byAnimal[key] = { animalId: v.AnimalId, earringNo: v.Animals?.EarringNo || '-', name: v.Animals?.Name || '-', vaccines: {} };
        typeSet.add(v.VaccineName);
        if (!byAnimal[key].vaccines[v.VaccineName]) byAnimal[key].vaccines[v.VaccineName] = [];
        byAnimal[key].vaccines[v.VaccineName].push({ date: v.VaccineDate, id: v.Id });
      });
      setGrouped(byAnimal);
      setVaccineTypes([...typeSet].sort());
    }
    setDataLoading(false);
  };

  const rows = Object.values(grouped);
  const filtered = rows.filter(r => {
    if (!search.trim()) return true;
    return r.earringNo.toLowerCase().includes(search.toLowerCase()) || r.name.toLowerCase().includes(search.toLowerCase());
  });

  if (loading) return <Spinner />;
  if (!user) return null;

  return (
    <>
      <style>{GLOBAL_STYLES + EXTRA}</style>
      <div style={{ minHeight: '100vh', background: '#ffffff' }}>
        <ManagementHeader user={user} onSignOut={signOut} title="Aşı Kayıtları" />
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '14px 12px 40px' }}>
          <div className="page-header">
            <div>
              <h1 className="page-title">Toplam <span style={{ color: '#7c3aed' }}>{rows.length}</span> hayvan</h1>
              <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{vaccines.length} aşı kaydı</p>
            </div>
          </div>

          <div style={{ position: 'relative', marginBottom: 10 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input type="text" placeholder="Küpe No veya İsim ara..." className="search-input" value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          {dataLoading ? <div style={{ textAlign: 'center', padding: '48px', color: '#9ca3af' }}>Yükleniyor...</div> : (
            <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table className="vax-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Küpe No</th>
                      <th>İsim</th>
                      {vaccineTypes.map(t => <th key={t}>{t}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan={3 + vaccineTypes.length} style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>Kayıt bulunamadı.</td></tr>
                    ) : filtered.map((row, idx) => (
                      <tr key={row.animalId} style={{ background: idx % 2 === 0 ? '#fff' : '#f9fafb' }}>
                        <td style={{ color: '#9ca3af', fontSize: 12 }}>{idx + 1}</td>
                        <td style={{ fontWeight: 600 }}>{row.earringNo}</td>
                        <td>{row.name}</td>
                        {vaccineTypes.map(type => {
                          const entries = row.vaccines[type] || [];
                          return (
                            <td key={type}>
                              {entries.length === 0 ? <span style={{ color: '#d1d5db' }}>-</span>
                                : entries.map((e, i) => (
                                  <div key={i}><span className="vax-badge">{new Date(e.date).toLocaleDateString('tr-TR')}</span></div>
                                ))}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <div style={{ marginTop: 6, fontSize: 12, color: '#9ca3af', textAlign: 'right' }}>
            {filtered.length !== rows.length ? `${filtered.length} / ${rows.length}` : rows.length} hayvan
          </div>
        </div>
      </div>
    </>
  );
}
