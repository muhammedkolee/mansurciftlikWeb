// 'use server'

// import { supabase } from '@/lib/supabase'

// export async function getMothers() {
//     const { data, error } = await supabase
//         .from("Animals")
//         .select("EarringNo, Name")
//         .in("Type", ["cow", "heifer"]);

//     if (error) {
//         console.error("Error fetching mothers:", error);
//         return [];
//     }
//     return data;
// }

// export async function getBulls() {
//     const { data, error } = await supabase
//         .from("Animals")
//         .select("Name")
//         .eq("Type", "bull");

//     if (error) {
//         console.error("Error fetching bulls:", error);
//         return [];
//     }
//     return data;
// }
