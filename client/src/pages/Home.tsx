import { useState } from "react";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { InputForm } from "@/components/InputForm";
import { MetricTile } from "@/components/MetricTile";
import { NumberAccordion } from "@/components/NumberAccordion";
import { DailyForecast } from "@/components/DailyForecast";
import { TimePeriodForecasts } from "@/components/TimePeriodForecasts";
import { TimingAdvisor } from "@/components/TimingAdvisor";
import { ZodiacDisplay } from "@/components/ZodiacDisplay";
import { NatalChart } from "@/components/NatalChart";
import { CompatibilityCalculator } from "@/components/CompatibilityCalculator";
import { CountryCompatibility } from "@/components/CountryCompatibility";
import { ExportPanel } from "@/components/ExportPanel";
import { NameNumerology } from "@/components/NameNumerology";
import { DailyEnergyCards } from "@/components/DailyEnergyCards";
import { SpecialDatesInfo } from "@/components/SpecialDatesInfo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { apiRequest } from "@/lib/queryClient";
import { 
  getLifePath, 
  masterNumberLabels, 
  getPersonalYear, 
  getPersonalMonth, 
  getPersonalDay, 
  getLunarPhase, 
  getUniversalYear,
  getMonthlyForecast,
  getYearlyForecast,
  calculateExpressionNumber,
  getVietnamAnimal,
  getDayNumber,
  getMonthNumber,
  getReportTemplate,
  getCurrentYearAnimal,
  getMonthAnimal,
  evaluateCycleStatus,
  getNameNumerology,
  getZodiacSign,
  numberMeanings,
  type NumberStatus,
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
  TrendingUp,
  Info,
  ChevronDown,
  Type,
  BookOpen,
  CheckCircle,
  XCircle,
  MinusCircle,
  Shield
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
  arabicName?: string;
  birthTime?: string;
  birthLocation?: string;
  birthCity?: string;
  latitude?: string;
  longitude?: string;
}

