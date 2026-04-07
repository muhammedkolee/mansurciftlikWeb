import AddAnimalForm from '@/components/AddAnimalForm';
import { getMothers, getBulls } from '@/actions/formHelpers';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = { title: 'Hayvan Ekle' };

export default async function ManagementAddAnimalPage() {
    const mothers = await getMothers();
    const bulls = await getBulls();

    return (
        <div style={{ maxWidth: '700px' }}>
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
                        Yeni Hayvan Ekle
                    </h2>
                    <p style={{ fontSize: '13px', color: 'var(--brand-gray)', margin: 0 }}>Yeni hayvan kaydı oluşturun</p>
                </div>
            </div>
            <AddAnimalForm mothers={mothers} bulls={bulls} />
        </div>
    );
}
