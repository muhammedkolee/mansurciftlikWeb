"use client";
import { useState, useEffect } from 'react';
import { supabaseManagement } from '@/lib/supabase';

const todayStr = () => new Date().toISOString().split('T')[0];

// ── Modal Sheet (bottom on mobile, centered on desktop) ──────────
const MODAL_CSS = `
  .mgmt-overlay { position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:200;display:flex;align-items:flex-end;justify-content:center; }
  .mgmt-sheet { background:#fff;border-radius:20px 20px 0 0;width:100%;max-height:92vh;overflow-y:auto; }
  @media(min-width:640px){
    .mgmt-overlay{align-items:center;}
    .mgmt-sheet{border-radius:16px;max-width:520px;max-height:85vh;}
  }
  .mgmt-input { width:100%;padding:12px 14px;font-size:15px;border:1.5px solid #d1d5db;border-radius:10px;font-family:inherit;color:#111827;background:#fff;outline:none;box-sizing:border-box; }
  .mgmt-input:focus{border-color:#2c5f2e;}
  .mgmt-select{width:100%;padding:12px 14px;font-size:15px;border:1.5px solid #d1d5db;border-radius:10px;font-family:inherit;color:#111827;background:#fff;outline:none;box-sizing:border-box;appearance:none;}
  .mgmt-select:focus{border-color:#2c5f2e;}
  .mgmt-btn-primary{width:100%;padding:14px;background:#2c5f2e;color:#fff;border:none;border-radius:12px;font-size:15px;font-weight:600;font-family:inherit;cursor:pointer;}
  .mgmt-btn-primary:hover{background:#1e4220;}
  .mgmt-btn-primary:disabled{opacity:0.6;cursor:not-allowed;}
  .mgmt-btn-secondary{flex:1;padding:13px;background:#f3f4f6;color:#374151;border:1px solid #e5e7eb;border-radius:12px;font-size:14px;font-weight:500;font-family:inherit;cursor:pointer;}
  .mgmt-btn-danger{flex:1;padding:13px;background:#dc2626;color:#fff;border:none;border-radius:12px;font-size:14px;font-weight:600;font-family:inherit;cursor:pointer;}
  .mgmt-btn-danger:hover{background:#b91c1c;}
`;

function ModalSheet({ title, onClose, children }) {
  return (
    <>
      <style>{MODAL_CSS}</style>
      <div className="mgmt-overlay" onClick={onClose}>
        <div className="mgmt-sheet" onClick={e => e.stopPropagation()}>
          <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#111827', margin: 0 }}>{title}</h2>
            <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: 26, cursor: 'pointer', color: '#9ca3af', lineHeight: 1, padding: '0 4px' }}>×</button>
          </div>
          <div style={{ padding: '16px 20px 32px' }}>{children}</div>
        </div>
      </div>
    </>
  );
}

