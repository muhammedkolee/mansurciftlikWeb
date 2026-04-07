// 'use server'

// import { supabase } from '@/lib/supabase'
// import { revalidatePath } from 'next/cache'

// export async function addAnimal(datas) {
//     const { data, error } = await supabase
//         .from("Animals")
//         .insert(datas.animalDatas)
//         .select();

//     if (error) {
//         console.error("Error adding animal:", error);
//         return { success: false, error: error.message };
//     }

//     const animalId = data[0].Id;
//     let typeError = null;

//     if (datas.animalDatas.Type === "cow") {
//         datas.cowDatas.Id = animalId;
//         const { error } = await supabase.from("Cows").insert(datas.cowDatas);
//         typeError = error;
//     } else if (datas.animalDatas.Type === "heifer") {
//         datas.heiferDatas.Id = animalId;
//         const { error } = await supabase.from("Heifers").insert(datas.heiferDatas);
//         typeError = error;
//     } else if (datas.animalDatas.Type === "calf") {
//         datas.calfDatas.Id = animalId;
//         const { error } = await supabase.from("Calves").insert(datas.calfDatas);
//         typeError = error;
//     }

//     if (typeError) {
//         console.error("Error adding specific animal type:", typeError);
//         // Rollback? For now just return error
//         return { success: false, error: typeError.message };
//     }

//     revalidatePath('/animals');
//     revalidatePath('/');
//     return { success: true };
// }
