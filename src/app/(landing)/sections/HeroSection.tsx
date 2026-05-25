"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ─── Typing effect hook ───────────────────────────────────────────────────────

const PHRASES = [
  "Blog Posts",
  "Social Captions",
  "Email Copy",
];

function useTypingEffect(phrases: string[], speed = 55, pause = 1800) {
  const [displayed, setDisplayed] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    if (shouldReduce) {
      setDisplayed(phrases[0]);
      return;
    }
    const current = phrases[phraseIdx];

    const timeout = setTimeout(
      () => {
        if (!deleting) {
          if (charIdx < current.length) {
            setDisplayed(current.slice(0, charIdx + 1));
            setCharIdx((c) => c + 1);
          } else {
            setTimeout(() => setDeleting(true), pause);
          }
        } else {
          if (charIdx > 0) {
            setDisplayed(current.slice(0, charIdx - 1));
            setCharIdx((c) => c - 1);
          } else {
            setDeleting(false);
            setPhraseIdx((i) => (i + 1) % phrases.length);
          }
        }
      },
      deleting ? speed / 2 : speed
    );

    return () => clearTimeout(timeout);
  }, [charIdx, deleting, phraseIdx, phrases, speed, pause, shouldReduce]);

  return displayed;
}

// ─── Floating badge ───────────────────────────────────────────────────────────

function FloatingBadge({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={cn(
        "absolute hidden lg:flex items-center gap-1.5 rounded-full border border-border",
        "bg-background/80 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-foreground shadow-sm",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

// ─── Animated background grid ─────────────────────────────────────────────────

function GridBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Radial glow */}
      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function HeroSection() {
  const typedText = useTypingEffect(PHRASES);
  const nextSectionRef = useRef<HTMLDivElement>(null);

  const scrollToNext = () => {
    const next = document.getElementById("features");
    next?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-[65vh] flex-col items-center justify-center overflow-hidden py-20 sm:py-28 lg:py-32"
    >
      <GridBackground />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">

        {/* Announcement badge */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-6 inline-flex"
        >
          <Badge
            variant="secondary"
            className="gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Powered by Gemini AI — Now in Public Beta
          </Badge>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          custom={0.1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl"
        >
          Write smarter content,{" "}
          <span className="relative">
            <span className="text-primary">10× faster</span>
            {/* Underline accent */}
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
              className="absolute -bottom-1 left-0 right-0 h-[3px] origin-left rounded-full bg-primary/40"
            />
          </span>
        </motion.h1>

        {/* Typing subheadline */}
        <motion.div
          custom={0.25}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-6 text-xl sm:text-2xl font-medium text-muted-foreground min-h-[2rem]"
          aria-live="polite"
          aria-label={`WriteFlow AI helps you write ${typedText}`}
        >
          WriteFlow AI helps you write{" "}
          <span className="text-foreground font-semibold">
            {typedText}
            <span className="ml-0.5 inline-block h-5 w-0.5 animate-pulse bg-primary align-middle" />
          </span>
        </motion.div>

        {/* Supporting copy */}
        <motion.p
          custom={0.35}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed"
        >
          From first draft to final publish — WriteFlow AI combines intelligent
          generation, tone rewriting, and real-time team collaboration in one
          seamless workspace.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          custom={0.45}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <Button size="lg" className="h-12 px-8 text-base font-semibold gap-2 group" asChild>
            <Link href="/register">
              Start Writing Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 px-8 text-base font-medium"
            asChild
          >
            <Link href="/explore">See Examples</Link>
          </Button>
        </motion.div>

        {/* Social proof */}
        <motion.p
          custom={0.55}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-5 text-sm text-muted-foreground"
        >
          No credit card required · Free plan includes 5,000 words/month
        </motion.p>

        {/* Floating context badges — desktop only */}
        <div className="relative mt-16 hidden lg:block h-0">
          <FloatingBadge
            className="-left-8 -top-24"
            delay={0.7}
          >
            <span className="h-2 w-2 rounded-full bg-green-500" />
            10,000+ active writers
          </FloatingBadge>
          <FloatingBadge
            className="-right-8 -top-32"
            delay={0.85}
          >
            <Sparkles className="h-3 w-3 text-primary" />
            500K+ words generated today
          </FloatingBadge>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        onClick={scrollToNext}
        aria-label="Scroll to features"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
      >
        <span className="text-xs font-medium">Explore features</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </motion.button>

      <div ref={nextSectionRef} />
    </section>
  );
}
