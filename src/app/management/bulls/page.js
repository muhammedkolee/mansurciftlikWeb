"use client";
import { useState, useEffect } from 'react';
import { supabaseManagement } from '@/lib/supabase';
import { ManagementHeader, DataTable, ActionBtns, useAuth, GLOBAL_STYLES } from '../_components/shared';
import { AnimalFormModal, ViewAnimalModal, TrashModal } from '../_components/modals';

function calcAge(bd) {
  if (!bd) return null;
  const days = Math.ceil((Date.now() - new Date(bd)) / 86400000);
  const months = Math.floor(days / 30);
  return `${days} (${months} ay)`;
}

function Spinner() {
  return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff' }}>
    <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #d1fae5', borderTopColor: '#2c5f2e', animation: 'spin 0.8s linear infinite' }} />
  </div>;
}

export default function BullsPage() {
  const { user, loading, signOut } = useAuth();
  const [bulls, setBulls] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [modal, setModal] = useState(null);

  useEffect(() => { if (user) fetchBulls(); }, [user]);

  const fetchBulls = async () => {
    setDataLoading(true);
    const { data } = await supabaseManagement.from('Animals').select('*')
      .eq('Type', 'bull').eq('IsDeleted', false).eq('user_id', user.id)
      .order('BirthDate', { ascending: false });
    if (data) setBulls(data);
    setDataLoading(false);
  };

  const handleDone = () => { setModal(null); fetchBulls(); };

  const columns = [
    { header: '#', key: 'idx', sortable: false, render: (_, i) => <span style={{ color: '#9ca3af', fontSize: 12 }}>{i + 1}</span> },
    { header: 'Küpe No', key: 'EarringNo', searchValue: r => r.EarringNo },
    { header: 'İsim', key: 'Name', searchValue: r => r.Name },
    { header: 'Doğum T.', key: 'BirthDate', render: r => r.BirthDate ? new Date(r.BirthDate).toLocaleDateString('tr-TR') : '-', sortValue: r => r.BirthDate },
    { header: 'Yaşı', key: 'Age', render: r => <span style={{ fontWeight: 600 }}>{calcAge(r.BirthDate) || '-'}</span>, sortValue: r => r.BirthDate ? Date.now() - new Date(r.BirthDate) : -1 },
    { header: 'Anne K.No', key: 'MotherEarringNo' },
    { header: 'Anne', key: 'MotherName' },
    { header: 'Cinsi', key: 'Breed' },
    { header: 'Not', key: 'Note', sortable: false },
    {
      header: 'İşlemler', key: 'actions', sortable: false,
      render: r => <ActionBtns
        onView={() => setModal({ type: 'view', animal: { ...r, Type: 'bull' } })}
        onEdit={() => setModal({ type: 'edit', animal: { ...r, Type: 'bull' } })}
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
        <ManagementHeader user={user} onSignOut={signOut} title="Danalar" />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '14px 12px 40px' }}>
          <div className="page-header">
            <h1 className="page-title">Toplam <span style={{ color: '#dc2626' }}>{dataLoading ? '...' : bulls.length}</span> dana</h1>
          </div>
          {dataLoading ? <div style={{ textAlign: 'center', padding: '48px', color: '#9ca3af' }}>Yükleniyor...</div>
            : <DataTable columns={columns} data={bulls} rowColor={(_, i) => i % 2 === 0 ? '#fff' : '#f9fafb'} />}
        </div>
      </div>

      {modal?.type === 'view' && <ViewAnimalModal animal={modal.animal} onClose={() => setModal(null)} />}
      {modal?.type === 'edit' && <AnimalFormModal animal={modal.animal} userId={user.id} onClose={() => setModal(null)} onDone={handleDone} />}
      {modal?.type === 'trash' && <TrashModal animal={modal.animal} onClose={() => setModal(null)} onDone={handleDone} />}
    </>
  );
}
