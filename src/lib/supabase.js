import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://naskuftaxoacdtltzuyg.supabase.co"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_Pma_wtBnIHG_u-kd1frWug_MEVE66YX"

// Server-side client (for Server Components & Server Actions)
export const supabase = createClient(supabaseUrl, supabaseKey)

// Browser client (for Client Components)
export function createSupabaseBrowserClient() {
  return createBrowserClient(supabaseUrl, supabaseKey)
}
