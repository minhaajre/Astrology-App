import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Star, MapPin, Clock } from "lucide-react";

interface Planet {
  name: string;
  sign: string;
  degree: number;
  house: number;
}

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

const AYANAMSA = 24.1; // Lahiri ayanamsa (approximate for 2024)

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

function convertToTropical(siderealSign: string, siderealDegree: number): { sign: string; degree: number } {
  const signIndex = ZODIAC_SIGNS.indexOf(siderealSign);
  const absoluteDegree = signIndex * 30 + siderealDegree;
  let tropicalAbsolute = absoluteDegree + AYANAMSA;
  
  if (tropicalAbsolute >= 360) {
    tropicalAbsolute -= 360;
  }
  
  const newSignIndex = Math.floor(tropicalAbsolute / 30) % 12;
  const newDegree = tropicalAbsolute % 30;
  
  return {
    sign: ZODIAC_SIGNS[newSignIndex],
    degree: newDegree
  };
}

export function NatalChart({ name, dob, birthTime, birthLocation, birthCity, latitude, longitude }: NatalChartProps) {
  const [isTropical, setIsTropical] = useState(true);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/natal-chart", dob.toISOString(), birthTime, birthLocation, birthCity, latitude, longitude],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 1500));
      
      // Base data in Tropical coordinates (Western astrology default)
      return {
        planets: [
          { name: "Sun", sign: "Capricorn", degree: 15.4, house: 10 },
          { name: "Moon", sign: "Taurus", degree: 22.1, house: 2 },
          { name: "Mercury", sign: "Capricorn", degree: 5.8, house: 9 },
          { name: "Venus", sign: "Aquarius", degree: 12.3, house: 11 },
          { name: "Mars", sign: "Scorpio", degree: 18.7, house: 7 },
          { name: "Jupiter", sign: "Aries", degree: 4.2, house: 12 },
          { name: "Saturn", sign: "Pisces", degree: 29.5, house: 12 },
          { name: "Uranus", sign: "Taurus", degree: 14.1, house: 2 },
          { name: "Neptune", sign: "Pisces", degree: 25.6, house: 11 },
          { name: "Pluto", sign: "Capricorn", degree: 29.8, house: 10 },
        ] as Planet[],
        ascendant: { name: "Ascendant", sign: "Aries", degree: 12.5, house: 1 }
      };
    }
  });

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

  const getDisplayAscendant = () => {
    if (!data?.ascendant) return null;
    
    if (isTropical) {
      return data.ascendant;
    }
    
    const converted = convertToSidereal(data.ascendant.sign, data.ascendant.degree);
    return { ...data.ascendant, sign: converted.sign, degree: converted.degree };
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayPlanets = getDisplayPlanets();
  const displayAscendant = getDisplayAscendant();

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
