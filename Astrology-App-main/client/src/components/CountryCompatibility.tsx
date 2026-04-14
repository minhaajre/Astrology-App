import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  getLifePath,
  getDayNumber,
  getMonthNumber,
  getVietnamAnimal,
  animalIconNames,
  calculateCompatibility,
  getAnimalCompatibility,
  type CompatibilityResult,
} from "@/lib/numerology";
import { countries } from "@/lib/countries";
import { Globe, MapPin, Sparkles, Search, X, ChevronDown } from "lucide-react";

interface CountryResult {
  country: string;
  result: CompatibilityResult;
  month: number;
  day: number;
  year: number;
}

interface CountryCompatibilityProps {
  personDob?: Date;
  personName?: string;
  initialCountry?: string;
}

export function CountryCompatibility({
  personDob,
  personName,
  initialCountry,
}: CountryCompatibilityProps) {
  const [allResults, setAllResults] = useState<CountryResult[]>([]);
  const [selectedCountryIndex, setSelectedCountryIndex] = useState<number | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [customCountryResult, setCustomCountryResult] = useState<CountryResult | null>(null);

  // Auto-analyze if initialCountry provided
  useEffect(() => {
    if (!initialCountry || !allResults.length) return;
    
    const countryIndex = allResults.findIndex(r => r.country === initialCountry);
    if (countryIndex >= 0) {
      setSelectedCountryIndex(countryIndex);
    }
  }, [initialCountry, allResults]);

  const personData = useMemo(() => {
    if (!personDob) return null;
    return {
      lifePath: getLifePath(personDob).lifePath,
      dayNumber: getDayNumber(personDob),
      monthNumber: getMonthNumber(personDob),
      animal: getVietnamAnimal(personDob.getFullYear(), personDob),
    };
  }, [personDob]);

  const getZodiacCompatibilityDetails = (compatibility: 'Good' | 'Neutral' | 'Enemies') => {
    const details: Record<typeof compatibility, { color: string; label: string; description: string }> = {
      Good: {
        color: 'text-green-600 dark:text-green-400',
        label: 'Good Compatibility',
        description: 'Natural harmony and mutual understanding'
      },
      Neutral: {
        color: 'text-gray-600 dark:text-gray-400',
        label: 'Neutral',
        description: 'Neither particularly aligned nor opposed'
      },
      Enemies: {
        color: 'text-red-600 dark:text-red-400',
        label: 'Challenging Enemies',
        description: 'Different approaches - requires conscious effort'
      }
    };
    return details[compatibility];
  };

  useEffect(() => {
    if (!personDob || !personData) return;

    const results: CountryResult[] = countries
      .map((country) => {
        const countryDob = new Date(country.year, country.month - 1, country.day);
        const countryData = {
          lifePath: getLifePath(countryDob).lifePath,
          dayNumber: getDayNumber(countryDob),
          monthNumber: getMonthNumber(countryDob),
          animal: "",
        };

        const result = calculateCompatibility(personData, countryData);

        return {
          country: country.name,
          result,
          month: country.month,
          day: country.day,
          year: country.year,
        };
      })
      .sort((a, b) => b.result.totalScore - a.result.totalScore);

    setAllResults(results);
  }, [personDob, personData]);

  const getScoreLabel = (score: number) => {
    if (score >= 80) return { label: "Excellent", color: "text-green-600 dark:text-green-400" };
    if (score >= 60) return { label: "Good", color: "text-blue-600 dark:text-blue-400" };
    if (score >= 40) return { label: "Moderate", color: "text-amber-600 dark:text-amber-400" };
    if (score >= 20) return { label: "Challenging", color: "text-orange-600 dark:text-orange-400" };
    return { label: "Difficult", color: "text-red-600 dark:text-red-400" };
  };

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return countries.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleCountrySelect = (country: typeof countries[0]) => {
    if (!personData) return;
    const countryDob = new Date(country.year, country.month - 1, country.day);
    const countryData = {
      lifePath: getLifePath(countryDob).lifePath,
      dayNumber: getDayNumber(countryDob),
      monthNumber: getMonthNumber(countryDob),
      animal: "",
    };
    const result = calculateCompatibility(personData, countryData);
    setCustomCountryResult({
      country: country.name,
      result,
      month: country.month,
      day: country.day,
      year: country.year,
    });
    setSearchQuery("");
  };

  const topCountries = allResults.slice(0, 10);
  const selectedResult = selectedCountryIndex !== null ? allResults[selectedCountryIndex] : null;
  const activeResult = customCountryResult || selectedResult;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-500" />
            Country Independence Numerology
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Discover how your numerology aligns with countries' independence dates
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-blue-50/30 dark:bg-blue-950/20 p-3 border border-blue-200/50 dark:border-blue-900/50 text-xs text-blue-800 dark:text-blue-300">
            <p>
              <strong>How it works:</strong> Your birth date numerology is automatically compared with all countries' independence date numerology. Higher compatibility scores indicate natural alignment with that nation's founding energy.
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Search for any country</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Type country name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-country-search"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
                  data-testid="button-clear-search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {filteredCountries.length > 0 && (
              <div className="border rounded-md max-h-48 overflow-y-auto">
                {filteredCountries.slice(0, 10).map((country) => (
                  <button
                    key={`${country.name}-${country.year}`}
                    onClick={() => handleCountrySelect(country)}
                    className="w-full text-left px-3 py-2 hover:bg-muted/50 text-sm border-b last:border-b-0 transition-colors"
                    data-testid={`button-select-country-${country.name}`}
                  >
                    <span className="font-medium">{country.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {String(country.month).padStart(2, "0")}/{String(country.day).padStart(2, "0")}/{country.year}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {personData && (
            <div className="rounded-lg bg-primary/5 p-4 border border-primary/20">
              <p className="text-xs font-medium text-muted-foreground mb-3">
                Your Numerology Profile
              </p>
              <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {personData.lifePath}
                  </p>
                  <p className="text-xs text-muted-foreground">Life Path</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {personData.dayNumber}
                  </p>
                  <p className="text-xs text-muted-foreground">Day Number</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {personData.monthNumber}
                  </p>
                  <p className="text-xs text-muted-foreground">Month Number</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl">
                    {animalIconNames[personData.animal]}
                  </p>
                  <p className="text-xs text-muted-foreground">{personData.animal}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {topCountries.length > 0 && (
        <>
          <Collapsible defaultOpen>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                  <CardTitle className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-amber-500" />
                      Top Compatible Countries
                    </span>
                    <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Click any country to see detailed alignment breakdown
                  </p>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <div className="space-y-3">
                    {topCountries.map((countryRes, idx) => (
                      <button
                        key={idx}
                        onClick={() =>
                          setSelectedCountryIndex(
                            allResults.findIndex((r) => r.country === countryRes.country)
                          )
                        }
                        className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                          selectedCountryIndex === allResults.findIndex((r) => r.country === countryRes.country)
                            ? "border-primary bg-primary/10"
                            : "border-muted hover:border-primary/50 hover:bg-muted/30"
                        }`}
                        data-testid={`button-country-${idx}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{countryRes.country}</span>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-2xl font-black ${getScoreLabel(countryRes.result.totalScore).color}`}
                            >
                              {countryRes.result.totalScore}%
                            </span>
                            <Badge
                              variant={
                                countryRes.result.totalScore >= 60
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {getScoreLabel(countryRes.result.totalScore).label}
                            </Badge>
                          </div>
                        </div>
                        <Progress
                          value={countryRes.result.totalScore}
                          className="h-2"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          Independence: {String(countryRes.month).padStart(2, "0")}/
                          {String(countryRes.day).padStart(2, "0")}/{countryRes.year}
                        </p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {activeResult && (
            <>
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="p-8 text-center">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                    {activeResult.country} — Alignment Score
                  </p>
                  <p
                    className={`text-6xl font-black ${getScoreLabel(activeResult.result.totalScore).color}`}
                    data-testid="text-country-score"
                  >
                    {activeResult.result.totalScore}%
                  </p>
                  <p
                    className={`text-lg font-medium mt-2 ${getScoreLabel(activeResult.result.totalScore).color}`}
                  >
                    {getScoreLabel(activeResult.result.totalScore).label}
                  </p>
                </CardContent>
              </Card>

              {personData && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Sparkles className="h-4 w-4" />
                      Zodiac Animal Compatibility
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const countryDate = new Date(activeResult.year, activeResult.month - 1, activeResult.day);
                      const countryAnimal = getVietnamAnimal(activeResult.year, countryDate);
                      const compatibility = getAnimalCompatibility(personData.animal, countryAnimal);
                      const details = getZodiacCompatibilityDetails(compatibility);
                      
                      return (
                        <div className="grid grid-cols-2 gap-6">
                          <div className="text-center">
                            <p className="text-xs font-medium text-muted-foreground mb-3">Your Animal</p>
                            <div className="text-5xl mb-2">{animalIconNames[personData.animal]}</div>
                            <p className="font-semibold">{personData.animal}</p>
                          </div>
                          
                          <div className="text-center">
                            <p className="text-xs font-medium text-muted-foreground mb-3">{activeResult.country}'s Animal</p>
                            <div className="text-5xl mb-2">{animalIconNames[countryAnimal]}</div>
                            <p className="font-semibold">{countryAnimal}</p>
                          </div>
                        </div>
                      );
                    })()}
                    
                    {(() => {
                      const countryDate = new Date(activeResult.year, activeResult.month - 1, activeResult.day);
                      const countryAnimal = getVietnamAnimal(activeResult.year, countryDate);
                      const compatibility = getAnimalCompatibility(personData.animal, countryAnimal);
                      const details = getZodiacCompatibilityDetails(compatibility);
                      
                      return (
                        <div className="mt-6 pt-6 border-t">
                          <div className="rounded-lg bg-muted/50 p-4">
                            <p className={`text-sm font-semibold ${details.color} mb-2`}>
                              {details.label}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {details.description}
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              )}

              <Collapsible defaultOpen>
                <Card>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                      <CardTitle className="flex items-center justify-between gap-2 text-base">
                        <span className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          Number Comparison & Alignment
                        </span>
                        <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {personName || "You"} vs {activeResult.country}
                      </p>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-5">
                  {activeResult.result.breakdown.map((item, index) => (
                    <div
                      key={index}
                      className="space-y-3 rounded-lg border p-4 bg-muted/20"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">
                          {item.category}
                        </span>
                        <span className="text-xs font-bold bg-primary/10 px-2 py-1 rounded">
                          {item.points}/{item.maxPoints} pts
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="rounded-lg bg-background border border-blue-200/50 dark:border-blue-900/50 p-3">
                          <p className="text-xs font-medium text-blue-900 dark:text-blue-200 mb-1">
                            Your Number
                          </p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                              {item.personA}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({personName || "You"})
                            </span>
                          </div>
                        </div>

                        <div className="rounded-lg bg-background border border-green-200/50 dark:border-green-900/50 p-3">
                          <p className="text-xs font-medium text-green-900 dark:text-green-200 mb-1">
                            {activeResult.country}'s Number
                          </p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                              {item.personB}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              (Independence Date)
                            </span>
                          </div>
                        </div>
                      </div>

                      <Progress
                        value={(item.points / item.maxPoints) * 100}
                        className="h-2"
                      />

                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {item.explanation}
                      </p>
                    </div>
                  ))}

                  <div className="mt-6 rounded-lg bg-muted/50 p-4 border-t-2 border-muted">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Total Alignment Score</span>
                      <span className="text-lg font-bold">
                        {activeResult.result.breakdown.reduce(
                          (sum, b) => sum + b.points,
                          0
                        )}
                        /
                        {activeResult.result.breakdown.reduce(
                          (sum, b) => sum + b.maxPoints,
                          0
                        )}{" "}
                        pts
                      </span>
                    </div>
                    <Progress
                      value={activeResult.result.totalScore}
                      className="h-3"
                    />
                  </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              <Collapsible defaultOpen>
                <Card className="border-blue-200/50 bg-blue-50/30 dark:border-blue-900/30 dark:bg-blue-950/20">
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                      <CardTitle className="flex items-center justify-between text-sm text-blue-900 dark:text-blue-200">
                        <span>Interpretation Guide</span>
                        <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="text-xs text-blue-800 dark:text-blue-300 space-y-3">
                  <div>
                    <p className="font-semibold mb-1">Excellent (70+):</p>
                    <p>
                      Your numerology resonates deeply with {activeResult.country}'s
                      founding energy. You may feel natural affinity, ease of
                      adaptation, or sense of belonging there.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Good (60-69):</p>
                    <p>
                      Compatible with growth opportunities. You can thrive there
                      but may need conscious adaptation in some areas.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Moderate (40-59):</p>
                    <p>
                      Balanced challenges and opportunities. Success depends on
                      intentional effort and awareness.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Low (&lt;40):</p>
                    <p>
                      Different foundational energy. Not impossible, but requires
                      significant conscious navigation.
                    </p>
                  </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            </>
          )}
        </>
      )}
    </div>
  );
}
