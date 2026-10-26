import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const initialMigration = readFileSync(
  resolve("supabase/migrations/20261024170556_initial_field_tracking.sql"),
  "utf8",
);
const historyMigration = readFileSync(
  resolve("supabase/migrations/20261026113416_add_planting_history_rpc.sql"),
  "utf8",
);
const rpcCompatibilityMigration = readFileSync(
  resolve("supabase/migrations/20261026113459_fix_planting_rpc_signature.sql"),
  "utf8",
);

describe("ekim geçmişi migration bütünlüğü", () => {
  it("aynı tarla için tek güncel ekimi unique index ile korur", () => {
    expect(initialMigration).toMatch(/unique index plantings_one_current_per_field_idx[\s\S]*where is_current/i);
  });

  it("tarla sahipliğini doğrular ve satırı eşzamanlı işlemlere karşı kilitler", () => {
    expect(historyMigration).toContain("owner_id = (select auth.uid())");
    expect(historyMigration).toContain("for update");
    expect(historyMigration).toContain("security invoker");
  });

  it("tarla ve ekim geçmişi okumalarını kullanıcı sahipliğiyle sınırlar", () => {
    expect(initialMigration).toMatch(/fields_select_own[\s\S]*auth\.uid\(\)[\s\S]*owner_id/i);
    expect(initialMigration).toMatch(/plantings_select_via_field_owner[\s\S]*fields\.owner_id = \(select auth\.uid\(\)\)/i);
  });

  it("eski güncel kaydı geçmişe taşıdıktan sonra ayrı bir güncel satır ekler", () => {
    const demoteIndex = historyMigration.indexOf("set is_current = false");
    const insertIndex = historyMigration.indexOf("insert into public.plantings");
    expect(demoteIndex).toBeGreaterThan(-1);
    expect(insertIndex).toBeGreaterThan(demoteIndex);
    expect(historyMigration).toContain("true\n  )");
  });

  it("anon erişimini kapatıp yalnızca authenticated role RPC izni verir", () => {
    expect(historyMigration).toContain("from public, anon");
    expect(historyMigration).toContain("to authenticated");
  });

  it("geçmiş satırların doğrudan güncellenmesini ve silinmesini engeller", () => {
    expect(historyMigration).toMatch(/for update[\s\S]*using \([\s\S]*is_current/i);
    expect(historyMigration).toContain("revoke delete on table public.plantings from authenticated");
  });

  it("RPC uyumluluk migration'ı beş parametreyi ve şema yenilemeyi içerir", () => {
    expect(rpcCompatibilityMigration).toMatch(/create or replace function public\.create_planting_record\([\s\S]*p_field_id uuid,[\s\S]*p_season text[\s\S]*\)/i);
    expect(rpcCompatibilityMigration).toContain("notify pgrst, 'reload schema'");
  });
});
