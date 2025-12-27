import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { profections } from "@/data/profections";
import { calculateProfectionYear } from "@/lib/numerology";
import { HelpCircle, AlertCircle, Sparkles, BookOpen } from "lucide-react";

interface ProfectionPanelProps {
  birthDate: Date;
}

export function ProfectionPanel({ birthDate }: ProfectionPanelProps) {
  const houseNumber = calculateProfectionYear(birthDate);
  const data = profections[houseNumber];

  if (!data) return null;

  return (
    <Card className="border-primary/20 bg-card/50">
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="text-xl flex items-center gap-2">
            <span className="text-primary font-bold">{data.house}{data.house === 1 ? 'st' : data.house === 2 ? 'nd' : data.house === 3 ? 'rd' : 'th'} House</span>
            Profection Year
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1 italic capitalize">
            Focus: {data.focus}
          </p>
        </div>
        {data.planetary_joy && (
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 shrink-0">
            <Sparkles className="h-3 w-3 mr-1" />
            {data.planetary_joy}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-base leading-relaxed">
          {data.copy}
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="how-to-use" className="border-primary/10">
            <AccordionTrigger className="hover:no-underline py-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <HelpCircle className="h-4 w-4 text-primary" />
                How to use this year
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="grid gap-2 pl-2">
                {data.how_to_use.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="prompts" className="border-primary/10">
            <AccordionTrigger className="hover:no-underline py-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <BookOpen className="h-4 w-4 text-primary" />
                Reflection Prompts
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-3 pl-2">
                {data.prompts.map((prompt, i) => (
                  <div key={i} className="p-3 rounded-md bg-primary/5 border border-primary/10 text-sm italic">
                    "{prompt}"
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="cautions" className="border-none">
            <AccordionTrigger className="hover:no-underline py-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                Areas for Awareness
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="grid gap-2 pl-2">
                {data.cautions.map((caution, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-500/40 mt-1.5 shrink-0" />
                    {caution}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="pt-4 border-t border-primary/10">
          <p className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-md border border-border">
            <span className="font-semibold text-primary">Note:</span> Look to the sign of this house and its ruler for detail.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
