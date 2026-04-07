import { NextResponse } from "next/server";

export function proxy(req) {
  // No subdomain routing needed - simple passthrough
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
