import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://keixqunsvrtxhtjbxqlr.supabase.co"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlaXhxdW5zdnJ0eGh0amJ4cWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MjExMjQsImV4cCI6MjA2NzM5NzEyNH0.EU-7sz48RYWPR-Nn9hiuYlZvWVDNrMg2xvI3ha4Z0xk"

// Server-side client (for Server Components & Server Actions)
export const supabase = createClient(supabaseUrl, supabaseKey)

// Browser client (for Client Components)
export function createSupabaseBrowserClient() {
  return createBrowserClient(supabaseUrl, supabaseKey)
}
