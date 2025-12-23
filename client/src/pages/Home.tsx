import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputForm } from "@/components/InputForm";
import { MetricTile } from "@/components/MetricTile";
import { NumberAccordion } from "@/components/NumberAccordion";
import { DailyForecast } from "@/components/DailyForecast";
import { TimingAdvisor } from "@/components/TimingAdvisor";
import { ZodiacDisplay } from "@/components/ZodiacDisplay";
import { CompatibilityCalculator } from "@/components/CompatibilityCalculator";
import { CountryCompatibility } from "@/components/CountryCompatibility";
import { ExportPanel } from "@/components/ExportPanel";
import { NameNumerology } from "@/components/NameNumerology";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getLifePath,
  getDayNumber,
  getMonthNumber,
  getVietnamAnimal,
  getPersonalYear,
  getPersonalMonth,
  getPersonalDay,
  getUniversalYear,
  numberMeanings,
  getReportTemplate,
} from "@/lib/numerology";
import { 
  Sparkles, 
  Hash, 
  Target, 
  Calendar,
  Heart,
  Clock,
  FileText,
  Star,
  AlertTriangle,
  Lightbulb,
  TrendingUp
} from "lucide-react";

interface PersonData {
  name: string;
  dob: Date;
  lifePath: number;
  dayNumber: number;
  monthNumber: number;
  animal: string;
  universalYear: number;
  personalYear: number;
  personalMonth: number;
  personalDay: number;
}

