// 'use server'

// import { supabase } from '@/lib/supabase'

// export async function signIn(email, password) {
//     const { data, error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//     })
//     if (error) return { success: false, error: error.message }
//     return { success: true, user: data.user }
// }

// export async function signOut() {
//     await supabase.auth.signOut()
//     return { success: true }
// }

// export async function getSession() {
//     const { data: { session } } = await supabase.auth.getSession()
//     return session
// }

// export async function getUser() {
//     const { data: { user }, error } = await supabase.auth.getUser()
//     if (error || !user) return null
//     return user
// }
