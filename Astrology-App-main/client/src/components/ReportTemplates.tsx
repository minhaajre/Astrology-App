import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { reportTemplates, getReportTemplate, type ReportTemplate } from "@/lib/numerology";
import { FileText, Star, Lightbulb } from "lucide-react";

interface ReportTemplatesProps {
  lifePath?: number;
  dayNumber?: number;
  monthNumber?: number;
}

export function ReportTemplates({ lifePath, dayNumber, monthNumber }: ReportTemplatesProps) {
  const matchingTemplate = lifePath && dayNumber && monthNumber 
    ? getReportTemplate(lifePath, dayNumber, monthNumber) 
    : null;

  return (
    <div className="space-y-6">
      {matchingTemplate && (
        <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-transparent">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              <CardTitle>Your Personal Archetype</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Based on your Life Path {lifePath}, Day {dayNumber}, Month {monthNumber} combination
            </p>
          </CardHeader>
          <CardContent>
            <TemplateContent template={matchingTemplate} featured />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Common Number Combinations
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Pre-analyzed archetypes for popular Life Path + Day + Month patterns
          </p>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="space-y-2">
            {reportTemplates.map((template) => {
              const isMatch = template.combo === `${lifePath}-${dayNumber}-${monthNumber}`;
              
              return (
                <AccordionItem key={template.id} value={template.id} className="border-0">
                  <Card className={isMatch ? "border-primary/30" : ""}>
                    <AccordionTrigger className="px-4 py-3 hover:no-underline" data-testid={`template-${template.combo}`}>
                      <div className="flex items-center gap-3 text-left">
                        <Badge variant="outline" className="font-mono">
                          {template.combo}
                        </Badge>
                        <div>
                          <span className="font-semibold">{template.name}</span>
                          {isMatch && (
                            <Badge className="ml-2 text-xs">Your Pattern</Badge>
                          )}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <TemplateContent template={template} />
                    </AccordionContent>
                  </Card>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

function TemplateContent({ template, featured = false }: { template: ReportTemplate; featured?: boolean }) {
  return (
    <div className="space-y-4">
      <div className={featured ? "text-center mb-6" : ""}>
        <Badge variant="secondary" className={featured ? "text-base px-4 py-1" : ""}>
          {template.archetype}
        </Badge>
      </div>

      <div className="rounded-lg bg-muted/50 p-4">
        <p className="leading-relaxed">{template.summary}</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          Key Insights
        </div>
        <ul className="space-y-2">
          {template.keyInsights.map((insight, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
