import { useState, useEffect } from "react";
import { User, Sparkles } from "lucide-react";
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

interface InputFormProps {
  onGenerate: (name: string, dob: Date, arabicName?: string, birthTime?: string, birthLocation?: string) => void;
  isLoading?: boolean;
}

export function InputForm({ onGenerate, isLoading }: InputFormProps) {
  const [name, setName] = useState("");
  const [arabicName, setArabicName] = useState("");
  const [birthHour, setBirthHour] = useState("12");
  const [birthMinute, setBirthMinute] = useState("00");
  const [birthPeriod, setBirthPeriod] = useState("AM");
  const [birthLocation, setBirthLocation] = useState("");
  const [day, setDay] = useState("1");
  const [month, setMonth] = useState("January");
  const [year, setYear] = useState(new Date().getFullYear().toString());

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && day && month && year && birthLocation) {
      const dob = new Date(parseInt(year), monthMap[month] - 1, parseInt(day));
      const birthTimeFormatted = `${birthHour}:${birthMinute} ${birthPeriod}`;
      onGenerate(name, dob, arabicName || undefined, birthTimeFormatted, birthLocation);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
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
              <Label htmlFor="arabicName" className="text-xs uppercase tracking-wide text-muted-foreground">
                Arabic Name (optional)
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
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                Time of Birth
              </Label>
              <div className="flex gap-2">
                <select
                  value={birthHour}
                  onChange={(e) => setBirthHour(e.target.value)}
                  className="border rounded-sm bg-muted/30 px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-primary"
                  style={{ height: "32px", width: "60px" }}
                  data-testid="select-birth-hour"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                    <option key={h} value={h.toString().padStart(2, '0')}>
                      {h.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <select
                  value={birthMinute}
                  onChange={(e) => setBirthMinute(e.target.value)}
                  className="border rounded-sm bg-muted/30 px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-primary"
                  style={{ height: "32px", width: "60px" }}
                  data-testid="select-birth-minute"
                >
                  {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                    <option key={m} value={m.toString().padStart(2, '0')}>
                      {m.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <select
                  value={birthPeriod}
                  onChange={(e) => setBirthPeriod(e.target.value)}
                  className="border rounded-sm bg-muted/30 px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-primary"
                  style={{ height: "32px", width: "60px" }}
                  data-testid="select-birth-period"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthLocation" className="text-xs uppercase tracking-wide text-muted-foreground">
                Location of Birth
              </Label>
              <Input
                id="birthLocation"
                placeholder="City, Country"
                value={birthLocation}
                onChange={(e) => setBirthLocation(e.target.value)}
                data-testid="input-birth-location"
                required
              />
            </div>
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

              {/* Year Input */}
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="YYYY"
                min="1"
                max={currentYear}
                className="border rounded-sm bg-muted/30 px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-primary"
                style={{ height: "32px", width: "80px" }}
                data-testid="input-year"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!name || !day || !month || !year || !birthLocation || isLoading}
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
