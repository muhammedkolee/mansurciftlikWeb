import { getAnimalDetails } from '@/actions/getAnimalDetails';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function AnimalDetailPage({ params }) {
    const { id } = await params;
    const details = await getAnimalDetails(id);

    if (!details) {
        return <div>Hayvan bulunamadı.</div>;
    }

    const { animal, cowData, heiferData, calfData, vaccines, offsprings } = details;

    return (
        <div className="container mx-auto mt-5 mb-4 px-4 max-w-4xl">
            <div className="relative mb-6 flex items-center justify-center">
                <Link href="/animals" className="absolute left-0 top-0 bg-gray-700 hover:bg-gray-800 text-white rounded-full w-12 h-12 shadow-lg transition-all duration-200 hover:scale-110 flex items-center justify-center" title="Geri Dön">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h2 className="text-2xl font-bold">Hayvan Detayı: {animal.Name}</h2>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold mb-4 border-b pb-2">Genel Bilgiler</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><span className="font-semibold">Küpe No:</span> {animal.EarringNo}</div>
                    <div><span className="font-semibold">İsim:</span> {animal.Name}</div>
                    <div><span className="font-semibold">Doğum Tarihi:</span> {new Date(animal.BirthDate).toLocaleDateString("tr-TR")}</div>
                    <div><span className="font-semibold">Cinsi:</span> {animal.Breed}</div>
                    <div><span className="font-semibold">Türü:</span> {animal.Type === 'cow' ? 'İnek' : animal.Type === 'heifer' ? 'Düve' : animal.Type === 'calf' ? 'Buzağı' : 'Dana'}</div>
                    <div><span className="font-semibold">Anne Küpe No:</span> {animal.MotherEarringNo}</div>
                    <div><span className="font-semibold">Anne Adı:</span> {animal.MotherName}</div>
                </div>
                {animal.Note && (
                    <div className="mt-4">
                        <span className="font-semibold">Not:</span>
                        <p className="bg-gray-100 p-2 rounded mt-1">{animal.Note}</p>
                    </div>
                )}
            </div>

            {cowData && (
                <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-bold mb-4 border-b pb-2">İnek Bilgileri</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><span className="font-semibold">Tohumlama Tarihi:</span> {cowData.InseminationDate ? new Date(cowData.InseminationDate).toLocaleDateString("tr-TR") : '-'}</div>
                        <div><span className="font-semibold">Dana İsmi (Baba):</span> {cowData.BullName || '-'}</div>
                        <div><span className="font-semibold">Gebelik Kontrol:</span> {cowData.CheckedDate && cowData.CheckedDate !== '1970-01-01' ? new Date(cowData.CheckedDate).toLocaleDateString("tr-TR") : '-'}</div>
                    </div>
                </div>
            )}

            {heiferData && (
                <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-bold mb-4 border-b pb-2">Düve Bilgileri</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><span className="font-semibold">Son Doğum Tarihi:</span> {heiferData.LastBirthDate ? new Date(heiferData.LastBirthDate).toLocaleDateString("tr-TR") : '-'}</div>
                    </div>
                </div>
            )}

            {calfData && (
                <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-bold mb-4 border-b pb-2">Buzağı Bilgileri</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><span className="font-semibold">Cinsiyet:</span> {calfData.Gender ? 'Dişi' : 'Erkek'}</div>
                    </div>
                </div>
            )}

            {vaccines && vaccines.length > 0 && (
                <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-bold mb-4 border-b pb-2">Aşı Geçmişi</h3>
                    <ul className="list-disc list-inside">
                        {vaccines.map(v => (
                            <li key={v.Id}>
                                <span className="font-semibold">{v.VaccineName}:</span> {new Date(v.VaccineDate).toLocaleDateString("tr-TR")}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {offsprings && offsprings.length > 0 && (
                <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-bold mb-4 border-b pb-2">Yavruları</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-left">Küpe No</th>
                                    <th className="px-4 py-2 text-left">İsim</th>
                                    <th className="px-4 py-2 text-left">Doğum Tarihi</th>
                                    <th className="px-4 py-2 text-left">Detay</th>
                                </tr>
                            </thead>
                            <tbody>
                                {offsprings.map(calf => (
                                    <tr key={calf.Id} className="border-t">
                                        <td className="px-4 py-2">{calf.EarringNo}</td>
                                        <td className="px-4 py-2">{calf.Name}</td>
                                        <td className="px-4 py-2">{new Date(calf.BirthDate).toLocaleDateString("tr-TR")}</td>
                                        <td className="px-4 py-2">
                                            <Link href={`/animals/${calf.Id}`} className="text-blue-600 hover:underline">Görüntüle</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
