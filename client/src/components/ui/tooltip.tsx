import { createContext, useContext, useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

const TooltipContext = createContext<Record<string, never>>({});

export function TooltipProvider({ children }: { children: ReactNode }) {
  return <TooltipContext.Provider value={{}}>{children}</TooltipContext.Provider>;
}

export function Tooltip({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function TooltipTrigger({ children, asChild }: { children: ReactNode; asChild?: boolean }) {
  return <>{children}</>;
}

export function TooltipContent({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "z-50 rounded-md bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
}
