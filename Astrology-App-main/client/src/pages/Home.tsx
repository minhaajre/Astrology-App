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
  MapPin,
  Loader2,
  Calculator,
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
import { calcNatalCharts } from "@/lib/ephemeris";

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

// ── Astrology static data & helpers ──────────────────────────────────────────

function formatDegree(deg: number): string {
  const d = Math.floor(deg);
  const m = Math.round((deg - d) * 60);
  return `${d}°${String(m).padStart(2, "0")}'`;
}

const NAKSHATRA_DESCRIPTIONS: Record<string, string> = {
  "Ashwini": "Your emotional nature is swift, impulsive, and hungry for new beginnings. You feel most alive when charging into the unknown, and you heal others and yourself through bold action. Patience with your own feelings may be your lifelong practice.",
  "Bharani": "You carry an intensity of feeling that others can find overwhelming, yet it is precisely this depth that gives you the capacity to transform through experience. Emotionally you are drawn to extremes — profound love and profound grief feel equally real. Learning to contain rather than express every wave is your inner work.",
  "Krittika": "Your inner world burns brightly; you feel things with a sharp, discerning clarity and have little tolerance for emotional vagueness or dishonesty. You are loyal and protective of those you love, but your critical nature can turn inward and scorch your own sense of self-worth.",
  "Rohini": "Emotionally you are sensuous, receptive, and deeply nourishing to those around you. You crave beauty, stability, and physical comfort as emotional anchors, and you are at your best when life feels abundant and aesthetically pleasing. Possessiveness can arise when that sense of security is threatened.",
  "Mrigashira": "Your emotional life is perpetually curious, always questing for something just beyond reach. You feel most at home in the early stages of connection — the searching, the wondering — and restlessness sets in once a situation becomes too familiar. This searching quality makes you gentle, sensitive, and endlessly interesting.",
  "Ardra": "You feel deeply and turbulently, like a storm that must break before calm returns. Your emotional intelligence includes a gift for dismantling old structures inside yourself so that something truer can emerge. Grief, when you allow yourself to feel it fully, becomes a source of profound renewal.",
  "Punarvasu": "Your emotional nature is optimistic, expansive, and capable of remarkable recovery after difficulty. You return again and again to a hopeful baseline, which makes you resilient but can also lead you to gloss over wounds that need deeper attention. At your best you are a source of genuine warmth and philosophical reassurance.",
  "Pushya": "Nourishment — giving it and receiving it — is the core of your emotional life. You feel most yourself when caring for others or for a cherished tradition, and you are gifted at creating emotional security. The shadow side is an attachment to being needed that can tip into control.",
  "Ashlesha": "Your emotions are perceptive to the point of being psychic; you sense the undercurrents in any room and in any relationship. This gives you wisdom but also a tendency toward emotional guardedness or manipulation when you feel threatened. Trusting your instincts while staying honest is your inner challenge.",
  "Magha": "You feel things with the authority of someone who carries ancestral memory — emotions are not just personal but collective. Pride and a need for respect are real emotional needs for you, not vanities. When your dignity is honoured you are magnanimous; when it is slighted you withdraw into a regal silence.",
  "Purva Phalguni": "Your emotional world is pleasure-seeking, creative, and intensely relational. You feel most alive in partnership, in creative flow, and in spaces of genuine joy. The risk is avoiding discomfort or difficult feelings by retreating into indulgence.",
  "Uttara Phalguni": "You feel emotions with a sense of duty attached — love, for you, is expressed through service and reliability. Deep partnerships nourish you, and you seek emotional exchanges that are both intimate and structured. You can struggle with expressing vulnerability.",
  "Hasta": "Your emotional intelligence is precise and skillful; you process feelings through doing, making, and fixing. You are adaptable and witty emotionally, able to lighten any atmosphere, but you can use that cleverness to deflect from deeper emotional currents within yourself.",
  "Chitra": "You experience emotions with an aesthetic sensitivity — you feel the beauty or ugliness of a situation acutely. You are drawn to emotional experiences that are vivid and well-crafted, and you can be restless if life feels plain or unrefined. At your best you bring elegance and insight to how you handle feeling.",
  "Swati": "Your emotional nature is independent, airy, and flexible. You adapt easily to emotional environments but need genuine freedom within relationships to feel safe. Too much emotional entanglement makes you anxious; at your best you are socially deft and compassionately detached.",
  "Vishakha": "Your emotional life is driven by ambition and desire — you feel most alive when working toward something meaningful. Feelings of jealousy or restless striving can arise when goals seem blocked. At your core, you have a capacity for fierce devotion once you have found your cause.",
  "Anuradha": "You feel things with a quality of steadfast devotion; once you love, you love deeply and loyally across time. Friendship and belonging are core emotional needs, and isolation distresses you profoundly. You have a talent for sustaining emotional connection even across difficult circumstances.",
  "Jyeshtha": "Your emotional world is intense, protective, and concerned with personal authority. You feel a strong need to be seen as capable and in command of your own life, and vulnerability can feel threatening. When you trust, however, you are deeply generous and protective of those in your care.",
  "Mula": "Emotionally you are drawn toward root causes — you need to understand why you feel what you feel. This gives you a searching, sometimes ruthless quality in your inner life as you strip away what is no longer true. Great transformation is available to you through what initially looks like loss.",
  "Purva Ashadha": "Your emotional strength lies in your capacity for enthusiasm and the ability to rally others around a vision. You feel most yourself when you are inspiring or being inspired. The risk is emotional inflation — convincing yourself of things that feel good but are not yet tested by reality.",
  "Uttara Ashadha": "You carry a quality of quiet, sustained emotional determination. Your feelings run deep and long; once a commitment is made emotionally you rarely abandon it. You can be slow to warm but once you do, your loyalty and steadiness are extraordinary.",
  "Shravana": "Listening — truly hearing others and the world — is your central emotional gift. You process feelings through understanding and narrative, and you need connection with people who are willing to go deep in conversation. You can absorb others' emotional pain unconsciously if you are not discerning.",
  "Dhanishtha": "Your emotional nature is rhythmic, communal, and attuned to shared celebration. You feel most yourself in groups united by a common purpose and you have a gift for lifting the mood of any gathering. The shadow is a tendency to prioritise the group's emotional climate over your own individual needs.",
  "Shatabhisha": "You feel things privately and sometimes eccentrically — your inner emotional world is vast but you share it selectively. A need for solitude and time to integrate experience is genuine rather than antisocial. Your emotional depth surfaces as healing insight when you trust your unconventional perspective.",
  "Purva Bhadrapada": "Your emotional life is intense, idealistic, and capable of profound transformation. You feel drawn toward experiences that test you and burn away what is inessential. At your most balanced you combine fierce passion with visionary compassion; at your shadow you can be extreme or self-destructive.",
  "Uttara Bhadrapada": "You carry emotional depth and patience that few possess. You feel things slowly, fully, and with a kind of cosmic acceptance that can appear detached but is actually the deepest form of engagement. You are a natural container for others' pain and a source of quiet, enduring wisdom.",
  "Revati": "Your emotional nature is gentle, imaginative, and boundlessly compassionate. You feel the pain of others acutely and can struggle to maintain clear boundaries between your emotions and those of the people around you. At your best you are a loving, creative presence that helps others find their way home.",
};

