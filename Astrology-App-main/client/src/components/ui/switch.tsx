import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, onCheckedChange, checked, ...props }, ref) => (
    <label className={cn("relative inline-flex h-5 w-9 cursor-pointer items-center", className)}>
      <input
        type="checkbox"
        ref={ref}
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        className="sr-only peer"
        {...props}
      />
      <span className="h-5 w-9 rounded-full bg-input transition-colors peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring" />
      <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-background shadow-sm transition-transform peer-checked:translate-x-4" />
    </label>
  )
);
Switch.displayName = "Switch";
