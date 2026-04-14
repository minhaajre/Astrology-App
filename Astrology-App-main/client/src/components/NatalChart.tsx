import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Star, MapPin, Clock } from "lucide-react";
import { calculateNatalChart } from "@/lib/astrology";

interface NatalChartProps {
  name: string;
  dob: Date;
  birthTime?: string;
  birthLocation?: string;
  birthCity?: string;
  latitude?: string;
  longitude?: string;
}

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const AYANAMSA = 24.1;

function convertToSidereal(tropicalSign: string, tropicalDegree: number): { sign: string; degree: number } {
  const signIndex = ZODIAC_SIGNS.indexOf(tropicalSign);
  const absoluteDegree = signIndex * 30 + tropicalDegree;
  let siderealAbsolute = absoluteDegree - AYANAMSA;
  
  if (siderealAbsolute < 0) {
    siderealAbsolute += 360;
  }
  
  const newSignIndex = Math.floor(siderealAbsolute / 30) % 12;
  const newDegree = siderealAbsolute % 30;
  
  return {
    sign: ZODIAC_SIGNS[newSignIndex],
    degree: newDegree
  };
}

export function NatalChart({ name, dob, birthTime, birthLocation, birthCity, latitude, longitude }: NatalChartProps) {
  const [isTropical, setIsTropical] = useState(true);
  
  const data = useMemo(() => {
    const lat = latitude ? parseFloat(latitude) : 0;
    const lng = longitude ? parseFloat(longitude) : 0;
    
    return calculateNatalChart(dob, birthTime, lat, lng);
  }, [dob, birthTime, latitude, longitude]);

  const getDisplayPlanets = () => {
    if (!data) return [];
    
    if (isTropical) {
      return data.planets;
    }
    
    return data.planets.map(p => {
      const converted = convertToSidereal(p.sign, p.degree);
      return { ...p, sign: converted.sign, degree: converted.degree };
    });
  };

  const getDisplaySpecial = (point: { name: string; sign: string; degree: number; house: number } | undefined) => {
    if (!point) return null;
    
    if (isTropical) {
      return point;
    }
    
    const converted = convertToSidereal(point.sign, point.degree);
    return { ...point, sign: converted.sign, degree: converted.degree };
  };

  const displayPlanets = getDisplayPlanets();
  const displayAscendant = getDisplaySpecial(data?.ascendant);
  const displayMidheaven = getDisplaySpecial(data?.midheaven);

  return (
    <Card className="w-full border-primary/20 bg-primary/5">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Natal Birth Chart
          </CardTitle>
          
          <div className="flex items-center gap-3 bg-background/50 rounded-md px-3 py-2">
            <Label 
              htmlFor="zodiac-toggle" 
              className={`text-sm cursor-pointer transition-colors ${!isTropical ? 'text-primary font-medium' : 'text-muted-foreground'}`}
            >
              Sidereal
            </Label>
            <Switch
              id="zodiac-toggle"
              checked={isTropical}
              onCheckedChange={setIsTropical}
              data-testid="switch-zodiac-system"
            />
            <Label 
              htmlFor="zodiac-toggle" 
              className={`text-sm cursor-pointer transition-colors ${isTropical ? 'text-primary font-medium' : 'text-muted-foreground'}`}
            >
              Tropical
            </Label>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
          {birthTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Time: {birthTime}
            </div>
          )}
          {birthLocation && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Country: {birthLocation}
            </div>
          )}
          {birthCity && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              City: {birthCity}
            </div>
          )}
          {(latitude || longitude) && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Coords: {latitude || "N/A"}, {longitude || "N/A"}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Placement</TableHead>
              <TableHead>Sign</TableHead>
              <TableHead>Degree</TableHead>
              <TableHead>House</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayPlanets.map((p) => (
              <TableRow key={p.name}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>{p.sign}</TableCell>
                <TableCell>{p.degree.toFixed(1)}°</TableCell>
                <TableCell>{p.house}</TableCell>
              </TableRow>
            ))}
            {displayAscendant && (
              <TableRow className="bg-primary/5 font-bold">
                <TableCell>{displayAscendant.name}</TableCell>
                <TableCell>{displayAscendant.sign}</TableCell>
                <TableCell>{displayAscendant.degree.toFixed(1)}°</TableCell>
                <TableCell>{displayAscendant.house}</TableCell>
              </TableRow>
            )}
            {displayMidheaven && (
              <TableRow className="bg-primary/5 font-bold">
                <TableCell>{displayMidheaven.name}</TableCell>
                <TableCell>{displayMidheaven.sign}</TableCell>
                <TableCell>{displayMidheaven.degree.toFixed(1)}°</TableCell>
                <TableCell>{displayMidheaven.house}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <p className="text-[10px] text-muted-foreground mt-4 italic text-center">
          * Calculated using the {isTropical ? "Tropical" : "Sidereal (Lahiri)"} Zodiac system. 
          {!isTropical && " Ayanamsa offset: ~24.1°."} Placements are approximate based on birth data provided.
        </p>
      </CardContent>
    </Card>
  );
}
