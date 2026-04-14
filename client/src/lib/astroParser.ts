// Local astrology data parsers — no API calls
// Supported formats:
//   Tropical : "Planet in Sign Deg°Min', [Retrograde,] in Nth House"
//              "Planet in Sign Deg°"  |  "Planet: Sign Deg°"
//              "Planet Deg°Min' Sign (House N)"  (AstroSeek / degree-first)
//              "Sign Planet"  (reversed)
//   Vedic    : "Planet in Sign [Deg°] [Nakshatra [Pada N]] [House N]"     ← free-text
//              AstroSage KP format — Planetary Positions table with DDD-MM-SS degrees
//              Sanskrit names: Surya, Chandra, Budha, Shukra, Mangal/Kuja,
//              Guru/Brihaspati, Shani, Rahu → North Node, Ketu → South Node
//   Bazi     : "Year/Month/Day/Hour Pillar: Stem Branch (Element Animal)"
//              Columnar table: Year | Month | Day | Hour header rows

export const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

export const PLANETS = [
  "Sun", "Moon", "Mercury", "Venus", "Mars",
  "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto",
  "Ascendant", "Midheaven", "North Node", "South Node",
  "Chiron", "Lilith",
];

export const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishtha",
  "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
];

export const HEAVENLY_STEMS = [
  "Jia", "Yi", "Bing", "Ding", "Wu", "Ji", "Geng", "Xin", "Ren", "Gui",
  "Jiǎ", "Yǐ", "Bǐng", "Dīng",
];

export const EARTHLY_BRANCHES = [
  "Zi", "Chou", "Yin", "Mao", "Chen", "Si",
  "Wu", "Wei", "Shen", "You", "Xu", "Hai",
];

export const CHINESE_ANIMALS = [
  "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake",
  "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig",
];

export const BAZI_ELEMENTS = ["Wood", "Fire", "Earth", "Metal", "Water"];

// ── Sign & planet normalization ──────────────────────────────────────────────

/** 3-letter and 2-letter zodiac abbreviations (lowercase keys) */
const SIGN_ABBR: Record<string, string> = {
  ari: "Aries",   tau: "Taurus",  gem: "Gemini",      can: "Cancer",
  leo: "Leo",     vir: "Virgo",   lib: "Libra",        sco: "Scorpio",
  sag: "Sagittarius", cap: "Capricorn", aqu: "Aquarius", pis: "Pisces",
  ar:  "Aries",   ta:  "Taurus",  ge:  "Gemini",       cn:  "Cancer",
  le:  "Leo",     vi:  "Virgo",   li:  "Libra",        sc:  "Scorpio",
  sg:  "Sagittarius", cp: "Capricorn", aq: "Aquarius", pi: "Pisces",
};

export function normalizeSign(s: string): string | undefined {
  const lower = s.trim().toLowerCase();
  return ZODIAC_SIGNS.find((z) => z.toLowerCase() === lower) ?? SIGN_ABBR[lower];
}

/** Astrological symbols that appear in exported chart text */
const SYMBOL_MAP: Record<string, string> = {
  "☉": "Sun",        "☽": "Moon",       "☾": "Moon",
  "☿": "Mercury",    "♀": "Venus",       "♂": "Mars",
  "♃": "Jupiter",    "♄": "Saturn",      "♅": "Uranus",
  "♆": "Neptune",    "♇": "Pluto",
  "☊": "North Node", "☋": "South Node",
};

/**
 * Expand astrological symbols and normalize common abbreviations so that
 * all downstream patterns only need to handle plain English names.
 */
function preprocessText(text: string): string {
  let out = text;
  for (const [sym, name] of Object.entries(SYMBOL_MAP)) {
    out = out.split(sym).join(` ${name} `);
  }
  return out
    .replace(/\bASC\b/g, "Ascendant")
    .replace(/\bAsc\b/g,  "Ascendant")
    .replace(/\bMC\b/g,   "Midheaven")
    .replace(/\bNN\b/g,   "North Node")
    .replace(/\bSN\b/g,   "South Node");
}

// ── Interfaces ────────────────────────────────────────────────────────────────

export interface PlanetPlacement {
  planet: string;
  sign: string;
  degree?: number;
  house?: number;
  retrograde?: boolean;
  nakshatra?: string;
  pada?: number;
  lord?: string;
}

export interface TropicalChart {
  placements: PlanetPlacement[];
  rawText: string;
}

