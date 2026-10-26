import { redirect } from "next/navigation";

import { AuthCard } from "@/components/agis/auth/auth-card";
import { ConfigNotice } from "@/components/agis/config-notice";
import { hasSupabaseEnv } from "@/lib/agis/env";
import { createClient } from "@/lib/agis/supabase/server";

export default async function LoginPage() {
  if (!hasSupabaseEnv) return <ConfigNotice />;

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims?.sub) {
    redirect("/");
  }

  return <AuthCard />;
}
