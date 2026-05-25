import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { HTMLAttributes } from "react";

interface SkeletonCardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * "document" — mimics a document / blog card (image + title + excerpt)
   * "stat"     — mimics a dashboard stat card (icon + number + label)
   * "profile"  — mimics a user profile card (avatar + name + bio)
   */
  variant?: "document" | "stat" | "profile";
  /** Number of skeleton cards to render side-by-side in a grid */
  count?: number;
}

/** Single document-style skeleton */
function DocumentSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-5 space-y-4 shadow-sm",
        className
      )}
    >
      {/* Thumbnail */}
      <Skeleton className="h-40 w-full rounded-md" />
      {/* Badge + date row */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-4 w-24 rounded" />
      </div>
      {/* Title */}
      <Skeleton className="h-5 w-3/4 rounded" />
      {/* Excerpt lines */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-5/6 rounded" />
        <Skeleton className="h-4 w-4/6 rounded" />
      </div>
      {/* Footer row */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-7 rounded-full" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </div>
  );
}

/** Single stat-style skeleton */
function StatSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-5 space-y-3 shadow-sm",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28 rounded" />
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>
      <Skeleton className="h-8 w-24 rounded" />
      <Skeleton className="h-3 w-36 rounded" />
    </div>
  );
}

/** Single profile-style skeleton */
function ProfileSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-5 space-y-4 shadow-sm",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <Skeleton className="h-14 w-14 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32 rounded" />
          <Skeleton className="h-4 w-48 rounded" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-5/6 rounded" />
      </div>
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-8 w-24 rounded-md" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
    </div>
  );
}

const variantMap = {
  document: DocumentSkeleton,
  stat: StatSkeleton,
  profile: ProfileSkeleton,
};

/**
 * SkeletonCard
 * Reusable loading placeholder that mirrors real card layouts.
 * Renders `count` cards in a responsive grid.
 *
 * @example
 * <SkeletonCard variant="document" count={3} />
 * <SkeletonCard variant="stat" count={4} />
 */
export function SkeletonCard({
  variant = "document",
  count = 1,
  className,
  ...props
}: SkeletonCardProps) {
  const Card = variantMap[variant];

  if (count === 1) {
    return <Card className={className} {...(props as object)} />;
  }

  return (
    <div
      className={cn(
        "grid gap-4",
        // Responsive grid columns based on count
        count === 2 && "grid-cols-1 sm:grid-cols-2",
        count === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        count >= 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
      aria-busy="true"
      aria-label="Loading content"
      {...props}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} />
      ))}
    </div>
  );
}
