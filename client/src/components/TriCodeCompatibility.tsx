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
} from "lucide-react";

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5 text-primary" />
            Tri-Code Compatibility
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Analyze compatibility using Destiny Code (dates), Identity Code
            (Latin names), and Essence Code (Arabic names)
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4" />
                Destiny Code (DC)
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Time and behavior pattern from birth dates
              </p>
            </CardHeader>
            <CardContent>
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
                Identity Code Latin (IC-L)
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Public name signature using Pythagorean mapping
              </p>
            </CardHeader>
            <CardContent>
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
                Essence Code Arabic (EC-A)
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Arabic letter-weight signature using Abjad values
              </p>
            </CardHeader>
            <CardContent>
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
                How each code layer aligns between entities
              </p>
            </CardHeader>
            <CardContent>
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
                How to Read the Tri-Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-200 mb-1">
                    Destiny Code (DC)
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    Measures behavior through time
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                    Best for: timing and trajectory fit
                  </p>
                </div>
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-200 mb-1">
                    Identity Code Latin (IC-L)
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    Public name signature
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                    Best for: branding and social friction
                  </p>
                </div>
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-200 mb-1">
                    Essence Code Arabic (EC-A)
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    Arabic letter-weight signature
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                    Best for: deeper resonance and intensity
                  </p>
                </div>
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-300 mt-4 pt-4 border-t border-blue-200/50 dark:border-blue-800/30">
                If codes differ, it means different layers disagree. That is
                tension to manage, not a calculation error.
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
        </>
      )}
    </div>
  );
}
