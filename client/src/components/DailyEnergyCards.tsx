import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Zap, 
  Calendar, 
  BarChart3,
  Star,
  Heart,
  Moon,
  ChevronDown
} from "lucide-react";
import {
  reduceToSingleDigit,
  sumDigitsOfString,
  getVietnamAnimal,
  animalIconNames,
  numberMeanings,
  getAnimalCompatibility,
  getZodiacSign,
  generateDailyInsight,
  specialDates,
  getLunarPhase,
  getUniversalYear,
} from "@/lib/numerology";
import { useState } from "react";

export function DailyEnergyCards() {
  const today = new Date();
  
  // Today's energy - use actual date from numerology system
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
  
  // Lunar phase data
  const lunarPhase = getLunarPhase(today);

  // Year theme
  const yearNumber = getUniversalYear(today);
  const yearMeaning = numberMeanings[yearNumber];

  // Western Zodiac
  const zodiacSign = getZodiacSign(today);

  // Generate daily insight - use reduced number for insights
  const dailyInsight = generateDailyInsight(todayReducedNumber, weekNumber1, monthNumber, zodiacSign, todayAnimal, "");

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

      <Collapsible defaultOpen={true}>
        <CollapsibleTrigger className="flex items-center gap-2 w-full py-2 text-left hover-elevate rounded-lg px-4 group bg-muted/30">
          <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
          <span className="font-medium text-sm">Energy Cards</span>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <div className="grid gap-4 md:grid-cols-5">
            {/* Today's Animal - GG33 Focus */}
            <Card className="bg-card/50 h-full">
              <CardContent className="pt-6 pb-6 flex flex-col h-full">
                <div className="flex gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 flex-shrink-0">
                    <span className="text-xl flex-shrink-0">{todayAnimalIcon}</span>
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Animal of Year
                    </p>
                    <div className="mb-3">
                      <p className="text-3xl font-bold" data-testid="energy-today-animal">
                        {todayAnimal}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* This Year's Theme */}
            <Card className="bg-card/50 h-full">
              <CardContent className="pt-6 pb-6 flex flex-col h-full">
                <div className="flex gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 flex-shrink-0">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Year Theme
                    </p>
                    <div className="mb-3">
                      <p className="text-3xl font-bold" data-testid="energy-year-number">
                        {yearNumber}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {yearMeaning.core}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-auto leading-relaxed">
                      {today.getFullYear()} yearly focus
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

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
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
