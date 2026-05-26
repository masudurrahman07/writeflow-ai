"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

const particleConfig = [
  { left: "12%", top: "18%", size: 8, duration: 8, delay: 0 },
  { left: "82%", top: "16%", size: 6, duration: 9, delay: 1.2 },
  { left: "24%", top: "72%", size: 7, duration: 10, delay: 0.8 },
  { left: "74%", top: "68%", size: 5, duration: 7.5, delay: 2 },
  { left: "48%", top: "14%", size: 4, duration: 9.5, delay: 1.8 },
  { left: "66%", top: "40%", size: 3, duration: 11, delay: 2.5 },
];

function ParticleCanvas({ isDark }: { isDark: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const particles = Array.from({ length: 28 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.3 + 1,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.25 + 0.12,
    }));

    const color = isDark ? "rgba(255,255,255,0.24)" : "rgba(59,130,246,0.18)";

    const resize = () => {
      const { innerWidth, innerHeight } = window;
      const ratio = window.devicePixelRatio || 1;
      canvas.width = innerWidth * ratio;
      canvas.height = innerHeight * ratio;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles.forEach((particle) => {
        particle.x = Math.random() * innerWidth;
        particle.y = Math.random() * innerHeight;
      });
    };

    resize();

    let frame = 0;
    const draw = () => {
      const { innerWidth, innerHeight } = window;
      context.clearRect(0, 0, innerWidth, innerHeight);

      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < -10 || particle.x > innerWidth + 10) {
          particle.x = Math.random() * innerWidth;
        }
        if (particle.y < -10 || particle.y > innerHeight + 10) {
          particle.y = Math.random() * innerHeight;
        }

        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fillStyle = color.replace("0.24", particle.alpha.toString()).replace("0.18", particle.alpha.toString());
        context.fill();
      });

      frame = window.requestAnimationFrame(draw);
    };

    draw();

    window.addEventListener("resize", resize);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [isDark]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}

export function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.06 3.29 9.36 7.86 10.89.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.69-3.88-1.54-3.88-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.75.4-1.24.73-1.53-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.08 11.08 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.18-1.18 3.18-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.26 5.69.41.35.78 1.04.78 2.1 0 1.52-.01 2.74-.01 3.11 0 .31.2.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

export function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M18.9 2H22l-6.6 7.54L23.5 22h-6.1l-4.8-6.23L7.1 22H4l7.1-8.1L.5 2h6.2l4.3 5.7L18.9 2Zm-2.1 18h1.7L7.1 4H5.3l11.5 16Z" />
    </svg>
  );
}

export function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.45 20.45h-3.55v-5.55c0-1.32-.03-3.02-1.84-3.02-1.84 0-2.12 1.44-2.12 2.93v5.64H9.39V9.01h3.41v1.56h.05c.47-.9 1.62-1.84 3.34-1.84 3.58 0 4.24 2.35 4.24 5.41v6.31ZM5.33 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.55V9.01h3.56v11.44ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.22.79 24 1.77 24h20.45C23.2 24 24 23.22 24 22.28V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

export function SocialIconButton({
  icon: Icon,
  label,
  onClick,
  disabled = false,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={className ?? "h-12 w-12 rounded-full border-white/30 bg-white/65 text-foreground shadow-[0_14px_40px_-24px_rgba(59,130,246,0.6)] backdrop-blur-xl transition-transform duration-200 hover:scale-[1.03] hover:border-primary/60 hover:bg-primary/10 dark:border-white/10 dark:bg-slate-950/45"}
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
    <div className="relative isolate min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.12),transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.12),transparent_22%),linear-gradient(135deg,#f8fbff_0%,#eef2ff_48%,#f8fafc_100%)] text-foreground dark:bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.22),transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.2),transparent_24%),linear-gradient(135deg,#020617_0%,#0f172a_46%,#111827_100%)]">
      <ParticleCanvas isDark={false} />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-8%] top-[-5%] h-56 w-56 rounded-full bg-sky-400/15 blur-3xl dark:bg-sky-500/15" />
        <div className="absolute bottom-[-8%] right-[-10%] h-64 w-64 rounded-full bg-indigo-400/12 blur-3xl dark:bg-indigo-400/12" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex items-center justify-start">
          <Link href="/" className="text-sm font-semibold uppercase tracking-[0.35em] text-foreground/80">
            WriteFlow AI
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="w-full max-w-xl"
          >
            <Card className="relative overflow-hidden rounded-[30px] border border-white/35 bg-white/70 shadow-[0_28px_85px_-35px_rgba(15,23,42,0.22)] backdrop-blur-2xl transition-transform duration-200 hover:scale-[1.01] dark:border-white/10 dark:bg-slate-950/65 dark:shadow-[0_28px_85px_-35px_rgba(56,189,248,0.18)]">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.32),transparent_45%,rgba(255,255,255,0.08))] dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_45%,rgba(255,255,255,0.03))]" />

              <CardHeader className="relative space-y-4 px-6 pt-6 sm:px-8 sm:pt-8">
                <Badge className="w-fit rounded-full border-primary/30 bg-primary/10 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-primary">
                  {badge}
                </Badge>
                <div className="space-y-3">
                  <h1 className="text-[2rem] font-semibold tracking-tight text-foreground sm:text-[2.2rem]">
                    {title}
                  </h1>
                  <p className="max-w-lg text-sm leading-7 text-muted-foreground sm:text-[0.98rem]">
                    {subtitle}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="relative px-6 pb-1 sm:px-8">{children}</CardContent>
              {footer ? <CardFooter className="relative px-6 pb-6 sm:px-8">{footer}</CardFooter> : null}
            </Card>
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background/80 to-transparent" />

      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        {particleConfig.map((item) => (
          <motion.span
            key={`${item.left}-${item.top}`}
            className="absolute rounded-full bg-primary/20 blur-[1px] dark:bg-sky-200/20"
            style={{
              left: item.left,
              top: item.top,
              width: item.size,
              height: item.size,
            }}
            animate={{ y: [0, -14, 0], x: [0, 8, 0], opacity: [0.28, 0.75, 0.28] }}
            transition={{ duration: item.duration, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: item.delay }}
          />
        ))}
      </div>
    </div>
  );
}
