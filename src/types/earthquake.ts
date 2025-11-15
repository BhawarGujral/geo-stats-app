// Types for earthquake fetch/CSV response
export interface EarthquakeProperties {
  time: string;
  latitude: number;
  longitude: number;
  depth: number;
  mag: number;
  magType: string | null;
  nst: number | null;
  gap: number | null;
  dmin: number | null;
  rms: number | null;
  net: string | null;
  id: string;
  updated: string;
  place: string | null;
  type: string | null;
  horizontalError: number | null;
  depthError: number | null;
  magError: number | null;
  magNst: number | null;
  status: string | null;
  locationSource: string | null;
  magSource: string | null;
}
