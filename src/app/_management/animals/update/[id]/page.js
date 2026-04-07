import UpdateAnimalForm from '@/components/UpdateAnimalForm';
import { getAnimalDetails } from '@/actions/getAnimalDetails';
import { getMothers, getBulls } from '@/actions/formHelpers';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = { title: 'Hayvan Güncelle' };

export default async function ManagementUpdateAnimalPage({ params }) {
    const { id } = await params;
    const details = await getAnimalDetails(id);
    const mothers = await getMothers();
    const bulls = await getBulls();

    if (!details) {
        return (
            <div style={{ textAlign: 'center', padding: '80px', color: 'var(--brand-gray)' }}>
                <h2>Hayvan bulunamadı.</h2>
                <Link href="/management/animals" style={{ color: 'var(--brand-blue)' }}>Geri Dön</Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '700px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
                <Link
                    href={`/management/animals/${id}`}
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
                        Hayvanı Güncelle
                    </h2>
                    <p style={{ fontSize: '13px', color: 'var(--brand-gray)', margin: 0 }}>{details.animal?.Name}</p>
                </div>
            </div>
            <UpdateAnimalForm initialData={details} mothers={mothers} bulls={bulls} />
        </div>
    );
}
