import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  getLifePath, 
  getDayNumber, 
  getMonthNumber, 
  getVietnamAnimal,
  animalIconNames,
  calculateCompatibility,
  type CompatibilityResult 
} from "@/lib/numerology";
import { Heart, Users, Calculator, User, Hash, MapPin, ChevronDown } from "lucide-react";
import { TriCodeCompatibility } from "./TriCodeCompatibility";
import { CountryCompatibility } from "./CountryCompatibility";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface CompatibilityCalculatorProps {
  personA?: { name: string; dob: Date };
}

export function CompatibilityCalculator({ personA }: CompatibilityCalculatorProps) {
  const [mode, setMode] = useState<"standard" | "tricode" | "country">("standard");
  const [personBName, setPersonBName] = useState("");
  const [personBDob, setPersonBDob] = useState("");
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [personBData, setPersonBData] = useState<{
    lifePath: number;
    dayNumber: number;
    monthNumber: number;
    animal: string;
  } | null>(null);

  const handleCalculate = () => {
    if (!personA || !personBDob) return;

    const dobB = new Date(personBDob);
    
    const dataA = {
      lifePath: getLifePath(personA.dob).lifePath,
      dayNumber: getDayNumber(personA.dob),
      monthNumber: getMonthNumber(personA.dob),
      animal: getVietnamAnimal(personA.dob.getFullYear())
    };

    const dataB = {
      lifePath: getLifePath(dobB).lifePath,
      dayNumber: getDayNumber(dobB),
      monthNumber: getMonthNumber(dobB),
      animal: getVietnamAnimal(dobB.getFullYear())
    };

    setPersonBData(dataB);
    setResult(calculateCompatibility(dataA, dataB));
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return { label: "Excellent", color: "text-green-500" };
    if (score >= 60) return { label: "Good", color: "text-blue-500" };
    if (score >= 40) return { label: "Moderate", color: "text-amber-500" };
    if (score >= 20) return { label: "Challenging", color: "text-orange-500" };
    return { label: "Difficult", color: "text-red-500" };
  };

  return (
    <div className="space-y-6">
      <Tabs value={mode} onValueChange={(v) => setMode(v as "standard" | "tricode" | "country")}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="standard" className="flex items-center gap-2" data-testid="tab-standard-compatibility">
            <Heart className="h-4 w-4" />
            Standard
          </TabsTrigger>
          <TabsTrigger value="tricode" className="flex items-center gap-2" data-testid="tab-tricode-compatibility">
            <Hash className="h-4 w-4" />
            Tri-Code
          </TabsTrigger>
          <TabsTrigger value="country" className="flex items-center gap-2" data-testid="tab-country-compatibility">
            <MapPin className="h-4 w-4" />
            Country
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tricode" className="mt-0">
          <TriCodeCompatibility personA={personA} />
        </TabsContent>

        <TabsContent value="country" className="mt-0">
          <CountryCompatibility personDob={personA?.dob} personName={personA?.name} />
        </TabsContent>

        <TabsContent value="standard" className="mt-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-500" />
                Compatibility Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Person A</span>
                  </div>
                  {personA ? (
                    <div className="space-y-2">
                      <p className="font-medium">{personA.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {personA.dob.toLocaleDateString()}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">LP: {getLifePath(personA.dob).lifePath}</Badge>
                        <Badge variant="secondary">Day: {getDayNumber(personA.dob)}</Badge>
                        <Badge variant="secondary">{animalIconNames[getVietnamAnimal(personA.dob.getFullYear())]} {getVietnamAnimal(personA.dob.getFullYear())}</Badge>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Generate your report first in the Overview tab
                    </p>
                  )}
                </div>

                <div className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-pink-500" />
                    <span className="text-sm font-medium">Person B</span>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="personBName" className="text-xs">Name (Latin)</Label>
                      <Input
                        id="personBName"
                        placeholder="Enter name"
                        value={personBName}
                        onChange={(e) => setPersonBName(e.target.value)}
                        data-testid="input-person-b-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="personBDob" className="text-xs">Date of Birth</Label>
                      <Input
                        id="personBDob"
                        type="date"
                        value={personBDob}
                        onChange={(e) => setPersonBDob(e.target.value)}
                        data-testid="input-person-b-dob"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleCalculate}
                disabled={!personA || !personBDob}
                className="w-full"
                data-testid="button-calculate-compatibility"
              >
                <Calculator className="mr-2 h-4 w-4" />
                Calculate Compatibility
              </Button>
            </CardContent>
          </Card>

          {result && (
            <>
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="p-8 text-center">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                    Compatibility Score
                  </p>
                  <p className={`text-6xl font-black ${getScoreLabel(result.totalScore).color}`} data-testid="text-compatibility-score">
                    {result.totalScore}%
                  </p>
                  <p className={`text-lg font-medium mt-2 ${getScoreLabel(result.totalScore).color}`}>
                    {getScoreLabel(result.totalScore).label}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Calculator className="h-4 w-4" />
                    Compatibility Radar
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Visual breakdown of compatibility across categories
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        data={result.breakdown.map((item) => ({
                          category: item.category.replace(" Match", ""),
                          score: Math.round((item.points / item.maxPoints) * 100),
                          fullMark: 100,
                        }))}
                      >
                        <PolarGrid stroke="hsl(var(--muted-foreground) / 0.3)" />
                        <PolarAngleAxis
                          dataKey="category"
                          tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }}
                        />
                        <PolarRadiusAxis
                          angle={30}
                          domain={[0, 100]}
                          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                        />
                        <Radar
                          name="Compatibility"
                          dataKey="score"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.4}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "6px",
                          }}
                          formatter={(value: number) => [`${value}%`, "Score"]}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Collapsible defaultOpen>
                <Card>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                      <CardTitle className="flex items-center justify-between text-base">
                        <span className="flex items-center gap-2">
                          <Calculator className="h-4 w-4" />
                          Score Breakdown
                        </span>
                        <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                      </CardTitle>
                      <p className="text-sm text-muted-foreground text-left">
                        How your compatibility score was calculated
                      </p>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-4">
                      {result.breakdown.map((item, index) => (
                        <div key={index} className="space-y-2 rounded-lg border p-4">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{item.category}</span>
                            <span className="text-sm font-bold">
                              {item.points}/{item.maxPoints} pts
                            </span>
                          </div>
                          <Progress 
                            value={(item.points / item.maxPoints) * 100} 
                            className="h-2"
                          />
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4">
                              <Badge variant="outline">{String(item.personA)}</Badge>
                              <span className="text-muted-foreground">vs</span>
                              <Badge variant="outline">{String(item.personB)}</Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {item.explanation}
                          </p>
                        </div>
                      ))}

                      <div className="mt-4 rounded-lg bg-muted/50 p-4">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Total Score</span>
                          <span className="text-lg font-bold">
                            {result.breakdown.reduce((sum, b) => sum + b.points, 0)}/
                            {result.breakdown.reduce((sum, b) => sum + b.maxPoints, 0)} pts
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
