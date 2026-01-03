import { useState, useEffect, useRef } from "react";
import { User, Sparkles, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    country: string;
  };
}

interface InputFormProps {
  onGenerate: (
    name: string,
    dob: Date,
    arabicName?: string,
    birthTime?: string,
    birthLocation?: string,
    birthCity?: string,
    latitude?: string,
    longitude?: string
  ) => void;
  isLoading?: boolean;
}

const monthMap: Record<string, number> = {
  January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
  July: 7, August: 8, September: 9, October: 10, November: 11, December: 12,
};

const months = Object.keys(monthMap);

export function InputForm({ onGenerate, isLoading }: InputFormProps) {
  const [name, setName] = useState("");
  const [arabicName, setArabicName] = useState("");
  const [birthHour, setBirthHour] = useState("12");
  const [birthMinute, setBirthMinute] = useState("00");
  const [birthPeriod, setBirthPeriod] = useState<"AM" | "PM">("AM");
  
  const [locationInput, setLocationInput] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationSuggestion | null>(null);
  
  const [day, setDay] = useState("1");
  const [month, setMonth] = useState("January");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  
  const suggestionRef = useRef<HTMLDivElement>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (locationInput.length > 2 && !selectedLocation) {
        setIsSearching(true);
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationInput)}&addressdetails=1&limit=5`
          );
          const data = await response.json();
          setSuggestions(data);
        } catch (error) {
          console.error("Location search error:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [locationInput, selectedLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && day && month && year && selectedLocation) {
      // Use YYYY-MM-DD string to avoid timezone shifts
      const monthNum = monthMap[month].toString().padStart(2, '0');
      const dayNum = day.padStart(2, '0');
      const dateString = `${year}-${monthNum}-${dayNum}`;
      const dob = new Date(dateString);

      const birthTimeFormatted = `${birthHour}:${birthMinute} ${birthPeriod}`;
      const city = selectedLocation.address.city || selectedLocation.address.town || selectedLocation.address.village || "";
      onGenerate(
        name,
        dob,
        arabicName || undefined,
        birthTimeFormatted,
        selectedLocation.address.country,
        city,
        selectedLocation.lat,
        selectedLocation.lon
      );
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs uppercase tracking-wide text-muted-foreground">Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="name" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} className="pl-10" data-testid="input-name" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="arabicName" className="text-xs uppercase tracking-wide text-muted-foreground">Arabic Name (optional)</Label>
              <Input id="arabicName" placeholder="Enter your name in Arabic" value={arabicName} onChange={(e) => setArabicName(e.target.value)} dir="rtl" data-testid="input-arabic-name" />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">Time of Birth</Label>
              <div className="flex gap-2">
                <select value={birthHour} onChange={(e) => setBirthHour(e.target.value)} className="border rounded-sm bg-muted/30 px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-primary" style={{ height: "32px", width: "60px" }} data-testid="select-birth-hour">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                    <option key={h} value={h.toString().padStart(2, '0')}>{h.toString().padStart(2, '0')}</option>
                  ))}
                </select>
                <select value={birthMinute} onChange={(e) => setBirthMinute(e.target.value)} className="border rounded-sm bg-muted/30 px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-primary" style={{ height: "32px", width: "60px" }} data-testid="select-birth-minute">
                  {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                    <option key={m} value={m.toString().padStart(2, '0')}>{m.toString().padStart(2, '0')}</option>
                  ))}
                </select>
                <select value={birthPeriod} onChange={(e) => setBirthPeriod(e.target.value as "AM" | "PM")} className="border rounded-sm bg-muted/30 px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-primary" style={{ height: "32px", width: "60px" }} data-testid="select-birth-period">
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2 relative">
              <Label htmlFor="location" className="text-xs uppercase tracking-wide text-muted-foreground">Place of Birth</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  id="location" 
                  placeholder="Type city name (e.g. Paris, New York)" 
                  value={locationInput} 
                  onChange={(e) => {
                    setLocationInput(e.target.value);
                    setSelectedLocation(null);
                  }} 
                  className="pl-10"
                  data-testid="input-location"
                  required
                />
                {isSearching && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />}
              </div>
              
              {suggestions.length > 0 && (
                <div ref={suggestionRef} className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      className="w-full text-left px-4 py-2 text-sm hover:bg-muted focus:bg-muted focus:outline-none"
                      onClick={() => {
                        setSelectedLocation(suggestion);
                        setLocationInput(suggestion.display_name);
                        setSuggestions([]);
                      }}
                    >
                      {suggestion.display_name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Date of Birth</Label>
            <div className="flex gap-2">
              <select value={day} onChange={(e) => setDay(e.target.value)} className="border rounded-sm bg-muted/30 px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-primary" style={{ height: "32px", width: "70px" }} data-testid="select-day">
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (<option key={d} value={d}>{d}</option>))}
              </select>
              <select value={month} onChange={(e) => setMonth(e.target.value)} className="border rounded-sm bg-muted/30 px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-primary" style={{ height: "32px", width: "100px" }} data-testid="select-month">
                {months.map((m) => (<option key={m} value={m}>{m}</option>))}
              </select>
              <input type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="YYYY" min="1" max={currentYear} className="border rounded-sm bg-muted/30 px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-primary" style={{ height: "32px", width: "80px" }} data-testid="input-year" />
            </div>
          </div>

          <Button type="submit" disabled={!name || !day || !month || !year || !selectedLocation || isLoading} className="w-full" data-testid="button-generate">
            <Sparkles className="mr-2 h-4 w-4" />
            {isLoading ? "Generating..." : "Generate Report"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

