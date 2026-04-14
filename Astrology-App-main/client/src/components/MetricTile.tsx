import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricTileProps {
  label?: string;
  title?: string;
  value: number | string;
  subtitle?: string;
  description?: string;
  highlight?: boolean;
  icon?: any;
  testId?: string;
  variant?: "default" | "primary" | "accent";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function MetricTile({ 
  label, 
  title,
  value, 
  subtitle,
  description, 
  highlight,
  icon: Icon,
  testId,
  variant = "default",
  size = "md",
  className 
}: MetricTileProps) {
  const displayLabel = label || title;
  const displaySubtitle = subtitle;
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
    <Card className={cn(variantClasses[variant], highlight && "border-primary bg-primary/5", className)}>
      <CardContent className="p-6 text-center">
        <div className="flex flex-col items-center justify-center gap-2">
          {Icon && <Icon className="h-5 w-5 text-primary mb-1" />}
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {displayLabel}
          </p>
        </div>
        <p className={cn("font-black mt-2", sizeClasses[size])} data-testid={testId}>
          {value}
        </p>
        {displaySubtitle && (
          <p className="mt-1 text-xs font-medium text-primary">
            {displaySubtitle}
          </p>
        )}
        {description && (
          <p className="mt-2 text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