export interface VedicChart {
  placements: PlanetPlacement[];
  lagna?: string;
  rawText: string;
}

export interface BaziPillar {
  label: string;
  stem: string;
  branch: string;
  animal?: string;
  element?: string;
  hiddenStems?: string[];
}

export interface BaziChart {
  yearPillar?: BaziPillar;
  monthPillar?: BaziPillar;
  dayPillar?: BaziPillar;
  hourPillar?: BaziPillar;
  dayMaster?: string;
  dominantElement?: string;
  rawText: string;
}

// ── Tropical Parser ──────────────────────────────────────────────────────────
//
// Handles all these line formats (case-insensitive):
//   "Sun in Leo 11°19', in 4th House"
//   "Mercury in Leo 23°25', Retrograde, in 5th House"
//   "Sun in Aries 15°32' (House 10) R"
//   "Sun: Aries 15°"
//   "Sun 15°32' Aries (House 10)"      ← degree-first (AstroSeek)
//   "☉ Sun: 15°32' Aries, 10th House"
//   "Aries Sun"

// Matches: "in 4th House" | "House 4" | "H.4" | "H4"
const HOUSE_PAT =
  /\bin\s+([0-9]{1,2})(?:st|nd|rd|th)?\s+[Hh]ouse|[Hh]ouse\s*#?\s*([0-9]{1,2})|(?:^|[\s,(])[Hh]\.?\s*([0-9]{1,2})(?:$|[\s,)])/i;

// Matches: "Retrograde" | "R" standalone | "Rx" | "℞"
const RETRO_PAT = /\bR\b|\bRx\b|\bretrograde\b|℞/i;

// Matches: "11°19'" or "11°" or "11º"
const DEG_PAT = /([0-9]{1,3})[°º∘]([0-9]{1,2})?/;

export function parseTropical(raw: string): TropicalChart {
  const text = preprocessText(raw);
  const placements: PlanetPlacement[] = [];

  // Sort signs longest-first so "Sagittarius" matches before "Sag"
  const signsAlt = [...ZODIAC_SIGNS].sort((a, b) => b.length - a.length).join("|");
  const signRe = new RegExp(`\\b(${signsAlt})\\b`, "i");

  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    for (const planet of PLANETS) {
      if (placements.find((p) => p.planet === planet)) continue;

      const escaped = planet.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      // Planet must appear as a whole word in this line
      if (!new RegExp(`\\b${escaped}\\b`, "i").test(trimmed)) continue;

      // Sign must appear somewhere on the same line
      const signMatch = trimmed.match(signRe);
      if (!signMatch) continue;
      const sign = normalizeSign(signMatch[1]);
      if (!sign) continue;

      // Degree — only parse when ° symbol is present to avoid grabbing house/orb numbers
      const degMatch = trimmed.match(DEG_PAT);
      let degree: number | undefined;
      if (degMatch) {
        const d = parseFloat(degMatch[1]);
        const m = degMatch[2] ? parseFloat(degMatch[2]) / 60 : 0;
        degree = parseFloat((d + m).toFixed(2));
      }

      // House — independent of order in the line
      const houseMatch = trimmed.match(HOUSE_PAT);
      const house = houseMatch
        ? parseInt(houseMatch[1] || houseMatch[2] || houseMatch[3])
        : undefined;

      // Retrograde — independent of order
      const retrograde = RETRO_PAT.test(trimmed) ? true : undefined;

      placements.push({ planet, sign, degree, house, retrograde });
    }
  }

  return { placements, rawText: raw };
}

// ── Vedic Parser ─────────────────────────────────────────────────────────────
//
// Two sub-parsers tried in order:
//   1. AstroSage KP System structured table (DDD-MM-SS degrees, RASH/NAK columns)
//   2. Free-text format (Sanskrit aliases, "Planet in Sign Nakshatra Pada House")
//
// AstroSage sample rows:
//   Sun      107-46-22   MON   MER   MER   RAH
//   Mercury[R] 119-51-34 MON   MER   SAT   JUP
//   Su(4)  Mo(11)  Ra(1)  …  (house diagram abbreviations)
//   Lagna  Aries   (top metadata)

// ── AstroSage helpers ────────────────────────────────────────────────────────

