import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricTileProps {
  label: string;
  value: number | string;
  description?: string;
  variant?: "default" | "primary" | "accent";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function MetricTile({ 
  label, 
  value, 
  description, 
  variant = "default",
  size = "md",
  className 
}: MetricTileProps) {
  const sizeClasses = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-5xl"
  };

  const variantClasses = {
    default: "",
    primary: "border-primary/20 bg-primary/5",
    accent: "border-chart-1/20 bg-chart-1/5"
  };

  return (
    <Card className={cn(variantClasses[variant], className)}>
      <CardContent className="p-6 text-center">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className={cn("font-black", sizeClasses[size])} data-testid={`text-${label.toLowerCase().replace(/\s+/g, "-")}`}>
          {value}
        </p>
        {description && (
          <p className="mt-2 text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