const NORTH_NODE_PURPOSE: Record<string, string> = {
  "Aries": "With North Node in Aries, your soul's growth lies in developing courageous self-assertion and a willingness to act independently. Life calls you away from the comfort of compromise and toward the vitality of claiming your own desires without apology.",
  "Taurus": "With North Node in Taurus, your purpose is to cultivate embodied steadiness — to build, to savour, and to trust the slow accumulation of real value. You are learning to exchange the intensity of transformation for the grace of simple, enduring presence.",
  "Gemini": "With North Node in Gemini, your path of growth runs through curiosity, communication, and the willingness to hold two ideas simultaneously. You are moving away from broad philosophising and toward the delight of the specific, the local, and the conversational.",
  "Cancer": "With North Node in Cancer, your soul calls you toward emotional vulnerability, rootedness, and the courage to need others. Your growth comes through creating genuine home — inner and outer — rather than perpetual achievement or public recognition.",
  "Leo": "With North Node in Leo, your purpose lies in embodying joy, creative self-expression, and the courage to be seen. Life asks you to move from collective ideals toward the warmth of personal radiance and heartfelt generosity.",
  "Virgo": "With North Node in Virgo, your growth is found in service, discernment, and attending to what is concretely in front of you. You are learning to move from the oceanic and undefined toward the healing power of precision and practical skill.",
  "Libra": "With North Node in Libra, your path of growth runs through partnership, fairness, and the art of genuine collaboration. You are being called to refine the self-sufficiency of Aries into the grace of true relatedness.",
  "Scorpio": "With North Node in Scorpio, your purpose lies in radical depth, emotional honesty, and the willingness to transform through surrender. Life asks you to release attachment to material security and move toward the power born of complete inner change.",
  "Sagittarius": "With North Node in Sagittarius, your soul's growth is found through expanding your horizons — philosophically, geographically, and spiritually. You are moving from the accumulation of facts toward the living experience of meaning.",
  "Capricorn": "With North Node in Capricorn, your path is the long, deliberate work of building something that lasts. Life calls you away from emotional reactivity and toward the quiet authority that comes from disciplined, earned mastery.",
  "Aquarius": "With North Node in Aquarius, your purpose is to serve the collective — to contribute your originality to causes larger than the personal. You are learning to move from individual drama toward the liberation that comes from belonging to humanity.",
  "Pisces": "With North Node in Pisces, your soul's growth lies in surrendering to the larger flow of life — in compassion, creative imagination, and spiritual trust. You are moving from the need to manage and perfect toward the grace of accepting what cannot be controlled.",
};

