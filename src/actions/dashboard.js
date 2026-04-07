// 'use server'

// import { supabase } from '@/lib/supabase'

// export async function getDashboardStats() {
//     const { count: cowCount } = await supabase.from('Animals').select('*', { count: 'exact', head: true }).eq('Type', 'cow');
//     const { count: heiferCount } = await supabase.from('Animals').select('*', { count: 'exact', head: true }).eq('Type', 'heifer');
//     const { count: calfCount } = await supabase.from('Animals').select('*', { count: 'exact', head: true }).eq('Type', 'calf');
//     const { count: bullCount } = await supabase.from('Animals').select('*', { count: 'exact', head: true }).eq('Type', 'bull');

//     return {
//         cowCount: cowCount || 0,
//         heiferCount: heiferCount || 0,
//         calfCount: calfCount || 0,
//         bullCount: bullCount || 0
//     };
// }

// function getTodayDate() {
//     let today = new Date();
//     let year = today.getFullYear();
//     let month = String(today.getMonth() + 1).padStart(2, "0");
//     let day = String(today.getDate()).padStart(2, "0");
//     return new Date(`${year}-${month}-${day}`);
// }

// export async function getDashboardLists() {
//     const today = getTodayDate();
//     const todayTime = today.getTime();
//     const dayInMillis = 1000 * 60 * 60 * 24;

//     // Closest Heifers
//     const { data: heifers } = await supabase.from('Heifers').select('*');
//     const closestHeifers = [];

//     if (heifers) {
//         heifers.forEach(heifer => {
//             if (heifer.LastBirthDate) {
//                 const lastBirth = new Date(heifer.LastBirthDate);
//                 const diffDays = (todayTime - lastBirth.getTime()) / dayInMillis;
//                 if (diffDays >= 40 && diffDays <= 90) {
//                     closestHeifers.push({
//                         EarringNo: heifer.EarringNo,
//                         Name: heifer.Name,
//                         Date: Math.floor(diffDays)
//                     });
//                 }
//             }
//         });
//     }

//     // Closest Cows
//     const { data: cows } = await supabase.from('Cows').select('*');
//     const closestCows = [];

//     if (cows) {
//         cows.forEach(cow => {
//             if (cow.InseminationDate) {
//                 const inseminationDate = new Date(cow.InseminationDate);
//                 const daysSinceInsemination = (todayTime - inseminationDate.getTime()) / dayInMillis;
//                 const daysUntilBirth = 280 - daysSinceInsemination; // Assuming 280 days gestation

//                 // Logic from original: (today - insemination) + 280 <= 20 ?? 
//                 // Original: (new Date(cow.InseminationDate) - getTodayDate()) / dayInMillis + 280 <= 20
//                 // Wait, (Insemination - Today) is negative. So it's -DaysSince + 280 <= 20.
//                 // Which means DaysUntilBirth <= 20.

//                 // Let's re-read original:
//                 // (new Date(cow.InseminationDate) - getTodayDate()) / (1000 * 60 * 60 * 24) + 280 <= 20
//                 // Example: Insemination = Today. Diff = 0. 0 + 280 <= 20 False.
//                 // Example: Insemination = 270 days ago. Diff = -270. -270 + 280 = 10 <= 20 True.

//                 const val = ((inseminationDate.getTime() - todayTime) / dayInMillis) + 280;

//                 if (val <= 20) {
//                     closestCows.push({
//                         EarringNo: cow.EarringNo,
//                         Name: cow.Name,
//                         Date: Math.floor(val)
//                     });
//                 }
//             }
//         });
//     }

//     // Info
//     const { data: infoDatas } = await supabase.from('Information').select('*').order('CreatedAt', { ascending: false });

//     return {
//         closestHeifers,
//         closestCows,
//         info: infoDatas || []
//     };
// }

// export async function syncDatabase() {
//     const today = getTodayDate();
//     const todayTime = today.getTime();
//     const dayInMillis = 1000 * 60 * 60 * 24;

//     // Get calves
//     const { data: calves } = await supabase.from('Calves').select('*');

//     if (calves) {
//         for (const calf of calves) {
//             const birthDate = new Date(calf.BirthDate);
//             const ageDays = (todayTime - birthDate.getTime()) / dayInMillis;

//             if (ageDays >= 365) {
//                 // Delete from Calves
//                 await supabase.from('Calves').delete().eq('EarringNo', calf.EarringNo);

//                 // Insert into Heifers or update Animals type
//                 if (calf.Gender) { // Assuming Gender true = Female/Heifer based on original logic "If calf is a girl"
//                     await supabase.from('Heifers').insert({
//                         EarringNo: calf.EarringNo,
//                         Name: calf.Name,
//                         LastBirthDate: today.toISOString(), // Original used getTodayDate()
//                         // Note: Original insert didn't include Id, but Supabase might auto-gen or we need it?
//                         // In addAnimalF.js, Id is shared.
//                         // Here we should probably keep the Id.
//                         Id: calf.Id
//                     });

//                     await supabase.from('Animals').update({ Type: 'heifer' }).eq('EarringNo', calf.EarringNo);

//                     await supabase.from('Information').insert({
//                         Info: `${calf.EarringNo} küpe numaralı buzağı "Düve" olarak kaydedildi!`
//                     });
//                 } else {
//                     // Bull
//                     await supabase.from('Animals').update({ Type: 'bull' }).eq('EarringNo', calf.EarringNo);
//                     // No Bulls table insert in original code?
//                     // "If calf is a boy, insert Bulls." comment exists but code only updates Animals type.
//                 }
//             }
//         }
//     }

//     // Clean up old info
//     const { data: infoDatas } = await supabase.from('Information').select('*');
//     if (infoDatas) {
//         for (const info of infoDatas) {
//             const createdAt = new Date(info.CreatedAt);
//             const ageDays = (todayTime - createdAt.getTime()) / dayInMillis;
//             if (ageDays > 5) {
//                 await supabase.from('Information').delete().eq('Info', info.Info); // Deleting by Info string might be risky if duplicates
//             }
//         }
//     }

//     return { success: true };
// }
