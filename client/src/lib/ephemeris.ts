/**
 * Local natal chart calculation via @swisseph/browser (WebAssembly).
 * No API calls — runs entirely in the browser.
 *
 * Uses dynamic import so the WASM module only loads on demand
 * (when the user clicks "Calculate Natal Chart"), keeping app startup fast.
 */

import { ZODIAC_SIGNS, NAKSHATRAS } from "./astroParser";
import type { TropicalChart, VedicChart, PlanetPlacement } from "./astroParser";

// ── Planet / body numeric IDs (Swiss Ephemeris spec) ─────────────────────────
const SE_SUN        = 0;
const SE_MOON       = 1;
const SE_MERCURY    = 2;
const SE_VENUS      = 3;
const SE_MARS       = 4;
const SE_JUPITER    = 5;
const SE_SATURN     = 6;
const SE_URANUS     = 7;
const SE_NEPTUNE    = 8;
const SE_PLUTO      = 9;
const SE_MEAN_NODE  = 10;
const SE_CHIRON     = 15;

const BODIES: Array<{ name: string; id: number }> = [
  { name: "Sun",        id: SE_SUN },
  { name: "Moon",       id: SE_MOON },
  { name: "Mercury",    id: SE_MERCURY },
  { name: "Venus",      id: SE_VENUS },
  { name: "Mars",       id: SE_MARS },
  { name: "Jupiter",    id: SE_JUPITER },
  { name: "Saturn",     id: SE_SATURN },
  { name: "Uranus",     id: SE_URANUS },
  { name: "Neptune",    id: SE_NEPTUNE },
  { name: "Pluto",      id: SE_PLUTO },
  { name: "North Node", id: SE_MEAN_NODE },
  { name: "Chiron",     id: SE_CHIRON },
];

// ── Singleton WASM instance ───────────────────────────────────────────────────

let _swe: unknown = null;
let _initPromise: Promise<unknown> | null = null;

async function getSwe(): Promise<unknown> {
  if (_swe) return _swe;
  if (_initPromise) return _initPromise;
  _initPromise = (async () => {
    // Dynamic import keeps @swisseph/browser out of the initial bundle parse —
    // the CJS/ESM interop issue in Vite dev server is bypassed this way.
    const mod = await import("@swisseph/browser");
    const SwissEphemeris = mod.default ?? (mod as Record<string, unknown>).SwissEphemeris;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const instance = new (SwissEphemeris as any)();
    await instance.init();
    _swe = instance;
    return instance;
  })();
  return _initPromise;
}

// ── Ayanamsa (Lahiri / Chitrapaksha) ─────────────────────────────────────────

export function lahiriAyanamsa(jd: number): number {
  const yearsFrom1900 = (jd - 2415020.5) / 365.2422;
  return 22.4605 + yearsFrom1900 * 0.013966;
}

// ── Coordinate helpers ────────────────────────────────────────────────────────

function norm(lon: number): number {
  return ((lon % 360) + 360) % 360;
}

function lonToSign(lon: number): { sign: string; degree: number } {
  const n = norm(lon);
  return { sign: ZODIAC_SIGNS[Math.floor(n / 30)], degree: n % 30 };
}

function lonToNakshatra(siderealLon: number): { nakshatra: string; pada: number } {
  const n = norm(siderealLon);
  const span = 360 / 27;
  const idx = Math.floor(n / span);
  const pada = Math.min(Math.floor((n % span) / (span / 4)) + 1, 4);
  return { nakshatra: NAKSHATRAS[idx] ?? NAKSHATRAS[0], pada };
}

// D9 start sign index per rashi element group
const D9_START: Record<string, number> = {
  Aries: 0, Leo: 0, Sagittarius: 0,
  Taurus: 9, Virgo: 9, Capricorn: 9,
  Gemini: 6, Libra: 6, Aquarius: 6,
  Cancer: 3, Scorpio: 3, Pisces: 3,
};

function lonToNavamsha(lon: number): string {
  const n = norm(lon);
  const signIndex = Math.floor(n / 30);
  const degInSign = n % 30;
  const offset = Math.floor(degInSign / (30 / 9)); // 0–8
  return ZODIAC_SIGNS[((D9_START[ZODIAC_SIGNS[signIndex]] ?? 0) + offset) % 12];
}

function getHouseNumber(lon: number, cusps: number[]): number {
  const n = norm(lon);
  for (let i = 0; i < 12; i++) {
    const start = norm(cusps[i]);
    const end = norm(cusps[(i + 1) % 12]);
    if (start < end ? n >= start && n < end : n >= start || n < end) return i + 1;
  }
  return 1;
}

