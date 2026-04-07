// 'use server'

// import { supabase } from '@/lib/supabase'

// export async function getAnimals(type) {
//     let query = supabase
//         .from("Animals")
//         .select("*")
//         .order('EarringNo', { ascending: true });

//     if (type) {
//         query = query.eq('Type', type);
//     }

//     const { data: animals, error } = await query;

//     if (error) {
//         console.error("Error fetching animals:", error);
//         return { animalDatas: [], settingsDatas: {} };
//     }

//     const settingsDatas = { showInformationButton: true };

//     return { animalDatas: animals, settingsDatas };
// }
