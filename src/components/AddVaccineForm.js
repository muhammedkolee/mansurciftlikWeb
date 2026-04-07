// 'use client'

// import { useState } from 'react';
// import { addVaccine } from '@/actions/vaccines';
// import { useRouter } from 'next/navigation';

// export default function AddVaccineForm({ animals }) {
//     const router = useRouter();
//     const [mode, setMode] = useState('single'); // single, type, all
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError(null);

//         const formData = new FormData(e.target);
//         const data = Object.fromEntries(formData.entries());

//         const vaccineDatas = {
//             VaccineName: data.VaccineName,
//             VaccineDate: data.VaccineDate,
//         };

//         if (mode === 'single') {
//             vaccineDatas.AnimalId = data.AnimalId;
//         } else if (mode === 'type') {
//             vaccineDatas.types = {
//                 cows: data.cows === 'on',
//                 heifers: data.heifers === 'on',
//                 calves: data.calves === 'on',
//                 bulls: data.bulls === 'on'
//             };
//         } else if (mode === 'all') {
//             vaccineDatas.all = true;
//         }

//         const result = await addVaccine(vaccineDatas);

//         if (result.success) {
//             alert('Aşı başarıyla eklendi!');
//             router.push('/vaccines');
//             router.refresh();
//         } else {
//             setError(result.error);
//             alert('Hata: ' + result.error);
//         }
//         setLoading(false);
//     };

//     return (
//         <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
//             {error && <div className="text-red-500 font-bold">{error}</div>}

//             <div>
//                 <label className="block text-sm font-medium text-gray-700">Aşı Adı</label>
//                 <input type="text" name="VaccineName" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
//             </div>

//             <div>
//                 <label className="block text-sm font-medium text-gray-700">Aşı Tarihi</label>
//                 <input type="date" name="VaccineDate" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
//             </div>

//             <div className="flex gap-4 mb-4">
//                 <label className="inline-flex items-center">
//                     <input type="radio" className="form-radio" name="mode" value="single" checked={mode === 'single'} onChange={() => setMode('single')} />
//                     <span className="ml-2">Tek Hayvan</span>
//                 </label>
//                 <label className="inline-flex items-center">
//                     <input type="radio" className="form-radio" name="mode" value="type" checked={mode === 'type'} onChange={() => setMode('type')} />
//                     <span className="ml-2">Türe Göre</span>
//                 </label>
//                 <label className="inline-flex items-center">
//                     <input type="radio" className="form-radio" name="mode" value="all" checked={mode === 'all'} onChange={() => setMode('all')} />
//                     <span className="ml-2">Tüm Hayvanlar</span>
//                 </label>
//             </div>

//             {mode === 'single' && (
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700">Hayvan Seç</label>
//                     <input type="text" name="AnimalId" list="animalsList" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" placeholder="Küpe No veya İsim ile ara..." />
//                     <datalist id="animalsList">
//                         {animals.map(a => <option key={a.Id} value={a.Id}>{a.EarringNo} - {a.Name}</option>)}
//                     </datalist>
//                 </div>
//             )}

//             {mode === 'type' && (
//                 <div className="space-y-2">
//                     <label className="inline-flex items-center mr-4">
//                         <input type="checkbox" name="cows" className="form-checkbox" />
//                         <span className="ml-2">İnekler</span>
//                     </label>
//                     <label className="inline-flex items-center mr-4">
//                         <input type="checkbox" name="heifers" className="form-checkbox" />
//                         <span className="ml-2">Düveler</span>
//                     </label>
//                     <label className="inline-flex items-center mr-4">
//                         <input type="checkbox" name="calves" className="form-checkbox" />
//                         <span className="ml-2">Buzağılar</span>
//                     </label>
//                     <label className="inline-flex items-center">
//                         <input type="checkbox" name="bulls" className="form-checkbox" />
//                         <span className="ml-2">Danalar</span>
//                     </label>
//                 </div>
//             )}

//             <div className="flex justify-end">
//                 <button
//                     type="submit"
//                     disabled={loading}
//                     className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
//                 >
//                     {loading ? 'Kaydediliyor...' : 'Kaydet'}
//                 </button>
//             </div>
//         </form>
//     );
// }
