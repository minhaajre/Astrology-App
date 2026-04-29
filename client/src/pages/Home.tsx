import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Sun,
  Moon,
  Globe,
  CalendarDays,
  Hash,
  Info,
  Layers,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "@/lib/theme";

// ── BaZi computation ──────────────────────────────────────────────────────────

const STEMS = ["Jia", "Yi", "Bing", "Ding", "Wu", "Ji", "Geng", "Xin", "Ren", "Gui"];
const BRANCHES = ["Zi", "Chou", "Yin", "Mao", "Chen", "Si", "Wu", "Wei", "Shen", "You", "Xu", "Hai"];
const STEM_ELEMENTS = ["Wood", "Wood", "Fire", "Fire", "Earth", "Earth", "Metal", "Metal", "Water", "Water"];
const STEM_POLARITY = ["Yang", "Yin", "Yang", "Yin", "Yang", "Yin", "Yang", "Yin", "Yang", "Yin"];
const ANIMALS = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];

function julianDay(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

const REF_JD = julianDay(1900, 1, 1);

interface BaziPillar {
  label: string;
  stem: string;
  branch: string;
  animal: string;
  element: string;
  polarity: string;
}

interface ComputedBazi {
  year: BaziPillar;
  month: BaziPillar;
  day: BaziPillar;
  hour: BaziPillar | null;
  dayMaster: string;
  chineseZodiac: string;
}

function computeBazi(dateStr: string, hourNum?: number): ComputedBazi | null {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return null;

  const yearStemIdx = (((y - 4) % 10) + 10) % 10;
  const yearBranchIdx = (((y - 4) % 12) + 12) % 12;

  const jd = julianDay(y, m, d);
  const daysFromRef = jd - REF_JD;
  const dayStemIdx = ((daysFromRef % 10) + 10) % 10;
  const dayBranchIdx = (((daysFromRef + 10) % 12) + 12) % 12;

  let solarMonth = m;
  let stemYear = y;
  if (d < 7) {
    solarMonth = m - 1;
    if (solarMonth < 1) { solarMonth = 12; stemYear = y - 1; }
  }
  const monthBranchIdx = solarMonth % 12;
  const adjYearStemIdx = (((stemYear - 4) % 10) + 10) % 10;
  const yearStemGroup = Math.floor(adjYearStemIdx / 2);
  const monthStemIdx = (yearStemGroup * 2 + monthBranchIdx) % 10;

  let hourPillar: BaziPillar | null = null;
  if (hourNum !== undefined) {
    const hourBranchIdx = Math.floor(((hourNum + 1) % 24) / 2);
    const hourStemIdx = (dayStemIdx % 5) * 2 + (hourBranchIdx % 2);
    hourPillar = {
      label: "Hour",
      stem: STEMS[hourStemIdx % 10],
      branch: BRANCHES[hourBranchIdx],
      animal: ANIMALS[hourBranchIdx],
      element: STEM_ELEMENTS[hourStemIdx % 10],
      polarity: STEM_POLARITY[hourStemIdx % 10],
    };
  }

  return {
    year: {
      label: "Year",
      stem: STEMS[yearStemIdx],
      branch: BRANCHES[yearBranchIdx],
      animal: ANIMALS[yearBranchIdx],
      element: STEM_ELEMENTS[yearStemIdx],
      polarity: STEM_POLARITY[yearStemIdx],
    },
    month: {
      label: "Month",
      stem: STEMS[monthStemIdx],
      branch: BRANCHES[monthBranchIdx],
      animal: ANIMALS[monthBranchIdx],
      element: STEM_ELEMENTS[monthStemIdx],
      polarity: STEM_POLARITY[monthStemIdx],
    },
    day: {
      label: "Day",
      stem: STEMS[dayStemIdx],
      branch: BRANCHES[dayBranchIdx],
      animal: ANIMALS[dayBranchIdx],
      element: STEM_ELEMENTS[dayStemIdx],
      polarity: STEM_POLARITY[dayStemIdx],
    },
    hour: hourPillar,
    dayMaster: `${STEM_POLARITY[dayStemIdx]} ${STEM_ELEMENTS[dayStemIdx]} (${STEMS[dayStemIdx]})`,
    chineseZodiac: ANIMALS[yearBranchIdx],
  };
}

// ── Numerology computation ────────────────────────────────────────────────────

function reduceToLifePath(n: number): number {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split("").reduce((acc, d) => acc + Number(d), 0);
  }
  return n;
}

