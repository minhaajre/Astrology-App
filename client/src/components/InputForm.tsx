import { useState } from "react";
import { User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

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

const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
  "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)",
  "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)", "Democratic Republic of the Congo", "Denmark", "Djibouti",
  "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini",
  "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala",
  "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Holy See", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran",
  "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait",
  "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico",
  "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (formerly Burma)", "Namibia",
  "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
  "Oman", "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland",
  "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
  "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore",
  "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka",
  "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga",
  "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom",
  "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

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
  const [birthLocation, setBirthLocation] = useState("");
  const [birthCity, setBirthCity] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [day, setDay] = useState("1");
  const [month, setMonth] = useState("January");
  const [year, setYear] = useState(new Date().getFullYear().toString());

  const currentYear = new Date().getFullYear();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && day && month && year && birthLocation && birthCity) {
      const dob = new Date(parseInt(year), monthMap[month] - 1, parseInt(day));
      const birthTimeFormatted = `${birthHour}:${birthMinute} ${birthPeriod}`;
      onGenerate(name, dob, arabicName || undefined, birthTimeFormatted, birthLocation, birthCity, latitude, longitude);
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
              <Input id="arabicName" placeholder="Enter your name in Arabic (ع ل ي)" value={arabicName} onChange={(e) => setArabicName(e.target.value)} dir="rtl" data-testid="input-arabic-name" />
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
            <div className="space-y-2">
              <Label htmlFor="birthLocation" className="text-xs uppercase tracking-wide text-muted-foreground">Location of Birth (Country)</Label>
              <select id="birthLocation" value={birthLocation} onChange={(e) => setBirthLocation(e.target.value)} className="w-full border rounded-sm bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" data-testid="select-birth-location" required>
                <option value="">Select a country</option>
                {countries.map((country) => (<option key={country} value={country}>{country}</option>))}
              </select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="birthCity" className="text-xs uppercase tracking-wide text-muted-foreground">City of Birth</Label>
              <Input id="birthCity" placeholder="City" value={birthCity} onChange={(e) => setBirthCity(e.target.value)} data-testid="input-birth-city" required />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="latitude" className="text-xs uppercase tracking-wide text-muted-foreground">Latitude (optional)</Label>
                <Input id="latitude" placeholder="e.g. 51.5" value={latitude} onChange={(e) => setLatitude(e.target.value)} data-testid="input-latitude" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude" className="text-xs uppercase tracking-wide text-muted-foreground">Longitude (optional)</Label>
                <Input id="longitude" placeholder="e.g. -0.1" value={longitude} onChange={(e) => setLongitude(e.target.value)} data-testid="input-longitude" />
              </div>
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

          <Button type="submit" disabled={!name || !day || !month || !year || !birthLocation || !birthCity || isLoading} className="w-full" data-testid="button-generate">
            <Sparkles className="mr-2 h-4 w-4" />
            {isLoading ? "Generating..." : "Generate Report"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