export default function Home() {
  const [personData, setPersonData] = useState<PersonData | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const handleGenerate = async (
    name: string,
    dob: Date,
    arabicName?: string,
    birthTime?: string,
    birthLocation?: string,
    birthCity?: string,
    latitude?: string,
    longitude?: string
  ) => {
    const lp = getLifePath(dob);
    const dayNum = getDayNumber(dob);
    const monthNum = getMonthNumber(dob);
    const animal = getVietnamAnimal(dob.getFullYear());
    const uy = getUniversalYear();
    const py = getPersonalYear(dob);
    const pm = getPersonalMonth(dob);
    const pd = getPersonalDay(dob);
    const zodiac = getZodiacSign(dob);
    const nameNum = getNameNumerology(name);
    const lunarInfo = getLunarPhase(new Date());
    const genTemplate = lp ? getReportTemplate(lp.lifePath, dayNum, monthNum) : null;

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
      arabicName,
      birthTime,
      birthLocation,
      birthCity,
      latitude,
      longitude,
    });
    setActiveTab("overview");

    try {
      const evaluationData: any = {
        name,
        birthDate: dob.toISOString().split("T")[0],
        birthTime,
        birthLocation,
        birthCity,
        latitude,
        longitude,
        lifePath: lp.lifePath,
        zodiacAnimal: animal,
        zodiacSign: zodiac.name,
        expressionNumber: nameNum?.expressionNumber,
        soulUrge: nameNum?.soulUrge,
        personality: nameNum?.personality,
        lifePathLabel: masterNumberLabels[lp.lifePath] || null,
        reportData: JSON.stringify({
          lp,
          animal,
          zodiac,
          nameNum,
          personalYear: py,
          personalMonth: pm,
          personalDay: pd,
          lunarInfo,
          universalYear: uy,
          template: genTemplate,
          timingAdvisor: lp ? { lifePath: lp.lifePath } : null,
          geo: { birthCity, latitude, longitude }
        })
      };

      await apiRequest("POST", "/api/evaluations", evaluationData);
    } catch (error) {
      console.error("Failed to save evaluation:", error);
    }
  };

  const template = personData
    ? getReportTemplate(personData.lifePath, personData.dayNumber, personData.monthNumber)
    : null;

  // Helper for status badge rendering
  const StatusBadge = ({ status, testId }: { status: NumberStatus | 'Good' | 'Neutral' | 'Enemies'; testId?: string }) => {
    if (status === 'Good') {
      return (
        <Badge variant="default" data-testid={testId || "status-good"}>
          <CheckCircle className="h-3 w-3 mr-1" />
          Good
        </Badge>
      );
    }
    if (status === 'Challenging' || status === 'Enemies') {
      return (
        <Badge variant="destructive" data-testid={testId || "status-challenging"}>
          <XCircle className="h-3 w-3 mr-1" />
          Challenging
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" data-testid={testId || "status-neutral"}>
        <MinusCircle className="h-3 w-3 mr-1" />
        Neutral
      </Badge>
    );
  };

  // Current zodiac data
  const currentDate = new Date();
  const currentYearAnimal = getCurrentYearAnimal(currentDate);
  const currentMonthAnimal = getMonthAnimal(currentDate);

  // Name numerology for gematria section
  const nameNumerology = personData ? getNameNumerology(personData.name) : null;

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
          <div className="flex items-center gap-2">
            <Link href="/admin">
              <Button variant="ghost" size="icon" data-testid="button-admin">
                <Shield className="h-4 w-4" />
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="space-y-8">
          <DailyEnergyCards />
          <Collapsible defaultOpen={false}>
            <CollapsibleTrigger className="flex items-center gap-2 w-full py-3 text-left hover-elevate rounded-lg px-4 group" data-testid="button-toggle-dates">
              <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
              <span className="font-medium">Special Dates Energy Guide</span>
              <Badge variant="secondary" className="ml-auto">1-31</Badge>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SpecialDatesInfo />
            </CollapsibleContent>
          </Collapsible>
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

                <div className="bg-muted/30 rounded-xl p-6 border">
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-semibold">Your Numerological Profile</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Your unique Life Path ({personData.lifePath}), Day ({personData.dayNumber}), and Month ({personData.monthNumber}) combination creates a distinctive numerological signature. Explore the Numerology tab for detailed insights into each number's meaning and how they interact in your life.
                  </p>
                  <div className="space-y-2">
                    <p className="font-semibold text-sm">Your Numbers:</p>
                    <ul className="space-y-1">
                      <li className="flex items-center gap-2 text-sm">
                        <span className="text-primary">•</span>
                        <span className="font-medium text-foreground">Life Path {personData.lifePath}:</span>
                        <span className="text-muted-foreground">{numberMeanings[personData.lifePath]?.core}</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <span className="text-primary">•</span>
                        <span className="font-medium text-foreground">Day {personData.dayNumber}:</span>
                        <span className="text-muted-foreground">{numberMeanings[personData.dayNumber]?.core}</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <span className="text-primary">•</span>
                        <span className="font-medium text-foreground">Month {personData.monthNumber}:</span>
                        <span className="text-muted-foreground">{numberMeanings[personData.monthNumber]?.core}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Key Themes & Insights</h3>
                  </div>
                  
                  <div className="grid gap-6 md:grid-cols-3">
                    <Card className="bg-muted/20 border-none shadow-none">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm text-foreground">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          Key Themes
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-xs font-bold text-foreground mb-1">Life Path {personData.lifePath}: {numberMeanings[personData.lifePath]?.core}</p>
                          <p className="text-xs font-bold text-foreground mb-1">Day {personData.dayNumber}: {numberMeanings[personData.dayNumber]?.core}</p>
                          <p className="text-xs font-bold text-foreground">Month {personData.monthNumber}: {numberMeanings[personData.monthNumber]?.core}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/20 border-none shadow-none">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm text-foreground">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          Watch Out For
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {numberMeanings[personData.lifePath]?.traps.slice(0, 3).map((trap, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs">
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                              <span className="text-muted-foreground">{trap}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/20 border-none shadow-none">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm text-foreground">
                          <Lightbulb className="h-4 w-4 text-blue-500" />
                          Leverage Points
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {numberMeanings[personData.lifePath]?.strengths.slice(0, 3).map((strength, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs">
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                              <span className="text-muted-foreground">{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <MetricTile
                    highlight
                    value={personData.lifePath}
                    subtitle="Life Path"
                    icon={Sparkles}
                    testId="metric-lifepath"
                  />
                  <MetricTile
                    value={personData.animal}
                    icon={Target}
                    testId="metric-animal"
                  />
                  <MetricTile
                    value={personData.universalYear}
                    subtitle="Universal Energy"
                    icon={TrendingUp}
                    testId="metric-universal"
                  />
                </div>
                
                {template && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-primary" />
                          {template.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Archetype: <span className="font-medium text-foreground">{template.archetype}</span>
                        </p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-base leading-relaxed text-muted-foreground">
                          {template.summary}
                        </p>
                      </CardContent>
                    </Card>

                    <div className="grid gap-6 md:grid-cols-2">
                      <Card className="border-green-500/20 bg-green-500/5">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                            <Lightbulb className="h-5 w-5" />
                            Key Insights
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {template.keyInsights.map((s: string, i: number) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                                <span className="text-sm">{s}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      {template.advice && (
                        <Card className="border-blue-500/20 bg-blue-500/5">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                              <Target className="h-5 w-5" />
                              Strategic Advice
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {template.advice.map((s: string, i: number) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                                  <span className="text-sm">{s}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      )}

                      {template.compatibility && (
                        <Card className="border-pink-500/20 bg-pink-500/5">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-pink-600 dark:text-pink-400">
                              <Heart className="h-5 w-5" />
                              Relational Dynamics
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm leading-relaxed">
                              {template.compatibility}
                            </p>
                          </CardContent>
                        </Card>
                      )}

                      {template.career && (
                        <Card className="border-amber-500/20 bg-amber-500/5">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                              <Target className="h-5 w-5" />
                              Career Pathing
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm leading-relaxed">
                              {template.career}
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                )}

                <NatalChart 
                  name={personData.name}
                  dob={personData.dob}
                  birthTime={personData.birthTime}
                  birthLocation={personData.birthLocation}
                  birthCity={personData.birthCity}
                  latitude={personData.latitude}
                  longitude={personData.longitude}
                />
              </TabsContent>

              <TabsContent value="numerology" className="animate-in fade-in duration-500 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <MetricTile
                    highlight
                    value={personData.lifePath}
                    subtitle={masterNumberLabels[personData.lifePath] || "Your Number"}
                    icon={Sparkles}
                    testId="numerology-tab-lifepath"
                  />
                  <MetricTile
                    value={personData.dayNumber}
                    subtitle={masterNumberLabels[personData.dayNumber] || "Your Number"}
                    icon={Calendar}
                    testId="numerology-tab-day"
                  />
                  <MetricTile
                    value={personData.monthNumber}
                    subtitle={masterNumberLabels[personData.monthNumber] || "Your Number"}
                    icon={Hash}
                    testId="numerology-tab-month"
                  />
                </div>
                <NumberAccordion highlightNumbers={[personData.lifePath, personData.dayNumber, personData.monthNumber]} />
              </TabsContent>

              <TabsContent value="zodiac" className="animate-in fade-in duration-500">
                <ZodiacDisplay 
                  birthYear={personData.dob.getFullYear()}
                  birthDate={personData.dob}
                />
              </TabsContent>

              <TabsContent value="compatibility" className="animate-in fade-in duration-500">
                <CompatibilityCalculator 
                  personA={{ name: personData.name, dob: personData.dob }}
                />
              </TabsContent>

              <TabsContent value="timing" className="animate-in fade-in duration-500 space-y-6">
                <TimePeriodForecasts 
                  personalYear={personData.personalYear}
                  personalMonth={personData.personalMonth}
                  personalDay={personData.personalDay}
                />
                <TimingAdvisor dob={personData.dob} />
              </TabsContent>

              <TabsContent value="export" className="animate-in fade-in duration-500">
                <ExportPanel 
                  name={personData.name}
                  dob={personData.dob}
                />
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center text-muted-foreground">
                Enter your details above to generate your universal matrix profile.
              </CardContent>
            </Card>
          )}

          <footer className="mt-12 pt-8 border-t border-primary/10 text-center pb-12">
            <Card className="max-w-2xl mx-auto border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3">Ready for a deeper dive?</h3>
                <p className="text-muted-foreground mb-6">
                  While these insights provide a powerful foundation, a personalized consultation can help you navigate your unique cycles with even greater clarity.
                </p>
                <Button asChild size="lg" className="hover-elevate">
                  <a href="https://calendly.com/minhaaj/30min" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Book a Personalized Consultation
                  </a>
                </Button>
              </CardContent>
            </Card>
          </footer>
        </div>
      </main>
    </div>
  );
}