interface NumerologyResult {
  lifePath: number;
  birthdayNumber: number;
  personalYear: number;
  lifePathLabel: string;
  isMaster: boolean;
}

const LIFE_PATH_LABELS: Record<number, string> = {
  1: "The Initiator — independent, original, driven to pioneer new paths",
  2: "The Mediator — cooperative, attuned, a natural facilitator",
  3: "The Communicator — expressive, creative, drawn to language and form",
  4: "The Architect — disciplined, methodical, builds lasting structures",
  5: "The Adapter — versatile, dynamic, thrives on movement and change",
  6: "The Steward — responsible, relational, anchors community and care",
  7: "The Analyst — introspective, pattern-seeking, pursues underlying truth",
  8: "The Director — authoritative, strategic, orients toward structured mastery",
  9: "The Integrator — scope-minded, completing cycles, service-oriented",
  11: "Master 11 — heightened perceptual sensitivity, activation threshold",
  22: "Master 22 — large-scale structural vision brought into disciplined form",
  33: "Master 33 — compassionate facilitation, highest instructional expression",
};

function computeNumerology(dateStr: string): NumerologyResult | null {
  if (!dateStr) return null;
  const digits = dateStr.replace(/-/g, "").split("").map(Number);
  if (digits.length < 8) return null;

  const [, m, d] = dateStr.split("-").map(Number);
  const rawSum = digits.reduce((a, b) => a + b, 0);
  const lifePath = reduceToLifePath(rawSum);
  const birthdayNumber = reduceToLifePath(d);
  const currentYear = new Date().getFullYear();
  const pyRaw =
    m +
    d +
    String(currentYear).split("").reduce((a, b) => a + Number(b), 0);
  const personalYear = reduceToLifePath(pyRaw);

  return {
    lifePath,
    birthdayNumber,
    personalYear,
    lifePathLabel: LIFE_PATH_LABELS[lifePath] ?? "",
    isMaster: [11, 22, 33].includes(lifePath),
  };
}

// ── Cross-tradition intersection finding ─────────────────────────────────────

const ELEMENT_PROFILE: Record<string, { orientation: "outward" | "inward"; cciaf_phrase: string; keyword: string }> = {
  Wood:  { orientation: "outward", cciaf_phrase: "patterns of directional momentum, initiative, and upward expansion", keyword: "expansive growth" },
  Fire:  { orientation: "outward", cciaf_phrase: "patterns of outward activation, illumination, and expressive radiance", keyword: "activation and radiance" },
  Earth: { orientation: "inward",  cciaf_phrase: "patterns of foundational stability, containment, and cyclical nourishment", keyword: "structural stability" },
  Metal: { orientation: "inward",  cciaf_phrase: "patterns of refinement, decisive clarity, and structural precision", keyword: "refinement and precision" },
  Water: { orientation: "inward",  cciaf_phrase: "patterns of adaptive depth, inward collection, and flow-seeking", keyword: "depth and adaptability" },
};

const LIFE_PATH_PROFILE: Record<number, { orientation: "outward" | "inward"; cciaf_phrase: string; keyword: string }> = {
  1:  { orientation: "outward", cciaf_phrase: "a cycle associated with independent initiation and self-directed action", keyword: "pioneering" },
  2:  { orientation: "inward",  cciaf_phrase: "a cycle associated with cooperative attunement and relational discernment", keyword: "cooperative sensitivity" },
  3:  { orientation: "outward", cciaf_phrase: "a cycle associated with expressive creativity and communicative activation", keyword: "creative expression" },
  4:  { orientation: "inward",  cciaf_phrase: "a cycle associated with disciplined construction and structural consolidation", keyword: "disciplined building" },
  5:  { orientation: "outward", cciaf_phrase: "a cycle associated with dynamic versatility and adaptive movement", keyword: "dynamic change" },
  6:  { orientation: "inward",  cciaf_phrase: "a cycle associated with relational responsibility and foundational care", keyword: "relational accountability" },
  7:  { orientation: "inward",  cciaf_phrase: "a cycle associated with analytical depth and the pursuit of underlying pattern", keyword: "introspection" },
  8:  { orientation: "outward", cciaf_phrase: "a cycle associated with structured mastery and directed authority", keyword: "strategic mastery" },
  9:  { orientation: "outward", cciaf_phrase: "a cycle associated with universal scope, release, and cycle completion", keyword: "completion" },
  11: { orientation: "inward",  cciaf_phrase: "a master cycle associated with heightened perceptual sensitivity and intuitive activation", keyword: "elevated sensitivity" },
  22: { orientation: "outward", cciaf_phrase: "a master cycle associated with large-scale structural vision and its disciplined execution", keyword: "visionary construction" },
  33: { orientation: "inward",  cciaf_phrase: "a master cycle associated with compassionate facilitation and selfless instructional expression", keyword: "selfless service" },
};

