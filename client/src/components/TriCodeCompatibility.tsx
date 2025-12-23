import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  computeTriCodeCompatibility,
  getTriCodeGuidance,
  type TriCodeResult,
  type TriCodeEntity,
  type AxisScore,
} from "@/lib/numerology";
import {
  Calculator,
  User,
  Users,
  MapPin,
  Info,
  Zap,
  TrendingUp,
  Languages,
  Hash,
  Download,
  Copy,
  Check,
} from "lucide-react";
import { format } from "date-fns";

interface TriCodeCompatibilityProps {
  personA?: { name: string; dob: Date };
}

export function TriCodeCompatibility({ personA }: TriCodeCompatibilityProps) {
  const [entityBType, setEntityBType] = useState<"person" | "place">("person");
  const [entityBNameLatin, setEntityBNameLatin] = useState("");
  const [entityBNameArabic, setEntityBNameArabic] = useState("");
  const [entityBDob, setEntityBDob] = useState("");
  const [entityAArabicName, setEntityAArabicName] = useState("");
  const [abjadMode, setAbjadMode] = useState<"reduced" | "modular">("modular");
  const [result, setResult] = useState<TriCodeResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCalculate = () => {
    if (!personA) return;

    const entityA: TriCodeEntity = {
      nameLatin: personA.name,
      nameArabic: entityAArabicName || undefined,
      birthDate: personA.dob,
    };

    const entityB: TriCodeEntity = {
      nameLatin: entityBNameLatin || undefined,
      nameArabic: entityBNameArabic || undefined,
      isPlace: entityBType === "place",
      ...(entityBType === "person" && entityBDob
        ? { birthDate: new Date(entityBDob) }
        : {}),
      ...(entityBType === "place" && entityBDob
        ? { anchorDate: new Date(entityBDob) }
        : {}),
    };

    const triCodeResult = computeTriCodeCompatibility(entityA, entityB, {
      abjadMode,
    });
    setResult(triCodeResult);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-blue-500";
    if (score >= 40) return "text-amber-500";
    return "text-red-500";
  };

  const getRelationBadgeVariant = (
    type: string
  ): "default" | "secondary" | "outline" | "destructive" => {
    switch (type) {
      case "same":
        return "default";
      case "complementary":
        return "secondary";
      case "neutral":
        return "outline";
      case "friction":
        return "destructive";
      default:
        return "outline";
    }
  };

  const renderAxisTile = (axis: AxisScore | null, label: string) => {
    if (!axis) {
      return (
        <div className="rounded-lg border p-3 opacity-50">
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
          <p className="text-sm text-muted-foreground">Not provided</p>
        </div>
      );
    }

    return (
      <div className="rounded-lg border p-3">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <div className="flex items-center justify-between gap-2">
          <span className="text-lg font-bold">{axis.value}/25</span>
          <Badge variant={getRelationBadgeVariant(axis.type)} className="text-xs">
            {axis.type}
          </Badge>
        </div>
      </div>
    );
  };

  const guidance = result ? getTriCodeGuidance(result) : null;

  const generateReport = () => {
    if (!result || !personA) return "";

    const entityBLabel = entityBType === "place" ? "Place" : "Person B";
    const entityBName = entityBNameLatin || entityBNameArabic || "Unknown";

    let report = `
================================================================================
                        THE UNIVERSAL MATRIX
                      Tri-Code Compatibility Report
================================================================================

Generated: ${format(new Date(), "MMMM d, yyyy 'at' h:mm a")}
Abjad Mode: ${abjadMode === "reduced" ? "Reduced (1-9)" : "Modular (mod-9)"}

================================================================================
                              ENTITIES
================================================================================

ENTITY A (${personA.name})
  Date of Birth: ${format(personA.dob, "MMMM d, yyyy")}
  Arabic Name: ${entityAArabicName || "Not provided"}
  Numerology (Dates): ${result.A.DC ?? "N/A"}
  Gematria Latin (Names): ${result.A.ICL ?? "N/A"}
  Gematria Arabic (Names): ${result.A.ECA ? `${result.A.ECA.sum} (reduced: ${result.A.ECA.reduced}, mod9: ${result.A.ECA.mod9}, ${result.A.ECA.intensity} intensity)` : "N/A"}

ENTITY B (${entityBName}) - ${entityBType === "place" ? "Place" : "Person"}
  ${entityBDob ? `Date: ${format(new Date(entityBDob), "MMMM d, yyyy")}` : "Date: Not provided"}
  Latin Name: ${entityBNameLatin || "Not provided"}
  Arabic Name: ${entityBNameArabic || "Not provided"}
  Numerology (Dates): ${result.B.DC ?? "N/A"}
  Gematria Latin (Names): ${result.B.ICL ?? "N/A"}
  Gematria Arabic (Names): ${result.B.ECA ? `${result.B.ECA.sum} (reduced: ${result.B.ECA.reduced}, mod9: ${result.B.ECA.mod9}, ${result.B.ECA.intensity} intensity)` : "N/A"}

================================================================================
                            OVERALL SCORE
================================================================================

Final Score: ${result.finalScore}/100
Mode: ${result.modeLabel}
Tension Index: ${result.tensionIndex}%
${result.nameDivergence ? `Name Divergence: ${result.nameDivergence}` : ""}

Best Use Cases: ${result.bestUseCases.join(", ")}

================================================================================
                         COMPATIBILITY AXES
================================================================================

`;

    const axisLabels: Record<string, string> = {
      A1_LatinCore: "Gematria Latin Alignment",
      A2_ArabicCore: "Gematria Arabic Alignment",
      A3_Destiny: "Numerology Trajectory",
      A4_LatinAdaptAB: "Latin Adaptation (you→them)",
      A5_LatinAdaptBA: "Latin Adaptation (them→you)",
      A6_ArabicAdaptAB: "Arabic Adaptation (you→them)",
      A7_ArabicAdaptBA: "Arabic Adaptation (them→you)",
    };

    for (const [key, label] of Object.entries(axisLabels)) {
      const axis = result.axes[key as keyof typeof result.axes];
      if (axis) {
        report += `${label}: ${axis.value}/25 (${axis.type})\n`;
      } else {
        report += `${label}: Not provided\n`;
      }
    }

    if (guidance) {
      report += `
================================================================================
                              GUIDANCE
================================================================================

What Works:
${guidance.whatWorks.map((item) => `  - ${item}`).join("\n")}

What Breaks It:
${guidance.whatBreaks.map((item) => `  - ${item}`).join("\n")}

How to Make It Work:
${guidance.howToMakeItWork.map((item) => `  - ${item}`).join("\n")}
`;
    }

    report += `
================================================================================
                            END OF REPORT
================================================================================

Report generated by The Universal Matrix - Tri-Code Module
`;

    return report.trim();
  };

  const handleCopy = async () => {
    const report = generateReport();
    await navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const report = generateReport();
    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const entityBName = entityBNameLatin || entityBNameArabic || "entity";
    a.download = `tricode-${personA?.name.toLowerCase().replace(/\s+/g, "-")}-${entityBName.toLowerCase().replace(/\s+/g, "-")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5 text-primary" />
            Tri-Code Compatibility
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Analyze compatibility using three layers: Numerology (dates), Gematria Latin (names), and Gematria Arabic (names)
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Entity A (You)</span>
              </div>
              {personA ? (
                <div className="space-y-3">
                  <p className="font-medium">{personA.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {personA.dob.toLocaleDateString()}
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="entityAArabic" className="text-xs">
                      Arabic Name (Optional)
                    </Label>
                    <Input
                      id="entityAArabic"
                      placeholder="الاسم بالعربية"
                      value={entityAArabicName}
                      onChange={(e) => setEntityAArabicName(e.target.value)}
                      dir="rtl"
                      data-testid="input-entity-a-arabic"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Generate your report first in the Overview tab
                </p>
              )}
            </div>

            <div className="space-y-4 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {entityBType === "person" ? (
                    <Users className="h-4 w-4 text-pink-500" />
                  ) : (
                    <MapPin className="h-4 w-4 text-blue-500" />
                  )}
                  <span className="text-sm font-medium">
                    Entity B ({entityBType === "person" ? "Person" : "Place"})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="entity-type" className="text-xs">
                    Place
                  </Label>
                  <Switch
                    id="entity-type"
                    checked={entityBType === "place"}
                    onCheckedChange={(checked) =>
                      setEntityBType(checked ? "place" : "person")
                    }
                    data-testid="switch-entity-type"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="entityBLatin" className="text-xs">
                    Name (Latin)
                  </Label>
                  <Input
                    id="entityBLatin"
                    placeholder="Enter name"
                    value={entityBNameLatin}
                    onChange={(e) => setEntityBNameLatin(e.target.value)}
                    data-testid="input-entity-b-latin"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entityBArabic" className="text-xs">
                    Name (Arabic)
                  </Label>
                  <Input
                    id="entityBArabic"
                    placeholder="الاسم بالعربية"
                    value={entityBNameArabic}
                    onChange={(e) => setEntityBNameArabic(e.target.value)}
                    dir="rtl"
                    data-testid="input-entity-b-arabic"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entityBDob" className="text-xs">
                    {entityBType === "person"
                      ? "Date of Birth"
                      : "Anchor Date (Optional)"}
                  </Label>
                  <Input
                    id="entityBDob"
                    type="date"
                    value={entityBDob}
                    onChange={(e) => setEntityBDob(e.target.value)}
                    data-testid="input-entity-b-dob"
                  />
                </div>
              </div>
            </div>
          </div>

          <Card className="border-amber-200/50 bg-amber-50/30 dark:border-amber-900/30 dark:bg-amber-950/20">
            <CardHeader>
              <CardTitle className="text-sm text-amber-900 dark:text-amber-200">Top Legend: What Each System Measures</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-amber-800 dark:text-amber-300 space-y-3">
              <p>This report combines <strong>three independent systems</strong>. Each measures a <strong>different layer</strong>. They are <strong>not supposed to match</strong>.</p>
              <div className="space-y-2 text-xs">
                <div className="flex gap-2">
                  <div className="font-medium min-w-fit">Numerology (Dates):</div>
                  <div>How two lives move together over time — life path & timing</div>
                </div>
                <div className="flex gap-2">
                  <div className="font-medium min-w-fit">Gematria – Latin (Names):</div>
                  <div>Communication, perception, social fit — public identity</div>
                </div>
                <div className="flex gap-2">
                  <div className="font-medium min-w-fit">Gematria – Arabic (Abjad):</div>
                  <div>Depth, intensity, karmic weight — structural essence</div>
                </div>
              </div>
              <p className="text-xs italic border-t border-amber-200/50 dark:border-amber-800/50 pt-2">If results differ, it means <strong>different layers agree or disagree</strong>, not that the calculation is wrong.</p>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Abjad Comparison Mode</p>
              <p className="text-xs text-muted-foreground">
                {abjadMode === "reduced"
                  ? "Reduced: Uses single-digit reduction (1-9)"
                  : "Modular: Uses mod-9 for magnitude awareness"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs">Modular</span>
              <Switch
                checked={abjadMode === "reduced"}
                onCheckedChange={(checked) =>
                  setAbjadMode(checked ? "reduced" : "modular")
                }
                data-testid="switch-abjad-mode"
              />
              <span className="text-xs">Reduced</span>
            </div>
          </div>

          <Button
            onClick={handleCalculate}
            disabled={!personA}
            className="w-full"
            data-testid="button-calculate-tricode"
          >
            <Calculator className="mr-2 h-4 w-4" />
            Compute Tri-Code Compatibility
          </Button>
        </CardContent>
      </Card>

      {result && (
        <>
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                  Tri-Code Score
                </p>
                <p
                  className={`text-6xl font-black ${getScoreColor(result.finalScore)}`}
                  data-testid="text-tricode-score"
                >
                  {result.finalScore}
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge
                  variant={
                    result.modeLabel === "Reinforcement"
                      ? "default"
                      : result.modeLabel === "Avoidance"
                        ? "destructive"
                        : "secondary"
                  }
                  className="text-sm"
                >
                  {result.modeLabel}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  Tension: {result.tensionIndex}%
                </Badge>
                {result.nameDivergence && (
                  <Badge variant="outline" className="text-sm">
                    Name Divergence: {result.nameDivergence}
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {result.bestUseCases.map((useCase) => (
                  <Badge key={useCase} variant="secondary" className="text-xs">
                    {useCase}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200/50 bg-blue-50/30 dark:border-blue-900/30 dark:bg-blue-950/20 mb-6">
            <CardHeader>
              <CardTitle className="text-sm text-blue-900 dark:text-blue-200">How the Tri-Code Score is Calculated</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-blue-800 dark:text-blue-300 space-y-2">
              <p>The final score (0-100) combines seven compatibility axes, each worth up to 25 points:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li><strong>Gematria (Latin):</strong> How your Latin names align</li>
                <li><strong>Gematria (Arabic):</strong> How your Arabic names align</li>
                <li><strong>Numerology:</strong> How your birth dates align</li>
                <li><strong>4 Adaptation Axes:</strong> How each side adapts to the other's signatures</li>
              </ul>
              <p className="mt-2">Higher score = less friction. Lower score = more effort needed. Scores do not judge outcomes—they measure ease vs. effort.</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200/50 bg-purple-50/30 dark:border-purple-900/30 dark:bg-purple-950/20 mb-6">
            <CardHeader>
              <CardTitle className="text-sm text-purple-900 dark:text-purple-200">What the Mode Labels Mean</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-purple-800 dark:text-purple-300 space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-xs">Reinforcement</Badge>
                  </div>
                  <p className="text-xs">All three layers (dates, Latin names, Arabic names) align strongly. This is a naturally harmonious connection requiring minimal effort.</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">Growth</Badge>
                  </div>
                  <p className="text-xs">Different layers create productive tension. The relationship pushes both parties to evolve and improve.</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">Extraction</Badge>
                  </div>
                  <p className="text-xs">One party draws more benefit from the connection. Check which direction the energy flows.</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">Avoidance</Badge>
                  </div>
                  <p className="text-xs">Layers conflict significantly. High effort required to maintain harmony. Not impossible, but demanding.</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">Mixed</Badge>
                  </div>
                  <p className="text-xs">Some layers align, others conflict. Context-dependent success — works well in some areas, requires effort in others.</p>
                </div>
              </div>
              <div className="border-t border-purple-200/50 dark:border-purple-800/50 pt-3 mt-3">
                <p className="text-xs"><strong>Tension Index:</strong> Measures how much the three layers disagree with each other. Low tension (0-30%) = consistent. High tension (70%+) = internal conflict between layers.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4" />
                Numerology: Birth Dates
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Measures how {personA?.name} and {entityBNameLatin || "the other entity"} behave over time
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted/30 p-3 text-xs space-y-2 mb-4 border-l-2 border-primary">
                <p><strong>What it means:</strong> Numerology shows life direction, rhythm, pace, day-to-day compatibility, and long-term sustainability.</p>
                <p><strong>How it's calculated:</strong> All digits of birth dates are added and reduced to a single digit (master numbers 11, 22, 33 preserved).</p>
                <p><strong>What it affects:</strong> Same or compatible numbers = smoother flow. Conflicting numbers = friction in priorities or pace.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-xs text-muted-foreground mb-1">
                    Entity A
                  </p>
                  {result.A.DC !== null ? (
                    <p className="text-3xl font-bold">{result.A.DC}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Not provided
                    </p>
                  )}
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-xs text-muted-foreground mb-1">
                    Entity B
                  </p>
                  {result.B.DC !== null ? (
                    <p className="text-3xl font-bold">{result.B.DC}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Not provided
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Languages className="h-4 w-4" />
                Gematria Latin: Letter Values
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Public identity and communication for {personA?.name} and {entityBNameLatin || "the other entity"}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted/30 p-3 text-xs space-y-2 mb-4 border-l-2 border-primary">
                <p><strong>What it means:</strong> Gematria (Latin) reflects how a name is perceived, communication style, branding, and social compatibility. This layer explains <strong>first impressions and interaction tone</strong>.</p>
                <p><strong>How it's calculated:</strong> Each Latin letter converts using Pythagorean mapping (A=1... Z=26), then values are summed and reduced.</p>
                <p><strong>What it affects:</strong> Strong alignment = easy communication and social flow. Weak alignment = misunderstandings or effort required.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-xs text-muted-foreground mb-1">
                    Entity A
                  </p>
                  {result.A.ICL !== null ? (
                    <p className="text-3xl font-bold">{result.A.ICL}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Not provided
                    </p>
                  )}
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-xs text-muted-foreground mb-1">
                    Entity B
                  </p>
                  {result.B.ICL !== null ? (
                    <p className="text-3xl font-bold">{result.B.ICL}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Not provided
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Hash className="h-4 w-4" />
                Gematria Arabic: Abjad Values
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Structural essence and intensity for {personA?.name} and {entityBNameArabic || "the other entity"}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted/30 p-3 text-xs space-y-2 mb-4 border-l-2 border-primary">
                <p><strong>What it means:</strong> Abjad measures the <strong>deepest layer</strong>—intensity of connection, depth of resonance, why something feels "heavy" or important, and structural/karmic pressure.</p>
                <p><strong>How it's calculated:</strong> Arabic letters are normalized, mapped using classical Abjad values (1–1000), with full number as primary and reduced value for comparison.</p>
                <p><strong>What it affects:</strong> High values = high intensity (not good/bad). Mismatch here = deep adaptation required. Alignment = powerful, stable resonance.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-xs text-muted-foreground mb-1">
                      Entity A
                    </p>
                    {result.A.ECA ? (
                      <>
                        <p className="text-3xl font-bold">{result.A.ECA.sum}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            Reduced: {result.A.ECA.reduced}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Mod9: {result.A.ECA.mod9}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {result.A.ECA.intensity} Intensity
                          </Badge>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Not provided
                      </p>
                    )}
                  </div>
                  {result.A.ECA && result.A.ECA.breakdown.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {result.A.ECA.breakdown.slice(0, 20).map((item, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-xs font-mono"
                        >
                          {item.letter}({item.value})
                        </Badge>
                      ))}
                      {result.A.ECA.breakdown.length > 20 && (
                        <Badge variant="outline" className="text-xs">
                          +{result.A.ECA.breakdown.length - 20} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-xs text-muted-foreground mb-1">
                      Entity B
                    </p>
                    {result.B.ECA ? (
                      <>
                        <p className="text-3xl font-bold">{result.B.ECA.sum}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            Reduced: {result.B.ECA.reduced}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Mod9: {result.B.ECA.mod9}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {result.B.ECA.intensity} Intensity
                          </Badge>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Not provided
                      </p>
                    )}
                  </div>
                  {result.B.ECA && result.B.ECA.breakdown.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {result.B.ECA.breakdown.slice(0, 20).map((item, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-xs font-mono"
                        >
                          {item.letter}({item.value})
                        </Badge>
                      ))}
                      {result.B.ECA.breakdown.length > 20 && (
                        <Badge variant="outline" className="text-xs">
                          +{result.B.ECA.breakdown.length - 20} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Zap className="h-4 w-4" />
                Compatibility Matrix
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Seven axes showing how all layers interact
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted/30 p-3 text-xs space-y-2 mb-4 border-l-2 border-primary">
                <p><strong>What these axes measure:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Gematria Latin Alignment:</strong> Public identity match</li>
                  <li><strong>Gematria Arabic Alignment:</strong> Spiritual intensity match</li>
                  <li><strong>Numerology Trajectory:</strong> Life path and timing alignment</li>
                  <li><strong>Latin Adaptation (both):</strong> How each adapts to the other's communication style</li>
                  <li><strong>Arabic Adaptation (both):</strong> How each adapts to the other's intensity/essence</li>
                </ul>
              </div>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                {renderAxisTile(result.axes.A1_LatinCore, "Latin Core")}
                {renderAxisTile(result.axes.A2_ArabicCore, "Arabic Core")}
                {renderAxisTile(result.axes.A3_Destiny, "Trajectory")}
                {renderAxisTile(
                  result.axes.A4_LatinAdaptAB,
                  "Latin Adapt A→B"
                )}
                {renderAxisTile(
                  result.axes.A5_LatinAdaptBA,
                  "Latin Adapt B→A"
                )}
                {renderAxisTile(
                  result.axes.A6_ArabicAdaptAB,
                  "Arabic Adapt A→B"
                )}
                {renderAxisTile(
                  result.axes.A7_ArabicAdaptBA,
                  "Arabic Adapt B→A"
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200/50 bg-blue-50/30 dark:border-blue-900/30 dark:bg-blue-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-blue-900 dark:text-blue-200">
                <Info className="h-4 w-4" />
                Understanding the Three Code Layers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-200 mb-1">
                    Numerology (Dates)
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    Birth dates reveal temporal and behavioral patterns
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                    Best for: life timing, destiny alignment
                  </p>
                </div>
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-200 mb-1">
                    Gematria Latin (Names)
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    Public name reveals social and professional identity
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                    Best for: compatibility in public/social spheres
                  </p>
                </div>
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-200 mb-1">
                    Gematria Arabic (Names)
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    Spiritual/essence name reveals deeper soul resonance
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                    Best for: intimate compatibility, soul-level connection
                  </p>
                </div>
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-300 mt-4 pt-4 border-t border-blue-200/50 dark:border-blue-800/30">
                <strong>Multi-layer insight:</strong> If all three codes align, you have rare harmony across time, society, and spirit. Differences show where friction or growth opportunities exist.
              </p>
            </CardContent>
          </Card>

          {guidance && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Guidance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
                      What Works
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {guidance.whatWorks.map((item) => (
                        <Badge
                          key={item}
                          variant="outline"
                          className="text-xs border-green-200 text-green-700 dark:border-green-800 dark:text-green-300"
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">
                      What Breaks It
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {guidance.whatBreaks.map((item) => (
                        <Badge
                          key={item}
                          variant="outline"
                          className="text-xs border-red-200 text-red-700 dark:border-red-800 dark:text-red-300"
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
                      How to Make It Work
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {guidance.howToMakeItWork.map((item) => (
                        <Badge
                          key={item}
                          variant="outline"
                          className="text-xs border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300"
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Download className="h-4 w-4" />
                Export Tri-Code Report
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Save or copy your Tri-Code compatibility analysis
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 flex-wrap">
                <Button onClick={handleCopy} variant="outline" data-testid="button-tricode-copy">
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy to Clipboard
                    </>
                  )}
                </Button>
                <Button onClick={handleDownload} data-testid="button-tricode-download">
                  <Download className="mr-2 h-4 w-4" />
                  Download TXT
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
