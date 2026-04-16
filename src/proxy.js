import { NextResponse } from "next/server";

export function proxy(req) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host");

  // Subdomain kontrolü
  if (hostname && hostname.startsWith("records.")) {
    // URL'in başına bizim yeni klasör ismini ekliyoruz
    return NextResponse.rewrite(new URL(`/records${url.pathname}`, req.url));
  }

  // Eğer subdomain değilse, Next.js otomatik olarak (main) grubundaki page.js'i bulacaktır.
  // Ekstra bir rewrite'a gerek kalmaz, çakışma bittiği için sistem rahatlar.
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};