function computeIntersection(dayMaster: string, lifePath: number): string | null {
  const elementMatch = dayMaster.match(/\b(Wood|Fire|Earth|Metal|Water)\b/);
  if (!elementMatch) return null;
  const element = elementMatch[1];
  const polarityMatch = dayMaster.match(/^(Yang|Yin)/);
  const polarity = polarityMatch ? polarityMatch[1] : "";
  const stemMatch = dayMaster.match(/\(([A-Za-z]+)\)/);
  const stem = stemMatch ? stemMatch[1] : "";

  const ep = ELEMENT_PROFILE[element];
  const lp = LIFE_PATH_PROFILE[lifePath];
  if (!ep || !lp) return null;

  const convergent = ep.orientation === lp.orientation;
  const masterNote = [11, 22, 33].includes(lifePath)
    ? " The master number designation in the Pythagorean tradition marks this as a configuration associated with amplified cyclical intensity."
    : "";

  if (convergent) {
    return `Within the BaZi system, the ${polarity} ${element} Day Master (${stem}) associates with ${ep.cciaf_phrase}. Within the Pythagorean numerology tradition, Life Path ${lifePath} indicates ${lp.cciaf_phrase}. These two traditions — derived from entirely separate intellectual lineages — independently converge on a shared orientation: both point toward ${ep.keyword} as a structuring principle of this configuration.${masterNote} Within the CCIAF framework, inter-tradition convergence of this kind is treated as a high-confidence signal — not because either tradition is validated by the other, but because independent systems reaching the same territory strengthens the interpretive weight of that territory.`;
  } else {
    return `Within the BaZi system, the ${polarity} ${element} Day Master (${stem}) associates with ${ep.cciaf_phrase}. Within the Pythagorean numerology tradition, Life Path ${lifePath} indicates ${lp.cciaf_phrase}. These two traditions point in different directions — BaZi toward ${ep.keyword}, numerology toward ${lp.keyword}.${masterNote} Within the CCIAF framework, this is not a contradiction. It indicates two active principles operating simultaneously: a character configuration (BaZi Day Master) and a current cycle orientation (Life Path). The analytical question is not which is "correct" but which principle is dominant in the present phase — and whether the tension between them is a source of productive friction or unresolved conflict.`;
  }
}

// ── InfoCard ──────────────────────────────────────────────────────────────────

function InfoCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="note-box flex gap-3">
      <div className="mt-0.5 shrink-0 text-[#9B7A2F] dark:text-[#C4993E]">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-foreground font-sans">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed font-sans">{body}</p>
      </div>
    </div>
  );
}

// ── DOBSection ────────────────────────────────────────────────────────────────

interface DOBSectionProps {
  dob: string;
  birthHour: string;
  onDobChange: (v: string) => void;
  onHourChange: (v: string) => void;
}

