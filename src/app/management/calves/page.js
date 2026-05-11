"use client";
import { useState, useEffect } from 'react';
import { supabaseManagement } from '@/lib/supabase';
import { ManagementHeader, DataTable, ActionBtns, useAuth, GLOBAL_STYLES } from '../_components/shared';
import { AnimalFormModal, ViewAnimalModal, TrashModal } from '../_components/modals';

const WEAN = 90;

function rowColor(item) { return item.Gender === true ? '#fce7f3' : '#dbeafe'; }

function Spinner() {
  return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff' }}>
    <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #d1fae5', borderTopColor: '#2c5f2e', animation: 'spin 0.8s linear infinite' }} />
  </div>;
}

export default function CalvesPage() {
  const { user, loading, signOut } = useAuth();
  const [calves, setCalves] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [cutDays, setCutDays] = useState(WEAN);
  const [modal, setModal] = useState(null);

  useEffect(() => { if (user) fetchCalves(); }, [user]);

  const fetchCalves = async () => {
    setDataLoading(true);
    const { data } = await supabaseManagement.from('Calves')
      .select(`Id,EarringNo,Name,BirthDate,Gender,user_id,Animals!inner(MotherEarringNo,MotherName,Breed,IsDeleted,Note)`)
      .eq('Animals.IsDeleted', false).eq('user_id', user.id)
      .order('BirthDate', { ascending: false });
    if (data) setCalves(data);
    setDataLoading(false);
  };

  const handleDone = () => { setModal(null); fetchCalves(); };

  const getEditAnimal = (r) => ({
    Id: r.Id, EarringNo: r.EarringNo, Name: r.Name, BirthDate: r.BirthDate,
    Type: 'calf', Breed: r.Animals?.Breed, Note: r.Animals?.Note,
    MotherEarringNo: r.Animals?.MotherEarringNo, MotherName: r.Animals?.MotherName,
    Gender: r.Gender,
  });

  const calcAge = (bd) => bd ? Math.ceil((Date.now() - new Date(bd)) / 86400000) : null;
  const calcWeanDate = (bd) => { if (!bd) return null; const d = new Date(bd); d.setDate(d.getDate() + cutDays); return d; };
  const calcWeanLeft = (bd) => { const d = calcWeanDate(bd); return d ? Math.ceil((d - Date.now()) / 86400000) : null; };

  const columns = [
    { header: '#', key: 'idx', sortable: false, render: (_, i) => <span style={{ color: '#9ca3af', fontSize: 12 }}>{i + 1}</span> },
    { header: 'Küpe No', key: 'EarringNo', searchValue: r => r.EarringNo },
    { header: 'İsim', key: 'Name', searchValue: r => r.Name },
    { header: 'Cinsi', key: 'Breed', sortable: false, render: r => r.Animals?.Breed || '-' },
    {
      header: 'Cinsiyet', key: 'Gender',
      render: r => <span style={{ background: r.Gender ? '#fce7f3' : '#dbeafe', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{r.Gender ? 'Dişi' : 'Erkek'}</span>,
    },
    { header: 'Doğum T.', key: 'BirthDate', render: r => r.BirthDate ? new Date(r.BirthDate).toLocaleDateString('tr-TR') : '-', sortValue: r => r.BirthDate },
    { header: 'Kaç Günlük', key: 'Age', render: r => { const a = calcAge(r.BirthDate); return a !== null ? <span style={{ fontWeight: 600 }}>{a}</span> : '-'; }, sortValue: r => calcAge(r.BirthDate) ?? -1 },
    { header: 'Sütten Kesme', key: 'WeanDate', render: r => { const d = calcWeanDate(r.BirthDate); return d ? d.toLocaleDateString('tr-TR') : '-'; }, sortValue: r => r.BirthDate },
    {
      header: 'Kalan', key: 'WeanLeft',
      render: r => { const l = calcWeanLeft(r.BirthDate); if (l === null) return '-'; return <span style={{ fontWeight: 600, color: l < 0 ? '#dc2626' : l < 14 ? '#d97706' : '#6b7280' }}>{l < 0 ? '-' : l}</span>; },
      sortValue: r => calcWeanLeft(r.BirthDate) ?? 9999,
    },
    { header: 'Anne K.No', key: 'MotherEarringNo', searchValue: r => r.Animals?.MotherEarringNo, render: r => r.Animals?.MotherEarringNo || '-' },
    { header: 'Anne', key: 'MotherName', searchValue: r => r.Animals?.MotherName, render: r => r.Animals?.MotherName || '-' },
    { header: 'Not', key: 'Note', sortable: false, render: r => <span style={{ fontSize: 11 }}>{r.Animals?.Note || '-'}</span> },
    {
      header: 'İşlemler', key: 'actions', sortable: false,
      render: r => <ActionBtns
        onView={() => setModal({ type: 'view', animal: { ...r, Type: 'calf', Gender: r.Gender } })}
        onEdit={() => setModal({ type: 'edit', animal: getEditAnimal(r) })}
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
        <ManagementHeader user={user} onSignOut={signOut} title="Buzağılar" />
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '14px 12px 40px' }}>
          <div className="page-header">
            <h1 className="page-title">Toplam <span style={{ color: '#db2777' }}>{dataLoading ? '...' : calves.length}</span> buzağı</h1>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6b7280' }}><div className="legend-dot" style={{ background: '#fce7f3' }} />Dişi</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6b7280' }}><div className="legend-dot" style={{ background: '#dbeafe' }} />Erkek</div>
              </div>
              <label style={{ fontSize: 12, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
                Sütten Kesme:
                <input type="number" value={cutDays} onChange={e => setCutDays(parseInt(e.target.value) || WEAN)}
                  style={{ width: 56, padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: 7, fontSize: 13, fontFamily: 'inherit', outline: 'none' }} />
                gün
              </label>
            </div>
          </div>
          {dataLoading ? <div style={{ textAlign: 'center', padding: '48px', color: '#9ca3af' }}>Yükleniyor...</div>
            : <DataTable columns={columns} data={calves} rowColor={rowColor} />}
        </div>
      </div>

      {modal?.type === 'view' && <ViewAnimalModal animal={modal.animal} onClose={() => setModal(null)} />}
      {modal?.type === 'edit' && <AnimalFormModal animal={modal.animal} userId={user.id} onClose={() => setModal(null)} onDone={handleDone} />}
      {modal?.type === 'trash' && <TrashModal animal={modal.animal} onClose={() => setModal(null)} onDone={handleDone} />}
    </>
  );
}