function Field({ label, children, half }) {
  return (
    <div style={{ marginBottom: 14, ...(half ? {} : {}) }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#6b7280', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
      {children}
    </div>
  );
}

function Row2({ children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>{children}</div>;
}

function SectionDivider({ title }) {
  return (
    <div style={{ margin: '16px 0 12px', paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{title}</div>
    </div>
  );
}

// ── Trash Modal ──────────────────────────────────────────────────
export function TrashModal({ animal, onClose, onDone }) {
  const [form, setForm] = useState({ DeathDate: todayStr(), Reason: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!form.Reason.trim()) { setError('Lütfen bir neden girin.'); return; }
    setLoading(true);
    const { error: err } = await supabaseManagement
      .from('Animals')
      .update({ IsDeleted: true, DeathDate: form.DeathDate, Reason: form.Reason })
      .eq('Id', animal.Id);
    setLoading(false);
    if (err) { setError(err.message); return; }
    onDone();
  };

  return (
    <ModalSheet title="Sürüden Çıkar" onClose={onClose}>
      <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 16 }}>
        <strong style={{ color: '#111827' }}>{animal.Name || animal.EarringNo}</strong> kaydı çöp kutusuna taşınacak.
      </p>
      <Field label="Ayrılma Tarihi">
        <input type="date" className="mgmt-input" value={form.DeathDate}
          onChange={e => setForm(f => ({ ...f, DeathDate: e.target.value }))} />
      </Field>
      <Field label="Neden / Açıklama">
        <input type="text" className="mgmt-input" placeholder="Satıldı, Öldü, Kurban..." value={form.Reason}
          onChange={e => setForm(f => ({ ...f, Reason: e.target.value }))} />
      </Field>
      {error && <div style={{ color: '#dc2626', fontSize: 13, marginBottom: 12 }}>{error}</div>}
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <button className="mgmt-btn-secondary" onClick={onClose}>İptal</button>
        <button className="mgmt-btn-danger" onClick={handleSubmit} disabled={loading}>
          {loading ? 'İşleniyor...' : 'Çöp Kutusuna Taşı'}
        </button>
      </div>
    </ModalSheet>
  );
}

// ── View Animal Modal ────────────────────────────────────────────
export function ViewAnimalModal({ animal, onClose }) {
  const [extra, setExtra] = useState(null);
  const [vaccines, setVaccines] = useState([]);

  useEffect(() => {
    const type = animal.Type;
    const id = animal.Id || animal.AnimalId;
    if (type === 'cow') {
      supabaseManagement.from('Cows').select('InseminationDate,BullName,CheckedDate,LastBirthDate').eq('Id', id).single()
        .then(({ data }) => setExtra(data));
    } else if (type === 'heifer') {
      supabaseManagement.from('Heifers').select('LastBirthDate').eq('Id', id).single()
        .then(({ data }) => setExtra(data));
    } else if (type === 'calf') {
      supabaseManagement.from('Calves').select('Gender').eq('Id', id).single()
        .then(({ data }) => setExtra(data));
    }
    supabaseManagement.from('Vaccines').select('VaccineName,VaccineDate').eq('AnimalId', id).order('VaccineDate')
      .then(({ data }) => setVaccines(data || []));
  }, [animal]);

  const TYPE_TR = { cow: 'İnek', heifer: 'Düve', bull: 'Dana', calf: 'Buzağı' };
  const row = (label, value) => value ? (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #f3f4f6' }}>
      <span style={{ fontSize: 13, color: '#6b7280' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: '#111827', textAlign: 'right', maxWidth: '55%' }}>{value}</span>
    </div>
  ) : null;

  const fmtDate = d => d && new Date(d).getFullYear() > 1970 ? new Date(d).toLocaleDateString('tr-TR') : null;

  return (
    <ModalSheet title={animal.Name || animal.EarringNo || 'Hayvan Bilgisi'} onClose={onClose}>
      {row('Küpe No', animal.EarringNo)}
      {row('İsim', animal.Name)}
      {row('Türü', TYPE_TR[animal.Type])}
      {row('Cinsi', animal.Breed || animal.Animals?.Breed)}
      {row('Doğum Tarihi', fmtDate(animal.BirthDate))}
      {row('Anne Küpe No', animal.MotherEarringNo || animal.Animals?.MotherEarringNo)}
      {row('Anne İsim', animal.MotherName || animal.Animals?.MotherName)}
      {row('Not', animal.Note || animal.Animals?.Note)}
      {extra && (
        <>
          {extra.InseminationDate && row('Tohumlama T.', fmtDate(extra.InseminationDate))}
          {extra.BullName && row('Boğa Adı', extra.BullName)}
          {extra.CheckedDate && row('Kontrol T.', fmtDate(extra.CheckedDate))}
          {extra.LastBirthDate && row('Son Doğum T.', fmtDate(extra.LastBirthDate))}
          {extra.Gender !== undefined && row('Cinsiyet', extra.Gender ? 'Dişi' : 'Erkek')}
        </>
      )}
      {vaccines.length > 0 && (
        <>
          <SectionDivider title={`Aşılar (${vaccines.length})`} />
          {vaccines.map((v, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #f3f4f6' }}>
              <span style={{ fontSize: 13, color: '#374151' }}>{v.VaccineName}</span>
              <span style={{ fontSize: 13, color: '#6b7280' }}>{new Date(v.VaccineDate).toLocaleDateString('tr-TR')}</span>
            </div>
          ))}
        </>
      )}
    </ModalSheet>
  );
}

// ── Animal Form Modal (Add + Edit) ───────────────────────────────
export function AnimalFormModal({ animal, userId, onClose, onDone }) {
  const isEdit = !!animal?.Id;
  const [form, setForm] = useState({
    EarringNo: animal?.EarringNo || '',
    Name: animal?.Name || '',
    BirthDate: animal?.BirthDate ? animal.BirthDate.split('T')[0] : '',
    MotherEarringNo: animal?.MotherEarringNo || animal?.Animals?.MotherEarringNo || '',
    MotherName: animal?.MotherName || animal?.Animals?.MotherName || '',
    Type: animal?.Type || 'cow',
    Breed: animal?.Breed || animal?.Animals?.Breed || '',
    Note: animal?.Note || animal?.Animals?.Note || '',
    // Cow fields
    InseminationDate: animal?.InseminationDate ? animal.InseminationDate.split('T')[0] : '',
    BullName: animal?.BullName || '',
    CheckedDate: animal?.CheckedDate ? animal.CheckedDate.split('T')[0] : '',
    // Heifer fields
    LastBirthDate: animal?.LastBirthDate ? animal.LastBirthDate.split('T')[0] : '',
    // Calf fields
    Gender: animal?.Gender ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const setBool = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value === 'true' }));

  const handleSubmit = async () => {
    if (!form.EarringNo && !form.Name) { setError('Küpe No veya İsim gerekli.'); return; }
    setLoading(true);
    setError('');

    const animalData = {
      EarringNo: form.EarringNo || null,
      Name: form.Name || null,
      BirthDate: form.BirthDate || null,
      MotherEarringNo: form.MotherEarringNo || null,
      MotherName: form.MotherName || null,
      Type: form.Type,
      Breed: form.Breed || null,
      Note: form.Note || null,
    };

    try {
      let animalId = animal?.Id;
      if (isEdit) {
        const { error: e } = await supabaseManagement.from('Animals').update(animalData).eq('Id', animalId);
        if (e) throw e;
      } else {
        const { data, error: e } = await supabaseManagement.from('Animals')
          .insert({ ...animalData, user_id: userId, IsDeleted: false }).select();
        if (e) throw e;
        animalId = data[0].Id;
      }

      // Type-specific
      if (form.Type === 'cow') {
        const cowData = { Id: animalId, EarringNo: form.EarringNo || null, Name: form.Name || null, InseminationDate: form.InseminationDate || null, BullName: form.BullName || null, CheckedDate: form.CheckedDate || null, user_id: userId };
        if (isEdit) await supabaseManagement.from('Cows').upsert(cowData);
        else await supabaseManagement.from('Cows').insert(cowData);
      } else if (form.Type === 'heifer') {
        const hData = { Id: animalId, EarringNo: form.EarringNo || null, Name: form.Name || null, LastBirthDate: form.LastBirthDate || null, user_id: userId };
        if (isEdit) await supabaseManagement.from('Heifers').upsert(hData);
        else await supabaseManagement.from('Heifers').insert(hData);
      } else if (form.Type === 'calf') {
        const cData = { Id: animalId, EarringNo: form.EarringNo || null, Name: form.Name || null, BirthDate: form.BirthDate || null, Gender: form.Gender, AnimalId: animalId, user_id: userId };
        if (isEdit) await supabaseManagement.from('Calves').upsert(cData);
        else await supabaseManagement.from('Calves').insert(cData);
      }

      onDone();
    } catch (err) {
      setError(err.message || 'Bir hata oluştu.');
    }
    setLoading(false);
  };

  return (
    <ModalSheet title={isEdit ? 'Hayvanı Düzenle' : 'Yeni Hayvan Ekle'} onClose={onClose}>
      <Row2>
        <Field label="Küpe No">
          <input className="mgmt-input" value={form.EarringNo} onChange={set('EarringNo')} placeholder="TR000000" />
        </Field>
        <Field label="İsim">
          <input className="mgmt-input" value={form.Name} onChange={set('Name')} placeholder="İsim (isteğe bağlı)" />
        </Field>
      </Row2>
      <Row2>
        <Field label="Tür">
          <select className="mgmt-select" value={form.Type} onChange={set('Type')} disabled={isEdit}>
            <option value="cow">İnek (Gebe)</option>
            <option value="heifer">Düve (Boş)</option>
            <option value="calf">Buzağı</option>
            <option value="bull">Dana</option>
          </select>
        </Field>
        <Field label="Cinsi">
          <input className="mgmt-input" value={form.Breed} onChange={set('Breed')} placeholder="Simental, Angus..." />
        </Field>
      </Row2>
      <Field label="Doğum Tarihi">
        <input type="date" className="mgmt-input" value={form.BirthDate} onChange={set('BirthDate')} />
      </Field>
      <Row2>
        <Field label="Anne Küpe No">
          <input className="mgmt-input" value={form.MotherEarringNo} onChange={set('MotherEarringNo')} />
        </Field>
        <Field label="Anne İsim">
          <input className="mgmt-input" value={form.MotherName} onChange={set('MotherName')} />
        </Field>
      </Row2>
      <Field label="Not">
        <input className="mgmt-input" value={form.Note} onChange={set('Note')} placeholder="Açıklama..." />
      </Field>

      {form.Type === 'cow' && (
        <>
          <SectionDivider title="Gebe İnek Bilgileri" />
          <Row2>
            <Field label="Tohumlama Tarihi">
              <input type="date" className="mgmt-input" value={form.InseminationDate} onChange={set('InseminationDate')} />
            </Field>
            <Field label="Boğa Adı">
              <input className="mgmt-input" value={form.BullName} onChange={set('BullName')} />
            </Field>
          </Row2>
          <Field label="Kontrol Tarihi">
            <input type="date" className="mgmt-input" value={form.CheckedDate} onChange={set('CheckedDate')} />
          </Field>
        </>
      )}
      {form.Type === 'heifer' && (
        <>
          <SectionDivider title="Düve Bilgileri" />
          <Field label="Son Doğum Tarihi">
            <input type="date" className="mgmt-input" value={form.LastBirthDate} onChange={set('LastBirthDate')} />
          </Field>
        </>
      )}
      {form.Type === 'calf' && (
        <>
          <SectionDivider title="Buzağı Bilgileri" />
          <Field label="Cinsiyet">
            <select className="mgmt-select" value={String(form.Gender)} onChange={setBool('Gender')}>
              <option value="true">Dişi</option>
              <option value="false">Erkek</option>
            </select>
          </Field>
        </>
      )}

      {error && <div style={{ color: '#dc2626', fontSize: 13, marginBottom: 10, marginTop: 4 }}>{error}</div>}
      <button className="mgmt-btn-primary" onClick={handleSubmit} disabled={loading} style={{ marginTop: 8 }}>
        {loading ? 'Kaydediliyor...' : (isEdit ? 'Güncelle' : 'Ekle')}
      </button>
    </ModalSheet>
  );
}

// ── Gave Birth Modal (Cows) ──────────────────────────────────────
export function GaveBirthModal({ cow, userId, onClose, onDone }) {
  const [form, setForm] = useState({
    BirthDate: todayStr(),
    CalfEarringNo: '',
    CalfName: '',
    CalfGender: 'true',
    CalfBreed: cow.Animals?.Breed || cow.Breed || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const cowId = cow.Id;

      // 1. Create Calf in Animals table
      const { data: calfAnimal, error: e1 } = await supabaseManagement.from('Animals').insert({
        EarringNo: form.CalfEarringNo || null,
        Name: form.CalfName || null,
        BirthDate: form.BirthDate,
        MotherEarringNo: cow.EarringNo || null,
        MotherName: cow.Name || null,
        Type: 'calf',
        Breed: form.CalfBreed || null,
        user_id: userId,
        IsDeleted: false,
      }).select();
      if (e1) throw e1;

      const calfId = calfAnimal[0].Id;

      // 2. Create in Calves table
      const { error: e2 } = await supabaseManagement.from('Calves').insert({
        Id: calfId,
        EarringNo: form.CalfEarringNo || null,
        Name: form.CalfName || null,
        BirthDate: form.BirthDate,
        Gender: form.CalfGender === 'true',
        user_id: userId,
      });
      if (e2) throw e2;

      // 3. Delete cow from Cows table
      const { error: e3 } = await supabaseManagement.from('Cows').delete().eq('Id', cowId);
      if (e3) throw e3;

      // 4. Insert into Heifers table (boş inek) with LastBirthDate = birth date
      const { error: e4 } = await supabaseManagement.from('Heifers').insert({
        Id: cowId,
        EarringNo: cow.EarringNo || null,
        Name: cow.Name || null,
        LastBirthDate: form.BirthDate,
        user_id: userId,
      });
      if (e4) throw e4;

      // 5. Update Animals.Type to 'heifer'
      const { error: e5 } = await supabaseManagement.from('Animals').update({ Type: 'heifer' }).eq('Id', cowId);
      if (e5) throw e5;

      onDone();
    } catch (err) {
      setError(err.message || 'Bir hata oluştu.');
    }
    setLoading(false);
  };


  return (
    <ModalSheet title="Doğum Kaydı" onClose={onClose}>
      <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 14 }}>
        <strong>{cow.Name || cow.EarringNo}</strong> için doğum kaydı
      </p>
      <Field label="Doğum Tarihi">
        <input type="date" className="mgmt-input" value={form.BirthDate} onChange={set('BirthDate')} />
      </Field>
      <SectionDivider title="Buzağı Bilgileri" />
      <Row2>
        <Field label="Küpe No">
          <input className="mgmt-input" value={form.CalfEarringNo} onChange={set('CalfEarringNo')} placeholder="TR..." />
        </Field>
        <Field label="İsim">
          <input className="mgmt-input" value={form.CalfName} onChange={set('CalfName')} placeholder="(isteğe bağlı)" />
        </Field>
      </Row2>
      <Row2>
        <Field label="Cinsiyet">
          <select className="mgmt-select" value={form.CalfGender} onChange={set('CalfGender')}>
            <option value="true">Dişi</option>
            <option value="false">Erkek</option>
          </select>
        </Field>
        <Field label="Cinsi">
          <input className="mgmt-input" value={form.CalfBreed} onChange={set('CalfBreed')} />
        </Field>
      </Row2>
      {error && <div style={{ color: '#dc2626', fontSize: 13, marginBottom: 10 }}>{error}</div>}
      <button className="mgmt-btn-primary" onClick={handleSubmit} disabled={loading} style={{ marginTop: 8 }}>
        {loading ? 'Kaydediliyor...' : '🍼 Doğumu Kaydet'}
      </button>
    </ModalSheet>
  );
}

