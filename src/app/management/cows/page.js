"use client";
import { useState, useEffect } from 'react';
import { supabaseManagement } from '@/lib/supabase';
import { ManagementHeader, DataTable, ActionBtns, useAuth, GLOBAL_STYLES } from '../_components/shared';
import { AnimalFormModal, ViewAnimalModal, TrashModal, GaveBirthModal } from '../_components/modals';

function fmtDate(d) {
  if (!d) return '-';
  const date = new Date(d);
  if (isNaN(date) || date.getFullYear() === 1970) return '-';
  return date.toLocaleDateString('tr-TR');
}
function calcBirth(insDate, days = 280) {
  if (!insDate) return null;
  const d = new Date(insDate); d.setDate(d.getDate() + days); return d;
}
function calcLeft(insDate, days = 280) {
  const b = calcBirth(insDate, days);
  return b ? Math.ceil((b - Date.now()) / 86400000) : null;
}

function rowColor(item) {
  const left = calcLeft(item.InseminationDate);
  if (left === null) return '#fff';
  if (left < 0) return '#fecaca';
  if (left < 20) return '#fde68a';
  if (left < 60) return '#bbf7d0';
  return '#bfdbfe';
}

function Spinner() {
  return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff', flexDirection: 'column', gap: 12 }}>
    <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #d1fae5', borderTopColor: '#2c5f2e', animation: 'spin 0.8s linear infinite' }} />
  </div>;
}

export default function CowsPage() {
  const { user, loading, signOut } = useAuth();
  const [cows, setCows] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [modal, setModal] = useState(null);

  useEffect(() => { if (user) fetchCows(); }, [user]);

  const fetchCows = async () => {
    setDataLoading(true);
    const { data } = await supabaseManagement
      .from('Cows').select(`*, Animals!inner(Breed,Note,IsDeleted)`)
      .eq('Animals.IsDeleted', false).eq('user_id', user.id)
      .order('InseminationDate', { ascending: true });
    if (data) setCows(data);
    setDataLoading(false);
  };

  const handleDone = () => { setModal(null); fetchCows(); };

  // For edit - merge cow + animal data
  const getEditAnimal = (item) => ({
    Id: item.Id, EarringNo: item.EarringNo, Name: item.Name,
    Type: 'cow', Breed: item.Animals?.Breed, Note: item.Animals?.Note,
    InseminationDate: item.InseminationDate, BullName: item.BullName,
    CheckedDate: item.CheckedDate, LastBirthDate: item.LastBirthDate,
  });

  const columns = [
    { header: '#', key: 'idx', sortable: false, render: (_, i) => <span style={{ color: '#9ca3af', fontSize: 12 }}>{i + 1}</span> },
    { header: 'Küpe No', key: 'EarringNo', searchValue: r => r.EarringNo },
    { header: 'İsim', key: 'Name', searchValue: r => r.Name },
    { header: 'Cinsi', key: 'Breed', sortable: false, render: r => r.Animals?.Breed || '-' },
    {
      header: 'Tohumlama', key: 'InseminationDate',
      render: r => fmtDate(r.InseminationDate), sortValue: r => r.InseminationDate,
    },
    {
      header: 'Doğum T.', key: 'ExpBirth',
      render: r => { const b = calcBirth(r.InseminationDate); return b ? b.toLocaleDateString('tr-TR') : '-'; },
      sortValue: r => r.InseminationDate,
    },
    {
      header: 'Kalan', key: 'LeftDay',
      render: r => {
        const d = calcLeft(r.InseminationDate);
        if (d === null) return '-';
        return <span style={{ fontWeight: 700, color: d < 0 ? '#dc2626' : d < 20 ? '#d97706' : '#16a34a' }}>{d}</span>;
      },
      sortValue: r => calcLeft(r.InseminationDate) ?? 9999,
    },
    {
      header: 'Kuruya Çık.', key: 'DryOff',
      render: r => { const b = calcBirth(r.InseminationDate, 220); return b ? b.toLocaleDateString('tr-TR') : '-'; },
      sortValue: r => r.InseminationDate,
    },
    { header: 'Boğa', key: 'BullName' },
    { header: 'Kontrol T.', key: 'CheckedDate', render: r => fmtDate(r.CheckedDate) },
    { header: 'Son Doğum', key: 'LastBirthDate', render: r => fmtDate(r.LastBirthDate) },
    { header: 'Not', key: 'AnimalNote', sortable: false, render: r => <span style={{ fontSize: 11 }}>{r.Animals?.Note || '-'}</span> },
    {
      header: 'İşlemler', key: 'actions', sortable: false,
      render: r => <ActionBtns
        onView={() => setModal({ type: 'view', animal: { ...r, Type: 'cow', Breed: r.Animals?.Breed, Note: r.Animals?.Note } })}
        onEdit={() => setModal({ type: 'edit', animal: getEditAnimal(r) })}
        onTrash={() => setModal({ type: 'trash', animal: r })}
        extra={
          <button className="action-btn" style={{ background: '#d1fae5', color: '#065f46' }} title="Doğurdu"
            onClick={() => setModal({ type: 'birth', animal: r })}>🍼</button>
        }
      />,
    },
  ];

  if (loading) return <Spinner />;
  if (!user) return null;

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div style={{ minHeight: '100vh', background: '#ffffff' }}>
        <ManagementHeader user={user} onSignOut={signOut} title="Gebe İnekler" />
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '14px 12px 40px' }}>
          <div className="page-header">
            <h1 className="page-title">
              Toplam <span style={{ color: '#1e40af' }}>{dataLoading ? '...' : cows.length}</span> gebe inek
            </h1>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              {[['#fecaca','Geçmiş'],['#fde68a','<20g'],['#bbf7d0','<60g'],['#bfdbfe','60g+']].map(([c, l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6b7280' }}>
                  <div className="legend-dot" style={{ background: c }} />{l}
                </div>
              ))}
            </div>
          </div>
          {dataLoading ? <div style={{ textAlign: 'center', padding: '48px', color: '#9ca3af' }}>Yükleniyor...</div>
            : <DataTable columns={columns} data={cows} rowColor={rowColor} />}
        </div>
      </div>

      {modal?.type === 'view' && <ViewAnimalModal animal={modal.animal} onClose={() => setModal(null)} />}
      {modal?.type === 'edit' && <AnimalFormModal animal={modal.animal} userId={user.id} onClose={() => setModal(null)} onDone={handleDone} />}
      {modal?.type === 'trash' && <TrashModal animal={modal.animal} onClose={() => setModal(null)} onDone={handleDone} />}
      {modal?.type === 'birth' && <GaveBirthModal cow={modal.animal} userId={user.id} onClose={() => setModal(null)} onDone={handleDone} />}
    </>
  );
}