/** Parse AstroSage DDD-MM-SS degree string to decimal degrees */
function parseKPDegree(s: string): number | undefined {
  const m = s.match(/^([0-9]{1,3})-([0-9]{2})-([0-9]{2})$/);
  if (!m) return undefined;
  return parseInt(m[1]) + parseInt(m[2]) / 60 + parseInt(m[3]) / 3600;
}

/** Convert absolute ecliptic degree (0–360) to zodiac sign name */
function degreeToSign(deg: number): string {
  return ZODIAC_SIGNS[Math.floor(deg / 30) % 12];
}

/** Convert absolute ecliptic degree to nakshatra name + pada (1–4) */
function degreeToNakshatra(deg: number): { nakshatra: string; pada: number } {
  const NAK_SPAN  = 360 / 27;          // 13.333…°
  const PADA_SPAN = NAK_SPAN / 4;      // 3.333…°
  const idx       = Math.floor(deg / NAK_SPAN) % 27;
  const degInNak  = deg % NAK_SPAN;
  const pada      = Math.min(Math.floor(degInNak / PADA_SPAN) + 1, 4);
  return { nakshatra: NAKSHATRAS[idx], pada };
}

/**
 * Short planet abbreviations used in AstroSage chart diagrams: Su(4), Mo(11) …
 * Value is the canonical PLANETS name.
 */
const KP_ABBR_TO_PLANET: Record<string, string> = {
  Su: "Sun",        Mo: "Moon",       Ma: "Mars",
  Me: "Mercury",    Ju: "Jupiter",    Ve: "Venus",
  Sa: "Saturn",     Ra: "North Node", Ke: "South Node",
  Ur: "Uranus",     Ne: "Neptune",    Pl: "Pluto",
};

/**
 * Attempt to parse the AstroSage KP / Nakshatra Nadi structured text.
 * Returns a VedicChart if the format is detected, or null otherwise.
 */
function parseVedicAstroSage(raw: string): VedicChart | null {
  // Fingerprint: look for the structured Planetary Positions section
  if (!/Planetary Positions/i.test(raw)) return null;

  const placements: PlanetPlacement[] = [];
  let lagna: string | undefined;

  // ── 1. Extract Lagna from metadata header ──────────────────────────────────
  // "Lagna  Aries"  or  "Lagna\nAries"
  const lagnaM = raw.match(/\bLagna\b[\s\n]+([A-Za-z]+)/);
  if (lagnaM) lagna = normalizeSign(lagnaM[1]);

  // ── 2. Extract house numbers from chart diagram: Su(4), Mo(11), Ra(1) … ──
  const houseMap: Record<string, number> = {};
  const houseRe = /\b(Su|Mo|Ma|Me|Ju|Ve|Sa|Ra|Ke|Ur|Ne|Pl)\(([0-9]{1,2})\)/g;
  let hm: RegExpExecArray | null;
  while ((hm = houseRe.exec(raw)) !== null) {
    const planet = KP_ABBR_TO_PLANET[hm[1]];
    if (planet) houseMap[planet] = parseInt(hm[2]);
  }

  // ── 3. Parse Planetary Positions table rows ────────────────────────────────
  // Each row: "Planet[R]  DDD-MM-SS  RASH  NAK  SUB  SS"
  // Planet names from AstroSage: Sun Moon Mars Mercury Jupiter Venus Saturn
  //                               Rahu Ketu Uranus Neptune Pluto
  const rowRe = /^(Sun|Moon|Mars|Mercury(?:\[R\])?|Jupiter(?:\[R\])?|Venus|Saturn|Rahu|Ketu|Uranus(?:\[R\])?|Neptune(?:\[R\])?|Pluto)\s+([0-9]{3}-[0-9]{2}-[0-9]{2})/im;

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    const m = trimmed.match(rowRe);
    if (!m) continue;

    const rawName   = m[1];
    const retrograde = /\[R\]/.test(rawName) ? true : undefined;
    let   planet    = rawName.replace(/\[R\]/i, "").trim();

    // Normalize Rahu/Ketu
    if (planet === "Rahu") planet = "North Node";
    if (planet === "Ketu") planet = "South Node";

    // Skip duplicates
    if (placements.find((p) => p.planet === planet)) continue;

    const deg = parseKPDegree(m[2]);
    if (deg === undefined) continue;

    const sign               = degreeToSign(deg);
    const { nakshatra, pada } = degreeToNakshatra(deg);

    // Within-sign degree (0–29)
    const signDegree = parseFloat((deg % 30).toFixed(2));

    const house = houseMap[planet];

    placements.push({ planet, sign, degree: signDegree, nakshatra, pada, house, retrograde });
  }

  if (placements.length === 0) return null;
  return { placements, lagna, rawText: raw };
}

