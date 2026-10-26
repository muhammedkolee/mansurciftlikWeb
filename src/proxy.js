
import { NextResponse } from "next/server";

import { updateSession as updateAgisSession } from
  "@/lib/agis/supabase/proxy";

export async function proxy(req) {
  const pathname = req.nextUrl.pathname;

  const hostname = (
    req.headers.get("host") ?? ""
  ).split(":")[0].toLowerCase();

  const isAgisHost =
    hostname === "agis.mansurciftlik.com" ||
    hostname === "agis.localhost";

  const isAgisInternalPath =
    pathname === "/agis" ||
    pathname.startsWith("/agis/");

  // AGIS'in dahili yoluna doğrudan erişimi engelle.
  // Bu kural bütün domainlerde geçerlidir.
  if (isAgisInternalPath) {
    return new NextResponse("Not Found", {
      status: 404,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }

  // AGIS yalnızca kendi subdomain'i üzerinden çalışır.
  if (isAgisHost) {
    const sessionResponse = await updateAgisSession(req);

    const destination = req.nextUrl.clone();

    destination.pathname =
      `/agis${pathname === "/" ? "" : pathname}`;

    const response = NextResponse.rewrite(destination, {
      request: {
        headers: req.headers,
      },
    });

    // Supabase oturum çerezlerini koru.
    for (const cookie of sessionResponse.cookies.getAll()) {
      response.cookies.set(cookie);
    }

    // Oturumla ilgili cache başlıklarını koru.
    for (const name of [
      "cache-control",
      "expires",
      "pragma",
    ]) {
      const value = sessionResponse.headers.get(name);

      if (value !== null) {
        response.headers.set(name, value);
      }
    }

    return response;
  }

  // Mevcut records subdomain
  if (hostname.startsWith("records.")) {
    return NextResponse.rewrite(
      new URL(`/records${pathname}`, req.url)
    );
  }

  // Mevcut management subdomain
  if (hostname.startsWith("management.")) {
    return NextResponse.rewrite(
      new URL(`/management${pathname}`, req.url)
    );
  }

  // Ana site
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|maplibre-gl-worker\\.mjs|mansurciftlik_profil\\.jpg).*)",
  ],
};
