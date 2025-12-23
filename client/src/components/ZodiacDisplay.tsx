import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  getVietnamAnimal, 
  animalFriends, 
  animalEnemiesPrimary, 
  animalEnemiesSecondary,
  getNextYearsByAnimals 
} from "@/lib/numerology";
import { Heart, AlertTriangle, AlertCircle, Calendar } from "lucide-react";

interface ZodiacDisplayProps {
  birthYear: number;
}

const animalEmojis: Record<string, string> = {
  Rat: "Rat",
  Buffalo: "Buffalo",
  Tiger: "Tiger",
  Cat: "Cat",
  Dragon: "Dragon",
  Snake: "Snake",
  Horse: "Horse",
  Goat: "Goat",
  Monkey: "Monkey",
  Rooster: "Rooster",
  Dog: "Dog",
  Pig: "Pig"
};

export function ZodiacDisplay({ birthYear }: ZodiacDisplayProps) {
  const animal = getVietnamAnimal(birthYear);
  const friends = animalFriends[animal] || [];
  const enemiesPrimary = animalEnemiesPrimary[animal] || [];
  const enemiesSecondary = animalEnemiesSecondary[animal] || [];

  const currentYear = new Date().getFullYear();
  const nextFriendlyYears = getNextYearsByAnimals(friends, 6, currentYear);
  const nextUnfavorableYears = getNextYearsByAnimals([...enemiesPrimary, ...enemiesSecondary], 6, currentYear);

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-8 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
            Vietnamese Zodiac
          </p>
          <p className="text-6xl font-black mb-2" data-testid="text-zodiac-animal">
            {animal}
          </p>
          <p className="text-sm text-muted-foreground">
            Born in the Year of the {animal}
          </p>
        </CardContent>
      </Card>

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
                  {animalEmojis[friend]}
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
                  {animalEmojis[enemy]}
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
                  {animalEmojis[enemy]}
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
