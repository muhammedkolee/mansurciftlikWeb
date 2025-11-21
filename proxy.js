import { NextResponse } from "next/server";

export function proxy(req) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host");

  // Eğer subdomain "yonetim" ise
  if (host?.startsWith("deneme.")) {
    // Eğer zaten /admin değilse
    if (!url.pathname.startsWith("/admin")) {
      url.pathname = "/admin" + url.pathname;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

// Middleware hangi yollar için geçerli olacak
export const config = {
  matcher: ["/((?!_next/static|favicon.ico).*)"],
};
