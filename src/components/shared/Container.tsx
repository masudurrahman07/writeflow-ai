import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * "default" → max-w-7xl  (1280px)  — general page sections
   * "narrow"  → max-w-3xl  (768px)   — prose / auth pages
   * "wide"    → max-w-screen-2xl     — full-bleed dashboards
   */
  size?: "default" | "narrow" | "wide";
}

/**
 * Container
 * Consistent max-width wrapper with responsive horizontal padding.
 * Breakpoints: 375px (px-4) → 768px (px-6) → 1280px (px-8)
 */
export function Container({
  size = "default",
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        // Horizontal padding — mobile → tablet → desktop
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        // Max-width variants
        {
          "max-w-7xl": size === "default",
          "max-w-3xl": size === "narrow",
          "max-w-screen-2xl": size === "wide",
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