const VEDIC_D1_LAGNA_THEMES: Record<string, string> = {
  "Aries":       "With Aries Lagna the life is infused with directness, physical vitality, and an instinct to initiate. The chart carries the energy of Mars — action, courage, and sometimes impatience — as its central thread.",
  "Taurus":      "Taurus Lagna orients the life toward stability, sensory richness, and the patient accumulation of both material and relational value. Venus as chart ruler gives aesthetic sensitivity and a deep need for belonging.",
  "Gemini":      "Gemini Lagna brings a life shaped by curiosity, adaptability, and the hunger to connect ideas and people. Mercury's rulership makes communication and learning central life instruments.",
  "Cancer":      "Cancer Lagna centres the life on emotional intelligence, protection of the vulnerable, and the creation of belonging. The Moon as lord gives sensitivity, intuition, and a life that moves in emotional tides.",
  "Leo":         "Leo Lagna structures life around the development of individual authority, creativity, and the courage to be seen. The Sun rules the chart, making vitality, dignity, and purpose central life themes.",
  "Virgo":       "Virgo Lagna brings the life toward discernment, service, and the mastery of craft. Mercury rules the chart, and the path runs through analysis, healing skills, and continuous refinement.",
  "Libra":       "Libra Lagna shapes life through relationship, justice, and the search for beauty and equilibrium. Venus as lord calls the native toward partnership as a primary arena of growth.",
  "Scorpio":     "Scorpio Lagna gives a life of depth, transformation, and penetrating insight. Mars and Ketu co-rule the chart, making intensity, hidden knowledge, and cycles of death-and-renewal central experiences.",
  "Sagittarius": "Sagittarius Lagna orients life toward meaning, wisdom, and the expansion of horizons both physical and philosophical. Jupiter's rulership makes faith, ethics, and the search for truth central themes.",
  "Capricorn":   "Capricorn Lagna brings discipline, perseverance, and a strong orientation toward worldly achievement and social duty. Saturn as lord gives the life a quality of deliberate, sometimes arduous, but ultimately rewarding construction.",
  "Aquarius":    "Aquarius Lagna structures life around originality, collective contribution, and the reform of established structures. Saturn and Rahu co-rule, giving the native an unconventional intelligence and a pull toward the future.",
  "Pisces":      "Pisces Lagna gives life a quality of sensitivity, imagination, and spiritual permeability. Jupiter's rulership brings compassion, creative depth, and a life lived at the intersection of the visible and the invisible.",
};

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
  birthTime: string;
  birthLat: string;
  birthLon: string;
  utcOffset: string;
  onDobChange: (v: string) => void;
  onHourChange: (v: string) => void;
  onTimeChange: (v: string) => void;
  onLatChange: (v: string) => void;
  onLonChange: (v: string) => void;
  onUtcChange: (v: string) => void;
  onCalcChart: () => void;
  calcStatus: "idle" | "loading" | "error" | "done";
}

