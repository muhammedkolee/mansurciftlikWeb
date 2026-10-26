
import { headers } from "next/headers";

export async function getAgisOrigin(): Promise<string> {
  const host = (
    (await headers()).get("host") ?? ""
  ).toLowerCase();

  if (/^agis\.localhost(?::\d+)?$/.test(host)) {
    return `http://${host}`;
  }

  if (host === "agis.mansurciftlik.com") {
    return `https://${host}`;
  }

  throw new Error(
    "AGIS yalnızca kendi subdomain'i üzerinden kullanılabilir.",
  );
}
