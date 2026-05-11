import { NextResponse } from "next/server";

export function proxy(req) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host");

  // records subdomain
  if (hostname && hostname.startsWith("records.")) {
    return NextResponse.rewrite(new URL(`/records${url.pathname}`, req.url));
  }

  // management subdomain
  if (hostname && hostname.startsWith("management.")) {
    return NextResponse.rewrite(new URL(`/management${url.pathname}`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