// ── Free-text Vedic aliases ───────────────────────────────────────────────────

/** Sanskrit → canonical planet names (applied before free-text parsing) */
const VEDIC_ALIASES: Array<[RegExp, string]> = [
  [/\bSurya\b/gi,      "Sun"],
  [/\bChandra\b/gi,    "Moon"],
  [/\bBudha\b/gi,      "Mercury"],
  [/\bShukra\b/gi,     "Venus"],
  [/\bMangal\b/gi,     "Mars"],
  [/\bKuja\b/gi,       "Mars"],
  [/\bGuru\b/gi,       "Jupiter"],
  [/\bBrihaspati\b/gi, "Jupiter"],
  [/\bShani\b/gi,      "Saturn"],
  [/\bRahu\b/gi,       "North Node"],
  [/\bKetu\b/gi,       "South Node"],
  // Lagna → Ascendant so it's captured as a planet placement too
  [/\bLagna\b/gi,      "Ascendant"],
];

export function parseVedic(raw: string): VedicChart {
  // ── Try AstroSage structured format first ──────────────────────────────────
  const astroSageResult = parseVedicAstroSage(raw);
  if (astroSageResult) return astroSageResult;

  // ── Fall back to free-text parser ─────────────────────────────────────────
  const placements: PlanetPlacement[] = [];
  let lagna: string | undefined;

  // Expand symbols then normalize Sanskrit / aliases
  let text = preprocessText(raw);
  for (const [pat, replacement] of VEDIC_ALIASES) {
    text = text.replace(pat, replacement);
  }

  const signsAlt = [...ZODIAC_SIGNS].sort((a, b) => b.length - a.length).join("|");
  const signRe   = new RegExp(`\\b(${signsAlt})\\b`, "i");

  // Nakshatra: longest-first so multi-word names match before partial overlaps
  const naksAlt = [...NAKSHATRAS].sort((a, b) => b.length - a.length).join("|");
  const naksRe  = new RegExp(`\\b(${naksAlt})\\b`, "i");

  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Detect Lagna / Ascendant line
    const lagnaM = trimmed.match(
      new RegExp(`\\b(?:Ascendant|Lagna)[:\\s]+(${signsAlt})`, "i")
    );
    if (lagnaM) {
      lagna = normalizeSign(lagnaM[1]);
    }

    for (const planet of PLANETS) {
      if (placements.find((p) => p.planet === planet)) continue;

      const escaped = planet.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (!new RegExp(`\\b${escaped}\\b`, "i").test(trimmed)) continue;

      const signMatch = trimmed.match(signRe);
      if (!signMatch) continue;
      const sign = normalizeSign(signMatch[1]);
      if (!sign) continue;

      // Degree — only when ° present
      const degMatch = trimmed.match(DEG_PAT);
      let degree: number | undefined;
      if (degMatch) {
        const d = parseFloat(degMatch[1]);
        const m = degMatch[2] ? parseFloat(degMatch[2]) / 60 : 0;
        degree = parseFloat((d + m).toFixed(2));
      }

      // Nakshatra
      const naksMatch = trimmed.match(naksRe);
      const nakshatra = naksMatch
        ? NAKSHATRAS.find((n) => n.toLowerCase() === naksMatch[1].toLowerCase())
        : undefined;

      // Pada
      const padaMatch = trimmed.match(/\b(?:Pada|P)\s*([1-4])\b/i);
      const pada = padaMatch ? parseInt(padaMatch[1]) : undefined;

      // House
      const houseMatch = trimmed.match(HOUSE_PAT);
      const house = houseMatch
        ? parseInt(houseMatch[1] || houseMatch[2] || houseMatch[3])
        : undefined;

      placements.push({ planet, sign, degree, nakshatra, pada, house });
    }
  }

  return { placements, lagna, rawText: raw };
}

// ── Bazi Parser ───────────────────────────────────────────────────────────────
//
// Handles three input styles:
//   A. Labelled lines : "Year Pillar: Geng Chen (Yang-Metal Dragon)"
//   B. Columnar table : header row "Hour | Day | Month | Year" then stem/branch rows
//                       including Chinese Metaphysics software format
//                       "時柱 Hour  日柱 Day  月柱 Month  年柱 Year"
//   C. Polarity names : "Yang-Metal" → Geng, "Yin-Water" → Gui
//                       Animal names: "Dragon" → branch Chen, etc.
//                       Chinese chars: 庚 → Geng, 辰 → Chen

