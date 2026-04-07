// 'use server'

// import { supabase } from '@/lib/supabase'
// import { revalidatePath } from 'next/cache'

// export async function removeAnimal(datas) {
//     let table = "";
//     if (datas.Type === "cow") table = "Cows";
//     else if (datas.Type === "heifer") table = "Heifers";
//     else if (datas.Type === "calf") table = "Calves";

//     if (table) {
//         await supabase.from(table).delete().eq("Id", datas.animalId);
//     }

//     const { error } = await supabase
//         .from("Animals")
//         .delete()
//         .eq("Id", datas.animalId);

//     if (error) {
//         return { success: false, error: error.message };
//     }

//     revalidatePath('/animals');
//     revalidatePath('/');
//     return { success: true };
// }
