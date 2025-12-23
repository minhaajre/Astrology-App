import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp, AlertCircle } from "lucide-react";

interface CountryCompatibilityProps {
  lifePath: number;
}

const countryCompatibility: Record<number, {
  favorable: { name: string; reason: string }[];
  challenging: { name: string; reason: string }[];
}> = {
  1: {
    favorable: [
      { name: "USA", reason: "Innovation and entrepreneurship" },
      { name: "Germany", reason: "Leadership and determination" },
      { name: "Japan", reason: "Pioneer spirit and excellence" },
    ],
    challenging: [
      { name: "Vatican City", reason: "Requires cooperation over independence" },
      { name: "Bhutan", reason: "Collective focus vs individual drive" },
    ],
  },
  2: {
    favorable: [
      { name: "Switzerland", reason: "Balance and harmony" },
      { name: "Denmark", reason: "Cooperation and diplomacy" },
      { name: "Canada", reason: "Peaceful coexistence" },
    ],
    challenging: [
      { name: "Singapore", reason: "Strict rules limit sensitivity" },
      { name: "Hong Kong", reason: "Competitive over collaborative" },
    ],
  },
  3: {
    favorable: [
      { name: "Italy", reason: "Art and cultural expression" },
      { name: "France", reason: "Creativity and sophistication" },
      { name: "Spain", reason: "Joy and creative freedom" },
    ],
    challenging: [
      { name: "North Korea", reason: "Restricted expression" },
      { name: "China", reason: "Limited creative freedom" },
    ],
  },
  4: {
    favorable: [
      { name: "Netherlands", reason: "Practical systems and organization" },
      { name: "Norway", reason: "Stability and foundations" },
      { name: "South Korea", reason: "Structure and discipline" },
    ],
    challenging: [
      { name: "Brazil", reason: "Unpredictable chaos" },
      { name: "Greece", reason: "Economic instability" },
    ],
  },
  5: {
    favorable: [
      { name: "Australia", reason: "Freedom and adventure" },
      { name: "Mexico", reason: "Dynamic change and culture" },
      { name: "Thailand", reason: "Exploration and adaptation" },
    ],
    challenging: [
      { name: "Iceland", reason: "Limited diversity of experience" },
      { name: "New Zealand", reason: "Isolation and remoteness" },
    ],
  },
  6: {
    favorable: [
      { name: "Portugal", reason: "Family and community values" },
      { name: "Greece", reason: "Harmony and tradition" },
      { name: "Ireland", reason: "Community and care focus" },
    ],
    challenging: [
      { name: "Australia", reason: "Too much freedom vs responsibility" },
      { name: "Las Vegas", reason: "Excess over service" },
    ],
  },
  7: {
    favorable: [
      { name: "India", reason: "Spiritual depth and wisdom" },
      { name: "Nepal", reason: "Introspection and nature" },
      { name: "Peru", reason: "Mystical and archaeological heritage" },
    ],
    challenging: [
      { name: "Russia", reason: "Extreme climate and isolation" },
      { name: "Saudi Arabia", reason: "Restrictive spiritually" },
    ],
  },
  8: {
    favorable: [
      { name: "China", reason: "Prosperity and business power" },
      { name: "Dubai", reason: "Wealth and ambition" },
      { name: "Singapore", reason: "Material success and power" },
    ],
    challenging: [
      { name: "Somalia", reason: "Instability and poverty" },
      { name: "Myanmar", reason: "Economic restriction" },
    ],
  },
  9: {
    favorable: [
      { name: "Kenya", reason: "Humanitarian and universal service" },
      { name: "South Africa", reason: "Diversity and humanity" },
      { name: "Argentina", reason: "Artistic and universal culture" },
    ],
    challenging: [
      { name: "North Korea", reason: "Restricted compassion" },
      { name: "Iran", reason: "Limited universal perspective" },
    ],
  },
  11: {
    favorable: [
      { name: "Switzerland", reason: "Balance of vision and practicality" },
      { name: "Sweden", reason: "Innovation with intuition" },
      { name: "Finland", reason: "Visionary thinking" },
    ],
    challenging: [
      { name: "Venezuela", reason: "Chaotic vision without foundation" },
      { name: "Pakistan", reason: "Instability vs enlightenment" },
    ],
  },
  22: {
    favorable: [
      { name: "Germany", reason: "Building master works" },
      { name: "UAE", reason: "Grand projects and infrastructure" },
      { name: "Canada", reason: "Building harmonious systems" },
    ],
    challenging: [
      { name: "Haiti", reason: "Lack of resources for projects" },
      { name: "Chad", reason: "Too few infrastructural opportunities" },
    ],
  },
  33: {
    favorable: [
      { name: "Norway", reason: "Universal compassion and wisdom" },
      { name: "Costa Rica", reason: "Peaceful service to all" },
      { name: "Uruguay", reason: "Harmonious universal culture" },
    ],
    challenging: [
      { name: "Syria", reason: "Suffering vs healing mission" },
      { name: "Yemen", reason: "Crisis over wisdom" },
    ],
  },
};

export function CountryCompatibility({ lifePath }: CountryCompatibilityProps) {
  const compatibility = countryCompatibility[lifePath];

  if (!compatibility) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Geographic Compatibility
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Countries aligned with Life Path {lifePath} energy for optimal growth
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <h3 className="font-semibold">Favorable Countries</h3>
            </div>
            <div className="space-y-3">
              {compatibility.favorable.map((country, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-green-200/50 bg-green-50/30 dark:border-green-900/30 dark:bg-green-950/20 p-3">
                  <Badge variant="secondary" className="mt-0.5 flex-shrink-0">
                    {country.name}
                  </Badge>
                  <p className="text-sm text-muted-foreground">{country.reason}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <h3 className="font-semibold">Challenging Environments</h3>
            </div>
            <div className="space-y-3">
              {compatibility.challenging.map((country, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-amber-200/50 bg-amber-50/30 dark:border-amber-900/30 dark:bg-amber-950/20 p-3">
                  <Badge variant="outline" className="mt-0.5 flex-shrink-0">
                    {country.name}
                  </Badge>
                  <p className="text-sm text-muted-foreground">{country.reason}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">
              These associations reflect numerological energy patterns. Your individual preferences, circumstances, and personal growth also play important roles in choosing where to live or travel.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