// ── Bazi lookup tables ────────────────────────────────────────────────────────

/**
 * Polarity+element string → Heavenly Stem romanized name.
 * Covers the "Yang-Metal / Yin-Water" naming style used by Chinese Metaphysics apps.
 */
const POLARITY_STEM_MAP: Record<string, string> = {
  "yang-wood":  "Jia",  "yin-wood":  "Yi",
  "yang-fire":  "Bing", "yin-fire":  "Ding",
  "yang-earth": "Wu",   "yin-earth": "Ji",
  "yang-metal": "Geng", "yin-metal": "Xin",
  "yang-water": "Ren",  "yin-water": "Gui",
};

/** Chinese character → romanized Heavenly Stem */
const CHINESE_STEM_MAP: Record<string, string> = {
  "甲": "Jia", "乙": "Yi",  "丙": "Bing", "丁": "Ding", "戊": "Wu",
  "己": "Ji",  "庚": "Geng","辛": "Xin",  "壬": "Ren",  "癸": "Gui",
};

/** Chinese character → romanized Earthly Branch */
const CHINESE_BRANCH_MAP: Record<string, string> = {
  "子": "Zi",  "丑": "Chou","寅": "Yin", "卯": "Mao",  "辰": "Chen",
  "巳": "Si",  "午": "Wu",  "未": "Wei", "申": "Shen", "酉": "You",
  "戌": "Xu",  "亥": "Hai",
};

/** Animal name → Earthly Branch romanized name */
const ANIMAL_TO_BRANCH: Record<string, string> = {
  Rat: "Zi", Ox: "Chou", Tiger: "Yin",    Rabbit: "Mao",
  Dragon: "Chen", Snake: "Si", Horse: "Wu", Goat: "Wei", Sheep: "Wei",
  Monkey: "Shen", Rooster: "You", Dog: "Xu", Pig: "Hai",
};

// ── Bazi match helpers ────────────────────────────────────────────────────────

function matchStem(text: string): string | undefined {
  const lower = text.toLowerCase();

  // 1. Polarity+element: "Yang-Metal" → Geng  (most specific, check first)
  for (const [key, stem] of Object.entries(POLARITY_STEM_MAP)) {
    if (lower.includes(key)) return stem;
  }
  // 2. Chinese character: 庚 → Geng
  for (const [char, name] of Object.entries(CHINESE_STEM_MAP)) {
    if (text.includes(char)) return name;
  }
  // 3. Romanized name: Geng, Ren, Jia …
  for (const s of HEAVENLY_STEMS) {
    if (lower.includes(s.toLowerCase())) return s;
  }
  return undefined;
}

function matchBranch(text: string): string | undefined {
  // 1. Chinese character: 辰 → Chen
  for (const [char, name] of Object.entries(CHINESE_BRANCH_MAP)) {
    if (text.includes(char)) return name;
  }
  // 2. Romanized name — word-boundary aware.
  //    "Yin" must NOT match inside "Yin-Wood / Yin-Fire / Yin-Water …" (polarity prefix).
  for (const b of EARTHLY_BRANCHES) {
    const re = b === "Yin"
      ? /\bYin\b(?!-)/i           // skip "Yin-<element>" polarity strings
      : new RegExp(`\\b${b}\\b`, "i");
    if (re.test(text)) return b;
  }
  return undefined;
}

function matchAnimal(text: string): string | undefined {
  for (const a of CHINESE_ANIMALS) {
    if (text.toLowerCase().includes(a.toLowerCase())) return a;
  }
  return undefined;
}

function matchElement(text: string): string | undefined {
  for (const e of BAZI_ELEMENTS) {
    if (text.toLowerCase().includes(e.toLowerCase())) return e;
  }
  return undefined;
}

/** Derive branch from animal when branch token is absent */
function branchFromAnimal(animal: string | undefined): string | undefined {
  return animal ? ANIMAL_TO_BRANCH[animal] : undefined;
}

// ── Columnar Bazi parser (Chinese Metaphysics software format) ────────────────
//
// Detects a header line containing all four of: Year/Month/Day/Hour (or 年/月/日/時).
// Then reads stem+branch+animal+element from subsequent rows using column positions.
// Column order can be any permutation — determined dynamically from header.

