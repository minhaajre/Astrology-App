import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Calendar, 
  BarChart3,
  Heart,
  Brain,
  Sparkles
} from "lucide-react";
import {
  reduceToSingleDigit,
  sumDigitsOfString,
  getVietnamAnimal,
  getMonthAnimal,
  animalIconNames,
  numberMeanings,
  getAnimalCompatibility,
} from "@/lib/numerology";

export function DailyEnergyCards() {
  const today = new Date();
  
  // Today's energy
  const todayDate = today.getDate();
  const todayNumber = reduceToSingleDigit(todayDate);
  const todayMeaning = numberMeanings[todayNumber];
  const todayAnimal = getVietnamAnimal(today.getFullYear());
  const todayAnimalIcon = animalIconNames[todayAnimal];
  
  // This week's energy - use week number
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
  const pastDaysOfYear = (today.getTime() - firstDayOfYear.getTime()) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  const weekNumber1 = reduceToSingleDigit(weekNumber);
  const weekMeaning = numberMeanings[weekNumber1];
  
  // This month's energy
  const monthNumber = reduceToSingleDigit(today.getMonth() + 1);
  const monthMeaning = numberMeanings[monthNumber];
  const monthAnimal = getMonthAnimal(today);
  const monthAnimalIcon = animalIconNames[monthAnimal];

  const getTodayCompatibility = () => getAnimalCompatibility(todayAnimal, todayAnimal);

  return (
    <div className="space-y-4 mb-8">
      <div className="text-center mb-2">
        <h2 className="text-lg font-semibold tracking-tight">Today's Energies</h2>
        <p className="text-xs text-muted-foreground">
          {today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        {/* Today's Numerology */}
        <Card className="bg-card/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2 mt-1">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Numerology
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold" data-testid="energy-today-number">
                    {todayNumber}
                  </p>
                  <Badge variant="secondary" className="text-xs whitespace-nowrap">
                    {todayMeaning.core.split(" &")[0]}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                  {todayMeaning.dailyForecast}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* This Week's Energy */}
        <Card className="bg-card/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2 mt-1">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  This Week
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold" data-testid="energy-week-number">
                    {weekNumber1}
                  </p>
                  <Badge variant="secondary" className="text-xs whitespace-nowrap">
                    Week {weekNumber}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                  {weekMeaning.core.split(" &")[0]} • {weekMeaning.essence.substring(0, 60)}...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* This Month's Energy */}
        <Card className="bg-card/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2 mt-1">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  This Month
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold" data-testid="energy-month-number">
                    {monthNumber}
                  </p>
                  <Badge variant="secondary" className="text-xs whitespace-nowrap">
                    {today.toLocaleDateString("en-US", { month: "short" })}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                  {monthMeaning.core.split(" &")[0]} • {monthMeaning.essence.substring(0, 60)}...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vietnamese Zodiac Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Today's Zodiac */}
        <Card className="bg-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{todayAnimalIcon}</span>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Today's Animal
                </p>
                <p className="text-lg font-bold" data-testid="energy-today-animal">
                  {todayAnimal}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {getTodayCompatibility() === 'Good' ? '✓ Aligned' : getTodayCompatibility() === 'Enemies' ? '✗ Challenging' : '• Neutral'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* This Month's Zodiac */}
        <Card className="bg-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{monthAnimalIcon}</span>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  This Month's Animal
                </p>
                <p className="text-lg font-bold" data-testid="energy-month-animal">
                  {monthAnimal}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Energetic theme for {today.toLocaleDateString("en-US", { month: "long" })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
