
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import type { Database } from "@/lib/agis/database.types";
import {
  getSupabaseEnv,
  hasSupabaseEnv,
} from "@/lib/agis/env";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!hasSupabaseEnv) {
    return response;
  }

  const { supabaseUrl, supabasePublishableKey } =
    getSupabaseEnv();

  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabasePublishableKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet, headers) {
          // Yeni çerezler Server Components tarafından görülebilmeli.
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({ request });

          // Güncellenen çerezler tarayıcıya da gönderilmeli.
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });

          // Supabase'in cache güvenlik başlıklarını koru.
          if (headers) {
            Object.entries(headers).forEach(([name, value]) => {
              if (value) {
                response.headers.set(name, value);
              }
            });
          }
        },
      },
    },
  );

  await supabase.auth.getClaims();

  return response;
}