type PillarAccum = { stem?: string; branch?: string; animal?: string; element?: string };

function parseBaziColumnar(raw: string): Partial<BaziChart> | null {
  const lines = raw.split(/\r?\n/);
  let headerIdx = -1;
  let colOrder: string[] = [];    // e.g. ["Hour","Day","Month","Year"]

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const hasYear  = /year|年柱|年\b/i.test(line);
    const hasMonth = /month|月柱|月\b/i.test(line);
    const hasDay   = /\bday\b|日柱|日\b/i.test(line);
    const hasHour  = /hour|時柱|時\b/i.test(line);

    if (hasYear && hasMonth && hasDay && hasHour) {
      headerIdx = i;
      // Determine left-to-right order by character position
      colOrder = [
        { name: "Year",  pos: line.search(/year|年柱|年/i)   },
        { name: "Month", pos: line.search(/month|月柱|月/i)  },
        { name: "Day",   pos: line.search(/\bday\b|日柱|日/i)},
        { name: "Hour",  pos: line.search(/hour|時柱|時/i)   },
      ]
        .filter((c) => c.pos >= 0)
        .sort((a, b) => a.pos - b.pos)
        .map((c) => c.name);
      break;
    }
  }

  if (headerIdx === -1 || colOrder.length < 4) return null;

  const accum: Record<string, PillarAccum> = {
    Year: {}, Month: {}, Day: {}, Hour: {},
  };
  let foundDayMaster = false;

  // Scan the next ~15 lines for pillar data
  for (let i = headerIdx + 1; i < Math.min(headerIdx + 16, lines.length); i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    // Day Master detection
    if (/日元|Day Master|\bDM\b/i.test(line)) foundDayMaster = true;

    // Split by tab or 2+ spaces to get column tokens
    const parts = line.split(/\t|\s{2,}/).map((p) => p.trim()).filter(Boolean);
    if (parts.length < 2) continue;

    parts.forEach((part, colIdx) => {
      const pillarName = colOrder[colIdx];
      if (!pillarName) return;
      const a = accum[pillarName];
      const stem    = matchStem(part);
      const branch  = matchBranch(part);
      const animal  = matchAnimal(part);
      const element = matchElement(part);
      if (stem    && !a.stem)    a.stem    = stem;
      if (branch  && !a.branch)  a.branch  = branch;
      if (animal  && !a.animal)  a.animal  = animal;
      if (element && !a.element) a.element = element;
    });
  }

  const makePillar = (label: string): BaziPillar | undefined => {
    const a = accum[label];
    const branch = a.branch ?? branchFromAnimal(a.animal);
    if (!a.stem && !branch) return undefined;
    return { label, stem: a.stem || "?", branch: branch || "?", animal: a.animal, element: a.element };
  };

  const dayA = accum["Day"];
  const dayMaster = foundDayMaster && dayA.stem
    ? `${dayA.element ? dayA.element + " " : ""}${dayA.stem}`.trim()
    : undefined;

  return {
    yearPillar:  makePillar("Year"),
    monthPillar: makePillar("Month"),
    dayPillar:   makePillar("Day"),
    hourPillar:  makePillar("Hour"),
    dayMaster,
  };
}

// ── Main Bazi parser ──────────────────────────────────────────────────────────