// ── Public API ────────────────────────────────────────────────────────────────

export interface BirthData {
  date: string;       // YYYY-MM-DD
  time: string;       // HH:MM 24h local
  lat: number;        // decimal, + = North
  lon: number;        // decimal, + = East
  utcOffset: number;  // hours, e.g. +5.5 for IST
}

export async function calcNatalCharts(
  birth: BirthData
): Promise<{ tropical: TropicalChart; vedic: VedicChart } | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const swe = await getSwe() as any;

    const [year, month, day] = birth.date.split("-").map(Number);
    const [hh, mm] = (birth.time || "12:00").split(":").map(Number);
    const hourUT = hh + (mm || 0) / 60 - birth.utcOffset;
    const jd = swe.julianDay(year, month, day, hourUT);
    const ayanamsa = lahiriAyanamsa(jd);

    const houses = swe.calculateHouses(jd, birth.lat, birth.lon, "P");
    const ascLon = houses.ascendant;
    const mcLon = houses.mc;

    const tropicalPlacements: PlanetPlacement[] = [];
    const vedicPlacements: PlanetPlacement[] = [];

    for (const body of BODIES) {
      let pos;
      try {
        pos = swe.calculatePosition(jd, body.id);
      } catch {
        continue;
      }

      const tropLon = norm(pos.longitude);
      const isRetro = pos.longitudeSpeed < 0;
      const house = getHouseNumber(tropLon, houses.cusps);

      const { sign: tropSign, degree: tropDeg } = lonToSign(tropLon);
      tropicalPlacements.push({
        planet: body.name, sign: tropSign,
        degree: Math.round(tropDeg * 100) / 100, house, retrograde: isRetro,
        navamshaSign: lonToNavamsha(tropLon),
      });

      const sidLon = norm(tropLon - ayanamsa);
      const { sign: sidSign, degree: sidDeg } = lonToSign(sidLon);
      const { nakshatra, pada } = lonToNakshatra(sidLon);
      vedicPlacements.push({
        planet: body.name, sign: sidSign,
        degree: Math.round(sidDeg * 100) / 100, house, retrograde: isRetro,
        nakshatra, pada,
        navamshaSign: lonToNavamsha(sidLon),
      });
    }

    // Ascendant
    const { sign: ascSign, degree: ascDeg } = lonToSign(ascLon);
    const ascSid = norm(ascLon - ayanamsa);
    const { sign: ascSidSign, degree: ascSidDeg } = lonToSign(ascSid);
    const { nakshatra: ascNak, pada: ascPada } = lonToNakshatra(ascSid);
    tropicalPlacements.unshift({ planet: "Ascendant", sign: ascSign, degree: Math.round(ascDeg * 100) / 100, house: 1, navamshaSign: lonToNavamsha(ascLon) });
    vedicPlacements.unshift({ planet: "Ascendant", sign: ascSidSign, degree: Math.round(ascSidDeg * 100) / 100, house: 1, nakshatra: ascNak, pada: ascPada, navamshaSign: lonToNavamsha(ascSid) });

    // Midheaven
    const { sign: mcSign, degree: mcDeg } = lonToSign(mcLon);
    tropicalPlacements.push({ planet: "Midheaven", sign: mcSign, degree: Math.round(mcDeg * 100) / 100, house: 10, navamshaSign: lonToNavamsha(mcLon) });

    // IC (4th house cusp) and DSC (7th house cusp) — cusps are 0-indexed
    const icLon = norm(houses.cusps[3]);
    const { sign: icSign, degree: icDeg } = lonToSign(icLon);
    tropicalPlacements.push({ planet: "IC", sign: icSign, degree: Math.round(icDeg * 100) / 100, house: 4, navamshaSign: lonToNavamsha(icLon) });

    const dscLon = norm(houses.cusps[6]);
    const { sign: dscSign, degree: dscDeg } = lonToSign(dscLon);
    tropicalPlacements.push({ planet: "DSC", sign: dscSign, degree: Math.round(dscDeg * 100) / 100, house: 7, navamshaSign: lonToNavamsha(dscLon) });

    return {
      tropical: { placements: tropicalPlacements, rawText: "" },
      vedic: { placements: vedicPlacements, lagna: ascSidSign, rawText: "" },
    };
  } catch (err) {
    console.error("[ephemeris] calcNatalCharts failed:", err);
    return null;
  }
}
