import { getAnimals } from '@/actions/getAnimals';
import { removeAnimal } from '@/actions/removeAnimal';
import Link from 'next/link';
import { Info, Edit, Trash2, Plus } from 'lucide-react';

export const metadata = { title: 'Hayvanlar' };

export default async function ManagementAnimalsPage({ searchParams }) {
    const { type } = await searchParams;
    const { animalDatas } = await getAnimals(type);

    let title = 'Tüm Hayvanlar';
    if (type === 'cow') title = 'İnekler';
    else if (type === 'heifer') title = 'Düveler';
    else if (type === 'calf') title = 'Buzağılar';
    else if (type === 'bull') title = 'Danalar';

    const typeColors = {
        cow: { bg: '#DCFCE7', text: '#16A34A', label: 'İnek' },
        heifer: { bg: '#FEF3C7', text: '#D97706', label: 'Düve' },
        calf: { bg: '#FEF9C3', text: '#CA8A04', label: 'Buzağı' },
        bull: { bg: '#FEE2E2', text: '#DC2626', label: 'Dana' },
    };

    return (
        <div>
            {/* Page Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: 700, color: 'var(--brand-brown-dark)', margin: 0 }}>
                        {title}
                    </h2>
                    <p style={{ fontSize: '14px', color: 'var(--brand-gray)', marginTop: '4px' }}>
                        {animalDatas.length} hayvan listeleniyor
                    </p>
                </div>

                {/* Filter Tabs */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {[
                        { href: '/management/animals', label: 'Tümü', color: 'var(--brand-brown)' },
                        { href: '/management/animals?type=cow', label: 'İnekler', color: '#16A34A' },
                        { href: '/management/animals?type=heifer', label: 'Düveler', color: '#D97706' },
                        { href: '/management/animals?type=calf', label: 'Buzağılar', color: '#CA8A04' },
                        { href: '/management/animals?type=bull', label: 'Danalar', color: '#DC2626' },
                    ].map((f) => (
                        <Link
                            key={f.href}
                            href={f.href}
                            style={{
                                padding: '7px 14px',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontSize: '13px',
                                fontWeight: 600,
                                background: 'white',
                                color: f.color,
                                border: `1.5px solid ${f.color}30`,
                                transition: 'all 0.15s',
                            }}
                        >
                            {f.label}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Küpe No</th>
                            <th>İsim</th>
                            <th>Doğum Tarihi</th>
                            <th>Cinsi</th>
                            <th>Türü</th>
                            <th>Anne Küpe No</th>
                            <th>Anne Adı</th>
                            <th>Not</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {animalDatas.map((animal) => {
                            const typeMeta = typeColors[animal.Type] || { bg: 'var(--brand-blue-pale)', text: 'var(--brand-blue)', label: animal.Type };
                            const breedLabel = animal.Breed === 'Simmental' ? 'Simental' : animal.Breed;

                            return (
                                <tr key={animal.Id}>
                                    <td style={{ fontWeight: 700 }}>{animal.Id}</td>
                                    <td style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{animal.EarringNo}</td>
                                    <td style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{animal.Name}</td>
                                    <td style={{ whiteSpace: 'nowrap' }}>{new Date(animal.BirthDate).toLocaleDateString('tr-TR')}</td>
                                    <td>{breedLabel}</td>
                                    <td>
                                        <span style={{
                                            background: typeMeta.bg,
                                            color: typeMeta.text,
                                            padding: '3px 10px',
                                            borderRadius: '100px',
                                            fontSize: '12px',
                                            fontWeight: 700,
                                        }}>
                                            {typeMeta.label}
                                        </span>
                                    </td>
                                    <td style={{ whiteSpace: 'nowrap' }}>{animal.MotherEarringNo || '-'}</td>
                                    <td style={{ whiteSpace: 'nowrap' }}>{animal.MotherName || '-'}</td>
                                    <td style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={animal.Note}>{animal.Note || '-'}</td>
                                    <td>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                                            <Link
                                                href={`/management/animals/${animal.Id}`}
                                                style={{
                                                    background: '#FEF3C7',
                                                    color: '#D97706',
                                                    border: 'none',
                                                    padding: '6px',
                                                    borderRadius: '7px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    textDecoration: 'none',
                                                }}
                                            >
                                                <Info size={16} />
                                            </Link>
                                            <Link
                                                href={`/management/animals/update/${animal.Id}`}
                                                style={{
                                                    background: 'var(--brand-blue-pale)',
                                                    color: 'var(--brand-blue)',
                                                    border: 'none',
                                                    padding: '6px',
                                                    borderRadius: '7px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    textDecoration: 'none',
                                                }}
                                            >
                                                <Edit size={16} />
                                            </Link>
                                            <form action={async () => {
                                                'use server';
                                                await removeAnimal({ animalId: animal.Id, Type: animal.Type });
                                            }}>
                                                <button
                                                    type="submit"
                                                    style={{
                                                        background: '#FEE2E2',
                                                        color: '#DC2626',
                                                        border: 'none',
                                                        padding: '6px',
                                                        borderRadius: '7px',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                    }}
                                                    onClick={(e) => {
                                                        if (!confirm('Bu hayvanı silmek istediğinize emin misiniz?')) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* FAB - Add Animal */}
            <Link
                href="/management/animals/add"
                style={{
                    position: 'fixed',
                    bottom: '32px',
                    right: '32px',
                    background: 'linear-gradient(135deg, var(--brand-brown) 0%, var(--brand-blue) 100%)',
                    color: 'white',
                    borderRadius: '100px',
                    padding: '14px 24px',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 8px 24px rgba(107,63,31,0.35)',
                    zIndex: 50,
                    transition: 'all 0.2s',
                }}
            >
                <Plus size={18} />
                Yeni Hayvan Ekle
            </Link>
        </div>
    );
}