export function parseBazi(raw: string): BaziChart {
  // ── 1. Try columnar format first (Chinese Metaphysics software) ───────────
  const columnar = parseBaziColumnar(raw);
  if (columnar && (columnar.yearPillar || columnar.monthPillar ||
                   columnar.dayPillar  || columnar.hourPillar)) {
    // Compute dominant element then return
    const allPillars = [columnar.yearPillar, columnar.monthPillar,
                        columnar.dayPillar, columnar.hourPillar].filter(Boolean) as BaziPillar[];
    const elementCount: Record<string, number> = {};
    allPillars.forEach((p) => {
      if (p.element) elementCount[p.element] = (elementCount[p.element] || 0) + 1;
    });
    const dominantElement = Object.entries(elementCount)
      .sort(([, a], [, b]) => b - a)[0]?.[0];
    return { ...columnar, dominantElement, rawText: raw };
  }

  // ── 2. Fall back to line-by-line labelled format ───────────────────────────
  const text = raw;
  const lines = text.split(/\r?\n/);
  let yearPillar:  BaziPillar | undefined;
  let monthPillar: BaziPillar | undefined;
  let dayPillar:   BaziPillar | undefined;
  let hourPillar:  BaziPillar | undefined;
  let dayMaster:   string | undefined;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const isYear      = /year|birth year|\byear pillar\b|年柱/i.test(trimmed);
    const isMonth     = /month|\bmonth pillar\b|月柱/i.test(trimmed);
    const isDay       = /\bday\b(?! master)|\bday pillar\b|日柱/i.test(trimmed);
    const isHour      = /hour|\bhour pillar\b|時柱/i.test(trimmed);
    const isDayMaster = /day master|day stem|日元/i.test(trimmed);

    if (isDayMaster) {
      const stem    = matchStem(trimmed);
      const element = matchElement(trimmed);
      if (stem || element) {
        dayMaster = `${element ? element + " " : ""}${stem || ""}`.trim();
      }
    }

    const stem    = matchStem(trimmed);
    const animal  = matchAnimal(trimmed);
    const branch  = matchBranch(trimmed) ?? branchFromAnimal(animal);
    const element = matchElement(trimmed);

    const pillar: BaziPillar = {
      label:  "",
      stem:   stem   || "?",
      branch: branch || "?",
      animal,
      element,
    };

    // Note: isDay deliberately does NOT exclude isDayMaster — some apps write
    // "Day Pillar: Geng Xu (Day Master)" on one line; we want both.
    if      (isYear  && !yearPillar  && (stem || branch)) yearPillar  = { ...pillar, label: "Year" };
    else if (isMonth && !monthPillar && (stem || branch)) monthPillar = { ...pillar, label: "Month" };
    else if (isDay   && !dayPillar   && (stem || branch)) dayPillar   = { ...pillar, label: "Day" };
    else if (isHour  && !hourPillar  && (stem || branch)) hourPillar  = { ...pillar, label: "Hour" };
  }

  // ── 3. Last-resort: single header line "Year Month Day Hour" ─────────────
  if (!yearPillar && !monthPillar) {
    // Matches "Year ... Month ... Day ... Hour" in any direction
    const tableMatch = text.match(/(?:Year[^\n]*Month[^\n]*Day[^\n]*Hour|Hour[^\n]*Day[^\n]*Month[^\n]*Year)/i);
    if (tableMatch) {
      const headerIdx   = text.indexOf(tableMatch[0]);
      const afterHeader = text.slice(headerIdx + tableMatch[0].length);
      const stemLine    = afterHeader.split("\n").find((l) => matchStem(l));
      const branchLine  = afterHeader.split("\n").find((l) => matchBranch(l) || matchAnimal(l));
      if (stemLine) {
        const isReversed = /Hour.*Day.*Month.*Year/i.test(tableMatch[0]);
        const stems    = stemLine.split(/[\s|,\t]+/).filter((t) => matchStem(t));
        const bTokens  = branchLine ? branchLine.split(/[\s|,\t]+/).filter((t) => matchBranch(t) || matchAnimal(t)) : [];
        const labels   = isReversed ? ["Hour", "Day", "Month", "Year"] : ["Year", "Month", "Day", "Hour"];
        stems.forEach((s, i) => {
          const anm  = matchAnimal(bTokens[i] || "");
          const brch = matchBranch(bTokens[i] || "") ?? branchFromAnimal(anm);
          const p: BaziPillar = { label: labels[i] || `Pillar ${i + 1}`, stem: s, branch: brch || "?", animal: anm };
          if (labels[i] === "Year"  && !yearPillar)  yearPillar  = p;
          if (labels[i] === "Month" && !monthPillar) monthPillar = p;
          if (labels[i] === "Day"   && !dayPillar)   dayPillar   = p;
          if (labels[i] === "Hour"  && !hourPillar)  hourPillar  = p;
        });
      }
    }
  }

  // Dominant element across pillars
  const allElements = [yearPillar, monthPillar, dayPillar, hourPillar]
    .filter(Boolean)
    .map((p) => p!.element)
    .filter(Boolean) as string[];
  const elementCount: Record<string, number> = {};
  allElements.forEach((e) => { elementCount[e] = (elementCount[e] || 0) + 1; });
  const dominantElement = Object.entries(elementCount)
    .sort(([, a], [, b]) => b - a)[0]?.[0];

  return { yearPillar, monthPillar, dayPillar, hourPillar, dayMaster, dominantElement, rawText: text };
}

