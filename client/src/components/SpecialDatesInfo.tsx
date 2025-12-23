import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { specialDates } from "@/lib/numerology";
import { AlertCircle, CheckCircle } from "lucide-react";

export function SpecialDatesInfo() {
  // Group dates by category
  const datesByCategory = specialDates.reduce((acc, dateInfo) => {
    if (!acc[dateInfo.category]) {
      acc[dateInfo.category] = [];
    }
    acc[dateInfo.category].push(dateInfo);
    return acc;
  }, {} as Record<string, typeof specialDates>);

  // Sort categories chronologically by the minimum date in each category
  const categoryOrder = [
    "👑 Leadership & Control",
    "📢 Expression & Visibility",
    "❤️ Relationships & Harmony",
    "🧱 Structure & Systems",
    "🌍 Change & Travel",
    "💰 Money & Wealth",
    "🧠 Knowledge & Strategy",
    "🔮 Completion & Transition",
    "🧩 Master Numbers",
  ];

  const sortedCategories = categoryOrder.filter((cat) => datesByCategory[cat]);

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Special Calendar Days</CardTitle>
        <p className="text-sm text-muted-foreground">
          Recurring date themes for optimal planning and awareness
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground border border-muted">
          <p>
            These dates amplify certain themes throughout the month. They do not force outcomes—awareness determines results.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {sortedCategories.map((category) => (
            <AccordionItem
              key={category}
              value={category}
              className="border border-muted rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline bg-card/50 hover:bg-card" data-testid={`category-${category}`}>
                <span className="font-semibold text-sm">{category}</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-6 pt-0 bg-background/50">
                <div className="grid gap-3">
                  {(datesByCategory[category] || [])
                    .sort((a, b) => a.date - b.date)
                    .map((dateInfo) => (
                      <div
                        key={dateInfo.date}
                        className="rounded-lg border border-muted p-3 space-y-2"
                        data-testid={`special-date-${dateInfo.date}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-lg">{dateInfo.date}th</span>
                              {dateInfo.note && (
                                <span className="text-xs text-muted-foreground">
                                  {dateInfo.note}
                                </span>
                              )}
                            </div>
                            <p className="text-sm font-medium">{dateInfo.theme}</p>
                          </div>
                          <Badge variant="outline" className="text-xs shrink-0">
                            {dateInfo.number}
                          </Badge>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs font-semibold text-green-600 dark:text-green-400">
                                Best for
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {dateInfo.bestFor.join(", ")}
                              </p>
                            </div>
                          </div>
                          {dateInfo.avoidFor && (
                            <div className="flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                              <div>
                                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                                  Avoid
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {dateInfo.avoidFor.join(", ")}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
