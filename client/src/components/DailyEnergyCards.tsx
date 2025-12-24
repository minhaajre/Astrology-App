import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Calendar, 
  BarChart3,
  Star,
  Heart
} from "lucide-react";
import {
  reduceToSingleDigit,
  sumDigitsOfString,
  getVietnamAnimal,
  getMonthAnimal,
  animalIconNames,
  numberMeanings,
  getAnimalCompatibility,
  getZodiacSign,
  generateDailyInsight,
  specialDates,
} from "@/lib/numerology";

export function DailyEnergyCards() {
  const today = new Date();
  
  // Today's energy - use actual date from GG33 system
  const todayDate = today.getDate();
  const todaySpecialDate = specialDates.find(d => d.date === todayDate);
  const todayNumber = todayDate; // Display the actual date
  const todayReducedNumber = todaySpecialDate?.number || reduceToSingleDigit(todayDate);
  const todayMeaning = numberMeanings[todayReducedNumber];
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

  // Western Zodiac
  const zodiacSign = getZodiacSign(today);

  // Generate daily insight - use reduced number for insights
  const dailyInsight = generateDailyInsight(todayReducedNumber, weekNumber1, monthNumber, zodiacSign, todayAnimal, monthAnimal);

  const getTodayCompatibility = () => getAnimalCompatibility(todayAnimal, todayAnimal);

  return (
    <div className="space-y-4 mb-8">
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold tracking-tight">Today's Energies</h2>
        <p className="text-xs text-muted-foreground">
          {today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          {dailyInsight}
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-4">
        {/* Today's Numerology */}
        <Card className="bg-card/50 h-full">
          <CardContent className="pt-6 pb-6 flex flex-col h-full">
            <div className="flex gap-3">
              <div className="rounded-lg bg-primary/10 p-2 flex-shrink-0">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Today's Number
                </p>
                <div className="mb-3">
                  <p className="text-3xl font-bold" data-testid="energy-today-number">
                    {todayNumber}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {todaySpecialDate?.theme || todayMeaning.core}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-auto leading-relaxed">
                  {todaySpecialDate?.bestFor && todaySpecialDate.bestFor.length > 0 
                    ? `Best for: ${todaySpecialDate.bestFor.slice(0, 2).join(", ")}`
                    : todayMeaning.dailyForecast}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* This Week's Energy */}
        <Card className="bg-card/50 h-full">
          <CardContent className="pt-6 pb-6 flex flex-col h-full">
            <div className="flex gap-3">
              <div className="rounded-lg bg-primary/10 p-2 flex-shrink-0">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Week {weekNumber} Theme
                </p>
                <div className="mb-3">
                  <p className="text-3xl font-bold" data-testid="energy-week-number">
                    {weekNumber1}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {weekMeaning.core}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* This Month's Energy */}
        <Card className="bg-card/50 h-full">
          <CardContent className="pt-6 pb-6 flex flex-col h-full">
            <div className="flex gap-3">
              <div className="rounded-lg bg-primary/10 p-2 flex-shrink-0">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  {today.toLocaleDateString("en-US", { month: "long" })} Theme
                </p>
                <div className="mb-3">
                  <p className="text-3xl font-bold" data-testid="energy-month-number">
                    {monthNumber}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {monthMeaning.core}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Zodiac Sign */}
        <Card className="bg-card/50 h-full">
          <CardContent className="pt-6 pb-6 flex flex-col h-full">
            <div className="flex gap-3">
              <div className="rounded-lg bg-primary/10 p-2 flex-shrink-0">
                <Star className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Zodiac Sign
                </p>
                <div className="mb-3">
                  <p className="text-3xl font-bold" data-testid="energy-zodiac-sign">
                    {zodiacSign.symbol}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {zodiacSign.name}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-auto">
                  {zodiacSign.element} • {zodiacSign.dates}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vietnamese Zodiac Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Today's Zodiac */}
        <Card className="bg-card/50 min-h-32">
          <CardContent className="pt-6 pb-6 h-full flex items-center">
            <div className="flex items-center gap-4 w-full">
              <span className="text-5xl flex-shrink-0">{todayAnimalIcon}</span>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Today's Animal
                </p>
                <p className="text-lg font-bold" data-testid="energy-today-animal">
                  {todayAnimal}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {getTodayCompatibility() === 'Good' ? '✓ Aligned' : getTodayCompatibility() === 'Enemies' ? '✗ Challenging' : '• Neutral'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* This Month's Zodiac */}
        <Card className="bg-card/50 min-h-32">
          <CardContent className="pt-6 pb-6 h-full flex items-center">
            <div className="flex items-center gap-4 w-full">
              <span className="text-5xl flex-shrink-0">{monthAnimalIcon}</span>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  This Month's Animal
                </p>
                <p className="text-lg font-bold" data-testid="energy-month-animal">
                  {monthAnimal}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {today.toLocaleDateString("en-US", { month: "long" })} energetic theme
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
