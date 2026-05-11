"use client";
import { useState, useEffect } from 'react';
import { supabaseManagement } from '@/lib/supabase';
import { ManagementHeader, DataTable, ActionBtns, useAuth, GLOBAL_STYLES } from '../_components/shared';
import { AnimalFormModal, ViewAnimalModal, TrashModal } from '../_components/modals';

const TYPE_LABELS = { cow: 'İnek', heifer: 'Düve', bull: 'Dana', calf: 'Buzağı' };
const TYPE_COLORS = { cow: '#dbeafe', heifer: '#fef3c7', bull: '#fee2e2', calf: '#fce7f3' };

export default function AnimalsPage() {
  const { user, loading, signOut } = useAuth();
  const [animals, setAnimals] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [modal, setModal] = useState(null); // { type: 'add'|'edit'|'view'|'trash', animal }

  useEffect(() => { if (user) fetchAnimals(); }, [user]);

  const fetchAnimals = async () => {
    setDataLoading(true);
    const { data } = await supabaseManagement.from('Animals').select('*').eq('IsDeleted', false).eq('user_id', user.id).order('Type', { ascending: false });
    if (data) setAnimals(data);
    setDataLoading(false);
  };

  const handleDone = () => { setModal(null); fetchAnimals(); };

  const columns = [
    { header: '#', key: 'index', sortable: false, render: (_, i) => <span style={{ color: '#9ca3af', fontSize: 12 }}>{i + 1}</span> },
    { header: 'Küpe No', key: 'EarringNo', searchValue: r => r.EarringNo },
    { header: 'İsim', key: 'Name', searchValue: r => r.Name },
    {
      header: 'Tür', key: 'Type',
      render: r => <span style={{ background: TYPE_COLORS[r.Type], padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{TYPE_LABELS[r.Type] || r.Type}</span>,
    },
    { header: 'Cinsi', key: 'Breed' },
    {
      header: 'Doğum T.', key: 'BirthDate',
      render: r => r.BirthDate ? new Date(r.BirthDate).toLocaleDateString('tr-TR') : '-',
      sortValue: r => r.BirthDate,
    },
    { header: 'Anne K.No', key: 'MotherEarringNo' },
    { header: 'Not', key: 'Note', sortable: false, render: r => <span style={{ fontSize: 11 }}>{r.Note || '-'}</span> },
    {
      header: 'İşlemler', key: 'actions', sortable: false,
      render: r => <ActionBtns
        onView={() => setModal({ type: 'view', animal: r })}
        onEdit={() => setModal({ type: 'edit', animal: r })}
        onTrash={() => setModal({ type: 'trash', animal: r })}
      />,
    },
  ];

  if (loading) return <Spinner />;
  if (!user) return null;

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div style={{ minHeight: '100vh', background: '#ffffff' }}>
        <ManagementHeader user={user} onSignOut={signOut} title="Tüm Hayvanlar" />
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '14px 12px 40px' }}>
          <div className="page-header">
            <h1 className="page-title">
              Toplam <span style={{ color: '#2c5f2e' }}>{dataLoading ? '...' : animals.length}</span> hayvan
            </h1>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {Object.entries(TYPE_COLORS).map(([t, c]) => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6b7280' }}>
                    <div className="legend-dot" style={{ background: c }} />{TYPE_LABELS[t]}
                  </div>
                ))}
              </div>
              <button className="add-btn" onClick={() => setModal({ type: 'add', animal: null })}>+ Ekle</button>
            </div>
          </div>
          {dataLoading ? <LoadingText /> : <DataTable columns={columns} data={animals} rowColor={r => TYPE_COLORS[r.Type] || '#fff'} />}
        </div>
      </div>

      {modal?.type === 'add' && <AnimalFormModal userId={user.id} onClose={() => setModal(null)} onDone={handleDone} />}
      {modal?.type === 'edit' && <AnimalFormModal animal={modal.animal} userId={user.id} onClose={() => setModal(null)} onDone={handleDone} />}
      {modal?.type === 'view' && <ViewAnimalModal animal={modal.animal} onClose={() => setModal(null)} />}
      {modal?.type === 'trash' && <TrashModal animal={modal.animal} onClose={() => setModal(null)} onDone={handleDone} />}
    </>
  );
}

function Spinner() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff', flexDirection: 'column', gap: 12 }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #d1fae5', borderTopColor: '#2c5f2e', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );
}
function LoadingText() {
  return <div style={{ textAlign: 'center', padding: '48px', color: '#9ca3af' }}>Yükleniyor...</div>;
}
