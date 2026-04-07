// 'use server'

// import { supabase } from '@/lib/supabase'
// import { revalidatePath } from 'next/cache'

// export async function updateAnimal(allDatas) {
//     const { data: willRemoveAnimal, error: animalError } = await supabase
//         .from("Animals")
//         .select("*")
//         .eq("Id", allDatas.animalData.Id);

//     if (animalError || !willRemoveAnimal || willRemoveAnimal.length === 0) {
//         return { success: false, error: "Animal not found" };
//     }

//     const currentType = willRemoveAnimal[0].Type;
//     const newType = allDatas.animalData.Type;

//     if (newType == currentType) {
//         let table = "";
//         let updateData = {};

//         if (currentType == "cow") {
//             table = "Cows";
//             updateData = allDatas.cowData;
//         } else if (currentType == "heifer") {
//             table = "Heifers";
//             updateData = allDatas.heiferData;
//         } else if (currentType == "calf") {
//             table = "Calves";
//             updateData = allDatas.calfData;
//         }

//         if (table) {
//             const { error } = await supabase
//                 .from(table)
//                 .update(updateData)
//                 .eq("Id", allDatas.animalData.Id);

//             if (error) return { success: false, error: error.message };
//         }
//     } else {
//         // Type changed, delete from old table and insert into new
//         let oldTable = "";
//         if (currentType == "cow") oldTable = "Cows";
//         else if (currentType == "heifer") oldTable = "Heifers";
//         else if (currentType == "calf") oldTable = "Calves";

//         if (oldTable) {
//             await supabase.from(oldTable).delete().eq("Id", allDatas.animalData.Id);
//         }

//         let newTable = "";
//         let insertData = {};
//         if (newType == "cow") {
//             newTable = "Cows";
//             insertData = allDatas.cowData;
//         } else if (newType == "heifer") {
//             newTable = "Heifers";
//             insertData = allDatas.heiferData;
//         } else if (newType == "calf") {
//             newTable = "Calves";
//             insertData = allDatas.calfData;
//         }

//         if (newTable) {
//             insertData.Id = allDatas.animalData.Id;
//             const { error } = await supabase.from(newTable).insert(insertData);
//             if (error) return { success: false, error: error.message };
//         }
//     }

//     const { error } = await supabase
//         .from("Animals")
//         .update(allDatas.animalData)
//         .eq("Id", allDatas.animalData.Id);

//     if (error) {
//         return { success: false, error: error.message };
//     }

//     revalidatePath('/animals');
//     revalidatePath('/');
//     return { success: true };
// }