export default function Home() {
  const [personData, setPersonData] = useState<PersonData | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const handleGenerate = (name: string, dob: Date) => {
    const lp = getLifePath(dob);
    const dayNum = getDayNumber(dob);
    const monthNum = getMonthNumber(dob);
    const animal = getVietnamAnimal(dob.getFullYear());
    const uy = getUniversalYear();
    const py = getPersonalYear(dob);
    const pm = getPersonalMonth(dob);
    const pd = getPersonalDay(dob);

    setPersonData({
      name,
      dob,
      lifePath: lp.lifePath,
      dayNumber: dayNum,
      monthNumber: monthNum,
      animal,
      universalYear: uy,
      personalYear: py,
      personalMonth: pm,
      personalDay: pd,
    });
    setActiveTab("overview");
  };

  const template = personData
    ? getReportTemplate(personData.lifePath, personData.dayNumber, personData.monthNumber)
    : null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">The Universal Matrix</h1>
              <p className="text-xs text-muted-foreground">Numerology Calculator</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="space-y-8">
          <InputForm onGenerate={handleGenerate} />

          {personData ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 h-auto gap-1 bg-muted/50 p-1">
                <TabsTrigger value="overview" className="gap-2" data-testid="tab-overview">
                  <Hash className="h-4 w-4" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="numerology" className="gap-2" data-testid="tab-numerology">
                  <Star className="h-4 w-4" />
                  <span className="hidden sm:inline">Numerology</span>
                </TabsTrigger>
                <TabsTrigger value="zodiac" className="gap-2" data-testid="tab-zodiac">
                  <Target className="h-4 w-4" />
                  <span className="hidden sm:inline">Zodiac</span>
                </TabsTrigger>
                <TabsTrigger value="compatibility" className="gap-2" data-testid="tab-compatibility">
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">Compatibility</span>
                </TabsTrigger>
                <TabsTrigger value="timing" className="gap-2" data-testid="tab-timing">
                  <Clock className="h-4 w-4" />
                  <span className="hidden sm:inline">Timing</span>
                </TabsTrigger>
                <TabsTrigger value="export" className="gap-2" data-testid="tab-export">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">
                    Numerology Profile for {personData.name}
                  </h2>
                  <p className="text-muted-foreground">
                    Born {personData.dob.toLocaleDateString("en-US", { 
                      month: "long", 
                      day: "numeric", 
                      year: "numeric" 
                    })}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <MetricTile
                    label="Life Path"
                    value={personData.lifePath}
                    description={numberMeanings[personData.lifePath]?.core}
                    variant="primary"
                    size="lg"
                  />
                  <MetricTile
                    label="Day Number"
                    value={personData.dayNumber}
                    description={numberMeanings[personData.dayNumber]?.core}
                  />
                  <MetricTile
                    label="Month Number"
                    value={personData.monthNumber}
                    description={numberMeanings[personData.monthNumber]?.core}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                  <MetricTile
                    label="Universal Year"
                    value={personData.universalYear}
                    size="sm"
                  />
                  <MetricTile
                    label="Personal Year"
                    value={personData.personalYear}
                    size="sm"
                  />
                  <MetricTile
                    label="Personal Month"
                    value={personData.personalMonth}
                    size="sm"
                  />
                  <MetricTile
                    label="Personal Day"
                    value={personData.personalDay}
                    size="sm"
                    variant="accent"
                  />
                </div>

                <DailyForecast personalDay={personData.personalDay} />

                {template && (
                  <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Your Archetype: {template.name}
                      </CardTitle>
                      <Badge variant="secondary">{template.archetype}</Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="leading-relaxed text-muted-foreground mb-4">
                        {template.summary}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {template.keyInsights.slice(0, 3).map((insight, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {insight.length > 50 ? insight.substring(0, 50) + "..." : insight}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        Key Themes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-sm">
                        <strong>Life Path {personData.lifePath}:</strong>{" "}
                        {numberMeanings[personData.lifePath]?.core}
                      </div>
                      <div className="text-sm">
                        <strong>Day {personData.dayNumber}:</strong>{" "}
                        {numberMeanings[personData.dayNumber]?.core}
                      </div>
                      <div className="text-sm">
                        <strong>Month {personData.monthNumber}:</strong>{" "}
                        {numberMeanings[personData.monthNumber]?.core}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        Watch Out For
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-sm">
                        {numberMeanings[personData.lifePath]?.traps.slice(0, 3).map((trap, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500" />
                            {trap}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Lightbulb className="h-4 w-4 text-blue-500" />
                        Leverage Points
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-sm">
                        {numberMeanings[personData.lifePath]?.strengths.slice(0, 3).map((strength, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Target className="h-4 w-4" />
                      Vietnamese Zodiac
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="text-4xl font-black">{personData.animal}</div>
                      <div className="text-sm text-muted-foreground">
                        <p>Year of the {personData.animal}</p>
                        <p>Birth Year: {personData.dob.getFullYear()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="numerology" className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Number Meanings</h2>
                  <p className="text-muted-foreground">
                    Deep analysis of numbers 1-9 and Master Numbers 11, 22, 33
                  </p>
                </div>

                <NumberAccordion
                  highlightNumbers={[
                    personData.lifePath,
                    personData.dayNumber,
                    personData.monthNumber,
                  ]}
                />

                <div className="mt-8">
                  <NameNumerology initialName={personData.name} />
                </div>

                <CountryCompatibility lifePath={personData.lifePath} />
              </TabsContent>

              <TabsContent value="zodiac" className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Vietnamese Zodiac</h2>
                  <p className="text-muted-foreground">
                    Animal sign compatibility and yearly forecasts
                  </p>
                </div>

                <ZodiacDisplay birthYear={personData.dob.getFullYear()} />
              </TabsContent>

              <TabsContent value="compatibility" className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Compatibility Analysis</h2>
                  <p className="text-muted-foreground">
                    Calculate relationship compatibility with detailed scoring
                  </p>
                </div>

                <CompatibilityCalculator
                  personA={{ name: personData.name, dob: personData.dob }}
                />
              </TabsContent>

              <TabsContent value="timing" className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Timing Advisor</h2>
                  <p className="text-muted-foreground">
                    Optimal days based on your personal cycles
                  </p>
                </div>

                <DailyForecast personalDay={personData.personalDay} />

                <TimingAdvisor dob={personData.dob} />
              </TabsContent>

              <TabsContent value="export" className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Export Report</h2>
                  <p className="text-muted-foreground">
                    Download or copy your complete numerology analysis
                  </p>
                </div>

                <ExportPanel name={personData.name} dob={personData.dob} />
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                <Sparkles className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Discover Your Numbers</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Enter your name and date of birth above to generate your personalized
                numerology report with life path analysis, timing advice, and compatibility insights.
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t py-6 mt-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6 text-center text-sm text-muted-foreground">
          <p>The Universal Matrix - Numerology Calculator</p>
          <p className="mt-1">Ancient wisdom, modern insights</p>
        </div>
      </footer>
    </div>
  );
}
