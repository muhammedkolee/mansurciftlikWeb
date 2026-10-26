"use client";

import { useEffect, useRef, useState } from "react";
import { LoaderCircle, MapPin, Search, X } from "lucide-react";

import { useLanguage } from "@/components/agis/i18n/language-provider";
import { pick, type Locale } from "@/lib/agis/i18n";
import type { PlaceSearchResult } from "@/lib/agis/map/config";
import { buildGeocodingUrl, parseSearchResult } from "@/lib/agis/map/geocoding";

type Props = {
  geocodingUrl: string;
  getProximity: () => [number, number] | null;
  onSelect: (result: PlaceSearchResult) => void;
};

function resultTypeLabel(type: string | null, locale: Locale) {
  const labels: Record<string, string> = {
    region: pick(locale, "Şehir / bölge", "City / region"),
    subregion: pick(locale, "Bölge", "Region"),
    county: pick(locale, "İlçe", "County"),
    municipality: pick(locale, "Belediye", "Municipality"),
    municipal_district: pick(locale, "İlçe", "District"),
    locality: pick(locale, "Kasaba / köy", "Town / village"),
    neighbourhood: pick(locale, "Mahalle", "Neighbourhood"),
    place: pick(locale, "Yerleşim", "Place"),
  };
  return type ? labels[type] ?? pick(locale, "Konum", "Location") : pick(locale, "Konum", "Location");
}

export function MapSearch({ geocodingUrl, getProximity, onSelect }: Props) {
  const { locale } = useLanguage();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [active, setActive] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlaceSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!active) return;
    function handleOutsidePointer(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setActive(false);
        setLoading(false);
      }
    }
    document.addEventListener("pointerdown", handleOutsidePointer);
    return () => document.removeEventListener("pointerdown", handleOutsidePointer);
  }, [active]);

  useEffect(() => {
    const value = query.trim();
    if (!active || value.length < 2) return;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const url = buildGeocodingUrl(
          geocodingUrl,
          value,
          getProximity(),
          window.location.origin,
        );

        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(`Search service returned ${response.status}.`);
        const payload = (await response.json()) as { features?: unknown };
        const parsed = Array.isArray(payload.features)
          ? payload.features
              .map((feature, index) => parseSearchResult(feature, index))
              .filter((result): result is PlaceSearchResult => result !== null)
          : [];
        setResults(parsed);
        if (parsed.length === 0) setError(pick(locale, "Bu adla eşleşen bir yer bulunamadı.", "No place matched this name."));
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        setResults([]);
        setError(pick(locale, "Konum aranamadı. Lütfen biraz sonra tekrar deneyin.", "Could not search for a location. Please try again shortly."));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 350);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [active, geocodingUrl, getProximity, locale, query]);

  function clearSearch() {
    setQuery("");
    setResults([]);
    setError(null);
    setLoading(false);
    inputRef.current?.focus();
  }

  return (
    <div ref={rootRef} className={`map-search ${active ? "is-active" : ""}`}>
      <div className="map-search-panel">
        <div className="map-search-input">
          <Search size={19} />
          <input
            ref={inputRef}
            type="search"
            inputMode="search"
            autoComplete="off"
            value={query}
            onFocus={() => setActive(true)}
            onChange={(event) => {
              setQuery(event.target.value);
              setResults([]);
              setError(null);
              setLoading(false);
              setActive(true);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setActive(false);
                setLoading(false);
                inputRef.current?.blur();
              }
            }}
            placeholder={pick(locale, "Konum Ara", "Search location")}
            aria-label={pick(locale, "Konum ara", "Search location")}
            role="combobox"
            aria-autocomplete="list"
            aria-controls="map-search-results"
            aria-expanded={active && results.length > 0}
          />
          {loading ? (
            <LoaderCircle className="spin" size={18} aria-label={pick(locale, "Aranıyor", "Searching")} />
          ) : query ? (
            <button type="button" onClick={clearSearch} aria-label={pick(locale, "Aramayı temizle", "Clear search")}><X size={18} /></button>
          ) : null}
        </div>

        {active && (results.length > 0 || error || query.trim().length === 1) && (
          <div id="map-search-results" className="map-search-results" role="listbox">
            {query.trim().length === 1 && <p>{pick(locale, "Aramak için en az iki harf yazın.", "Enter at least two letters to search.")}</p>}
            {error && <p>{error}</p>}
            {results.map((result) => (
              <button
                type="button"
                key={result.id}
                role="option"
                aria-selected="false"
                onClick={() => {
                  onSelect(result);
                  setQuery(result.name);
                  setResults([]);
                  setActive(false);
                  setLoading(false);
                  inputRef.current?.blur();
                }}
              >
                <span><MapPin size={17} /></span>
                <span><strong>{result.name}</strong><small>{resultTypeLabel(result.type, locale)}</small></span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
