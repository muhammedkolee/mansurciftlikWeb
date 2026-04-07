// 'use server'

// import { supabase } from '@/lib/supabase'

// export async function getVaccines() {
//     const { data: vaccines, error } = await supabase
//         .from("Vaccines")
//         .select("*, Animals (Id, EarringNo, Name)")
//         .order("Id", { ascending: true });

//     if (error) {
//         console.error("Error fetching vaccines:", error);
//         return [];
//     }

//     return vaccines;
// }

// export async function getVaccineNames() {
//     const { data, error } = await supabase
//         .from("Vaccines")
//         .select("VaccineName")
//         .order("VaccineName", { ascending: true });

//     if (error) return [];

//     const names = [...new Set(data.map(v => v.VaccineName))];
//     return names;
// }
