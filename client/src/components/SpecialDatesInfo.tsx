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
  // Sort dates chronologically 1-31
  const sortedDates = [...specialDates].sort((a, b) => a.date - b.date);

  return (
    <div className="space-y-6">
      <Accordion type="single" collapsible className="space-y-2">
        {sortedDates.map((dateInfo) => (
          <AccordionItem
            key={dateInfo.date}
            value={String(dateInfo.date)}
            className="border border-muted rounded-lg"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline" data-testid={`date-${dateInfo.date}`}>
              <div className="flex items-center gap-4 w-full text-left">
                <span className="font-bold text-xl w-10">{dateInfo.date}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm truncate">{dateInfo.theme}</span>
                    <Badge variant="secondary" className="text-[10px] h-4">
                      {dateInfo.category}
                    </Badge>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs ml-auto shrink-0">
                  {dateInfo.number}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4">
                {dateInfo.note && (
                  <p className="text-xs text-muted-foreground italic bg-muted/30 p-2 rounded">
                    {dateInfo.note}
                  </p>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <p className="text-xs font-semibold text-green-600 dark:text-green-400">
                        Best for
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {dateInfo.bestFor.join(", ")}
                    </p>
                  </div>
                  {dateInfo.avoidFor && (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                          Avoid
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {dateInfo.avoidFor.join(", ")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
