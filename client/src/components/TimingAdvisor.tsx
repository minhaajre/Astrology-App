import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Star, Zap } from "lucide-react";
import { getOptimalDays, type OptimalDay } from "@/lib/numerology";
import { SpecialDatesInfo } from "./SpecialDatesInfo";
import { format } from "date-fns";

interface TimingAdvisorProps {
  dob: Date;
}

export function TimingAdvisor({ dob }: TimingAdvisorProps) {
  const optimalDays = getOptimalDays(dob, 30);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Top 10 Optimal Days
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Days when your Personal Day aligns with your core numbers
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {optimalDays.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No matching days found in the next 30 days
            </p>
          ) : (
            optimalDays.map((day, index) => (
              <OptimalDayCard key={day.date.toISOString()} day={day} rank={index + 1} />
            ))
          )}
        </CardContent>
      </Card>

      <SpecialDatesInfo />
    </div>
  );
}

function OptimalDayCard({ day, rank }: { day: OptimalDay; rank: number }) {
  const isToday = format(day.date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
  const isTripleMatch = day.matches.length >= 3;
  const isDoubleMatch = day.matches.length === 2;

  return (
    <div 
      className={`flex items-center gap-4 rounded-lg border p-4 ${
        isTripleMatch ? "border-primary/40 bg-primary/5" : 
        isDoubleMatch ? "border-chart-2/30 bg-chart-2/5" : ""
      }`}
      data-testid={`timing-day-${rank}`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-bold">
        #{rank}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium">
            {format(day.date, "EEEE, MMM d")}
          </span>
          {isToday && (
            <Badge variant="default" className="text-xs">
              Today
            </Badge>
          )}
          {isTripleMatch && (
            <Badge variant="secondary" className="text-xs">
              <Zap className="mr-1 h-3 w-3" />
              Triple Match
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-sm text-muted-foreground">
            Personal Day {day.personalDay}
          </span>
          <span className="text-muted-foreground">|</span>
          <div className="flex gap-1 flex-wrap">
            {day.matches.map((match) => (
              <Badge key={match} variant="outline" className="text-xs">
                <Star className="mr-1 h-3 w-3" />
                {match}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
