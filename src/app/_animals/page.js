import { getAnimals } from '@/actions/getAnimals';
import { removeAnimal } from '@/actions/removeAnimal';
import Link from 'next/link';
import { Info, Edit, Trash2, Plus, ArrowLeft } from 'lucide-react';

export default async function AnimalsPage({ searchParams }) {
    const { type } = await searchParams;
    const { animalDatas } = await getAnimals(type);

    let title = "Tüm Hayvanlar";
    if (type === "cow") title = "İnekler";
    else if (type === "heifer") title = "Düveler";
    else if (type === "calf") title = "Buzağılar";
    else if (type === "bull") title = "Danalar";

    return (
        <div className="container mx-auto mt-5 mb-4 px-4">
            <div className="relative mb-4 flex items-center justify-center">
                <Link href="/" className="absolute left-0 top-0 bg-gray-700 hover:bg-gray-800 text-white rounded-full w-12 h-12 shadow-lg transition-all duration-200 hover:scale-110 flex items-center justify-center" title="Ana Menü">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h2 className="text-2xl font-bold">{title} ({animalDatas.length})</h2>
            </div>

            <div className="shadow-lg rounded-lg overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="px-4 py-3 text-center font-semibold">Id</th>
                            <th className="px-4 py-3 text-center font-semibold">Küpe Numarası</th>
                            <th className="px-4 py-3 text-center font-semibold">Hayvan Adı</th>
                            <th className="px-4 py-3 text-center font-semibold">Doğum Tarihi</th>
                            <th className="px-4 py-3 text-center font-semibold">Cinsi</th>
                            <th className="px-4 py-3 text-center font-semibold">Türü</th>
                            <th className="px-4 py-3 text-center font-semibold">Anne Küpe No</th>
                            <th className="px-4 py-3 text-center font-semibold">Anne Adı</th>
                            <th className="px-4 py-3 text-center font-semibold">Not</th>
                            <th className="px-4 py-3 text-center font-semibold">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {animalDatas.map((animal) => {
                            let rowClass = "bg-blue-200 hover:bg-blue-300 transition-colors";
                            if (animal.Type === "cow") rowClass = "bg-green-200 hover:bg-green-300 transition-colors";
                            else if (animal.Type === "heifer") rowClass = "bg-red-200 hover:bg-red-300 transition-colors";
                            else if (animal.Type === "calf") rowClass = "bg-yellow-200 hover:bg-yellow-300 transition-colors";

                            let typeLabel = animal.Type;
                            if (animal.Type === "cow") typeLabel = "İnek";
                            else if (animal.Type === "heifer") typeLabel = "Düve";
                            else if (animal.Type === "bull") typeLabel = "Dana";
                            else if (animal.Type === "calf") typeLabel = "Buzağı";

                            let breedLabel = animal.Breed;
                            if (animal.Breed === "Simmental") breedLabel = "Simental";

                            return (
                                <tr key={animal.Id} className={rowClass}>
                                    <td className="px-4 py-3 text-center font-bold whitespace-nowrap">{animal.Id}</td>
                                    <td className="px-4 py-3 text-center font-bold whitespace-nowrap">{animal.EarringNo}</td>
                                    <td className="px-4 py-3 text-center font-bold whitespace-nowrap">{animal.Name}</td>
                                    <td className="px-4 py-3 text-center font-bold whitespace-nowrap">{new Date(animal.BirthDate).toLocaleDateString("tr-TR")}</td>
                                    <td className="px-4 py-3 text-center font-bold whitespace-nowrap">{breedLabel}</td>
                                    <td className="px-4 py-3 text-center font-bold whitespace-nowrap">{typeLabel}</td>
                                    <td className="px-4 py-3 text-center font-bold whitespace-nowrap">{animal.MotherEarringNo}</td>
                                    <td className="px-4 py-3 text-center font-bold whitespace-nowrap">{animal.MotherName}</td>
                                    <td className="px-4 py-3 text-center font-bold overflow-y-auto max-w-xs truncate" title={animal.Note}>{animal.Note}</td>
                                    <td className="px-4 py-3 text-center font-bold whitespace-nowrap">
                                        <div className="flex justify-center gap-1">
                                            <Link href={`/animals/${animal.Id}`} className="cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-2 rounded text-sm transition-colors">
                                                <Info className="w-5 h-5" />
                                            </Link>
                                            <Link href={`/animals/update/${animal.Id}`} className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-2 rounded text-sm transition-colors">
                                                <Edit className="w-5 h-5" />
                                            </Link>
                                            <form action={async () => {
                                                'use server';
                                                await removeAnimal({ animalId: animal.Id, Type: animal.Type });
                                            }}>
                                                <button type="submit" className="cursor-pointer bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 rounded text-sm transition-colors" onclick="return confirm('Silmek istediğinize emin misiniz?');">
                                                    <Trash2 className="w-5 h-5" />
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

            <Link href="/animals/add" className="fixed bottom-5 right-5 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors flex items-center gap-2 z-50">
                <Plus className="w-6 h-6" />
                Yeni Hayvan Ekle
            </Link>
        </div>
    );
}
