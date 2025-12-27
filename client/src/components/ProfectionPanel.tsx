import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { profections, houseThemes } from "@/data/profections";
import { calculateProfectionYear } from "@/lib/numerology";
import { HelpCircle, AlertCircle, Sparkles, BookOpen, Download, Maximize2, Info } from "lucide-react";
import wheelImage from "@assets/image_1766847825598.png";

interface ProfectionPanelProps {
  birthDate: Date;
}

export function ProfectionPanel({ birthDate }: ProfectionPanelProps) {
  const houseNumber = calculateProfectionYear(birthDate);
  const data = profections[houseNumber];

  if (!data) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = wheelImage;
    link.download = 'profection-wheel.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="border-primary/20 bg-card/50">
      <CardHeader>
        <div className="flex flex-col gap-6">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
              <Info className="h-6 w-6" />
              What is a Profection Wheel?
            </h3>
            <div className="text-muted-foreground space-y-3">
              <p>
                Annual Profections are an ancient Hellenistic timing technique that identifies a specific "Time Lord" and life theme for each year of your life. 
                Your chart is divided into 12 houses, and every birthday, the "focus" of your year shifts to the next house in a 12-year cycle.
              </p>
              <p>
                <strong>How to use it:</strong> Identify your current age, find the corresponding house, and look at the themes of that house. 
                This house becomes the "stage" where the main events of your year will play out.
              </p>
              <p>
                <strong>What it signifies:</strong> It acts as a spotlight, highlighting which areas of life (career, relationships, health, etc.) will be most active and significant during this specific 12-month period.
              </p>
            </div>
          </div>

          <div className="relative group">
            <Dialog>
              <DialogTrigger asChild>
                <div className="relative cursor-pointer overflow-hidden rounded-lg border border-primary/20 hover:border-primary/50 transition-colors">
                  <img src={wheelImage} alt="Profection Wheel" className="w-full h-auto object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Maximize2 className="h-12 w-12 text-white" />
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none">
                <img src={wheelImage} alt="Profection Wheel Enlarged" className="w-full h-auto" />
              </DialogContent>
            </Dialog>
            <div className="absolute top-2 right-2 flex gap-2">
              <Button size="sm" variant="secondary" className="bg-background/80 backdrop-blur-sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download Wheel
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-primary/20">
                  <th className="py-2 px-4 font-bold text-primary">House</th>
                  <th className="py-2 px-4 font-bold text-primary">Main Themes</th>
                  <th className="py-2 px-4 font-bold text-primary">Ages</th>
                </tr>
              </thead>
              <tbody>
                {houseThemes.map((h) => (
                  <tr key={h.house} className={`border-b border-primary/10 ${h.house === houseNumber ? 'bg-primary/5' : ''}`}>
                    <td className="py-2 px-4 font-medium">{h.house}{h.house === 1 ? 'st' : h.house === 2 ? 'nd' : h.house === 3 ? 'rd' : 'th'}</td>
                    <td className="py-2 px-4">{h.theme}</td>
                    <td className="py-2 px-4 text-xs text-muted-foreground">{h.ages.join(', ')}...</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardHeader>
      
      <div className="px-6 py-4 bg-primary/5 border-y border-primary/10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <span className="text-primary font-bold">Current: {data.house}{data.house === 1 ? 'st' : data.house === 2 ? 'nd' : data.house === 3 ? 'rd' : 'th'} House</span>
              Year
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
        </div>
      </div>

      <CardContent className="space-y-6 pt-6">
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
