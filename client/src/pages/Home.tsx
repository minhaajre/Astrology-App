import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { InputForm } from "@/components/InputForm";
import { MetricTile } from "@/components/MetricTile";
import { NumberAccordion } from "@/components/NumberAccordion";
import { DailyForecast } from "@/components/DailyForecast";
import { TimePeriodForecasts } from "@/components/TimePeriodForecasts";
import { TimingAdvisor } from "@/components/TimingAdvisor";
import { ZodiacDisplay } from "@/components/ZodiacDisplay";
import { CompatibilityCalculator } from "@/components/CompatibilityCalculator";
import { CountryCompatibility } from "@/components/CountryCompatibility";
import { ExportPanel } from "@/components/ExportPanel";
import { NameNumerology } from "@/components/NameNumerology";
import { DailyEnergyCards } from "@/components/DailyEnergyCards";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  getLifePath,
  getDayNumber,
  getMonthNumber,
  getVietnamAnimal,
  animalIconNames,
  getPersonalYear,
  getPersonalMonth,
  getPersonalDay,
  getUniversalYear,
  numberMeanings,
  getReportTemplate,
  getCurrentYearAnimal,
  getMonthAnimal,
  getAnimalCompatibility,
  evaluateCycleStatus,
  getNameNumerology,
  getArabicNumerology,
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
  MinusCircle
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
  country?: string;
  arabicName?: string;
}

