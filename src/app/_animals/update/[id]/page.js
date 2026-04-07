import UpdateAnimalForm from '@/components/UpdateAnimalForm';
import { getAnimalDetails } from '@/actions/getAnimalDetails';
import { getMothers, getBulls } from '@/actions/formHelpers';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function UpdateAnimalPage({ params }) {
    const { id } = await params;
    const details = await getAnimalDetails(id);
    const mothers = await getMothers();
    const bulls = await getBulls();

    if (!details) {
        return <div>Hayvan bulunamadı.</div>;
    }

    return (
        <div className="container mx-auto mt-5 mb-4 px-4 max-w-3xl">
            <div className="relative mb-6 flex items-center justify-center">
                <Link href="/animals" className="absolute left-0 top-0 bg-gray-700 hover:bg-gray-800 text-white rounded-full w-12 h-12 shadow-lg transition-all duration-200 hover:scale-110 flex items-center justify-center" title="Geri Dön">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h2 className="text-2xl font-bold">Hayvanı Güncelle</h2>
            </div>

            <UpdateAnimalForm initialData={details} mothers={mothers} bulls={bulls} />
        </div>
    );
}
