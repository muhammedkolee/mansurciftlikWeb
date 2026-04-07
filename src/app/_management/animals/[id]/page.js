import { getAnimalDetails } from '@/actions/getAnimalDetails';
import Link from 'next/link';
import { ArrowLeft, Tag, Calendar, Dna, User, FileText, Syringe, Baby } from 'lucide-react';

export async function generateMetadata({ params }) {
    const { id } = await params;
    return { title: `Hayvan #${id}` };
}

export default async function ManagementAnimalDetailPage({ params }) {
    const { id } = await params;
    const details = await getAnimalDetails(id);

    if (!details) {
        return (
            <div style={{ textAlign: 'center', padding: '80px', color: 'var(--brand-gray)' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🐄</div>
                <h2>Hayvan bulunamadı.</h2>
                <Link href="/management/animals" style={{ color: 'var(--brand-blue)', textDecoration: 'none' }}>Geri Dön</Link>
            </div>
        );
    }

    const { animal, cowData, heiferData, calfData, vaccines, offsprings } = details;
    const typeLabel = animal.Type === 'cow' ? 'İnek' : animal.Type === 'heifer' ? 'Düve' : animal.Type === 'calf' ? 'Buzağı' : 'Dana';

    return (
        <div style={{ maxWidth: '800px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
                <Link
                    href="/management/animals"
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'white',
                        border: '1px solid #E5E7EB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--brand-gray)',
                        textDecoration: 'none',
                        flexShrink: 0,
                    }}
                >
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', fontWeight: 700, color: 'var(--brand-brown-dark)', margin: 0 }}>
                        {animal.Name}
                    </h2>
                    <p style={{ fontSize: '13px', color: 'var(--brand-gray)', margin: 0 }}>Hayvan Detayı</p>
                </div>
            </div>

            {/* General Info */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--brand-brown-dark)', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #F3F4F6' }}>
                    Genel Bilgiler
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                    {[
                        { icon: <Tag size={16} />, label: 'Küpe No', value: animal.EarringNo },
                        { icon: <User size={16} />, label: 'İsim', value: animal.Name },
                        { icon: <Calendar size={16} />, label: 'Doğum Tarihi', value: new Date(animal.BirthDate).toLocaleDateString('tr-TR') },
                        { icon: <Dna size={16} />, label: 'Cinsi', value: animal.Breed === 'Simmental' ? 'Simental' : animal.Breed },
                        { icon: <User size={16} />, label: 'Türü', value: typeLabel },
                        { icon: <Tag size={16} />, label: 'Anne Küpe No', value: animal.MotherEarringNo || '-' },
                        { icon: <User size={16} />, label: 'Anne Adı', value: animal.MotherName || '-' },
                    ].map((field) => (
                        <div key={field.label} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            <div style={{ color: 'var(--brand-brown-light)', marginTop: '2px', flexShrink: 0 }}>{field.icon}</div>
                            <div>
                                <div style={{ fontSize: '11px', color: 'var(--brand-gray)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{field.label}</div>
                                <div style={{ fontSize: '15px', color: '#374151', fontWeight: 600, marginTop: '2px' }}>{field.value}</div>
                            </div>
                        </div>
                    ))}
                </div>
                {animal.Note && (
                    <div style={{ marginTop: '16px', padding: '12px 16px', background: 'var(--brand-brown-pale)', borderRadius: '10px', borderLeft: '3px solid var(--brand-brown-light)' }}>
                        <div style={{ fontSize: '11px', color: 'var(--brand-gray)', fontWeight: 600, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <FileText size={12} /> NOT
                        </div>
                        <div style={{ fontSize: '14px', color: '#374151' }}>{animal.Note}</div>
                    </div>
                )}
            </div>

            {/* Type-specific Data */}
            {cowData && (
                <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--brand-brown-dark)', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #F3F4F6' }}>
                        İnek Bilgileri
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                        <div>
                            <div style={{ fontSize: '11px', color: 'var(--brand-gray)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tohumlama Tarihi</div>
                            <div style={{ fontSize: '15px', color: '#374151', fontWeight: 600, marginTop: '4px' }}>{cowData.InseminationDate ? new Date(cowData.InseminationDate).toLocaleDateString('tr-TR') : '-'}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '11px', color: 'var(--brand-gray)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dana İsmi (Baba)</div>
                            <div style={{ fontSize: '15px', color: '#374151', fontWeight: 600, marginTop: '4px' }}>{cowData.BullName || '-'}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '11px', color: 'var(--brand-gray)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gebelik Kontrol</div>
                            <div style={{ fontSize: '15px', color: '#374151', fontWeight: 600, marginTop: '4px' }}>{cowData.CheckedDate && cowData.CheckedDate !== '1970-01-01' ? new Date(cowData.CheckedDate).toLocaleDateString('tr-TR') : '-'}</div>
                        </div>
                    </div>
                </div>
            )}

            {heiferData && (
                <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--brand-brown-dark)', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #F3F4F6' }}>
                        Düve Bilgileri
                    </h3>
                    <div>
                        <div style={{ fontSize: '11px', color: 'var(--brand-gray)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Son Doğum Tarihi</div>
                        <div style={{ fontSize: '15px', color: '#374151', fontWeight: 600, marginTop: '4px' }}>{heiferData.LastBirthDate ? new Date(heiferData.LastBirthDate).toLocaleDateString('tr-TR') : '-'}</div>
                    </div>
                </div>
            )}

            {calfData && (
                <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--brand-brown-dark)', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #F3F4F6' }}>
                        Buzağı Bilgileri
                    </h3>
                    <div>
                        <div style={{ fontSize: '11px', color: 'var(--brand-gray)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cinsiyet</div>
                        <div style={{ fontSize: '15px', color: '#374151', fontWeight: 600, marginTop: '4px' }}>{calfData.Gender ? 'Dişi' : 'Erkek'}</div>
                    </div>
                </div>
            )}

            {/* Vaccines */}
            {vaccines && vaccines.length > 0 && (
                <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--brand-brown-dark)', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Syringe size={18} style={{ color: '#7C3AED' }} /> Aşı Geçmişi
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {vaccines.map((v) => (
                            <div key={v.Id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#F5F3FF', borderRadius: '8px', borderLeft: '3px solid #7C3AED' }}>
                                <span style={{ fontWeight: 600, fontSize: '14px', color: '#374151' }}>{v.VaccineName}</span>
                                <span style={{ fontSize: '13px', color: '#6B7280' }}>{new Date(v.VaccineDate).toLocaleDateString('tr-TR')}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Offsprings */}
            {offsprings && offsprings.length > 0 && (
                <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--brand-brown-dark)', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Baby size={18} style={{ color: '#16A34A' }} /> Yavruları
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {offsprings.map((calf) => (
                            <div key={calf.Id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#F0FDF4', borderRadius: '8px', borderLeft: '3px solid #16A34A' }}>
                                <div>
                                    <span style={{ fontWeight: 600, fontSize: '14px', color: '#374151' }}>{calf.Name}</span>
                                    <span style={{ fontSize: '12px', color: '#6B7280', marginLeft: '8px' }}>{calf.EarringNo}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ fontSize: '12px', color: '#6B7280' }}>{new Date(calf.BirthDate).toLocaleDateString('tr-TR')}</span>
                                    <Link href={`/management/animals/${calf.Id}`} style={{ fontSize: '12px', color: 'var(--brand-blue)', fontWeight: 600, textDecoration: 'none' }}>
                                        Görüntüle →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
