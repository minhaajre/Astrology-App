import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Lightbulb, TrendingUp } from "lucide-react";
import { getWeeklyForecast, getMonthlyForecast, getYearlyForecast } from "@/lib/numerology";

interface TimePeriodForecastsProps {
  personalDay: number;
  personalMonth: number;
  personalYear: number;
}

export function TimePeriodForecasts({
  personalDay,
  personalMonth,
  personalYear,
}: TimePeriodForecastsProps) {
  const weekly = getWeeklyForecast(personalDay);
  const monthly = getMonthlyForecast(personalMonth);
  const yearly = getYearlyForecast(personalYear);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Weekly */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <CardTitle className="text-base">This Week</CardTitle>
            </div>
            <Badge variant="secondary" className="w-fit">
              Personal Day {personalDay}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {weekly.forecast}
              </p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3 border-l-2 border-blue-500">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <p className="font-semibold mb-1">Practical Strategy</p>
                  <p>{weekly.strategy}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-green-500" />
              <CardTitle className="text-base">This Month</CardTitle>
            </div>
            <Badge variant="secondary" className="w-fit">
              Personal Month {personalMonth}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {monthly.forecast}
              </p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3 border-l-2 border-green-500">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <p className="font-semibold mb-1">Practical Strategy</p>
                  <p>{monthly.strategy}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Yearly */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <CardTitle className="text-base">This Year</CardTitle>
            </div>
            <Badge variant="secondary" className="w-fit">
              Personal Year {personalYear}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {yearly.forecast}
              </p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3 border-l-2 border-purple-500">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <p className="font-semibold mb-1">Practical Strategy</p>
                  <p>{yearly.strategy}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
