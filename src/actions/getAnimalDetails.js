// 'use server'

// import { supabase } from '@/lib/supabase'

// export async function getAnimalDetails(id) {
//     // First get the animal to know the type
//     const { data: animal, error } = await supabase
//         .from("Animals")
//         .select("*")
//         .eq("Id", id)
//         .single();

//     if (error || !animal) {
//         return null;
//     }

//     const details = { animal };

//     // Fetch specific type data
//     if (animal.Type === 'cow') {
//         const { data: cowData } = await supabase.from("Cows").select("*").eq("Id", id).single();
//         details.cowData = cowData;

//         // Fetch offsprings (calves)
//         const { data: calves } = await supabase.from("Animals").select("*").eq("Type", "calf").eq("MotherEarringNo", animal.EarringNo);
//         details.offsprings = calves;
//     } else if (animal.Type === 'heifer') {
//         const { data: heiferData } = await supabase.from("Heifers").select("*").eq("Id", id).single();
//         details.heiferData = heiferData;

//         // Fetch offsprings (calves) - Heifers might have calves if they just gave birth and type updated?
//         // Or history.
//         const { data: calves } = await supabase.from("Animals").select("*").eq("Type", "calf").eq("MotherEarringNo", animal.EarringNo);
//         details.offsprings = calves;
//     } else if (animal.Type === 'calf') {
//         const { data: calfData } = await supabase.from("Calves").select("*").eq("Id", id).single();
//         details.calfData = calfData;
//     } else if (animal.Type === 'bull') {
//         // Bulls don't have specific table data in addAnimal, but maybe they do?
//         // checked main.js getBullDatas -> only vaccines.
//     }

//     // Fetch vaccines
//     const { data: vaccines } = await supabase.from("Vaccines").select("*").eq("AnimalId", id);
//     details.vaccines = vaccines;

//     return details;
// }
