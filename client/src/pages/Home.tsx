import { useState, useRef, useCallback, useEffect, DragEvent, ChangeEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sparkles,
  Upload,
  FileText,
  Image as ImageIcon,
  X,
  Star,
  Moon,
  Sun,
  Globe,
  CalendarDays,
  Hash,
  Clock,
  Info,
  ChevronRight,
  Layers,
} from "lucide-react";
import { useTheme } from "@/lib/theme";
import {
  parseTropical,
  parseVedic,
  parseBazi,
  synthesize,
  type TropicalChart,
  type VedicChart,
  type BaziChart,
  type SynthesisRow,
} from "@/lib/astroParser";

// ── Bazi / Numerology calculation helpers ─────────────────────────────────────

const STEMS = ["Jia", "Yi", "Bing", "Ding", "Wu", "Ji", "Geng", "Xin", "Ren", "Gui"];
const BRANCHES = ["Zi", "Chou", "Yin", "Mao", "Chen", "Si", "Wu", "Wei", "Shen", "You", "Xu", "Hai"];
const STEM_ELEMENTS = ["Wood", "Wood", "Fire", "Fire", "Earth", "Earth", "Metal", "Metal", "Water", "Water"];
const STEM_POLARITY = ["Yang", "Yin", "Yang", "Yin", "Yang", "Yin", "Yang", "Yin", "Yang", "Yin"];
const ANIMALS = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];

/** Compute Julian Day Number for a Gregorian date. */
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

// Reference: Jan 1, 1900 (Gregorian) = Jia Xu day (stem=0 Jia, branch=10 Xu)
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

  // Year pillar
  const yearStemIdx = (((y - 4) % 10) + 10) % 10;
  const yearBranchIdx = (((y - 4) % 12) + 12) % 12;

  // Day pillar via Julian Day Number
  const jd = julianDay(y, m, d);
  const daysFromRef = jd - REF_JD;
  const dayStemIdx = ((daysFromRef % 10) + 10) % 10;
  // Ref was Xu (branch 10), so offset by 10
  const dayBranchIdx = (((daysFromRef + 10) % 12) + 12) % 12;

  // Month pillar — solar term correction (month changes ~7th of each calendar month)
  // If day < 7 we are still in the previous Chinese month
  let solarMonth = m;
  let stemYear = y;
  if (d < 7) {
    solarMonth = m - 1;
    if (solarMonth < 1) { solarMonth = 12; stemYear = y - 1; }
  }
  // Month branch: Jan=Chou(1), Feb=Yin(2), Mar=Mao(3) … Dec=Zi(0)
  const monthBranchIdx = solarMonth % 12;
  // Month stem depends on the year stem of the stemYear (may differ from birth year near Jan)
  const adjYearStemIdx = (((stemYear - 4) % 10) + 10) % 10;
  const yearStemGroup = Math.floor(adjYearStemIdx / 2);
  const monthStemIdx = (yearStemGroup * 2 + monthBranchIdx) % 10;

  // Hour pillar (optional — 2-hour blocks; Zi=23:00-01:00, Chou=01:00-03:00…)
  let hourPillar: BaziPillar | null = null;
  if (hourNum !== undefined) {
    const hourBranchIdx = Math.floor(((hourNum + 1) % 24) / 2);
    // Hour stem depends on day stem
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

/** Reduce a number to a single digit (master numbers 11, 22, 33 kept). */
function reduceToLifePath(n: number): number {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n)
      .split("")
      .reduce((acc, d) => acc + Number(d), 0);
  }
  return n;
}

interface NumerologyResult {
  lifePath: number;
  birthdayNumber: number;
  personalYear: number;
  lifePathMeaning: string;
  isMaster: boolean;
}

const LIFE_PATH_MEANINGS: Record<number, string> = {
  1: "The Leader — independent, original, driven to pioneer new paths",
  2: "The Peacemaker — cooperative, intuitive, a natural diplomat",
  3: "The Creator — expressive, joyful, drawn to art, words and communication",
  4: "The Builder — practical, disciplined, creates lasting foundations",
  5: "The Explorer — freedom-loving, versatile, thrives on change",
  6: "The Nurturer — responsible, caring, anchors family and community",
  7: "The Seeker — analytical, introspective, pursues wisdom and truth",
  8: "The Achiever — ambitious, authoritative, mastery over material world",
  9: "The Humanitarian — compassionate, idealistic, a universal soul",
  11: "Master Intuitive — heightened sensitivity, spiritual messenger",
  22: "Master Builder — grand visions made real through disciplined effort",
  33: "Master Teacher — selfless service, highest expression of compassion",
};