function DOBSection({
  dob, birthHour, birthTime, birthLat, birthLon, utcOffset,
  onDobChange, onHourChange, onTimeChange, onLatChange, onLonChange, onUtcChange,
  onCalcChart, calcStatus,
}: DOBSectionProps) {
  const numerology = computeNumerology(dob);
  const bazi = computeBazi(dob, birthHour ? Number(birthHour) : undefined);
  const pillars = bazi
    ? [bazi.year, bazi.month, bazi.day, ...(bazi.hour ? [bazi.hour] : [])]
    : [];

  const canCalc = dob && birthTime && birthLat && birthLon && utcOffset !== "";

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
            <p className="text-xs text-muted-foreground">
              Date + time + place → full natal chart (Tropical &amp; Vedic) calculated locally
            </p>
          </div>
        </div>

        {/* Row 1: Date + Bazi hour */}
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
              Birth Hour <span className="text-muted-foreground/50">(0–23, for Bazi Hour Pillar)</span>
            </label>
            <input
              type="number" min="0" max="23"
              value={birthHour}
              onChange={(e) => onHourChange(e.target.value)}
              placeholder="e.g. 14"
              className="w-full rounded-xl border border-input bg-muted/40 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors placeholder:text-muted-foreground/40"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calculator className="h-3.5 w-3.5" />
            Natal chart calculation
          </div>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Row 2: Time + UTC offset */}
        <div className="grid gap-4 sm:grid-cols-2 mb-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Birth Time (HH:MM, 24h)</label>
            <input
              type="time"
              value={birthTime}
              onChange={(e) => onTimeChange(e.target.value)}
              className="w-full rounded-xl border border-input bg-muted/40 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              UTC Offset <span className="text-muted-foreground/50">(e.g. +5.5 for IST, -5 for EST)</span>
            </label>
            <input
              type="number" step="0.5" min="-12" max="14"
              value={utcOffset}
              onChange={(e) => onUtcChange(e.target.value)}
              placeholder="+0"
              className="w-full rounded-xl border border-input bg-muted/40 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors placeholder:text-muted-foreground/40"
            />
          </div>
        </div>

        {/* Row 3: Lat + Lon */}
        <div className="grid gap-4 sm:grid-cols-2 mb-5">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              <MapPin className="h-3 w-3 inline mr-1" />Latitude <span className="text-muted-foreground/50">(+ = North)</span>
            </label>
            <input
              type="number" step="0.0001" min="-90" max="90"
              value={birthLat}
              onChange={(e) => onLatChange(e.target.value)}
              placeholder="e.g. 51.5074"
              className="w-full rounded-xl border border-input bg-muted/40 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors placeholder:text-muted-foreground/40"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              <MapPin className="h-3 w-3 inline mr-1" />Longitude <span className="text-muted-foreground/50">(+ = East)</span>
            </label>
            <input
              type="number" step="0.0001" min="-180" max="180"
              value={birthLon}
              onChange={(e) => onLonChange(e.target.value)}
              placeholder="e.g. -0.1278"
              className="w-full rounded-xl border border-input bg-muted/40 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors placeholder:text-muted-foreground/40"
            />
          </div>
        </div>

        {/* Calculate button */}
        <button
          onClick={onCalcChart}
          disabled={!canCalc || calcStatus === "loading"}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm py-2.5 px-4 hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {calcStatus === "loading" ? (
            <><Loader2 className="h-4 w-4 animate-spin" />Calculating…</>
          ) : (
            <><Sparkles className="h-4 w-4" />Calculate Natal Chart</>
          )}
        </button>
        {calcStatus === "error" && (
          <p className="text-xs text-red-500 text-center mt-2">
            Calculation failed. Check your inputs and try again.
          </p>
        )}
        {!canCalc && dob && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            Fill in birth time, latitude, longitude, and UTC offset to calculate
          </p>
        )}
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
  const AXIS_POINTS   = new Set(["Ascendant", "Midheaven", "IC", "DSC"]);
  const LUMINARY_SET  = new Set(["Sun", "Moon", "North Node"]);
  const OUTER_SET     = new Set(["Uranus", "Neptune", "Pluto", "Chiron"]);

  type Tier = "axis" | "luminary" | "personal" | "outer" | "node";
  function tier(planet: string): Tier {
    if (AXIS_POINTS.has(planet))  return "axis";
    if (LUMINARY_SET.has(planet)) return "luminary";
    if (OUTER_SET.has(planet))    return "outer";
    if (["Mercury","Venus","Mars","Jupiter","Saturn"].includes(planet)) return "personal";
    return "node";
  }

  const TIER_CARD: Record<Tier, string> = {
    axis:     "border-amber-300/60 dark:border-amber-700/40 bg-amber-50/80 dark:bg-amber-950/25",
    luminary: "border-sky-300/60 dark:border-sky-700/40 bg-sky-50/80 dark:bg-sky-950/25",
    personal: "border-blue-100 dark:border-blue-900/30 bg-blue-50/60 dark:bg-blue-950/20",
    outer:    "border-slate-200 dark:border-slate-800/40 bg-slate-50/60 dark:bg-slate-950/20",
    node:     "border-blue-100 dark:border-blue-900/30 bg-blue-50/40 dark:bg-blue-950/15",
  };
  const TIER_LABEL: Record<Tier, string> = {
    axis:     "text-amber-600 dark:text-amber-400",
    luminary: "text-sky-600 dark:text-sky-400",
    personal: "text-blue-600 dark:text-blue-400",
    outer:    "text-slate-500 dark:text-slate-400",
    node:     "text-blue-500 dark:text-blue-400",
  };

  const shown = chart.placements;
  const asc = shown.find(p => p.planet === "Ascendant");
  const dsc = shown.find(p => p.planet === "DSC");
  const mc  = shown.find(p => p.planet === "Midheaven");
  const ic  = shown.find(p => p.planet === "IC");
  const northNode = shown.find(p => p.planet === "North Node");
  const purposeParagraph = northNode ? NORTH_NODE_PURPOSE[northNode.sign] : null;

  const bodyPlanets = shown.filter(p => !AXIS_POINTS.has(p.planet));

  const AxisCell = ({ p, label }: { p: typeof asc; label: string }) => {
    if (!p) return null;
    return (
      <div className="flex-1 rounded-xl border border-amber-300/60 dark:border-amber-700/40 bg-amber-50/80 dark:bg-amber-950/25 p-3 text-center">
        <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">{label}</p>
        {p.degree != null && (
          <p className="font-semibold text-sm mt-0.5">{formatDegree(p.degree)} {p.sign}</p>
        )}
        {p.house != null && <p className="text-xs text-muted-foreground">House {p.house}</p>}
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-blue-200/60 dark:border-blue-900/40 bg-card card-shadow overflow-hidden">
      <div className="p-5 border-b border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-950/20">
        <div className="flex items-center gap-2">
          <Sun className="h-5 w-5 text-blue-500" />
          <p className="text-sm font-semibold">Tropical — Natal Positions</p>
        </div>
      </div>
      <div className="p-5 space-y-5">
        {shown.length === 0 ? (
          <p className="text-sm text-center text-muted-foreground py-4">
            No Tropical data detected — paste your Western chart in the panel above.
          </p>
        ) : (
          <>
            {/* Axis pairs: ASC/DSC and MC/IC */}
            {(asc || dsc || mc || ic) && (
              <div className="space-y-2">
                <p className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Angles & Axes</p>
                {(asc || dsc) && (
                  <div className="flex items-center gap-2">
                    <AxisCell p={asc} label="ASC" />
                    {asc && dsc && (
                      <div className="flex flex-col items-center gap-0.5 shrink-0">
                        <div className="w-6 h-px bg-amber-300/60 dark:bg-amber-600/40" />
                        <p className="text-[8px] text-amber-500/60">axis</p>
                        <div className="w-6 h-px bg-amber-300/60 dark:bg-amber-600/40" />
                      </div>
                    )}
                    <AxisCell p={dsc} label="DSC" />
                  </div>
                )}
                {(mc || ic) && (
                  <div className="flex items-center gap-2">
                    <AxisCell p={mc} label="MC" />
                    {mc && ic && (
                      <div className="flex flex-col items-center gap-0.5 shrink-0">
                        <div className="w-6 h-px bg-amber-300/60 dark:bg-amber-600/40" />
                        <p className="text-[8px] text-amber-500/60">axis</p>
                        <div className="w-6 h-px bg-amber-300/60 dark:bg-amber-600/40" />
                      </div>
                    )}
                    <AxisCell p={ic} label="IC" />
                  </div>
                )}
              </div>
            )}

            {/* Soul direction from North Node */}
            {purposeParagraph && (
              <div className="rounded-xl border border-amber-200/60 dark:border-amber-800/30 bg-amber-50/40 dark:bg-amber-950/20 p-4">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-1.5">
                  Soul&apos;s Direction — North Node in {northNode!.sign}
                </p>
                <p className="text-sm text-foreground leading-relaxed">{purposeParagraph}</p>
              </div>
            )}

            {/* All body planets grouped by tier */}
            {bodyPlanets.length > 0 && (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {bodyPlanets.map((p) => {
                  const t = tier(p.planet);
                  return (
                    <div key={p.planet} className={`rounded-xl border p-3 ${TIER_CARD[t]}`}>
                      <div className="flex items-center gap-1 flex-wrap">
                        <p className={`text-xs font-medium ${TIER_LABEL[t]}`}>{p.planet}</p>
                        {(t === "luminary") && (
                          <span className="text-[9px] font-bold px-1 py-0 rounded border border-sky-400/40 text-sky-600 dark:text-sky-400 leading-tight">KEY</span>
                        )}
                      </div>
                      {p.degree != null ? (
                        <p className="font-semibold text-sm mt-0.5">
                          {formatDegree(p.degree)} {p.sign}{p.retrograde ? " ℞" : ""}
                        </p>
                      ) : (
                        <p className="font-semibold text-sm mt-0.5">{p.sign}{p.retrograde ? " ℞" : ""}</p>
                      )}
                      {p.house != null && <p className="text-xs text-muted-foreground">House {p.house}</p>}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function VedicSummary({ chart }: { chart: VedicChart }) {
  const shown = chart.placements;
  const moonP = shown.find(p => p.planet === "Moon");
  const moonNak = moonP?.nakshatra;
  const nakshatraDesc = moonNak ? NAKSHATRA_DESCRIPTIONS[moonNak] : null;

  const lagnaSign = chart.lagna;
  const sunSign   = shown.find(p => p.planet === "Sun")?.sign;
  const moonSign  = moonP?.sign;
  const d1Theme   = lagnaSign ? VEDIC_D1_LAGNA_THEMES[lagnaSign] : null;

  const D9_KEY = ["Ascendant", "Sun", "Moon", "Venus"];
  const d9Planets = shown.filter(p => D9_KEY.includes(p.planet) && p.navamshaSign);
  const d9Asc = shown.find(p => p.planet === "Ascendant")?.navamshaSign;

  const portraitParts: string[] = [];
  if (lagnaSign)  portraitParts.push(`The ${lagnaSign} Lagna sets the outer form of the life.`);
  if (moonNak)    portraitParts.push(`Emotionally the life is coloured by Moon in ${moonNak}${moonSign ? ` (${moonSign})` : ""}.`);
  if (d9Asc)      portraitParts.push(`In the Navamsha, the Ascendant falls in ${d9Asc}, shaping the soul's deeper dharmic unfolding and the quality of intimate partnerships.`);
  const portrait = portraitParts.join(" ");

  return (
    <div className="rounded-2xl border border-purple-200/60 dark:border-purple-900/40 bg-card card-shadow overflow-hidden">
      <div className="p-5 border-b border-purple-100 dark:border-purple-900/30 bg-purple-50/50 dark:bg-purple-950/20">
        <div className="flex items-center gap-2">
          <Moon className="h-5 w-5 text-purple-500" />
          <p className="text-sm font-semibold">Vedic — Sidereal Placements</p>
          {lagnaSign && (
            <Badge variant="outline" className="ml-auto text-xs border-purple-400/40 text-purple-600 dark:text-purple-400">
              Lagna: {lagnaSign}
            </Badge>
          )}
        </div>
      </div>
      <div className="p-5 space-y-5">
        {shown.length === 0 ? (
          <p className="text-sm text-center text-muted-foreground py-4">
            No Vedic data detected — paste your Jyotish / KP chart above.
          </p>
        ) : (
          <>
            {/* Moon Nakshatra — emotional nature */}
            {moonNak && nakshatraDesc && (
              <div className="rounded-xl border border-purple-200/60 dark:border-purple-800/30 bg-purple-50/40 dark:bg-purple-950/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Moon className="h-4 w-4 text-purple-500 shrink-0" />
                  <p className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wide">
                    Moon Nakshatra — {moonNak}{moonP?.pada ? ` · Pada ${moonP.pada}` : ""}
                  </p>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{nakshatraDesc}</p>
              </div>
            )}

            {/* D1 Chart Summary */}
            {d1Theme && (
              <div className="rounded-xl border border-indigo-200/60 dark:border-indigo-800/30 bg-indigo-50/40 dark:bg-indigo-950/20 p-4">
                <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide mb-1.5">
                  D1 Life Themes — Lagna {lagnaSign}{sunSign ? ` · Sun ${sunSign}` : ""}{moonSign ? ` · Moon ${moonSign}` : ""}
                </p>
                <p className="text-sm text-foreground leading-relaxed">{d1Theme}</p>
                {sunSign && moonSign && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Sun in {sunSign} colours core identity, while Moon in {moonSign} shapes the emotional and instinctive mind. These two, filtered through the {lagnaSign} Lagna, define the primary life texture.
                  </p>
                )}
              </div>
            )}

            {/* D9 Navamsha — key planets */}
            {d9Planets.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-widest mb-2">
                  D9 Navamsha — Key Planets
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {d9Planets.map(p => (
                    <div key={`d9-${p.planet}`} className="rounded-xl border border-purple-100 dark:border-purple-900/30 bg-purple-50/40 dark:bg-purple-950/15 p-3">
                      <p className="text-xs font-medium text-purple-600 dark:text-purple-400">{p.planet}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">D1: {p.sign}</p>
                      <p className="font-semibold text-sm mt-0.5">D9: {p.navamshaSign}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All planet placements */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {shown.map((p) => (
                <div key={p.planet} className="rounded-xl border border-purple-100 dark:border-purple-900/30 bg-purple-50/60 dark:bg-purple-950/20 p-3">
                  <p className="text-xs font-medium text-purple-600 dark:text-purple-400">{p.planet}</p>
                  <p className="font-semibold text-sm mt-0.5">{p.sign}{p.retrograde ? " ℞" : ""}</p>
                  {p.nakshatra && <p className="text-xs text-muted-foreground">{p.nakshatra}{p.pada ? ` P${p.pada}` : ""}</p>}
                  {p.degree != null && <p className="text-xs text-muted-foreground">{formatDegree(p.degree)}</p>}
                  {p.house != null && <p className="text-xs text-muted-foreground">House {p.house}</p>}
                </div>
              ))}
            </div>

            {/* Vedic Portrait */}
            {portrait && (
              <div className="rounded-xl border border-purple-200/60 dark:border-purple-800/30 bg-gradient-to-br from-purple-50/60 to-indigo-50/40 dark:from-purple-950/20 dark:to-indigo-950/20 p-4">
                <p className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wide mb-1.5">
                  Vedic Portrait
                </p>
                <p className="text-sm text-foreground leading-relaxed">{portrait}</p>
              </div>
            )}
          </>
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
            <TableRow style={{ background: "#E8EAF0" }} className="dark:bg-[#1a1c2e]">
              <TableHead className="w-[160px] pl-6" style={{ color: "#3B3F8C", fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11, letterSpacing: "1px", textTransform: "uppercase", fontWeight: 700, borderBottom: "2px solid #3B3F8C" }}>Theme</TableHead>
              <TableHead style={{ color: "#3B3F8C", fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11, letterSpacing: "1px", textTransform: "uppercase", fontWeight: 700, borderBottom: "2px solid #3B3F8C" }}><div className="flex items-center gap-1.5"><Sun className="h-3.5 w-3.5" />Tropical</div></TableHead>
              <TableHead style={{ color: "#3B3F8C", fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11, letterSpacing: "1px", textTransform: "uppercase", fontWeight: 700, borderBottom: "2px solid #3B3F8C" }}><div className="flex items-center gap-1.5"><Moon className="h-3.5 w-3.5" />Vedic</div></TableHead>
              <TableHead style={{ color: "#3B3F8C", fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11, letterSpacing: "1px", textTransform: "uppercase", fontWeight: 700, borderBottom: "2px solid #3B3F8C" }}><div className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" />Bazi</div></TableHead>
              <TableHead className="pr-6" style={{ color: "#3B3F8C", fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11, letterSpacing: "1px", textTransform: "uppercase", fontWeight: 700, borderBottom: "2px solid #3B3F8C" }}>Keywords</TableHead>
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
  const [birthTime, setBirthTime] = useState("");
  const [birthLat, setBirthLat] = useState("");
  const [birthLon, setBirthLon] = useState("");
  const [utcOffset, setUtcOffset] = useState("");
  const [calcStatus, setCalcStatus] = useState<"idle" | "loading" | "error" | "done">("idle");

  const [tropicalState, setTropicalState] = useState<PanelState>(EMPTY_PANEL);
  const [vedicState, setVedicState] = useState<PanelState>(EMPTY_PANEL);
  const [baziState, setBaziState] = useState<PanelState>(EMPTY_PANEL);

  const [tropical, setTropical] = useState<TropicalChart | null>(null);
  const [vedic, setVedic] = useState<VedicChart | null>(null);
  const [bazi, setBazi] = useState<BaziChart | null>(null);
  const [synthesis, setSynthesis] = useState<SynthesisRow[] | null>(null);

  const hasAnyChartInput =
    tropicalState.text.trim() || vedicState.text.trim() || baziState.text.trim();

  const handleCalcChart = async () => {
    setCalcStatus("loading");
    try {
      const result = await calcNatalCharts({
        date: dob,
        time: birthTime,
        lat: parseFloat(birthLat),
        lon: parseFloat(birthLon),
        utcOffset: parseFloat(utcOffset),
      });
      if (!result) {
        setCalcStatus("error");
        return;
      }
      setTropical(result.tropical);
      setVedic(result.vedic);
      setCalcStatus("done");
    } catch {
      setCalcStatus("error");
    }
  };

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
    setCalcStatus("idle");
  };

  return (
    <div className="min-h-screen bg-background" style={{ backgroundColor: "hsl(var(--page-bg))" }}>
      <Navbar onReset={handleReset} showReset={!!synthesis} />

      {/* Cover — report dark-cover style */}
      <div className="pt-14">
        <div
          style={{ background: "#0D0D12", borderBottom: "3px solid #8C6D3F", position: "relative" }}
          className="px-6 sm:px-16 pt-14 pb-12"
        >
          {/* Gold vertical line */}
          <div style={{ position: "absolute", left: "2.5rem", top: 0, bottom: 0, width: 2, background: "#8C6D3F", opacity: 0.45 }} />

          <p style={{ color: "#8C6D3F", fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 11, letterSpacing: "3px", textTransform: "uppercase", marginBottom: 20, marginLeft: 20 }}>
            Cross-System Astrology Synthesis
          </p>
          <h1 style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontWeight: 800, fontSize: "clamp(40px, 6vw, 72px)", letterSpacing: "2px", textTransform: "uppercase", lineHeight: 1.0, marginLeft: 20, color: "white", marginBottom: 0 }}>
            Celestia
          </h1>
          <div style={{ borderTop: "1px solid #8C6D3F", margin: "20px 0 20px 20px", width: "50%" }} />
          <p style={{ color: "#CCCCCC", fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 13, marginLeft: 20, marginBottom: 6, letterSpacing: "0.3px" }}>
            Paste Tropical · Vedic · Bazi charts and synthesize across all three traditions
          </p>
          <p style={{ color: "#8C6D3F", fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 11, letterSpacing: "0.5px", marginLeft: 20, lineHeight: 2.0 }}>
            Western Tropical &nbsp;·&nbsp; Vedic Jyotish &nbsp;·&nbsp; Chinese Bazi
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 pb-16 space-y-10">

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
          <div className="mb-5">
            <h2 className="section-label flex items-center gap-2">
              <CalendarDays className="h-3.5 w-3.5" />Birth Details &amp; Calculations
            </h2>
          </div>
          <DOBSection
            dob={dob}
            birthHour={birthHour}
            birthTime={birthTime}
            birthLat={birthLat}
            birthLon={birthLon}
            utcOffset={utcOffset}
            onDobChange={setDob}
            onHourChange={setBirthHour}
            onTimeChange={setBirthTime}
            onLatChange={setBirthLat}
            onLonChange={setBirthLon}
            onUtcChange={setUtcOffset}
            onCalcChart={handleCalcChart}
            calcStatus={calcStatus}
          />
        </section>

        {/* Chart paste panels */}
        {!synthesis && (
          <section>
            <div className="flex items-end justify-between mb-5">
              <h2 className="section-label flex items-center gap-2">
                <FileText className="h-3.5 w-3.5" />Paste Chart Data
                <span style={{ fontWeight: 400, letterSpacing: "1px" }}>(optional)</span>
              </h2>
              <span className="text-xs text-muted-foreground hidden sm:block font-sans pb-1">
                Fill one, two, or all three panels
              </span>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <PasteZone
                id="tropical"
                title="Tropical Natal Chart"
                subtitle="AstroSeek · Western · Sun in Aries 15°32' format"
                icon={<Sun className="h-5 w-5" style={{ color: "#3B3F8C" }} />}
                accentClass="dark:bg-[#1a1c2e]"
                borderClass="border-border"
                placeholder={`Sun in Aries 15°32'\nMoon in Cancer 8°\nMercury in Taurus 3°\nAscendant in Scorpio\n…`}
                state={tropicalState}
                onChange={setTropicalState}
              />
              <PasteZone
                id="vedic"
                title="Vedic Placement Report"
                subtitle="Jyotish · AstroSage KP · Sanskrit names OK"
                icon={<Moon className="h-5 w-5" style={{ color: "#1B4D4D" }} />}
                accentClass="dark:bg-[#0d1e1e]"
                borderClass="border-border"
                placeholder={`Lagna: Scorpio\nSun in Pisces, Revati Nakshatra\nMoon in Virgo, Hasta Pada 2\nMars in Capricorn House 3\n…`}
                state={vedicState}
                onChange={setVedicState}
              />
              <PasteZone
                id="bazi"
                title="Chinese Bazi Data"
                subtitle="Four Pillars · inline or columnar · or use DOB above"
                icon={<Globe className="h-5 w-5" style={{ color: "#8C6D3F" }} />}
                accentClass="dark:bg-[#1e1a10]"
                borderClass="border-border"
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

        {/* Ephemeris natal chart results (from Calculate Natal Chart button) */}
        {calcStatus === "done" && tropical && vedic && !synthesis && (
          <section className="space-y-5">
            <div className="text-center space-y-1 pb-2">
              <h2 className="text-xl font-bold">Natal Chart — Calculated Locally</h2>
              <p className="text-sm text-muted-foreground">Swiss Ephemeris (WASM) · Lahiri ayanamsa · Placidus houses · No data sent externally</p>
            </div>
            <TropicalSummary chart={tropical} />
            <VedicSummary chart={vedic} />
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
