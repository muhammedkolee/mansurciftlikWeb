// 'use client'

// import { useState } from 'react';
// import { addAnimal } from '@/actions/addAnimal';
// import { useRouter } from 'next/navigation';

// export default function AddAnimalForm({ mothers, bulls }) {
//     const router = useRouter();
//     const [type, setType] = useState('cow');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError(null);

//         const formData = new FormData(e.target);
//         const data = Object.fromEntries(formData.entries());

//         // Construct the datas object expected by addAnimal action
//         const animalDatas = {
//             EarringNo: data.EarringNo,
//             Name: data.Name,
//             BirthDate: data.BirthDate,
//             Breed: data.Breed,
//             Type: type,
//             MotherEarringNo: data.MotherEarringNo,
//             MotherName: data.MotherName,
//             Note: data.Note
//         };

//         const datas = {
//             animalDatas: animalDatas,
//             cowDatas: {},
//             heiferDatas: {},
//             calfDatas: {}
//         };

//         if (type === 'cow') {
//             datas.cowDatas = {
//                 EarringNo: data.EarringNo,
//                 Name: data.Name,
//                 InseminationDate: data.InseminationDate,
//                 BullName: data.BullName,
//                 CheckedDate: data.CheckedDate || '1970-01-01'
//             };
//         } else if (type === 'heifer') {
//             datas.heiferDatas = {
//                 EarringNo: data.EarringNo,
//                 Name: data.Name,
//                 LastBirthDate: data.LastBirthDate
//             };
//         } else if (type === 'calf') {
//             datas.calfDatas = {
//                 EarringNo: data.EarringNo,
//                 Name: data.Name,
//                 BirthDate: data.BirthDate,
//                 Gender: data.Gender === 'true' // Convert string to boolean
//             };
//         }

//         const result = await addAnimal(datas);

//         if (result.success) {
//             alert('Hayvan başarıyla eklendi!');
//             router.push('/animals');
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
//                 <label className="block text-sm font-medium text-gray-700">Hayvan Türü</label>
//                 <select
//                     value={type}
//                     onChange={(e) => setType(e.target.value)}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
//                 >
//                     <option value="cow">İnek</option>
//                     <option value="heifer">Düve</option>
//                     <option value="calf">Buzağı</option>
//                     <option value="bull">Dana</option>
//                 </select>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700">Küpe Numarası</label>
//                     <input type="text" name="EarringNo" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700">İsim</label>
//                     <input type="text" name="Name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700">Doğum Tarihi</label>
//                     <input type="date" name="BirthDate" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700">Cinsi</label>
//                     <select name="Breed" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border">
//                         <option value="Simmental">Simental</option>
//                         <option value="Angus">Angus</option>
//                         <option value="Other">Diğer</option>
//                     </select>
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700">Anne Küpe No</label>
//                     <input type="text" name="MotherEarringNo" list="mothersList" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
//                     <datalist id="mothersList">
//                         {mothers.map(m => <option key={m.EarringNo} value={m.EarringNo}>{m.Name}</option>)}
//                     </datalist>
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700">Anne Adı</label>
//                     <input type="text" name="MotherName" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
//                 </div>
//             </div>

//             {/* Type Specific Fields */}
//             {type === 'cow' && (
//                 <div className="border-t pt-4 mt-4">
//                     <h3 className="text-lg font-medium mb-2">İnek Bilgileri</h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700">Tohumlama Tarihi</label>
//                             <input type="date" name="InseminationDate" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700">Dana İsmi (Baba)</label>
//                             <input type="text" name="BullName" list="bullsList" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
//                             <datalist id="bullsList">
//                                 {bulls.map((b, i) => <option key={i} value={b.Name} />)}
//                             </datalist>
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700">Gebelik Kontrol Tarihi</label>
//                             <input type="date" name="CheckedDate" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {type === 'heifer' && (
//                 <div className="border-t pt-4 mt-4">
//                     <h3 className="text-lg font-medium mb-2">Düve Bilgileri</h3>
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">Son Doğum Tarihi (Varsa)</label>
//                         <input type="date" name="LastBirthDate" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
//                     </div>
//                 </div>
//             )}

//             {type === 'calf' && (
//                 <div className="border-t pt-4 mt-4">
//                     <h3 className="text-lg font-medium mb-2">Buzağı Bilgileri</h3>
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">Cinsiyet</label>
//                         <select name="Gender" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border">
//                             <option value="true">Dişi</option>
//                             <option value="false">Erkek</option>
//                         </select>
//                     </div>
//                 </div>
//             )}

//             <div>
//                 <label className="block text-sm font-medium text-gray-700">Not</label>
//                 <textarea name="Note" rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"></textarea>
//             </div>

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
