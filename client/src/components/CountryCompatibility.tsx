import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getLifePath,
  getDayNumber,
  getMonthNumber,
  calculateCompatibility,
  type CompatibilityResult,
} from "@/lib/numerology";
import { countries } from "@/lib/countries";
import { Globe, Calculator, MapPin } from "lucide-react";

interface CountryCompatibilityProps {
  personDob?: Date;
  personName?: string;
}

export function CountryCompatibility({
  personDob,
  personName,
}: CountryCompatibilityProps) {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [result, setResult] = useState<CompatibilityResult | null>(null);

  const countryOptions = useMemo(() => {
    return countries
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((c) => ({ label: c.name, value: c.name }));
  }, []);

  const handleCalculate = () => {
    if (!personDob || !selectedCountry) return;

    const country = countries.find((c) => c.name === selectedCountry);
    if (!country) return;

    const countryDob = new Date(country.year, country.month - 1, country.day);

    const personData = {
      lifePath: getLifePath(personDob).lifePath,
      dayNumber: getDayNumber(personDob),
      monthNumber: getMonthNumber(personDob),
      animal: "",
    };

    const countryData = {
      lifePath: getLifePath(countryDob).lifePath,
      dayNumber: getDayNumber(countryDob),
      monthNumber: getMonthNumber(countryDob),
      animal: "",
    };

    setResult(calculateCompatibility(personData, countryData));
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
              <strong>How it works:</strong> Your birth date numerology is compared with the independence date numerology of countries around the world. A higher compatibility score suggests natural alignment with that nation's founding energy.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="country-select" className="text-sm font-medium">
                Select Country
              </Label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger id="country-select" data-testid="select-country">
                  <SelectValue placeholder="Choose a country..." />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {countryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCountry && (
              <div className="rounded-lg bg-muted/30 p-3 border">
                <p className="text-xs text-muted-foreground mb-2">
                  <strong>Selected:</strong> {selectedCountry}
                </p>
                {countries.find((c) => c.name === selectedCountry) && (
                  <p className="text-xs text-muted-foreground">
                    Independence Date:{" "}
                    {countries
                      .find((c) => c.name === selectedCountry)
                      ?.month.toString()
                      .padStart(2, "0")}
                    /
                    {countries
                      .find((c) => c.name === selectedCountry)
                      ?.day.toString()
                      .padStart(2, "0")}
                    /
                    {countries.find((c) => c.name === selectedCountry)?.year}
                  </p>
                )}
              </div>
            )}
          </div>

          <Button
            onClick={handleCalculate}
            disabled={!personDob || !selectedCountry}
            className="w-full"
            data-testid="button-calculate-country"
          >
            <Globe className="mr-2 h-4 w-4" />
            Calculate Country Compatibility
          </Button>
        </CardContent>
      </Card>

      {result && selectedCountry && (
        <>
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-8 text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                Numerology Alignment Score
              </p>
              <p
                className={`text-6xl font-black ${getScoreLabel(result.totalScore).color}`}
                data-testid="text-country-score"
              >
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
                Alignment Breakdown
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                How {personName || "you"} aligns with {selectedCountry}
              </p>
            </CardHeader>
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
          </Card>

          <Card className="border-green-200/50 bg-green-50/30 dark:border-green-900/30 dark:bg-green-950/20">
            <CardHeader>
              <CardTitle className="text-sm text-green-900 dark:text-green-200">
                What This Score Means
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-green-800 dark:text-green-300 space-y-2">
              <p>
                <strong>Higher scores (70+):</strong> Your numerology resonates with this nation's founding energy. You may feel a natural affinity, ease of travel, or sense of belonging there.
              </p>
              <p>
                <strong>Moderate scores (40-69):</strong> Compatible but with growth edges. You can thrive there but may need conscious adaptation in certain areas.
              </p>
              <p>
                <strong>Lower scores (&lt;40):</strong> Different foundational energy. Challenges possible but not insurmountable—awareness and intention help.
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
