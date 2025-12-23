import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Sparkles } from "lucide-react";
import { getDailyForecast } from "@/lib/numerology";
import { format } from "date-fns";

interface DailyForecastProps {
  personalDay: number;
  date?: Date;
}

export function DailyForecast({ personalDay, date = new Date() }: DailyForecastProps) {
  const forecast = getDailyForecast(personalDay);

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
              <span className="text-3xl font-black text-primary" data-testid="text-personal-day">
                {personalDay}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {format(date, "EEEE, MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  Personal Day {personalDay}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex-1 md:border-l md:pl-6 border-border">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Daily Forecast
              </span>
            </div>
            <p className="text-lg leading-relaxed" data-testid="text-daily-forecast">
              {forecast}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