// ── Insemination Modal (Heifers) ─────────────────────────────────
export function InseminationModal({ heifer, userId, onClose, onDone }) {
  const [form, setForm] = useState({ InseminationDate: todayStr(), BullName: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!form.InseminationDate) { setError('Tohumlama tarihi gerekli.'); return; }
    setLoading(true);
    setError('');
    try {
      const hId = heifer.Id;

      // 1. Update Animals type to 'cow'
      const { error: e1 } = await supabaseManagement.from('Animals')
        .update({ Type: 'cow' }).eq('Id', hId);
      if (e1) throw e1;

      // 2. Delete from Heifers
      await supabaseManagement.from('Heifers').delete().eq('Id', hId);

      // 3. Insert into Cows
      const { error: e3 } = await supabaseManagement.from('Cows').insert({
        Id: hId,
        EarringNo: heifer.EarringNo || null,
        Name: heifer.Name || null,
        InseminationDate: form.InseminationDate,
        BullName: form.BullName || null,
        user_id: userId,
      });
      if (e3) throw e3;

      onDone();
    } catch (err) {
      setError(err.message || 'Bir hata oluştu.');
    }
    setLoading(false);
  };

  return (
    <ModalSheet title="Tohumlama Kaydı" onClose={onClose}>
      <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 14 }}>
        <strong>{heifer.Name || heifer.EarringNo}</strong> tohumlandı olarak işaretlenecek ve Gebe İnekler listesine taşınacak.
      </p>
      <Field label="Tohumlama Tarihi">
        <input type="date" className="mgmt-input" value={form.InseminationDate}
          onChange={e => setForm(f => ({ ...f, InseminationDate: e.target.value }))} />
      </Field>
      <Field label="Boğa Adı (isteğe bağlı)">
        <input className="mgmt-input" value={form.BullName} placeholder="Boğa adı..."
          onChange={e => setForm(f => ({ ...f, BullName: e.target.value }))} />
      </Field>
      {error && <div style={{ color: '#dc2626', fontSize: 13, marginBottom: 10 }}>{error}</div>}
      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: '#92400e' }}>
        ⚠️ Bu işlem geri alınamaz. Hayvan Gebe İnekler listesine taşınacak.
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="mgmt-btn-secondary" onClick={onClose}>İptal</button>
        <button className="mgmt-btn-primary" style={{ flex: 1 }} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Kaydediliyor...' : '💉 Tohumlamayı Kaydet'}
        </button>
      </div>
    </ModalSheet>
  );
}
