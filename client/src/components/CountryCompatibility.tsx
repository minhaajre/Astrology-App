import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  getLifePath,
  getDayNumber,
  getMonthNumber,
  calculateCompatibility,
  type CompatibilityResult,
} from "@/lib/numerology";
import { countries } from "@/lib/countries";
import { Globe, MapPin, Sparkles } from "lucide-react";

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
}

export function CountryCompatibility({
  personDob,
  personName,
}: CountryCompatibilityProps) {
  const [allResults, setAllResults] = useState<CountryResult[]>([]);
  const [selectedCountryIndex, setSelectedCountryIndex] = useState<number | null>(
    null
  );

  const personData = useMemo(() => {
    if (!personDob) return null;
    return {
      lifePath: getLifePath(personDob).lifePath,
      dayNumber: getDayNumber(personDob),
      monthNumber: getMonthNumber(personDob),
      animal: "",
    };
  }, [personDob]);

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

  const topCountries = allResults.slice(0, 10);
  const selectedResult = selectedCountryIndex !== null ? allResults[selectedCountryIndex] : null;

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

          {personData && (
            <div className="rounded-lg bg-primary/5 p-4 border border-primary/20">
              <p className="text-xs font-medium text-muted-foreground mb-3">
                Your Numerology Profile
              </p>
              <div className="grid gap-3 grid-cols-3">
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
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {topCountries.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Top Compatible Countries
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Click any country to see detailed alignment breakdown
              </p>
            </CardHeader>
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
          </Card>

          {selectedResult && (
            <>
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="p-8 text-center">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                    {selectedResult.country} — Alignment Score
                  </p>
                  <p
                    className={`text-6xl font-black ${getScoreLabel(selectedResult.result.totalScore).color}`}
                    data-testid="text-country-score"
                  >
                    {selectedResult.result.totalScore}%
                  </p>
                  <p
                    className={`text-lg font-medium mt-2 ${getScoreLabel(selectedResult.result.totalScore).color}`}
                  >
                    {getScoreLabel(selectedResult.result.totalScore).label}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Globe className="h-4 w-4" />
                    Number Comparison & Alignment
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {personName || "You"} vs {selectedResult.country}
                  </p>
                </CardHeader>
                <CardContent className="space-y-5">
                  {selectedResult.result.breakdown.map((item, index) => (
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
                            {selectedResult.country}'s Number
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
                        {selectedResult.result.breakdown.reduce(
                          (sum, b) => sum + b.points,
                          0
                        )}
                        /
                        {selectedResult.result.breakdown.reduce(
                          (sum, b) => sum + b.maxPoints,
                          0
                        )}{" "}
                        pts
                      </span>
                    </div>
                    <Progress
                      value={selectedResult.result.totalScore}
                      className="h-3"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200/50 bg-blue-50/30 dark:border-blue-900/30 dark:bg-blue-950/20">
                <CardHeader>
                  <CardTitle className="text-sm text-blue-900 dark:text-blue-200">
                    Interpretation Guide
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-blue-800 dark:text-blue-300 space-y-3">
                  <div>
                    <p className="font-semibold mb-1">Excellent (70+):</p>
                    <p>
                      Your numerology resonates deeply with {selectedResult.country}'s
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
              </Card>
            </>
          )}
        </>
      )}
    </div>
  );
}
