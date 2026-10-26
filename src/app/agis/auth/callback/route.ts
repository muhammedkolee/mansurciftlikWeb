
import { NextResponse, type NextRequest } from "next/server";

import { getAgisOrigin } from "@/lib/agis/routes";
import { createClient } from "@/lib/agis/supabase/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const origin = await getAgisOrigin();

  const code = url.searchParams.get("code");

  // Yalnızca izin verilen AGIS sayfalarına dönüş.
  const next =
    url.searchParams.get("next") === "/sifre-yenile"
      ? "/sifre-yenile"
      : "/";

  if (code) {
    const supabase = await createClient();

    const { error } =
      await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(
        new URL(next, origin),
      );
    }
  }

  const loginUrl = new URL("/giris", origin);
  loginUrl.searchParams.set(
    "error",
    "dogrulama-basarisiz",
  );

  return NextResponse.redirect(loginUrl);
}
