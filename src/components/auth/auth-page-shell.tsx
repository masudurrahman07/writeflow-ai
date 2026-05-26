"use client";

import type { ReactNode } from "react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.06 3.29 9.36 7.86 10.89.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.69-3.88-1.54-3.88-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.75.4-1.24.73-1.53-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.08 11.08 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.18-1.18 3.18-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.26 5.69.41.35.78 1.04.78 2.1 0 1.52-.01 2.74-.01 3.11 0 .31.2.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

export function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M18.9 2H22l-6.6 7.54L23.5 22h-6.1l-4.8-6.23L7.1 22H4l7.1-8.1L.5 2h6.2l4.3 5.7L18.9 2Zm-2.1 18h1.7L7.1 4H5.3l11.5 16Z" />
    </svg>
  );
}

export function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M20.45 20.45h-3.55v-5.55c0-1.32-.03-3.02-1.84-3.02-1.84 0-2.12 1.44-2.12 2.93v5.64H9.39V9.01h3.41v1.56h.05c.47-.9 1.62-1.84 3.34-1.84 3.58 0 4.24 2.35 4.24 5.41v6.31ZM5.33 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.55V9.01h3.56v11.44ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.22.79 24 1.77 24h20.45C23.2 24 24 23.22 24 22.28V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

export function SocialIconButton({
  icon: Icon,
  label,
  onClick,
  disabled = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="h-11 w-11 rounded-xl border-border/70 bg-background/80 hover:border-primary/40 hover:bg-primary/10"
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}

export function AuthPageShell({
  badge,
  title,
  subtitle,
  children,
  footer,
}: {
  badge: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.25),transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.22),transparent_26%),linear-gradient(135deg,hsl(var(--background)),hsl(var(--muted)))] px-4 py-8 sm:px-6">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-4%] h-56 w-56 rounded-full bg-primary/15 blur-3xl animate-pulse" />
        <div className="absolute bottom-[-8%] right-[-6%] h-64 w-64 rounded-full bg-sky-500/15 blur-3xl animate-pulse" />
        <div className="absolute left-[8%] top-[18%] h-24 w-24 rounded-full bg-cyan-400/20 blur-2xl" />
        <div className="absolute bottom-[20%] left-[15%] h-20 w-20 rounded-full bg-blue-400/20 blur-2xl" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col items-center justify-center gap-8">
        <div className="flex w-full items-center justify-start gap-4">
          <Link href="/" className="text-sm font-semibold tracking-[0.2em] text-foreground/70">
            WRITEFLOW AI
          </Link>
        </div>

        <div className="grid w-full items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6 max-lg:text-center">
            <Badge className="rounded-full border-primary/30 bg-primary/10 text-primary">
              {badge}
            </Badge>
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {title}
              </h1>
              <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                {subtitle}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-card/60 px-4 py-3 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Speed</p>
                <p className="mt-2 text-lg font-semibold text-foreground">Instant</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-card/60 px-4 py-3 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Security</p>
                <p className="mt-2 text-lg font-semibold text-foreground">Protected</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-card/60 px-4 py-3 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Focus</p>
                <p className="mt-2 text-lg font-semibold text-foreground">Flow-first</p>
              </div>
            </div>
          </div>

          <Card className="w-full border-white/10 bg-card/75 shadow-[0_25px_80px_-30px_rgba(15,23,42,0.55)] backdrop-blur-2xl">
            <CardHeader className="space-y-2 pb-4">
              <CardTitle className="text-2xl font-semibold text-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">{children}</CardContent>
            {footer ? (
              <CardFooter className="flex flex-col gap-4 pt-0">{footer}</CardFooter>
            ) : null}
          </Card>
        </div>
      </div>
    </div>
  );
}
