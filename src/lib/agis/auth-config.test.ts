import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Supabase Auth yapılandırması", () => {
  it("yerel kayıtlarda e-posta doğrulamasını zorunlu tutmaz", () => {
    const config = readFileSync(resolve("supabase/config.toml"), "utf8");
    expect(config).toMatch(/\[auth\.email\][\s\S]*enable_confirmations\s*=\s*false/i);
  });
});