function computeNumerology(dateStr: string): NumerologyResult | null {
  if (!dateStr) return null;
  const digits = dateStr.replace(/-/g, "").split("").map(Number);
  if (digits.length < 8) return null;

  const [y, m, d] = dateStr.split("-").map(Number);
  const rawSum = digits.reduce((a, b) => a + b, 0);
  const lifePath = reduceToLifePath(rawSum);
  const birthdayNumber = reduceToLifePath(d);
  // Personal Year = month + day of birth + current year digits reduced
  const currentYear = new Date().getFullYear();
  const pyRaw =
    m +
    d +
    String(currentYear)
      .split("")
      .reduce((a, b) => a + Number(b), 0);
  const personalYear = reduceToLifePath(pyRaw);

  return {
    lifePath,
    birthdayNumber,
    personalYear,
    lifePathMeaning: LIFE_PATH_MEANINGS[lifePath] ?? "",
    isMaster: [11, 22, 33].includes(lifePath),
  };
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface UploadedFile {
  name: string;
  type: "image" | "pdf" | "text";
  dataUrl?: string;
  text?: string;
}

interface PanelState {
  text: string;
  files: UploadedFile[];
}

// ── File helpers ──────────────────────────────────────────────────────────────

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function processFile(file: File): Promise<UploadedFile> {
  if (file.type.startsWith("image/")) {
    const dataUrl = await readFileAsDataUrl(file);
    return { name: file.name, type: "image", dataUrl };
  }
  if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
    const text = await readFileAsText(file);
    const clean = text
      .replace(/[^\x20-\x7E\n\r\t]/g, " ")
      .replace(/\s{3,}/g, "\n")
      .trim();
    return { name: file.name, type: "pdf", text: clean };
  }
  const text = await readFileAsText(file);
  return { name: file.name, type: "text", text };
}

// ── Section info card ─────────────────────────────────────────────────────────

