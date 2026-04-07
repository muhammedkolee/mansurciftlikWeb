import AddVaccineForm from '@/components/AddVaccineForm';
import { getAnimals } from '@/actions/getAnimals';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function AddVaccinePage() {
    const { animalDatas } = await getAnimals();

    return (
        <div className="container mx-auto mt-5 mb-4 px-4 max-w-3xl">
            <div className="relative mb-6 flex items-center justify-center">
                <Link href="/vaccines" className="absolute left-0 top-0 bg-gray-700 hover:bg-gray-800 text-white rounded-full w-12 h-12 shadow-lg transition-all duration-200 hover:scale-110 flex items-center justify-center" title="Geri Dön">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h2 className="text-2xl font-bold">Yeni Aşı Ekle</h2>
            </div>

            <AddVaccineForm animals={animalDatas} />
        </div>
    );
}
