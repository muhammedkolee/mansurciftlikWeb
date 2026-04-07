import { getVaccines, getVaccineNames } from '@/actions/getVaccines';
import { removeVaccine as removeVaccineAction } from '@/actions/vaccines';
import Link from 'next/link';
import { Trash2, Plus, ArrowLeft } from 'lucide-react';

export default async function VaccinesPage() {
    const vaccines = await getVaccines();
    const vaccineNames = await getVaccineNames();

    // Pivot data: Group by Animal
    const animalVaccineMap = {};
    vaccines.forEach(v => {
        if (!v.Animals) return; // Skip if animal deleted
        const animalId = v.Animals.Id;
        if (!animalVaccineMap[animalId]) {
            animalVaccineMap[animalId] = {
                earringNo: v.Animals.EarringNo,
                name: v.Animals.Name,
                vaccines: {}
            };
        }
        if (!animalVaccineMap[animalId].vaccines[v.VaccineName]) {
            animalVaccineMap[animalId].vaccines[v.VaccineName] = [];
        }
        animalVaccineMap[animalId].vaccines[v.VaccineName].push({
            id: v.Id,
            date: v.VaccineDate
        });
    });

    return (
        <div className="container mx-auto mt-5 mb-4 px-4">
            <div className="relative mb-4 flex items-center justify-center">
                <Link href="/" className="absolute left-0 top-0 bg-gray-700 hover:bg-gray-800 text-white rounded-full w-12 h-12 shadow-lg transition-all duration-200 hover:scale-110 flex items-center justify-center" title="Ana Menü">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h2 className="text-2xl font-bold">Aşı Takip Listesi</h2>
            </div>

            <div className="shadow-lg rounded-lg overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="px-4 py-3 text-center">Sayı</th>
                            <th className="px-4 py-3 text-center">Küpe No.</th>
                            <th className="px-4 py-3 text-center">İsim</th>
                            {vaccineNames.map(name => (
                                <th key={name} className="px-4 py-3 text-center">{name}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {Object.values(animalVaccineMap).map((animal, index) => (
                            <tr key={animal.earringNo} className="hover:bg-blue-200 transition-colors duration-150 font-bold bg-yellow-100">
                                <td className="px-4 py-3 text-center">{index + 1}-)</td>
                                <td className="px-4 py-3 text-center">{animal.earringNo}</td>
                                <td className="px-4 py-3 text-center">{animal.name}</td>
                                {vaccineNames.map(vName => (
                                    <td key={vName} className="px-4 py-3 text-center">
                                        {animal.vaccines[vName] ? (
                                            <div className="space-y-1">
                                                {animal.vaccines[vName].map(v => (
                                                    <div key={v.id} className="flex items-center justify-center gap-2">
                                                        <span className="text-sm">{new Date(v.date).toLocaleDateString("tr-TR")}</span>
                                                        <form action={async () => {
                                                            'use server';
                                                            await removeVaccineAction(v.id);
                                                        }}>
                                                            <button type="submit" className="text-red-500 hover:text-red-700 transition-colors" onclick="return confirm('Bu aşıyı silmek istediğinize emin misiniz?');">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </form>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Link href="/vaccines/add" className="fixed bottom-5 right-5 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors flex items-center gap-2 z-50">
                <Plus className="w-6 h-6" />
                Yeni Aşı Ekle
            </Link>
        </div>
    );
}
