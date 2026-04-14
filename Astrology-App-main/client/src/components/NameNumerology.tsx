import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getNameNumerology, numberMeanings } from "@/lib/numerology";
import { User, Hash, Heart, Eye } from "lucide-react";

interface NameNumerologyProps {
  initialName?: string;
}

export function NameNumerology({ initialName = "" }: NameNumerologyProps) {
  const [name, setName] = useState(initialName);
  const [result, setResult] = useState<ReturnType<typeof getNameNumerology> | null>(null);

  const handleCalculate = () => {
    if (name.trim()) {
      setResult(getNameNumerology(name));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Name Numerology
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Calculate your Expression, Soul Urge, and Personality numbers
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-3">
          <div className="flex-1">
            <Label htmlFor="nameInput" className="sr-only">Full Name</Label>
            <Input
              id="nameInput"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
              data-testid="input-name-numerology"
            />
          </div>
          <Button onClick={handleCalculate} disabled={!name.trim()} data-testid="button-calculate-name">
            Calculate
          </Button>
        </div>

        {result && (
          <div className="space-y-4">
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                Letters Analyzed
              </p>
              <p className="text-2xl font-mono tracking-widest">
                {result.clean}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card className="border-primary/20">
                <CardContent className="p-4 text-center">
                  <Hash className="mx-auto mb-2 h-5 w-5 text-primary" />
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                    Expression
                  </p>
                  <p className="text-3xl font-black" data-testid="text-expression-number">
                    {result.expressionNumber}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {numberMeanings[result.expressionNumber]?.core || "Your talents and abilities"}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-pink-500/20">
                <CardContent className="p-4 text-center">
                  <Heart className="mx-auto mb-2 h-5 w-5 text-pink-500" />
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                    Soul Urge
                  </p>
                  <p className="text-3xl font-black" data-testid="text-soul-urge">
                    {result.soulUrge}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {numberMeanings[result.soulUrge]?.core || "Your heart's desire"}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-500/20">
                <CardContent className="p-4 text-center">
                  <Eye className="mx-auto mb-2 h-5 w-5 text-blue-500" />
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                    Personality
                  </p>
                  <p className="text-3xl font-black" data-testid="text-personality-number">
                    {result.personality}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {numberMeanings[result.personality]?.core || "How others see you"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="rounded-lg border p-4 space-y-3">
              <p className="text-sm font-medium">How Name Numerology Works</p>
              <div className="grid gap-2 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Expression Number:</strong> Calculated from all letters in your name. Represents your natural talents and life purpose.
                </p>
                <p>
                  <strong className="text-foreground">Soul Urge:</strong> Calculated from vowels only (A, E, I, O, U). Reveals your inner desires and motivation.
                </p>
                <p>
                  <strong className="text-foreground">Personality:</strong> Calculated from consonants only. Shows how others perceive you initially.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