function DOBSection({ dob, birthHour, onDobChange, onHourChange }: DOBSectionProps) {
  const numerology = computeNumerology(dob);
  const bazi = computeBazi(dob, birthHour ? Number(birthHour) : undefined);
  const pillars = bazi ? [bazi.year, bazi.month, bazi.day, ...(bazi.hour ? [bazi.hour] : [])] : [];

  return (
    <div className="space-y-5">
      {/* Input card */}
      <div className="rounded-2xl border border-border bg-card card-shadow p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-950/50">
            <CalendarDays className="h-5 w-5 text-rose-500" />
          </div>
          <div>
            <p className="text-sm font-semibold">Birth Details</p>
            <p className="text-xs text-muted-foreground">
              Date of birth → BaZi Four Pillars + Numerology profile, calculated locally
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => onDobChange(e.target.value)}
              className="w-full rounded-xl border border-input bg-muted/40 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Birth Hour <span className="text-muted-foreground/50">(0–23, for BaZi Hour Pillar)</span>
            </label>
            <input
              type="number"
              min="0"
              max="23"
              value={birthHour}
              onChange={(e) => onHourChange(e.target.value)}
              placeholder="e.g. 14"
              className="w-full rounded-xl border border-input bg-muted/40 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors placeholder:text-muted-foreground/40"
            />
          </div>
        </div>
      </div>

      {/* Numerology */}
      {numerology && (
        <div className="rounded-2xl border border-border bg-card card-shadow overflow-hidden">
          <div className="p-5 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/50">
                <Hash className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-semibold">Numerology Profile</p>
                <p className="text-xs text-muted-foreground">
                  Within the Pythagorean numerology tradition — calculated from date of birth
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <InfoCard
              icon={<Info className="h-4 w-4" />}
              title="About this layer"
              body="Within the Pythagorean numerology tradition, birth date digits map to numerical archetypes associated with recurring life-pattern themes. The Life Path number is derived by reducing all digits of the full birth date (master numbers 11, 22, 33 preserved). The Personal Year tracks the current annual cycle. This is one layer of the CCIAF Identity Module — not a standalone prediction."
            />

            <div className="flex items-center gap-5 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white">
                <span className="text-2xl font-bold">{numerology.lifePath}</span>
              </div>
              <div>
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-0.5">
                  Life Path {numerology.isMaster && (
                    <span className="ml-1 text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">Master</span>
                  )}
                </p>
                <p className="text-sm font-semibold text-foreground leading-snug">{numerology.lifePathLabel}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-muted/30 p-3.5 text-center">
                <p className="text-xs text-muted-foreground mb-1">Birthday Number</p>
                <p className="text-2xl font-bold text-foreground">{numerology.birthdayNumber}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Day digit reduced</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-3.5 text-center">
                <p className="text-xs text-muted-foreground mb-1">Personal Year {new Date().getFullYear()}</p>
                <p className="text-2xl font-bold text-foreground">{numerology.personalYear}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Current annual cycle</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BaZi */}
      {bazi && (
        <div className="rounded-2xl border border-border bg-card card-shadow overflow-hidden">
          <div className="p-5 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/50">
                <Globe className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-semibold">BaZi — Four Pillars</p>
                <p className="text-xs text-muted-foreground">
                  Within the BaZi system — calculated from date of birth
                  {!birthHour && " · Add birth hour for Hour Pillar"}
                </p>
              </div>
              <Badge variant="outline" className="ml-auto text-xs border-amber-400/40 text-amber-600 dark:text-amber-400">
                {bazi.chineseZodiac}
              </Badge>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <InfoCard
              icon={<Info className="h-4 w-4" />}
              title="About this layer"
              body="Within the BaZi system, the Four Pillars map temporal cycles to elemental character. Year Pillar: ancestral and social pattern. Month Pillar: vocation and parental dynamic. Day Pillar: core self and partnership. Hour Pillar: inner life and later-phase expression. The Day Master is the central elemental identity. Month values are approximate — precision requires solar term dates. This is one layer of the CCIAF Identity Module — not a standalone prediction."
            />

            <div className={`grid gap-3 ${pillars.length === 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"}`}>
              {pillars.map((p) => (
                <div
                  key={p.label}
                  className="rounded-xl border border-amber-200/60 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/20 p-3 text-center"
                >
                  <p className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">
                    {p.label}
                  </p>
                  <p className="text-base font-bold leading-none">{p.stem}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{p.element}</p>
                  <div className="my-2 h-px bg-amber-200/60 dark:bg-amber-800/30" />
                  <p className="text-sm font-semibold">{p.branch}</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400">{p.animal}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-muted/30 border border-border px-4 py-3 text-center">
              <p className="text-xs text-muted-foreground">
                Day Master:{" "}
                <span className="font-semibold text-foreground">{bazi.dayMaster}</span>
                {" "}· Chinese Zodiac:{" "}
                <span className="font-semibold text-foreground">{bazi.chineseZodiac}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Intersection Finding ──────────────────────────────────────────────────────

function IntersectionFinding({ dayMaster, lifePath }: { dayMaster: string; lifePath: number }) {
  const finding = computeIntersection(dayMaster, lifePath);
  if (!finding) return null;

  const elementMatch = dayMaster.match(/\b(Wood|Fire|Earth|Metal|Water)\b/);
  const element = elementMatch ? elementMatch[1] : "";
  const convergent =
    elementMatch &&
    ELEMENT_PROFILE[element] &&
    LIFE_PATH_PROFILE[lifePath] &&
    ELEMENT_PROFILE[element].orientation === LIFE_PATH_PROFILE[lifePath].orientation;

  return (
    <div className="rounded-2xl border bg-card card-shadow overflow-hidden"
      style={{ borderColor: convergent ? "rgba(139,92,246,0.35)" : "rgba(251,146,60,0.35)" }}>
      <div className="p-5 border-b"
        style={{ borderColor: convergent ? "rgba(139,92,246,0.2)" : "rgba(251,146,60,0.2)", background: convergent ? "rgba(139,92,246,0.06)" : "rgba(251,146,60,0.06)" }}>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: convergent ? "rgba(139,92,246,0.15)" : "rgba(251,146,60,0.15)" }}>
            <span className="text-sm font-bold" style={{ color: convergent ? "#8B5CF6" : "#F97316" }}>
              {convergent ? "≡" : "⇌"}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold">
              Cross-Tradition Intersection Finding
            </p>
            <p className="text-xs text-muted-foreground">
              BaZi system × Pythagorean numerology tradition
              {" · "}
              <span className="font-medium" style={{ color: convergent ? "#8B5CF6" : "#F97316" }}>
                {convergent ? "Convergent" : "Divergent"} configuration
              </span>
            </p>
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-1 rounded-full border"
              style={{
                borderColor: convergent ? "rgba(139,92,246,0.4)" : "rgba(251,146,60,0.4)",
                color: convergent ? "#8B5CF6" : "#F97316",
                background: convergent ? "rgba(139,92,246,0.08)" : "rgba(251,146,60,0.08)",
              }}>
              CCIAF Free Tier
            </span>
          </div>
        </div>
      </div>

      <div className="p-5">
        <p className="text-sm text-foreground leading-relaxed">{finding}</p>

        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">CCIAF disclaimer:</span>{" "}
            This output is decision-support, not prediction. It is a structured interpretive
            finding drawing on two intellectual traditions. It is not a substitute for medical,
            psychiatric, legal, or financial advice. Users in distress should consult qualified
            professionals.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Upgrade CTA ───────────────────────────────────────────────────────────────

function UpgradeCTA() {
  return (
    <div className="rounded-2xl border border-border bg-card card-shadow overflow-hidden">
      <div className="p-5 border-b border-border" style={{ background: "rgba(139, 111, 63, 0.05)" }}>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#8C6D3F] mb-0.5">
          CCIAF · Next Tier
        </p>
        <p className="text-sm font-semibold">Go deeper with the Mid-Tier module</p>
      </div>
      <div className="p-5 space-y-3">
        <p className="text-xs text-muted-foreground leading-relaxed">
          The Identity Module is one layer. The CCIAF framework adds four more: Vedic dasha cycle timing,
          Islamic Firdaria and lunar mansion analysis, Traditional Hellenistic profections, and Jungian
          individuation mapping — synthesised into a unified timing report.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            "Vedic Dasha + Antardasha timing",
            "Islamic Firdaria (lifetime + sub-periods)",
            "28 Lunar Mansions — monthly action table",
            "Electional timing windows",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2">
              <ChevronRight className="h-3.5 w-3.5 mt-0.5 shrink-0 text-[#8C6D3F]" />
              <p className="text-xs text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>
        <a
          href="https://ibnarbi.minhaaj.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-[#8C6D3F]/40 bg-[#8C6D3F]/08 px-4 py-2.5 text-sm font-semibold text-[#8C6D3F] hover:bg-[#8C6D3F]/15 transition-colors"
        >
          Explore CCIAF Deep Tier
          <ChevronRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────

function Navbar() {
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 nav-blur
        ${scrolled
          ? "bg-background/90 border-b border-border shadow-sm"
          : "bg-transparent border-b border-transparent"
        }`}
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary">
            <Star className="h-4 w-4 text-white fill-white" />
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight leading-none">CCIAF</span>
            <p className="text-[10px] text-muted-foreground leading-none mt-0.5 tracking-wide">
              Free Tier · Identity Module
            </p>
          </div>
        </div>

        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="h-8 w-8 flex items-center justify-center rounded-xl border border-border bg-card hover:bg-muted transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="h-4 w-4 text-amber-500" />
          ) : (
            <Moon className="h-4 w-4 text-slate-600" />
          )}
        </button>
      </div>
    </header>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function Home() {
  const [dob, setDob] = useState("");
  const [birthHour, setBirthHour] = useState("");

  const bazi = dob ? computeBazi(dob, birthHour ? Number(birthHour) : undefined) : null;
  const numerology = dob ? computeNumerology(dob) : null;
  const showIntersection = !!(bazi && numerology);

  return (
    <div className="min-h-screen bg-background" style={{ backgroundColor: "hsl(var(--page-bg))" }}>
      <Navbar />

      {/* Cover */}
      <div className="pt-14">
        <div
          style={{ background: "#0D0D12", borderBottom: "3px solid #8C6D3F", position: "relative" }}
          className="px-6 sm:px-16 pt-14 pb-12"
        >
          <div style={{ position: "absolute", left: "2.5rem", top: 0, bottom: 0, width: 2, background: "#8C6D3F", opacity: 0.45 }} />

          <p style={{ color: "#8C6D3F", fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 11, letterSpacing: "3px", textTransform: "uppercase", marginBottom: 20, marginLeft: 20 }}>
            Cross-Civilization Intelligence and Action Framework
          </p>
          <h1 style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontWeight: 800, fontSize: "clamp(32px, 5vw, 60px)", letterSpacing: "2px", textTransform: "uppercase", lineHeight: 1.0, marginLeft: 20, color: "white", marginBottom: 0 }}>
            Identity Module
          </h1>
          <div style={{ borderTop: "1px solid #8C6D3F", margin: "20px 0 20px 20px", width: "50%" }} />
          <p style={{ color: "#CCCCCC", fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 13, marginLeft: 20, marginBottom: 6, letterSpacing: "0.3px" }}>
            BaZi Four Pillars + Pythagorean Numerology with cross-tradition intersection finding
          </p>
          <p style={{ color: "#8C6D3F", fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 11, letterSpacing: "0.5px", marginLeft: 20, lineHeight: 2.0 }}>
            Free Tier &nbsp;·&nbsp; Decision-support, not prediction &nbsp;·&nbsp; All calculation runs locally
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 pb-16 space-y-10">

        {/* How it works */}
        <section>
          <div className="mb-5">
            <h2 className="section-label flex items-center gap-2">
              <Layers className="h-3.5 w-3.5" />How it works
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <InfoCard
              icon={<CalendarDays className="h-4 w-4" />}
              title="1 · Enter your birth date"
              body="Your date of birth — and optionally your birth hour — instantly maps your BaZi Four Pillars and Pythagorean numerology profile. No external data sent."
            />
            <InfoCard
              icon={<Globe className="h-4 w-4" />}
              title="2 · Two traditions calculated"
              body="Within the BaZi system, your elemental Day Master and four temporal pillars are derived. Within the Pythagorean numerology tradition, your Life Path and current Personal Year cycle are computed."
            />
            <InfoCard
              icon={<Star className="h-4 w-4" />}
              title="3 · One intersection finding"
              body="CCIAF maps where the two traditions converge or diverge on the same character theme. Convergence signals high interpretive weight. Divergence indicates two active principles in tension."
            />
          </div>
        </section>

        {/* Input + calculations */}
        <section>
          <div className="mb-5">
            <h2 className="section-label flex items-center gap-2">
              <CalendarDays className="h-3.5 w-3.5" />Birth Details & Calculations
            </h2>
          </div>
          <DOBSection
            dob={dob}
            birthHour={birthHour}
            onDobChange={setDob}
            onHourChange={setBirthHour}
          />
        </section>

        {/* Intersection finding */}
        {showIntersection && (
          <section>
            <div className="mb-5">
              <h2 className="section-label flex items-center gap-2">
                <Star className="h-3.5 w-3.5" />Intersection Finding
              </h2>
            </div>
            <IntersectionFinding
              dayMaster={bazi!.dayMaster}
              lifePath={numerology!.lifePath}
            />
          </section>
        )}

        {/* Upgrade CTA */}
        {showIntersection && (
          <section>
            <UpgradeCTA />
          </section>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-3 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary">
              <Star className="h-3 w-3 text-white fill-white" />
            </div>
            <span className="text-xs font-bold tracking-tight">CCIAF</span>
            <span className="text-xs text-muted-foreground">Free Tier · Identity Module</span>
          </div>
          <p className="text-xs text-muted-foreground max-w-xl mx-auto leading-relaxed">
            CCIAF is a structured interpretive framework drawing on multiple intellectual traditions.
            It is decision-support, not prediction. It is not a substitute for medical, psychiatric,
            legal, or financial advice. Users in distress should consult qualified professionals.
          </p>
          <p className="text-xs text-muted-foreground/50">
            All calculation runs locally in your browser · No data collected or transmitted ·
            Founded by Minhaaj Rehman
          </p>
        </div>
      </footer>
    </div>
  );
}