function InfoCard({
  icon,
  title,
  body,
  accent = "rose",
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  accent?: "rose" | "blue" | "purple" | "amber" | "emerald";
}) {
  const colors: Record<string, string> = {
    rose: "bg-rose-50 border-rose-100 dark:bg-rose-950/30 dark:border-rose-900/40",
    blue: "bg-blue-50 border-blue-100 dark:bg-blue-950/30 dark:border-blue-900/40",
    purple: "bg-purple-50 border-purple-100 dark:bg-purple-950/30 dark:border-purple-900/40",
    amber: "bg-amber-50 border-amber-100 dark:bg-amber-950/30 dark:border-amber-900/40",
    emerald: "bg-emerald-50 border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900/40",
  };
  const iconColors: Record<string, string> = {
    rose: "text-rose-500",
    blue: "text-blue-500",
    purple: "text-purple-500",
    amber: "text-amber-500",
    emerald: "text-emerald-500",
  };
  return (
    <div className={`rounded-2xl border p-4 flex gap-3 ${colors[accent]}`}>
      <div className={`mt-0.5 shrink-0 ${iconColors[accent]}`}>{icon}</div>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

// ── Paste-zone panel ─────────────────────────────────────────────────────────

interface PasteZoneProps {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  accentClass: string;
  borderClass: string;
  placeholder: string;
  state: PanelState;
  onChange: (s: PanelState) => void;
}

function PasteZone({
  id,
  title,
  subtitle,
  icon,
  accentClass,
  borderClass,
  placeholder,
  state,
  onChange,
}: PasteZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const addFiles = useCallback(
    async (fileList: FileList) => {
      const processed = await Promise.all(Array.from(fileList).map(processFile));
      const textFromFiles = processed
        .map((f) => f.text || "")
        .filter(Boolean)
        .join("\n\n");
      onChange({
        text: state.text + (state.text && textFromFiles ? "\n\n" : "") + textFromFiles,
        files: [...state.files, ...processed],
      });
    },
    [state, onChange]
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(false);
      if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const handleFileInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) addFiles(e.target.files);
      e.target.value = "";
    },
    [addFiles]
  );

  const removeFile = (index: number) => {
    const newFiles = state.files.filter((_, i) => i !== index);
    onChange({ ...state, files: newFiles });
  };

  const handlePaste = useCallback(
    async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const items = Array.from(e.clipboardData.items);
      const imageItems = items.filter((item) => item.type.startsWith("image/"));
      if (imageItems.length === 0) return;
      e.preventDefault();
      const files = imageItems
        .map((item) => item.getAsFile())
        .filter((f): f is File => f !== null);
      if (!files.length) return;
      const processed = await Promise.all(files.map(processFile));
      onChange({ ...state, files: [...state.files, ...processed] });
    },
    [state, onChange]
  );

  return (
    <div className={`rounded-2xl border ${borderClass} bg-card card-shadow overflow-hidden`}>
      <div className="p-5 pb-3">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accentClass}`}>
            {icon}
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">{title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 space-y-3">
        <textarea
          id={id}
          value={state.text}
          onChange={(e) => onChange({ ...state, text: e.target.value })}
          onPaste={handlePaste}
          placeholder={placeholder}
          className="w-full min-h-[148px] rounded-xl border bg-muted/40 p-3 text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/40 transition-colors"
        />

        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed py-3.5 transition-colors select-none
            ${dragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/20 hover:border-primary/30 hover:bg-muted/30"
            }`}
        >
          <Upload className="h-4 w-4 text-muted-foreground mb-1" />
          <p className="text-xs text-muted-foreground">Drop image / PDF / text — or click to browse</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.txt,.csv"
            className="hidden"
            onChange={handleFileInput}
          />
        </div>

        {state.files.length > 0 && (
          <div className="space-y-2">
            {state.files.map((f, i) => (
              <div key={i} className="flex items-start gap-2 rounded-xl border bg-muted/20 p-2">
                {f.type === "image" ? (
                  <ImageIcon className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                ) : (
                  <FileText className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{f.name}</p>
                  {f.type === "image" && f.dataUrl && (
                    <img src={f.dataUrl} alt={f.name} className="mt-2 max-h-40 rounded-lg border object-contain" />
                  )}
                  {f.type === "pdf" && f.text && (
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{f.text.slice(0, 120)}…</p>
                  )}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                  className="text-muted-foreground hover:text-foreground p-0.5"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── DOB + Numerology section ──────────────────────────────────────────────────

interface DOBSectionProps {
  dob: string;
  birthHour: string;
  onDobChange: (v: string) => void;
  onHourChange: (v: string) => void;
}

function DOBSection({ dob, birthHour, onDobChange, onHourChange }: DOBSectionProps) {
  const numerology = computeNumerology(dob);
  const bazi = computeBazi(dob, birthHour ? Number(birthHour) : undefined);
  const pillars = bazi
    ? [bazi.year, bazi.month, bazi.day, ...(bazi.hour ? [bazi.hour] : [])]
    : [];

  return (
    <div className="space-y-5">
      {/* DOB Input card */}
      <div className="rounded-2xl border border-border bg-card card-shadow p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-950/50">
            <CalendarDays className="h-5 w-5 text-rose-500" />
          </div>
          <div>
            <p className="text-sm font-semibold">Your Birth Details</p>
            <p className="text-xs text-muted-foreground">Used to calculate Numerology and Bazi Four Pillars</p>
          </div>
        </div>

        <InfoCard
          icon={<Info className="h-4 w-4" />}
          title="How this works"
          body="Enter your date of birth to instantly get your Life Path number (Numerology) and Four Pillars (Bazi). Adding your birth hour gives a more precise Hour Pillar. These calculations run entirely in your browser — nothing is sent anywhere."
          accent="rose"
        />

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Date of Birth
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => onDobChange(e.target.value)}
              className="w-full rounded-xl border border-input bg-muted/40 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Birth Hour <span className="text-muted-foreground/60">(optional — for Hour Pillar)</span>
            </label>
            <input
              type="number"
              min="0"
              max="23"
              value={birthHour}
              onChange={(e) => onHourChange(e.target.value)}
              placeholder="0–23 (24h format)"
              className="w-full rounded-xl border border-input bg-muted/40 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors placeholder:text-muted-foreground/40"
            />
          </div>
        </div>
      </div>

      {/* Numerology section */}
      {numerology && (
        <div className="rounded-2xl border border-border bg-card card-shadow overflow-hidden">
          <div className="p-5 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/50">
                <Hash className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-semibold">Numerology Profile</p>
                <p className="text-xs text-muted-foreground">Calculated from your date of birth</p>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <InfoCard
              icon={<Info className="h-4 w-4" />}
              title="About Numerology"
              body="Numerology maps the digits of your birth date to archetypal life themes. The Life Path is the master number — found by reducing all digits of your full birth date to a single digit (master numbers 11, 22, 33 are kept). The Personal Year shows the current cycle you're in."
              accent="emerald"
            />

            {/* Big life path number */}
            <div className="flex items-center gap-5 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white">
                <span className="text-2xl font-bold">{numerology.lifePath}</span>
              </div>
              <div>
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-0.5">
                  Life Path Number {numerology.isMaster && <span className="ml-1 text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">Master</span>}
                </p>
                <p className="text-sm font-semibold text-foreground leading-snug">{numerology.lifePathMeaning}</p>
              </div>
            </div>

            {/* Secondary numbers */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-muted/30 p-3.5 text-center">
                <p className="text-xs text-muted-foreground mb-1">Birthday Number</p>
                <p className="text-2xl font-bold text-foreground">{numerology.birthdayNumber}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Day of birth reduced</p>
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

      {/* Bazi from DOB section */}
      {bazi && (
        <div className="rounded-2xl border border-border bg-card card-shadow overflow-hidden">
          <div className="p-5 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/50">
                <Globe className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-semibold">Bazi — Four Pillars from DOB</p>
                <p className="text-xs text-muted-foreground">
                  Chinese astrology calculated from your birth date
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
              title="Four Pillars (Bazi)"
              body="Each pillar represents a dimension of your life: Year = ancestry & social mask, Month = career & parents, Day = self & partner, Hour = children & later life. The Day Master (your Day Stem element) is your core elemental identity. Month values are approximate — for precision, use solar term dates."
              accent="amber"
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

// ── Synthesis display components ──────────────────────────────────────────────

function SignBadge({ text }: { text: string }) {
  if (text === "—") return <span className="text-muted-foreground text-sm">—</span>;
  return <span className="text-sm">{text}</span>;
}

function TropicalSummary({ chart }: { chart: TropicalChart }) {
  const corePlanets = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Ascendant"];
  const shown = chart.placements.filter((p) => corePlanets.includes(p.planet));
  return (
    <div className="rounded-2xl border border-blue-200/60 dark:border-blue-900/40 bg-card card-shadow overflow-hidden">
      <div className="p-5 border-b border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-950/20">
        <div className="flex items-center gap-2">
          <Sun className="h-5 w-5 text-blue-500" />
          <p className="text-sm font-semibold">Tropical — Natal Positions</p>
        </div>
      </div>
      <div className="p-5">
        {shown.length === 0 ? (
          <p className="text-sm text-center text-muted-foreground py-4">
            No Tropical data detected — paste your Western chart in the panel above.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {shown.map((p) => (
              <div key={p.planet} className="rounded-xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/60 dark:bg-blue-950/20 p-3">
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400">{p.planet}</p>
                <p className="font-semibold text-sm mt-0.5">{p.sign}{p.retrograde ? " ℞" : ""}</p>
                {p.degree != null && <p className="text-xs text-muted-foreground">{p.degree.toFixed(1)}°</p>}
                {p.house != null && <p className="text-xs text-muted-foreground">House {p.house}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function VedicSummary({ chart }: { chart: VedicChart }) {
  const corePlanets = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Ascendant"];
  const shown = chart.placements.filter((p) => corePlanets.includes(p.planet));
  return (
    <div className="rounded-2xl border border-purple-200/60 dark:border-purple-900/40 bg-card card-shadow overflow-hidden">
      <div className="p-5 border-b border-purple-100 dark:border-purple-900/30 bg-purple-50/50 dark:bg-purple-950/20">
        <div className="flex items-center gap-2">
          <Moon className="h-5 w-5 text-purple-500" />
          <p className="text-sm font-semibold">Vedic — Sidereal Placements</p>
          {chart.lagna && (
            <Badge variant="outline" className="ml-auto text-xs border-purple-400/40 text-purple-600 dark:text-purple-400">
              Lagna: {chart.lagna}
            </Badge>
          )}
        </div>
      </div>
      <div className="p-5">
        {shown.length === 0 ? (
          <p className="text-sm text-center text-muted-foreground py-4">
            No Vedic data detected — paste your Jyotish / KP chart above.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {shown.map((p) => (
              <div key={p.planet} className="rounded-xl border border-purple-100 dark:border-purple-900/30 bg-purple-50/60 dark:bg-purple-950/20 p-3">
                <p className="text-xs font-medium text-purple-600 dark:text-purple-400">{p.planet}</p>
                <p className="font-semibold text-sm mt-0.5">{p.sign}</p>
                {p.nakshatra && <p className="text-xs text-muted-foreground">{p.nakshatra}{p.pada ? ` P${p.pada}` : ""}</p>}
                {p.house != null && <p className="text-xs text-muted-foreground">House {p.house}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ElementalProfile({ bazi }: { bazi: BaziChart }) {
  const pillars = [bazi.yearPillar, bazi.monthPillar, bazi.dayPillar, bazi.hourPillar].filter(Boolean);
  return (
    <div className="rounded-2xl border border-amber-200/60 dark:border-amber-900/40 bg-card card-shadow overflow-hidden">
      <div className="p-5 border-b border-amber-100 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-950/20">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-amber-500" />
          <p className="text-sm font-semibold">Bazi — Pasted Four Pillars</p>
        </div>
      </div>
      <div className="p-5">
        {pillars.length === 0 ? (
          <p className="text-sm text-center text-muted-foreground py-4">
            No Bazi data detected — paste your Four Pillars chart in the panel above.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {pillars.map((p) => (
                <div key={p!.label} className="rounded-xl border border-amber-200/60 dark:border-amber-900/40 bg-amber-50/60 dark:bg-amber-950/20 p-3 text-center">
                  <p className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">{p!.label}</p>
                  <p className="mt-1.5 text-base font-bold">{p!.stem}</p>
                  <p className="text-sm text-muted-foreground">{p!.branch}</p>
                  {p!.animal && <Badge variant="outline" className="mt-1 text-xs border-amber-400/30">{p!.animal}</Badge>}
                  {p!.element && <p className="mt-1 text-xs text-amber-600/70 dark:text-amber-400/70">{p!.element}</p>}
                </div>
              ))}
            </div>
            {bazi.dayMaster && (
              <p className="mt-3 text-xs text-center text-muted-foreground">
                Day Master: <span className="font-semibold text-foreground">{bazi.dayMaster}</span>
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function SynthesisTable({ rows }: { rows: SynthesisRow[] }) {
  const hasData = rows.some((r) => r.tropical !== "—" || r.vedic !== "—" || r.bazi !== "—");
  if (!hasData) return null;
  return (
    <div className="rounded-2xl border border-border bg-card card-shadow overflow-hidden">
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <p className="text-sm font-semibold">Cross-System Synthesis</p>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Each row maps the same life theme across all three traditions.
        </p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-[160px] pl-6">Theme</TableHead>
              <TableHead><div className="flex items-center gap-1.5"><Sun className="h-3.5 w-3.5 text-blue-500" />Tropical</div></TableHead>
              <TableHead><div className="flex items-center gap-1.5"><Moon className="h-3.5 w-3.5 text-purple-500" />Vedic</div></TableHead>
              <TableHead><div className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-amber-500" />Bazi</div></TableHead>
              <TableHead className="pr-6">Keywords</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.theme} className="hover:bg-muted/20 transition-colors">
                <TableCell className="pl-6 font-medium text-sm">{row.theme}</TableCell>
                <TableCell><SignBadge text={row.tropical} /></TableCell>
                <TableCell><SignBadge text={row.vedic} /></TableCell>
                <TableCell className="text-sm">{row.bazi}</TableCell>
                <TableCell className="pr-6">
                  <div className="flex flex-wrap gap-1">
                    {row.keywords.map((kw) => (
                      <Badge key={kw} variant="secondary" className="text-xs px-1.5 py-0">{kw}</Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ── Sticky Navbar ─────────────────────────────────────────────────────────────

function Navbar({ onReset, showReset }: { onReset: () => void; showReset: boolean }) {
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 nav-blur
        ${scrolled
          ? "bg-background/90 border-b border-border shadow-sm"
          : "bg-transparent border-b border-transparent"
        }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary">
            <Star className="h-4 w-4 text-white fill-white" />
          </div>
          <span className="text-base font-bold tracking-tight">Celestia</span>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {showReset && (
            <Button variant="ghost" size="sm" onClick={onReset} className="text-xs h-8 px-3">
              <X className="h-3.5 w-3.5 mr-1" /> Reset
            </Button>
          )}
          {/* Theme toggle */}
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
      </div>
    </header>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

const EMPTY_PANEL: PanelState = { text: "", files: [] };

export default function Home() {
  const [dob, setDob] = useState("");
  const [birthHour, setBirthHour] = useState("");
  const [tropicalState, setTropicalState] = useState<PanelState>(EMPTY_PANEL);
  const [vedicState, setVedicState] = useState<PanelState>(EMPTY_PANEL);
  const [baziState, setBaziState] = useState<PanelState>(EMPTY_PANEL);

  const [tropical, setTropical] = useState<TropicalChart | null>(null);
  const [vedic, setVedic] = useState<VedicChart | null>(null);
  const [bazi, setBazi] = useState<BaziChart | null>(null);
  const [synthesis, setSynthesis] = useState<SynthesisRow[] | null>(null);

  const hasAnyChartInput =
    tropicalState.text.trim() || vedicState.text.trim() || baziState.text.trim();

  const handleSynthesize = () => {
    const t = parseTropical(tropicalState.text);
    const v = parseVedic(vedicState.text);
    const b = parseBazi(baziState.text);
    setTropical(t);
    setVedic(v);
    setBazi(b);
    setSynthesis(synthesize(t, v, b));
  };

  const handleReset = () => {
    setTropicalState(EMPTY_PANEL);
    setVedicState(EMPTY_PANEL);
    setBaziState(EMPTY_PANEL);
    setTropical(null);
    setVedic(null);
    setBazi(null);
    setSynthesis(null);
  };

  return (
    <div className="min-h-screen bg-background" style={{ backgroundColor: "hsl(var(--page-bg))" }}>
      <Navbar onReset={handleReset} showReset={!!synthesis} />

      {/* Hero */}
      <div className="pt-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-14 pb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 px-4 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Cross-system astrology synthesis
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Welcome to{" "}
            <span className="text-primary">Celestia</span>
          </h1>
          <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Paste data from Tropical, Vedic, and Chinese Bazi traditions — Celestia parses them
            client-side and maps shared life themes side by side.
          </p>

          {/* System icons */}
          <div className="mt-8 flex items-center justify-center gap-6">
            {[
              { icon: <Sun className="h-5 w-5 text-blue-500" />, label: "Tropical", bg: "bg-blue-50 dark:bg-blue-950/30" },
              { icon: <Moon className="h-5 w-5 text-purple-500" />, label: "Vedic", bg: "bg-purple-50 dark:bg-purple-950/30" },
              { icon: <Globe className="h-5 w-5 text-amber-500" />, label: "Bazi", bg: "bg-amber-50 dark:bg-amber-950/30" },
            ].map(({ icon, label, bg }, i) => (
              <div key={label} className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div className={`h-10 w-10 rounded-xl ${bg} flex items-center justify-center border border-border`}>
                    {icon}
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">{label}</span>
                </div>
                {i < 2 && <ChevronRight className="h-4 w-4 text-muted-foreground/40 -mt-5" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 pb-16 space-y-10">

        {/* How it works */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Layers className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">How it works</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <InfoCard
              icon={<CalendarDays className="h-4 w-4" />}
              title="1 · Enter your birth date"
              body="Your date (and optional birth hour) instantly calculates your Life Path number and Bazi Four Pillars — no chart needed."
              accent="rose"
            />
            <InfoCard
              icon={<FileText className="h-4 w-4" />}
              title="2 · Paste chart data (optional)"
              body="Paste raw text from AstroSeek, AstroSage KP, or any Bazi source. Images and PDFs are supported too."
              accent="blue"
            />
            <InfoCard
              icon={<Sparkles className="h-4 w-4" />}
              title="3 · Read your synthesis"
              body="Celestia maps each life theme (Identity, Career, Love…) across all systems so you can compare traditions at a glance."
              accent="emerald"
            />
          </div>
        </section>

        {/* DOB → Numerology + Bazi section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Numerology &amp; Bazi from Birth Date
            </h2>
          </div>
          <DOBSection
            dob={dob}
            birthHour={birthHour}
            onDobChange={setDob}
            onHourChange={setBirthHour}
          />
        </section>

        {/* Chart paste panels */}
        {!synthesis && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Paste Chart Data <span className="normal-case font-normal">(optional)</span>
                </h2>
              </div>
              <span className="text-xs text-muted-foreground hidden sm:block">
                Fill one, two, or all three panels
              </span>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <PasteZone
                id="tropical"
                title="Tropical Natal Chart"
                subtitle="AstroSeek · Western · Sun in Aries 15°32' format"
                icon={<Sun className="h-5 w-5 text-blue-500" />}
                accentClass="bg-blue-100 dark:bg-blue-950/50"
                borderClass="border-blue-200/60 dark:border-blue-900/40"
                placeholder={`Sun in Aries 15°32'\nMoon in Cancer 8°\nMercury in Taurus 3°\nAscendant in Scorpio\n…`}
                state={tropicalState}
                onChange={setTropicalState}
              />
              <PasteZone
                id="vedic"
                title="Vedic Placement Report"
                subtitle="Jyotish · AstroSage KP · Sanskrit names OK"
                icon={<Moon className="h-5 w-5 text-purple-500" />}
                accentClass="bg-purple-100 dark:bg-purple-950/50"
                borderClass="border-purple-200/60 dark:border-purple-900/40"
                placeholder={`Lagna: Scorpio\nSun in Pisces, Revati Nakshatra\nMoon in Virgo, Hasta Pada 2\nMars in Capricorn House 3\n…`}
                state={vedicState}
                onChange={setVedicState}
              />
              <PasteZone
                id="bazi"
                title="Chinese Bazi Data"
                subtitle="Four Pillars · inline or columnar · or use DOB above"
                icon={<Globe className="h-5 w-5 text-amber-500" />}
                accentClass="bg-amber-100 dark:bg-amber-950/50"
                borderClass="border-amber-200/60 dark:border-amber-900/40"
                placeholder={`Year Pillar: Jia Zi (Wood Rat)\nMonth Pillar: Bing Yin (Fire Tiger)\nDay Pillar: Ren Wu (Water Horse)\nHour Pillar: Gui Hai (Water Pig)\nDay Master: Yang Water\n…`}
                state={baziState}
                onChange={setBaziState}
              />
            </div>

            <div className="flex justify-center pt-5">
              <Button
                size="lg"
                disabled={!hasAnyChartInput}
                onClick={handleSynthesize}
                className="px-10 h-12 rounded-xl text-sm font-semibold shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Synthesize Chart Data
              </Button>
            </div>
            {!hasAnyChartInput && (
              <p className="text-center text-xs text-muted-foreground mt-2">
                Paste at least one chart above to run synthesis
              </p>
            )}
          </section>
        )}

        {/* Results */}
        {synthesis && tropical && vedic && bazi && (
          <section className="space-y-5">
            <div className="text-center space-y-1 pb-2">
              <h2 className="text-xl font-bold">Chart Synthesis</h2>
              <p className="text-sm text-muted-foreground">Parsed locally · no data sent externally</p>
            </div>

            <TropicalSummary chart={tropical} />
            <VedicSummary chart={vedic} />
            <ElementalProfile bazi={bazi} />
            <SynthesisTable rows={synthesis} />

            {tropical.placements.length === 0 &&
              vedic.placements.length === 0 &&
              !bazi.yearPillar && (
                <div className="rounded-2xl border border-yellow-300/50 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-800/30 p-4">
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    <strong>No structured data detected.</strong> The parser looks for patterns like
                    "Sun in Aries", "Moon: Cancer 8°", or "Year Pillar: Jia Zi". Try pasting more
                    structured text with planet names and sign names.
                  </p>
                </div>
              )}

            <div className="flex justify-center pt-2">
              <Button variant="outline" onClick={handleReset} className="rounded-xl">
                <X className="h-4 w-4 mr-2" /> Start Over
              </Button>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Celestia</span> · All parsing runs in your browser · No data is collected or transmitted
        </p>
      </footer>
    </div>
  );
}
