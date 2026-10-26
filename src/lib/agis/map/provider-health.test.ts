import { describe, expect, it } from "vitest";

import {
  extractHttpStatus,
  providerFallbackMessage,
  registerProviderError,
} from "./provider-health";

describe("harita sağlayıcı hata izleme", () => {
  it("yetkilendirme ve kota hatalarında hemen geri dönüş ister", () => {
    expect(registerProviderError([], 401, 100).shouldFallback).toBe(true);
    expect(registerProviderError([], 403, 100).shouldFallback).toBe(true);
    expect(registerProviderError([], 429, 100).shouldFallback).toBe(true);
  });

  it("tek geçici ağ hatasında sağlayıcıyı değiştirmez", () => {
    expect(registerProviderError([], null, 100).shouldFallback).toBe(false);
    expect(registerProviderError([100], 503, 200).shouldFallback).toBe(false);
  });

  it("zamana yayılan tekrarlı hataları kalıcı hata sayar", () => {
    const result = registerProviderError([100, 800, 1_500], 503, 2_400);
    expect(result.shouldFallback).toBe(true);
  });

  it("aynı anda oluşan tile hata kümesini tek başına kalıcı saymaz", () => {
    const result = registerProviderError([100, 150, 200], 503, 250);
    expect(result.shouldFallback).toBe(false);
  });

  it("eski hataları pencere dışında bırakır ve sağlayıcıya özel mesaj üretir", () => {
    expect(registerProviderError([1, 2, 3], null, 20_000).shouldFallback).toBe(false);
    expect(providerFallbackMessage("arcgis")).toContain("ArcGIS");
    expect(extractHttpStatus({ error: { statusCode: 429 } })).toBe(429);
    expect(extractHttpStatus({ message: "Request failed with status 403" })).toBe(403);
  });
});
