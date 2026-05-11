import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://naskuftaxoacdtltzuyg.supabase.co"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_Pma_wtBnIHG_u-kd1frWug_MEVE66YX"

const supabaseUrlForManagement = process.env.NEXT_PUBLIC_SUPABASE_URL_MANAGEMENT || "https://keixqunsvrtxhtjbxqlr.supabase.co"
const supabaseKeyForManagement = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_MANAGEMENT || "sb_publishable_f6iIwBv39b5emzh0d9elWw_5eXZ_LHP"

// Server-side client (for Server Components & Server Actions)
export const supabase = createClient(supabaseUrl, supabaseKey)

export const supabaseManagement = createClient(supabaseUrlForManagement, supabaseKeyForManagement)

// Browser client (for Client Components)
export function createSupabaseBrowserClient() {
  return createBrowserClient(supabaseUrl, supabaseKey)
}

export function createSupabaseBrowserClientForManagement() {
  return createBrowserClient(supabaseUrlForManagement, supabaseKeyForManagement)
}