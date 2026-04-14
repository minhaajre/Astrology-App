import { useState, useRef, useCallback, DragEvent, ChangeEvent } from "react";
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
} from "lucide-react";
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

// ── Types ─────────────────────────────────────────────────────────────────────

interface UploadedFile {
  name: string;
  type: "image" | "pdf" | "text";
  dataUrl?: string; // for images
  text?: string;    // extracted text for pdfs/txt
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
    // Try to read PDF as binary and extract raw text
    const text = await readFileAsText(file);
    // Strip binary noise, keep printable ASCII runs >= 4 chars
    const clean = text
      .replace(/[^\x20-\x7E\n\r\t]/g, " ")
      .replace(/\s{3,}/g, "\n")
      .trim();
    return { name: file.name, type: "pdf", text: clean };
  }
  // Plain text / CSV / other
  const text = await readFileAsText(file);
  return { name: file.name, type: "text", text };
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

  // Handle Ctrl+V / Cmd+V image paste directly into the textarea
  const handlePaste = useCallback(
    async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const items = Array.from(e.clipboardData.items);
      const imageItems = items.filter((item) => item.type.startsWith("image/"));
      if (imageItems.length === 0) return; // let normal text paste proceed
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
    <Card className={`border ${borderClass} bg-card/50 backdrop-blur-sm`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accentClass}`}>
            {icon}
          </div>
          <div>
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Textarea — accepts pasted text AND clipboard images (Ctrl/Cmd+V) */}
        <textarea
          id={id}
          value={state.text}
          onChange={(e) => onChange({ ...state, text: e.target.value })}
          onPaste={handlePaste}
          placeholder={placeholder}
          className={`
            w-full min-h-[160px] rounded-lg border bg-muted/30 p-3 text-sm
            font-mono resize-y focus:outline-none focus:ring-2 focus:ring-primary/40
            placeholder:text-muted-foreground/50 transition-colors
          `}
        />

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed
            py-4 transition-colors select-none
            ${dragging ? "border-primary bg-primary/10" : "border-muted-foreground/20 hover:border-primary/40 hover:bg-muted/20"}
          `}
        >
          <Upload className="h-5 w-5 text-muted-foreground mb-1" />
          <p className="text-xs text-muted-foreground">
            Drop image / PDF / text — or click to browse
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.txt,.csv"
            className="hidden"
            onChange={handleFileInput}
          />
        </div>

        {/* File previews */}
        {state.files.length > 0 && (
          <div className="space-y-2">
            {state.files.map((f, i) => (
              <div
                key={i}
                className="flex items-start gap-2 rounded-md border bg-muted/20 p-2"
              >
                {f.type === "image" ? (
                  <ImageIcon className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                ) : (
                  <FileText className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{f.name}</p>
                  {f.type === "image" && f.dataUrl && (
                    <img
                      src={f.dataUrl}
                      alt={f.name}
                      className="mt-2 max-h-40 rounded border object-contain"
                    />
                  )}
                  {f.type === "pdf" && f.text && (
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {f.text.slice(0, 120)}…
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Synthesis display ─────────────────────────────────────────────────────────

interface SynthesisProps {
  rows: SynthesisRow[];
  tropical: TropicalChart;
  vedic: VedicChart;
  bazi: BaziChart;
}

function SignBadge({ text }: { text: string }) {
  if (text === "—") return <span className="text-muted-foreground text-sm">—</span>;
  return (
    <span className="inline-flex items-center gap-1 text-sm">
      {text}
    </span>
  );
}

function ElementalProfile({ bazi }: { bazi: BaziChart }) {
  const pillars = [bazi.yearPillar, bazi.monthPillar, bazi.dayPillar, bazi.hourPillar].filter(Boolean);

  return (
    <Card className="border-amber-500/20 bg-amber-500/5">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-amber-500" />
          <CardTitle className="text-sm font-semibold">Bazi — Four Pillars</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {pillars.length === 0 ? (
          <p className="text-sm text-center text-muted-foreground py-4">
            No Bazi data detected — paste your Four Pillars chart in the panel above.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {pillars.map((p) => (
                <div
                  key={p!.label}
                  className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-center"
                >
                  <p className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                    {p!.label}
                  </p>
                  <p className="mt-1 text-base font-bold">{p!.stem}</p>
                  <p className="text-sm text-muted-foreground">{p!.branch}</p>
                  {p!.animal && (
                    <Badge variant="outline" className="mt-1 text-xs border-amber-500/30">
                      {p!.animal}
                    </Badge>
                  )}
                  {p!.element && (
                    <p className="mt-1 text-xs text-amber-600/70 dark:text-amber-400/70">
                      {p!.element}
                    </p>
                  )}
                </div>
              ))}
            </div>
            {bazi.dayMaster && (
              <p className="mt-3 text-sm text-center text-muted-foreground">
                Day Master: <span className="font-semibold text-foreground">{bazi.dayMaster}</span>
              </p>
            )}
            {bazi.dominantElement && (
              <p className="text-xs text-center text-muted-foreground">
                Dominant element: <span className="font-medium">{bazi.dominantElement}</span>
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function TropicalSummary({ chart }: { chart: TropicalChart }) {
  const corePlanets = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Ascendant"];
  const shown = chart.placements.filter((p) => corePlanets.includes(p.planet));

  return (
    <Card className="border-blue-500/20 bg-blue-500/5">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Sun className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-sm font-semibold">Tropical — Natal Positions</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {shown.length === 0 ? (
          <p className="text-sm text-center text-muted-foreground py-4">
            No Tropical data detected — paste your Western/Tropical chart in the panel above.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {shown.map((p) => (
              <div
                key={p.planet}
                className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-3"
              >
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400">{p.planet}</p>
                <p className="font-semibold text-sm">{p.sign}{p.retrograde ? " ℞" : ""}</p>
                {p.degree != null && (
                  <p className="text-xs text-muted-foreground">{p.degree.toFixed(1)}°</p>
                )}
                {p.house != null && (
                  <p className="text-xs text-muted-foreground">House {p.house}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function VedicSummary({ chart }: { chart: VedicChart }) {
  const corePlanets = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Ascendant"];
  const shown = chart.placements.filter((p) => corePlanets.includes(p.planet));

  return (
    <Card className="border-purple-500/20 bg-purple-500/5">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Moon className="h-5 w-5 text-purple-500" />
          <CardTitle className="text-sm font-semibold">Vedic — Sidereal Placements</CardTitle>
          {chart.lagna && (
            <Badge variant="outline" className="ml-auto text-xs border-purple-500/30">
              Lagna: {chart.lagna}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {shown.length === 0 ? (
          <p className="text-sm text-center text-muted-foreground py-4">
            No Vedic data detected — paste your Jyotish/KP chart in the panel above.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {shown.map((p) => (
              <div
                key={p.planet}
                className="rounded-lg border border-purple-500/20 bg-purple-500/10 p-3"
              >
                <p className="text-xs font-medium text-purple-600 dark:text-purple-400">{p.planet}</p>
                <p className="font-semibold text-sm">{p.sign}</p>
                {p.nakshatra && (
                  <p className="text-xs text-muted-foreground">{p.nakshatra}{p.pada ? ` P${p.pada}` : ""}</p>
                )}
                {p.house != null && (
                  <p className="text-xs text-muted-foreground">House {p.house}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SynthesisTable({ rows }: { rows: SynthesisRow[] }) {
  const hasData = rows.some(
    (r) => r.tropical !== "—" || r.vedic !== "—" || r.bazi !== "—"
  );
  if (!hasData) return null;

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle className="text-sm font-semibold">Cross-System Synthesis</CardTitle>
        </div>
        <p className="text-xs text-muted-foreground">
          Each row maps the same life theme across all three traditions.
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px] pl-6">Theme</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1.5">
                    <Sun className="h-3.5 w-3.5 text-blue-500" />
                    Tropical
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1.5">
                    <Moon className="h-3.5 w-3.5 text-purple-500" />
                    Vedic
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-amber-500" />
                    Bazi
                  </div>
                </TableHead>
                <TableHead className="pr-6">Keywords</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.theme}>
                  <TableCell className="pl-6 font-medium text-sm">{row.theme}</TableCell>
                  <TableCell>
                    <SignBadge text={row.tropical} />
                  </TableCell>
                  <TableCell>
                    <SignBadge text={row.vedic} />
                  </TableCell>
                  <TableCell className="text-sm">{row.bazi}</TableCell>
                  <TableCell className="pr-6">
                    <div className="flex flex-wrap gap-1">
                      {row.keywords.map((kw) => (
                        <Badge
                          key={kw}
                          variant="secondary"
                          className="text-xs px-1.5 py-0"
                        >
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

const EMPTY_PANEL: PanelState = { text: "", files: [] };

export default function Home() {
  const [tropicalState, setTropicalState] = useState<PanelState>(EMPTY_PANEL);
  const [vedicState, setVedicState] = useState<PanelState>(EMPTY_PANEL);
  const [baziState, setBaziState] = useState<PanelState>(EMPTY_PANEL);

  const [tropical, setTropical] = useState<TropicalChart | null>(null);
  const [vedic, setVedic] = useState<VedicChart | null>(null);
  const [bazi, setBazi] = useState<BaziChart | null>(null);
  const [synthesis, setSynthesis] = useState<SynthesisRow[] | null>(null);

  const hasAnyInput =
    tropicalState.text.trim() ||
    vedicState.text.trim() ||
    baziState.text.trim();

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <Star className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">Astro Synthesis</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Tropical · Vedic · Chinese Bazi
              </p>
            </div>
          </div>
          {synthesis && (
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <X className="h-4 w-4 mr-1" /> Reset
            </Button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        {/* Input section */}
        {!synthesis && (
          <>
            <div className="text-center space-y-2 pb-2">
              <h2 className="text-2xl font-bold">Paste Your Chart Data</h2>
              <p className="text-muted-foreground text-sm max-w-xl mx-auto">
                Paste text directly, or drop an image / PDF into each box. You can fill
                one, two, or all three — the synthesis adapts to what's available.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              <PasteZone
                id="tropical"
                title="Tropical Natal Chart"
                subtitle="Copy from AstroSeek or any western chart"
                icon={<Sun className="h-5 w-5 text-blue-500" />}
                accentClass="bg-blue-500/10"
                borderClass="border-blue-500/20"
                placeholder={`Paste planet positions here, e.g.\n\nSun in Aries 15°32'\nMoon in Cancer 8°\nMercury in Taurus 3°\nAscendant in Scorpio\n…`}
                state={tropicalState}
                onChange={setTropicalState}
              />
              <PasteZone
                id="vedic"
                title="Vedic Placement Report"
                subtitle="Paste Jyotish chart text, PDF or image"
                icon={<Moon className="h-5 w-5 text-purple-500" />}
                accentClass="bg-purple-500/10"
                borderClass="border-purple-500/20"
                placeholder={`Paste Vedic positions here, e.g.\n\nLagna: Scorpio\nSun in Pisces, Revati Nakshatra\nMoon in Virgo, Hasta Pada 2\nMars in Capricorn House 3\n…`}
                state={vedicState}
                onChange={setVedicState}
              />
              <PasteZone
                id="bazi"
                title="Chinese Bazi Data"
                subtitle="Four Pillars — text, image or PDF"
                icon={<Globe className="h-5 w-5 text-amber-500" />}
                accentClass="bg-amber-500/10"
                borderClass="border-amber-500/20"
                placeholder={`Paste Bazi data here, e.g.\n\nYear Pillar: Jia Zi (Wood Rat)\nMonth Pillar: Bing Yin (Fire Tiger)\nDay Pillar: Ren Wu (Water Horse)\nHour Pillar: Gui Hai (Water Pig)\nDay Master: Yang Water\n…`}
                state={baziState}
                onChange={setBaziState}
              />
            </div>

            <div className="flex justify-center pt-2">
              <Button
                size="lg"
                disabled={!hasAnyInput}
                onClick={handleSynthesize}
                className="px-10"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Synthesize Chart Data
              </Button>
            </div>
          </>
        )}

        {/* Results */}
        {synthesis && tropical && vedic && bazi && (
          <div className="space-y-5">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-bold">Chart Synthesis</h2>
              <p className="text-sm text-muted-foreground">
                Parsed locally · no data sent externally
              </p>
            </div>

            <TropicalSummary chart={tropical} />
            <VedicSummary chart={vedic} />
            <ElementalProfile bazi={bazi} />

            <SynthesisTable rows={synthesis} />

            {/* Raw parse notice */}
            {tropical.placements.length === 0 &&
              vedic.placements.length === 0 &&
              !bazi.yearPillar && (
                <Card className="border-yellow-500/30 bg-yellow-500/5">
                  <CardContent className="p-4 text-sm text-yellow-600 dark:text-yellow-400">
                    <strong>No structured data detected.</strong> The parser looks for patterns
                    like "Sun in Aries", "Moon: Cancer 8°", or "Year Pillar: Jia Zi". Try
                    pasting more structured text, or check that your data includes planet names
                    and sign names.
                  </CardContent>
                </Card>
              )}

            <div className="flex justify-center pt-2">
              <Button variant="outline" onClick={handleReset}>
                <X className="h-4 w-4 mr-2" /> Start Over
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