// ── Cross-system synthesis ────────────────────────────────────────────────────

export interface SynthesisRow {
  theme: string;
  tropical: string;
  vedic: string;
  bazi: string;
  keywords: string[];
}

const THEME_PLANETS: Array<{
  theme: string;
  tropicalPlanet: string;
  vedicPlanet: string;
  keywords: string[];
}> = [
  { theme: "Core Identity / Self",    tropicalPlanet: "Sun",       vedicPlanet: "Sun",       keywords: ["ego", "vitality", "purpose", "father"] },
  { theme: "Emotions / Inner Self",   tropicalPlanet: "Moon",      vedicPlanet: "Moon",      keywords: ["emotions", "mother", "mind", "instincts"] },
  { theme: "Communication / Mind",    tropicalPlanet: "Mercury",   vedicPlanet: "Mercury",   keywords: ["intellect", "speech", "siblings", "trade"] },
  { theme: "Love / Relationships",    tropicalPlanet: "Venus",     vedicPlanet: "Venus",     keywords: ["beauty", "romance", "arts", "luxury"] },
  { theme: "Drive / Action",          tropicalPlanet: "Mars",      vedicPlanet: "Mars",      keywords: ["energy", "courage", "conflict", "ambition"] },
  { theme: "Growth / Expansion",      tropicalPlanet: "Jupiter",   vedicPlanet: "Jupiter",   keywords: ["wisdom", "luck", "dharma", "teacher"] },
  { theme: "Structure / Discipline",  tropicalPlanet: "Saturn",    vedicPlanet: "Saturn",    keywords: ["karma", "discipline", "time", "lessons"] },
  { theme: "Rising / Persona",        tropicalPlanet: "Ascendant", vedicPlanet: "Ascendant", keywords: ["appearance", "first impression", "body"] },
];

function formatPlacement(p: PlanetPlacement | undefined): string {
  if (!p) return "—";
  let out = p.sign;
  if (p.degree != null) out += ` ${p.degree.toFixed(0)}°`;
  if (p.house   != null) out += ` · House ${p.house}`;
  if (p.retrograde)      out += " ℞";
  if (p.nakshatra)       out += ` · ${p.nakshatra}`;
  return out;
}

function formatBaziTheme(theme: string, chart: BaziChart): string {
  const { yearPillar, monthPillar, dayPillar, hourPillar, dayMaster } = chart;

  if (theme === "Core Identity / Self")
    return dayMaster || dayPillar?.stem || "—";
  if (theme === "Rising / Persona")
    return dayMaster ? `${dayMaster} (Day Master Element)` : dayPillar?.element || "—";
  if (theme === "Emotions / Inner Self")
    return hourPillar
      ? `${hourPillar.stem}/${hourPillar.branch}${hourPillar.animal ? ` (${hourPillar.animal})` : ""}`
      : "—";
  if (theme === "Communication / Mind")
    return monthPillar?.stem || "—";
  if (theme === "Love / Relationships")
    return dayPillar
      ? `${dayPillar.branch}${dayPillar.animal ? ` (${dayPillar.animal})` : ""}`
      : "—";
  if (theme === "Drive / Action")
    return monthPillar
      ? `${monthPillar.branch}${monthPillar.animal ? ` (${monthPillar.animal})` : ""}`
      : "—";
  if (theme === "Growth / Expansion")
    return yearPillar?.stem || "—";
  if (theme === "Structure / Discipline")
    return yearPillar
      ? `${yearPillar.branch}${yearPillar.animal ? ` (${yearPillar.animal})` : ""}`
      : "—";
  return "—";
}

export function synthesize(
  tropical: TropicalChart,
  vedic: VedicChart,
  bazi: BaziChart
): SynthesisRow[] {
  return THEME_PLANETS.map(({ theme, tropicalPlanet, vedicPlanet, keywords }) => {
    const tPlacement = tropical.placements.find(
      (p) => p.planet.toLowerCase() === tropicalPlanet.toLowerCase()
    );
    const vPlacement = vedic.placements.find(
      (p) => p.planet.toLowerCase() === vedicPlanet.toLowerCase()
    );
    return {
      theme,
      tropical: formatPlacement(tPlacement),
      vedic:    formatPlacement(vPlacement),
      bazi:     formatBaziTheme(theme, bazi),
      keywords,
    };
  });
}
