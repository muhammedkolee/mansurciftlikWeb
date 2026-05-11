"use client";
import { useState, useEffect } from 'react';
import { supabaseManagement } from '@/lib/supabase';
import { ManagementHeader, DataTable, ActionBtns, useAuth, GLOBAL_STYLES } from '../_components/shared';
import { AnimalFormModal, ViewAnimalModal, TrashModal, InseminationModal } from '../_components/modals';

function calcEmpty(d) { return d ? Math.ceil((Date.now() - new Date(d)) / 86400000) : null; }

function rowColor(item) {
  const days = calcEmpty(item.LastBirthDate);
  if (days === null) return '#fff';
  if (days > 180) return '#fecaca';
  if (days > 120) return '#fde68a';
  if (days > 60) return '#fed7aa';
  return '#bbf7d0';
}

function Spinner() {
  return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff' }}>
    <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #d1fae5', borderTopColor: '#2c5f2e', animation: 'spin 0.8s linear infinite' }} />
  </div>;
}

export default function HeifersPage() {
  const { user, loading, signOut } = useAuth();
  const [heifers, setHeifers] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [modal, setModal] = useState(null);

  useEffect(() => { if (user) fetchHeifers(); }, [user]);

  const fetchHeifers = async () => {
    setDataLoading(true);
    const { data } = await supabaseManagement.from('Heifers')
      .select(`*, Animals!inner(Breed,IsDeleted,Note)`)
      .eq('Animals.IsDeleted', false).eq('user_id', user.id)
      .order('LastBirthDate', { ascending: true });
    if (data) setHeifers(data);
    setDataLoading(false);
  };

  const handleDone = () => { setModal(null); fetchHeifers(); };

  const getEditAnimal = (r) => ({
    Id: r.Id, EarringNo: r.EarringNo, Name: r.Name,
    Type: 'heifer', Breed: r.Animals?.Breed, Note: r.Animals?.Note,
    LastBirthDate: r.LastBirthDate,
  });

  const columns = [
    { header: '#', key: 'idx', sortable: false, render: (_, i) => <span style={{ color: '#9ca3af', fontSize: 12 }}>{i + 1}</span> },
    { header: 'Küpe No', key: 'EarringNo', searchValue: r => r.EarringNo },
    { header: 'İsim', key: 'Name', searchValue: r => r.Name },
    { header: 'Son Doğum T.', key: 'LastBirthDate', render: r => r.LastBirthDate ? new Date(r.LastBirthDate).toLocaleDateString('tr-TR') : '-', sortValue: r => r.LastBirthDate },
    {
      header: 'Boş Gün', key: 'EmptyDays',
      render: r => {
        const d = calcEmpty(r.LastBirthDate);
        if (d === null) return '-';
        return <span style={{ fontWeight: 700, color: d > 180 ? '#dc2626' : d > 120 ? '#d97706' : d > 60 ? '#ea580c' : '#16a34a' }}>{d}</span>;
      },
      sortValue: r => calcEmpty(r.LastBirthDate) ?? -1,
    },
    { header: 'Cinsi', key: 'Breed', sortable: false, render: r => r.Animals?.Breed || '-' },
    { header: 'Not', key: 'Note', sortable: false, render: r => <span style={{ fontSize: 11 }}>{r.Animals?.Note || '-'}</span> },
    {
      header: 'İşlemler', key: 'actions', sortable: false,
      render: r => <ActionBtns
        onView={() => setModal({ type: 'view', animal: { ...r, Type: 'heifer', Breed: r.Animals?.Breed, Note: r.Animals?.Note } })}
        onEdit={() => setModal({ type: 'edit', animal: getEditAnimal(r) })}
        onTrash={() => setModal({ type: 'trash', animal: r })}
        extra={
          <button className="action-btn" style={{ background: '#ede9fe', color: '#7c3aed' }} title="Tohumla"
            onClick={() => setModal({ type: 'inseminate', animal: r })}>💉</button>
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
        <ManagementHeader user={user} onSignOut={signOut} title="Düveler (Boş İnek)" />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '14px 12px 40px' }}>
          <div className="page-header">
            <h1 className="page-title">Toplam <span style={{ color: '#d97706' }}>{dataLoading ? '...' : heifers.length}</span> düve</h1>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
              {[['#bbf7d0','<60g'],['#fed7aa','60-120g'],['#fde68a','120-180g'],['#fecaca','180g+']].map(([c, l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#6b7280' }}>
                  <div className="legend-dot" style={{ background: c }} />{l}
                </div>
              ))}
            </div>
          </div>
          {dataLoading ? <div style={{ textAlign: 'center', padding: '48px', color: '#9ca3af' }}>Yükleniyor...</div>
            : <DataTable columns={columns} data={heifers} rowColor={rowColor} />}
        </div>
      </div>

      {modal?.type === 'view' && <ViewAnimalModal animal={modal.animal} onClose={() => setModal(null)} />}
      {modal?.type === 'edit' && <AnimalFormModal animal={modal.animal} userId={user.id} onClose={() => setModal(null)} onDone={handleDone} />}
      {modal?.type === 'trash' && <TrashModal animal={modal.animal} onClose={() => setModal(null)} onDone={handleDone} />}
      {modal?.type === 'inseminate' && <InseminationModal heifer={modal.animal} userId={user.id} onClose={() => setModal(null)} onDone={handleDone} />}
    </>
  );
}
