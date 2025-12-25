import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  getVietnamAnimal, 
  animalIconNames,
  animalFriends, 
  animalEnemiesPrimary, 
  animalEnemiesSecondary,
  getNextYearsByAnimals,
  getZodiacSign
} from "@/lib/numerology";
import { Heart, AlertTriangle, AlertCircle, Calendar } from "lucide-react";

interface ZodiacDisplayProps {
  birthYear: number;
  birthDate?: Date;
}

const elementColors: Record<string, string> = {
  Fire: "text-red-500",
  Earth: "text-amber-600 dark:text-amber-400",
  Air: "text-sky-500",
  Water: "text-blue-500"
};

const elementBgColors: Record<string, string> = {
  Fire: "bg-red-500/10",
  Earth: "bg-amber-500/10",
  Air: "bg-sky-500/10",
  Water: "bg-blue-500/10"
};

export function ZodiacDisplay({ birthYear, birthDate }: ZodiacDisplayProps) {
  const animal = getVietnamAnimal(birthYear);
  const westernZodiac = birthDate ? getZodiacSign(birthDate) : null;
  const friends = animalFriends[animal] || [];
  const enemiesPrimary = animalEnemiesPrimary[animal] || [];
  const enemiesSecondary = animalEnemiesSecondary[animal] || [];

  const currentYear = new Date().getFullYear();
  const nextFriendlyYears = getNextYearsByAnimals(friends, 6, currentYear);
  const nextUnfavorableYears = getNextYearsByAnimals([...enemiesPrimary, ...enemiesSecondary], 6, currentYear);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-8 text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
              Vietnamese Zodiac
            </p>
            <p className="text-7xl mb-2" data-testid="text-zodiac-animal">
              {animalIconNames[animal]}
            </p>
            <p className="text-3xl font-black mb-2">{animal}</p>
            <p className="text-sm text-muted-foreground">
              Born in the Year of the {animal}
            </p>
          </CardContent>
        </Card>

        {westernZodiac && (
          <Card className={`border-primary/20 ${elementBgColors[westernZodiac.element]}`}>
            <CardContent className="p-8 text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                Western Zodiac
              </p>
              <p className="text-7xl mb-2" data-testid="text-western-zodiac-symbol">
                {westernZodiac.symbol}
              </p>
              <p className="text-3xl font-black mb-2" data-testid="text-western-zodiac-name">{westernZodiac.name}</p>
              <div className="flex items-center justify-center gap-2">
                <Badge variant="secondary" className={elementColors[westernZodiac.element]}>
                  {westernZodiac.element}
                </Badge>
                <span className="text-xs text-muted-foreground">{westernZodiac.dates}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Heart className="h-4 w-4 text-green-500" />
              Natural Allies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {friends.map((friend) => (
                <Badge key={friend} variant="secondary" className="text-sm">
                  {animalIconNames[friend]} {friend}
                </Badge>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Strong compatibility and natural understanding
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Primary Clash
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {enemiesPrimary.map((enemy) => (
                <Badge key={enemy} variant="destructive" className="text-sm">
                  {animalIconNames[enemy]} {enemy}
                </Badge>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Significant challenges in relationships
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              Secondary Tension
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {enemiesSecondary.map((enemy) => (
                <Badge key={enemy} variant="secondary" className="text-sm border-amber-500/30">
                  {animalIconNames[enemy]} {enemy}
                </Badge>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Requires patience and understanding
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4 text-green-500" />
              Next Favorable Years
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {nextFriendlyYears.map((year) => (
                <div key={year.year} className="flex items-center justify-between rounded-lg bg-green-500/10 px-3 py-2">
                  <span className="font-medium">{year.year}</span>
                  <Badge variant="secondary">Year of {year.animal}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4 text-red-500" />
              Years Requiring Caution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {nextUnfavorableYears.map((year) => (
                <div key={year.year} className="flex items-center justify-between rounded-lg bg-red-500/10 px-3 py-2">
                  <span className="font-medium">{year.year}</span>
                  <Badge variant="secondary">Year of {year.animal}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
