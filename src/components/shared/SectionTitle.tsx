import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface SectionTitleProps extends HTMLAttributes<HTMLDivElement> {
  /** Main heading text */
  heading: string;
  /** Optional supporting subheading */
  subheading?: string;
  /**
   * "left"   — left-aligned (default for content sections)
   * "center" — centered (hero / feature sections)
   */
  align?: "left" | "center";
  /**
   * Semantic heading level rendered in the DOM.
   * Defaults to h2.
   */
  as?: "h1" | "h2" | "h3";
  /** Highlight a portion of the heading with the brand accent color */
  highlight?: string;
}

/**
 * SectionTitle
 * Reusable heading + subheading block used across landing and dashboard pages.
 * Supports dark mode, responsive type scale, and optional text highlight.
 */
export function SectionTitle({
  heading,
  subheading,
  align = "left",
  as: Tag = "h2",
  highlight,
  className,
  ...props
}: SectionTitleProps) {
  // Inject highlighted span if a highlight string is provided
  const renderedHeading = highlight ? (
    <>
      {heading.split(highlight).map((part, i, arr) => (
        <span key={i}>
          {part}
          {i < arr.length - 1 && (
            <span className="text-primary">{highlight}</span>
          )}
        </span>
      ))}
    </>
  ) : (
    heading
  );

  return (
    <div
      className={cn(
        "space-y-3",
        align === "center" && "text-center",
        className
      )}
      {...props}
    >
      <Tag
        className={cn(
          // Responsive type scale
          "font-bold tracking-tight text-foreground",
          "text-2xl sm:text-3xl lg:text-4xl",
          // h1 gets a larger scale
          Tag === "h1" && "text-3xl sm:text-4xl lg:text-5xl xl:text-6xl"
        )}
      >
        {renderedHeading}
      </Tag>

      {subheading && (
        <p
          className={cn(
            "text-muted-foreground",
            "text-base sm:text-lg",
            // Constrain line length for readability
            align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"
          )}
        >
          {subheading}
        </p>
      )}
    </div>
  );
}
