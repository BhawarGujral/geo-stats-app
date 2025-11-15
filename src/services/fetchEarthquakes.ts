import type { EarthquakeProperties } from "../types/earthquake";
import { parse } from "papaparse";

// Fetch earthquake data from a URL.
// Returns an array of EarthquakeFeature objects with typed properties.
/* eslint-disable @typescript-eslint/no-explicit-any */
export async function fetchEarthquakes(
  url: string
): Promise<EarthquakeProperties[]> {
  const res = await fetch(url);
  if (!res.ok)
    throw new Error(
      `Failed to fetch earthquakes: ${res.status} ${res.statusText}`
    );

  const contentType = res.headers.get("content-type") || "";
  if (
    contentType.includes("application/json") ||
    contentType.includes("geo+json") ||
    url.endsWith(".json")
  ) {
    const json = await res.json();
    return parseGeoJson(json);
  }

  // Fallback to text (CSV)
  const text = await res.text();
  return parseCsv(text);
}

function parseGeoJson(json: any): EarthquakeProperties[] {
  if (!json) return [];
  // If the JSON is already a FeatureCollection
  if (json.type === "FeatureCollection" && Array.isArray(json.features)) {
    return json.features.map((f: any) => mapProperties(f.properties || {}));
  }

  // If it's an array of items
  if (Array.isArray(json)) {
    return json.map((item) => mapProperties(item));
  }

  // Single object
  return [mapProperties(json)];
}

function parseCsv(csv: string): EarthquakeProperties[] {
  const result = parse<Record<string, unknown>>(csv, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h: string) => String(h).trim(),
    dynamicTyping: true,
  });

  // If there were parse errors, keep going but log them — caller can handle
  if (result.errors && result.errors.length > 0) {
    // Use console.warn to avoid breaking behavior on minor parse issues
    console.warn("PapaParse CSV parse errors:", result.errors);
  }

  const rows = (result.data as unknown[]) || [];
  return rows.map((row) => mapProperties(row));
}

// Very small CSV splitter that handles quoted fields and commas
// CSV splitting/parsing is handled by Papa Parse (see parseCsv)

function parseNumber(value: any): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function mapProperties(raw: any): EarthquakeProperties {
  // raw may be strings (from CSV) or already typed values (from JSON)
  const p: EarthquakeProperties = {
    time: raw.time ?? raw.properties?.time ?? String(raw.time ?? ""),
    latitude:
      parseNumber(
        raw.latitude ??
          raw.properties?.latitude ??
          raw.geometry?.coordinates?.[1]
      ) ?? 0,
    longitude:
      parseNumber(
        raw.longitude ??
          raw.properties?.longitude ??
          raw.geometry?.coordinates?.[0]
      ) ?? 0,
    depth:
      parseNumber(
        raw.depth ?? raw.properties?.depth ?? raw.geometry?.coordinates?.[2]
      ) ?? 0,
    mag: parseNumber(raw.mag ?? raw.properties?.mag) ?? 0,
    magType: raw.magType ?? raw.properties?.magType ?? null,
    nst: parseNumber(raw.nst ?? raw.properties?.nst),
    gap: parseNumber(raw.gap ?? raw.properties?.gap),
    dmin: parseNumber(raw.dmin ?? raw.properties?.dmin),
    rms: parseNumber(raw.rms ?? raw.properties?.rms),
    net: raw.net ?? raw.properties?.net ?? null,
    id: String(raw.id ?? raw.properties?.id ?? raw.properties?.eventId ?? ""),
    updated: String(raw.updated ?? raw.properties?.updated ?? ""),
    place: raw.place ?? raw.properties?.place ?? null,
    type: raw.type ?? raw.properties?.type ?? null,
    horizontalError: parseNumber(
      raw.horizontalError ?? raw.properties?.horizontalError
    ),
    depthError: parseNumber(raw.depthError ?? raw.properties?.depthError),
    magError: parseNumber(raw.magError ?? raw.properties?.magError),
    magNst: parseNumber(raw.magNst ?? raw.properties?.magNst),
    status: raw.status ?? raw.properties?.status ?? null,
    locationSource:
      raw.locationSource ?? raw.properties?.locationSource ?? null,
    magSource: raw.magSource ?? raw.properties?.magSource ?? null,
  };
  return p;
}

export default fetchEarthquakes;
