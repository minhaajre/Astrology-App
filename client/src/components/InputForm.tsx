import { useState, useEffect } from "react";
import { Globe, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countries } from "@/lib/countries";

interface InputFormProps {
  onGenerate: (name: string, dob: Date, country?: string, arabicName?: string) => void;
  isLoading?: boolean;
}

export function InputForm({ onGenerate, isLoading }: InputFormProps) {
  const [name, setName] = useState("");
  const [arabicName, setArabicName] = useState("");
  const [day, setDay] = useState("1");
  const [month, setMonth] = useState("January");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [country, setCountry] = useState("");

  // Auto-detect country on mount
  useEffect(() => {
    const detectCountry = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        if (data.country_name) {
          setCountry(data.country_name);
        }
      } catch {
        // Silently fail - country selection is optional
      }
    };
    detectCountry();
  }, []);

  const monthMap: Record<string, number> = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  const months = Object.keys(monthMap);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 120 }, (_, i) => currentYear - i);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && day && month && year) {
      const dob = new Date(parseInt(year), monthMap[month] - 1, parseInt(day));
      onGenerate(name, dob, country || undefined, arabicName || undefined);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name and Country Row */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs uppercase tracking-wide text-muted-foreground">
                Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  data-testid="input-name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country" className="text-xs uppercase tracking-wide text-muted-foreground">
                Country
              </Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="pl-10" data-testid="select-country">
                    <SelectValue placeholder="Select country (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c.name} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Arabic Name (optional for Abjad calculation) */}
          <div className="space-y-2">
            <Label htmlFor="arabicName" className="text-xs uppercase tracking-wide text-muted-foreground">
              Arabic Name (optional for Abjad numerology)
            </Label>
            <Input
              id="arabicName"
              placeholder="Enter your name in Arabic (ع ل ي)"
              value={arabicName}
              onChange={(e) => setArabicName(e.target.value)}
              dir="rtl"
              data-testid="input-arabic-name"
            />
          </div>

          {/* Date of Birth - Scrollable Selectors */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">
              Date of Birth
            </Label>
            <div className="flex gap-2">
              {/* Day Selector */}
              <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="border rounded-sm bg-muted/30 px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-primary"
                style={{ height: "32px", width: "70px" }}
                data-testid="select-day"
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              {/* Month Selector */}
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="border rounded-sm bg-muted/30 px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-primary"
                style={{ height: "32px", width: "100px" }}
                data-testid="select-month"
              >
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>

              {/* Year Selector */}
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="border rounded-sm bg-muted/30 px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-primary"
                style={{ height: "32px", width: "80px" }}
                data-testid="select-year"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!name || !day || !month || !year || isLoading}
            className="w-full"
            data-testid="button-generate"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {isLoading ? "Generating..." : "Generate Report"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
