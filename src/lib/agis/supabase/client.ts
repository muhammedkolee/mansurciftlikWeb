import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/lib/agis/database.types";
import { getSupabaseEnv } from "@/lib/agis/env";

export function createClient() {
  const { supabaseUrl, supabasePublishableKey } = getSupabaseEnv();
  return createBrowserClient<Database>(supabaseUrl, supabasePublishableKey);
}