export default function Home() {
  const [personData, setPersonData] = useState<PersonData | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const handleGenerate = (name: string, dob: Date, country?: string, arabicName?: string) => {
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
      country,
      arabicName,
    });
    setActiveTab("overview");
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
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="space-y-8">
          <DailyEnergyCards />
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

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Star className="h-5 w-5 text-primary" />
                        Numerology
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="w-64 space-y-2">
                              <p className="font-semibold">Numerology</p>
                              <p className="text-xs">Based on your birth date, revealing your life path number and daily guidance.</p>
                              <p className="text-xs mt-3"><strong>Good:</strong> Numbers in harmony with your life path</p>
                              <p className="text-xs"><strong>Neutral:</strong> Numbers with neither positive nor challenging energy</p>
                              <p className="text-xs"><strong>Challenging:</strong> Numbers that create friction - requiring conscious growth</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Life Path</p>
                          <p className="text-2xl font-bold" data-testid="text-lifepath">{personData.lifePath}</p>
                        </div>
                        <StatusBadge status={evaluateCycleStatus(personData.lifePath, personData.personalYear)} testId="status-numerology" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground">Day Number</p>
                            <p className="text-lg font-semibold" data-testid="text-daynumber">{personData.dayNumber}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground">Month Number</p>
                            <p className="text-lg font-semibold" data-testid="text-monthnumber">{personData.monthNumber}</p>
                          </div>
                        </div>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <p className="text-xs text-muted-foreground">Personal Year</p>
                            <p className="text-lg font-semibold" data-testid="text-personalyear">{personData.personalYear}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Personal Month</p>
                            <p className="text-lg font-semibold" data-testid="text-personalmonth">{personData.personalMonth}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Personal Day</p>
                            <p className="text-lg font-semibold text-primary" data-testid="text-personalday">{personData.personalDay}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Type className="h-5 w-5 text-primary" />
                        Gematria (Latin)
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="w-64 space-y-2">
                              <p className="font-semibold">Gematria (Latin)</p>
                              <p className="text-xs">Pythagorean numerology of your name using the Latin alphabet.</p>
                              <p className="text-xs mt-2"><strong>Expression:</strong> How you express yourself and your talents</p>
                              <p className="text-xs"><strong>Soul Urge:</strong> Your inner desires and motivations</p>
                              <p className="text-xs"><strong>Personality:</strong> How others perceive you</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {nameNumerology && (
                        <>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">Expression</p>
                              <p className="text-2xl font-bold" data-testid="text-expression">{nameNumerology.expressionNumber}</p>
                            </div>
                            <StatusBadge status={evaluateCycleStatus(personData.lifePath, nameNumerology.expressionNumber)} testId="status-gematria" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-muted-foreground">Soul Urge</p>
                                <p className="text-lg font-semibold" data-testid="text-soulurge">{nameNumerology.soulUrge}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-muted-foreground">Personality</p>
                                <p className="text-lg font-semibold" data-testid="text-personality">{nameNumerology.personality}</p>
                              </div>
                            </div>
                          </div>
                          <div className="pt-2 border-t text-sm text-muted-foreground">
                            Pythagorean system calculation from "{personData.name}"
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <BookOpen className="h-5 w-5 text-primary" />
                        Abjad (Arabic)
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="w-64 space-y-2">
                              <p className="font-semibold">Abjad (Arabic)</p>
                              <p className="text-xs">Traditional Arabic numerology system where each letter has a numerical value.</p>
                              <p className="text-xs mt-2">Enter your Arabic name on the front page to calculate this value.</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {personData?.arabicName ? (
                        (() => {
                          const abjad = getArabicNumerology(personData.arabicName);
                          return abjad ? (
                            <>
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm text-muted-foreground">Abjad Total</p>
                                  <p className="text-2xl font-bold" data-testid="text-abjad">{abjad.total}</p>
                                </div>
                                <StatusBadge status={evaluateCycleStatus(personData.lifePath, abjad.reduced)} testId="status-abjad" />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-muted-foreground">Reduced Value</p>
                                  <p className="text-lg font-semibold" data-testid="text-abjad-reduced">{abjad.reduced}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Average Per Letter</p>
                                  <p className="text-lg font-semibold" data-testid="text-abjad-intensity">{abjad.intensity}</p>
                                </div>
                              </div>
                              <div className="pt-2 border-t text-sm text-muted-foreground">
                                Calculated from "{personData.arabicName}"
                              </div>
                            </>
                          ) : (
                            <p className="text-sm text-muted-foreground">Unable to calculate for this name</p>
                          );
                        })()
                      ) : (
                        <p className="text-sm text-muted-foreground">Arabic name was not provided. Enter your Arabic name on the front page to calculate this value.</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Target className="h-5 w-5 text-primary" />
                        Vietnamese Zodiac
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="w-64 space-y-2">
                              <p className="font-semibold">Vietnamese Zodiac</p>
                              <p className="text-xs">The 12-year zodiac cycle determining your animal sign and its characteristics.</p>
                              <p className="text-xs mt-2"><strong>Your Animal:</strong> Determined by your birth year</p>
                              <p className="text-xs"><strong>Current Year/Month:</strong> Today's animal sign</p>
                              <p className="text-xs"><strong>Compatibility:</strong> How your animal interacts with current energies</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-4xl">{animalIconNames[personData.animal]}</span>
                          <div>
                            <p className="text-sm text-muted-foreground">Your Animal</p>
                            <p className="text-xl font-bold" data-testid="text-zodiac-animal">{personData.animal}</p>
                          </div>
                        </div>
                        <StatusBadge status={getAnimalCompatibility(personData.animal, currentYearAnimal)} testId="status-zodiac" />
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{animalIconNames[currentYearAnimal]}</span>
                          <div>
                            <p className="text-xs text-muted-foreground">Current Year</p>
                            <p className="text-sm font-semibold" data-testid="text-current-year-animal">{currentYearAnimal}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{animalIconNames[currentMonthAnimal]}</span>
                          <div>
                            <p className="text-xs text-muted-foreground">Current Month</p>
                            <p className="text-sm font-semibold" data-testid="text-current-month-animal">{currentMonthAnimal}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <DailyForecast personalDay={personData.personalDay} />

                <Collapsible defaultOpen>
                  <CollapsibleTrigger asChild>
                    <button className="w-full flex items-center justify-between py-2 px-1 cursor-pointer hover:bg-muted/30 rounded-md transition-colors text-left">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <span className="font-semibold">Time Period Forecasts</span>
                      </div>
                      <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <TimePeriodForecasts
                      personalDay={personData.personalDay}
                      personalMonth={personData.personalMonth}
                      personalYear={personData.personalYear}
                    />
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible defaultOpen>
                  <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                        <CardTitle className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            {template ? `Your Archetype: ${template.name}` : "Your Numerological Profile"}
                          </span>
                          <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                        </CardTitle>
                        {template && <Badge variant="secondary" className="w-fit">{template.archetype}</Badge>}
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="space-y-4">
                        {template ? (
                          <>
                            <div>
                              <p className="leading-relaxed text-muted-foreground">
                                {template.summary}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm font-semibold text-foreground">Key Insights:</p>
                              <ul className="space-y-2">
                                {template.keyInsights.map((insight, i) => (
                                  <li key={i} className="flex gap-3 text-sm">
                                    <span className="text-primary font-bold flex-shrink-0">-</span>
                                    <span className="text-muted-foreground leading-relaxed">{insight}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              Your unique Life Path ({personData.lifePath}), Day ({personData.dayNumber}), and Month ({personData.monthNumber}) combination creates a distinctive numerological signature. Explore the Numerology tab for detailed insights into each number's meaning and how they interact in your life.
                            </p>
                            <div className="space-y-2 mt-4">
                              <p className="text-sm font-semibold text-foreground">Your Numbers:</p>
                              <ul className="space-y-1">
                                <li className="flex gap-3 text-sm">
                                  <span className="text-primary font-bold flex-shrink-0">-</span>
                                  <span className="text-muted-foreground">Life Path {personData.lifePath}: {numberMeanings[personData.lifePath]?.core}</span>
                                </li>
                                <li className="flex gap-3 text-sm">
                                  <span className="text-primary font-bold flex-shrink-0">-</span>
                                  <span className="text-muted-foreground">Day {personData.dayNumber}: {numberMeanings[personData.dayNumber]?.core}</span>
                                </li>
                                <li className="flex gap-3 text-sm">
                                  <span className="text-primary font-bold flex-shrink-0">-</span>
                                  <span className="text-muted-foreground">Month {personData.monthNumber}: {numberMeanings[personData.monthNumber]?.core}</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>

                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <button className="w-full flex items-center justify-between py-2 px-1 cursor-pointer hover:bg-muted/30 rounded-md transition-colors text-left">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <span className="font-semibold">Key Themes & Insights</span>
                      </div>
                      <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="grid gap-4 md:grid-cols-3 mt-4">
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
                  </CollapsibleContent>
                </Collapsible>
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

                <CountryCompatibility personDob={personData.dob} personName={personData.name} initialCountry={personData.country} />
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
          ) : null}
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
