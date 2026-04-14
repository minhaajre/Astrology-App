import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { numberMeanings, type NumberMeaning } from "@/lib/numerology";
import { Briefcase, Heart, DollarSign, AlertTriangle, Star, Moon } from "lucide-react";

interface NumberAccordionProps {
  highlightNumbers?: number[];
  personData?: any;
  timingAdvisor?: any;
  template?: any;
}

export function NumberAccordion({ 
  highlightNumbers = [], 
  personData, 
  timingAdvisor, 
  template 
}: NumberAccordionProps) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];

  return (
    <Accordion type="single" collapsible className="space-y-3">
      {numbers.map((num) => {
        const meaning = numberMeanings[num];
        const isHighlighted = highlightNumbers.includes(num);
        const isMaster = num >= 11;

        return (
          <AccordionItem 
            key={num} 
            value={String(num)}
            className="border-0"
          >
            <Card className={isHighlighted ? "border-primary/30 bg-primary/5" : ""}>
              <AccordionTrigger className="px-6 py-4 hover:no-underline" data-testid={`accordion-number-${num}`}>
                <div className="flex items-center gap-4 text-left">
                  <span className="text-3xl font-black">
                    {num}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold">{meaning.core}</span>
                      {isMaster && (
                        <Badge variant="secondary" className="text-xs">
                          {meaning.masterLabel || "Master Number"}
                        </Badge>
                      )}
                      {isHighlighted && (
                        <Badge className="text-xs">
                          Your Number
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {meaning.essence.substring(0, 120)}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <NumberDetails meaning={meaning} />
              </AccordionContent>
            </Card>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

function NumberDetails({ meaning }: { meaning: NumberMeaning }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-muted/50 p-4">
        <p className="leading-relaxed text-foreground/90">
          {meaning.essence}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-green-500 dark:text-green-400">
            <Star className="h-4 w-4" />
            Strengths
          </div>
          <ul className="space-y-1.5">
            {meaning.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 dark:bg-green-400" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-500 dark:text-amber-400">
            <AlertTriangle className="h-4 w-4" />
            Shadow Traits
          </div>
          <ul className="space-y-1.5">
            {meaning.traps.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 dark:bg-amber-400" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-500 dark:text-blue-400">
            <DollarSign className="h-4 w-4" />
            Money Patterns
          </div>
          <ul className="space-y-1.5">
            {meaning.money.map((m, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 dark:bg-blue-400" />
                {m}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-pink-500 dark:text-pink-400">
            <Heart className="h-4 w-4" />
            Relationships
          </div>
          <ul className="space-y-1.5">
            {meaning.relationships.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-pink-500 dark:bg-pink-400" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-purple-500 dark:text-purple-400">
          <Moon className="h-4 w-4" />
          Shadow Work
        </div>
        <p className="text-sm italic leading-relaxed text-muted-foreground">
          {meaning.shadowWork}
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Briefcase className="h-4 w-4" />
          Career Examples
        </div>
        <div className="flex flex-wrap gap-2">
          {meaning.careers.map((c, i) => (
            <Badge key={i} variant="secondary">
              {c}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
