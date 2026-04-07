import { getVaccines, getVaccineNames } from '@/actions/getVaccines';
import { removeVaccine as removeVaccineAction } from '@/actions/vaccines';
import Link from 'next/link';
import { Trash2, Plus, Syringe } from 'lucide-react';

export const metadata = { title: 'Aşı Takibi' };

export default async function ManagementVaccinesPage() {
    const vaccines = await getVaccines();
    const vaccineNames = await getVaccineNames();

    // Pivot data: Group by Animal
    const animalVaccineMap = {};
    vaccines.forEach((v) => {
        if (!v.Animals) return;
        const animalId = v.Animals.Id;
        if (!animalVaccineMap[animalId]) {
            animalVaccineMap[animalId] = {
                earringNo: v.Animals.EarringNo,
                name: v.Animals.Name,
                vaccines: {},
            };
        }
        if (!animalVaccineMap[animalId].vaccines[v.VaccineName]) {
            animalVaccineMap[animalId].vaccines[v.VaccineName] = [];
        }
        animalVaccineMap[animalId].vaccines[v.VaccineName].push({
            id: v.Id,
            date: v.VaccineDate,
        });
    });

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: 700, color: 'var(--brand-brown-dark)', margin: 0 }}>
                        Aşı Takip Listesi
                    </h2>
                    <p style={{ fontSize: '14px', color: 'var(--brand-gray)', marginTop: '4px' }}>
                        {Object.keys(animalVaccineMap).length} hayvana ait aşı kayıtları
                    </p>
                </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Küpe No</th>
                            <th>İsim</th>
                            {vaccineNames.map((name) => (
                                <th key={name}>{name}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(animalVaccineMap).map((animal, index) => (
                            <tr key={animal.earringNo}>
                                <td style={{ fontWeight: 700, color: 'var(--brand-gray)' }}>{index + 1}</td>
                                <td style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{animal.earringNo}</td>
                                <td style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{animal.name}</td>
                                {vaccineNames.map((vName) => (
                                    <td key={vName}>
                                        {animal.vaccines[vName] ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                {animal.vaccines[vName].map((v) => (
                                                    <div key={v.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                                        <span
                                                            style={{
                                                                background: '#F5F3FF',
                                                                color: '#7C3AED',
                                                                padding: '3px 8px',
                                                                borderRadius: '6px',
                                                                fontSize: '12px',
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            {new Date(v.date).toLocaleDateString('tr-TR')}
                                                        </span>
                                                        <form
                                                            action={async () => {
                                                                'use server';
                                                                await removeVaccineAction(v.id);
                                                            }}
                                                        >
                                                            <button
                                                                type="submit"
                                                                style={{
                                                                    background: 'none',
                                                                    border: 'none',
                                                                    cursor: 'pointer',
                                                                    color: '#DC2626',
                                                                    padding: '2px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                }}
                                                                onClick={(e) => {
                                                                    if (!confirm('Bu aşıyı silmek istediğinize emin misiniz?')) e.preventDefault();
                                                                }}
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </form>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span style={{ color: '#D1D5DB', fontSize: '18px' }}>—</span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* FAB */}
            <Link
                href="/management/vaccines/add"
                style={{
                    position: 'fixed',
                    bottom: '32px',
                    right: '32px',
                    background: 'linear-gradient(135deg, #7C3AED 0%, var(--brand-blue) 100%)',
                    color: 'white',
                    borderRadius: '100px',
                    padding: '14px 24px',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 8px 24px rgba(124,58,237,0.35)',
                    zIndex: 50,
                }}
            >
                <Plus size={18} />
                Yeni Aşı Ekle
            </Link>
        </div>
    );
}
