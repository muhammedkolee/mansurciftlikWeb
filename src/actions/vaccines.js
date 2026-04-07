// 'use server'

// import { supabase } from '@/lib/supabase'
// import { revalidatePath } from 'next/cache'

// export async function addVaccine(vaccineDatas) {
//     if (vaccineDatas.all) {
//         const { data, error } = await supabase.from("Animals").select("*");
//         if (error) return { success: false, error: error.message };

//         const inserts = data.map(animal => ({
//             VaccineName: vaccineDatas.VaccineName,
//             VaccineDate: vaccineDatas.VaccineDate,
//             AnimalId: animal.Id,
//         }));

//         const { error: insertError } = await supabase.from("Vaccines").insert(inserts);
//         if (insertError) return { success: false, error: insertError.message };

//     } else if (vaccineDatas.types) {
//         const types = [];
//         if (vaccineDatas.types.cows) types.push("cow");
//         if (vaccineDatas.types.heifers) types.push("heifer");
//         if (vaccineDatas.types.calves) types.push("calf");
//         if (vaccineDatas.types.bulls) types.push("bull");

//         if (types.length > 0) {
//             const { data, error } = await supabase
//                 .from("Animals")
//                 .select("*")
//                 .in("Type", types);

//             if (error) return { success: false, error: error.message };

//             const inserts = data.map(animal => ({
//                 VaccineName: vaccineDatas.VaccineName,
//                 VaccineDate: vaccineDatas.VaccineDate,
//                 AnimalId: animal.Id,
//             }));

//             const { error: insertError } = await supabase.from("Vaccines").insert(inserts);
//             if (insertError) return { success: false, error: insertError.message };
//         }
//     } else if (vaccineDatas.AnimalId) {
//         const { error } = await supabase.from("Vaccines").insert(vaccineDatas);
//         if (error) return { success: false, error: error.message };
//     }

//     revalidatePath('/vaccines');
//     return { success: true };
// }

// export async function removeVaccine(vaccineId) {
//     if (Array.isArray(vaccineId)) {
//         const { error } = await supabase
//             .from("Vaccines")
//             .delete()
//             .in("Id", vaccineId);
//         if (error) return { success: false, error: error.message };
//     } else {
//         const { error } = await supabase
//             .from("Vaccines")
//             .delete()
//             .eq("Id", vaccineId);
//         if (error) return { success: false, error: error.message };
//     }

//     revalidatePath('/vaccines');
//     return { success: true };
// }
