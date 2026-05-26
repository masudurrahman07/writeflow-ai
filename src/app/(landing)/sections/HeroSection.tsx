"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, Variants, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  ChevronDown,
  Play,
  Stars,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ───────────────────────────────────────────────────────────────────────────────
// Typing Effect
// ───────────────────────────────────────────────────────────────────────────────

const PHRASES = [
  "Blog Posts",
  "Social Captions",
  "Marketing Emails",
  "Product Descriptions",
];

function useTypingEffect(
  phrases: string[],
  speed = 70,
  pause = 1800
) {
  const [displayed, setDisplayed] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      setDisplayed(phrases[0]);
      return;
    }

    const current = phrases[phraseIndex];

    const timeout = setTimeout(() => {
      if (!deleting) {
        if (charIndex < current.length) {
          setDisplayed(current.slice(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);
        } else {
          setTimeout(() => setDeleting(true), pause);
        }
      } else {
        if (charIndex > 0) {
          setDisplayed(current.slice(0, charIndex - 1));
          setCharIndex((prev) => prev - 1);
        } else {
          setDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, deleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [
    charIndex,
    deleting,
    phraseIndex,
    phrases,
    speed,
    pause,
    reduceMotion,
  ]);

  return displayed;
}

// ───────────────────────────────────────────────────────────────────────────────
// Aurora Background
// ───────────────────────────────────────────────────────────────────────────────

interface AuroraBackgroundProps
  extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
  showRadialGradient?: boolean;
}

function AuroraBackground({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) {
  return (
    <div
      className={cn(
        "relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-transparent transition-colors",
        className
      )}
      {...props}
    >
      {/* Main Aurora */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            `
            absolute inset-0 opacity-50

            [background-image:repeating-linear-gradient(100deg,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_7%,transparent_10%,transparent_12%,rgba(255,255,255,1)_16%),repeating-linear-gradient(100deg,rgba(59,130,246,0.95)_10%,rgba(99,102,241,0.9)_15%,rgba(147,197,253,0.9)_20%,rgba(216,180,254,0.88)_25%,rgba(96,165,250,0.95)_30%)]

            dark:[background-image:repeating-linear-gradient(100deg,rgba(0,0,0,1)_0%,rgba(0,0,0,1)_7%,transparent_10%,transparent_12%,rgba(0,0,0,1)_16%),repeating-linear-gradient(100deg,rgba(59,130,246,0.95)_10%,rgba(79,70,229,0.92)_15%,rgba(59,130,246,0.88)_20%,rgba(167,139,250,0.9)_25%,rgba(37,99,235,0.95)_30%)]

            [background-size:300%,200%]

            [background-position:50%_50%,50%_50%]

            filter blur-[10px] invert dark:invert-0

            after:content-['']
            after:absolute
            after:inset-0

            after:[background-image:inherit]

            after:[background-size:200%,100%]

            after:animate-aurora

            after:[background-attachment:fixed]

            after:mix-blend-difference

            pointer-events-none
            will-change-transform
            `,
            showRadialGradient &&
              "[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]"
          )}
        />
      </div>

      {/* Extra Glow */}
      <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
// ───────────────────────────────────────────────────────────────────────────────
// Editor Preview
// ───────────────────────────────────────────────────────────────────────────────

function AiPreviewCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative mx-auto w-full max-w-xl"
    >
      {/* Glow */}
      <div className="absolute inset-0 rounded-[40px] bg-primary/10 blur-3xl -z-10" />

      {/* Card */}
      <div
        className={cn(
          "relative overflow-hidden rounded-[32px] border border-white/20 dark:border-white/10",
          "bg-white/70 dark:bg-zinc-900/70",
          "backdrop-blur-2xl",
          "shadow-[0_10px_80px_rgba(0,0,0,0.12)]"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 px-5 py-4 bg-white/40 dark:bg-white/5">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#FF5F56]" />
            <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
            <div className="h-3 w-3 rounded-full bg-[#27C93F]" />
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            AI Assistant
          </div>
        </div>

        {/* Body */}
        <div className="space-y-5 p-6">
          <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.03] p-4">
            <p className="text-sm text-muted-foreground">
              Generate a high-converting launch email for a new SaaS product.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="h-3 w-full rounded-full bg-muted" />
            <div className="h-3 w-11/12 rounded-full bg-muted" />
            <div className="h-3 w-10/12 rounded-full bg-muted" />
            <div className="h-3 w-8/12 rounded-full bg-muted-foreground/30" />
          </div>

          <div className="flex items-center justify-between border-t border-black/5 dark:border-white/10 pt-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-[#27C93F]" />
              AI generated in 3.2s
            </div>

            <Badge className="rounded-full px-3 py-1 font-medium text-xs">
              Optimized Copy
            </Badge>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// Animations
// ───────────────────────────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeInOut" as const,
    },
  },
};

// ───────────────────────────────────────────────────────────────────────────────
// Hero Section
// ───────────────────────────────────────────────────────────────────────────────

export function HeroSection() {
  const typed = useTypingEffect(PHRASES);

  const scrollToFeatures = () => {
    const el = document.getElementById("features");

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <AuroraBackground className="relative">
      <section
        id="hero"
        className="relative z-10 flex min-h-screen w-full items-center overflow-hidden bg-transparent py-20 sm:py-28"
      >
        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          
          {/* Left Content */}
          <div className="relative flex flex-col items-start">
            
            {/* Badge */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0 }}
              className="mb-6 inline-flex"
            >
              <Badge
                variant="secondary"
                className={cn(
                  "rounded-full border border-black/5 dark:border-white/10",
                  "bg-white/70 dark:bg-white/10",
                  "backdrop-blur-xl",
                  "px-4 py-1.5 text-sm font-medium"
                )}
              >
                <Stars className="mr-2 h-3.5 w-3.5" />
                Powered by Gemini AI
              </Badge>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
              className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl xl:text-8xl"
            >
              Create content
              <br />
              at the speed of
              <br />

              <span className="relative inline-block">
                thought

                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    delay: 0.8,
                    duration: 0.8,
                  }}
                  className="absolute bottom-2 left-0 h-1 w-full origin-left rounded-full bg-primary/40"
                />
              </span>
            </motion.h1>

            {/* Typing */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="mt-8 text-xl text-muted-foreground sm:text-2xl"
            >
              Instantly generate{" "}
              <span className="font-semibold text-foreground">
                {typed || "Marketing Emails"}
              </span>

              <span className="ml-0.5 inline-block h-6 w-[2px] animate-pulse bg-foreground align-middle" />
            </motion.div>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
            >
              WriteFlow AI helps creators, startups, and teams generate
              high-quality content with AI-powered writing, rewriting,
              and collaboration tools — all in one beautiful workspace.
            </motion.p>

            {/* Buttons */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
              className="mt-10 flex w-full flex-col gap-4 sm:w-auto sm:flex-row"
            >
              <Button
                size="lg"
                className={cn(
                  "group h-14 rounded-2xl px-8 text-base font-semibold",
                  "shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
                )}
                asChild
              >
                <Link href="/register">
                  Start Writing Free

                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className={cn(
                  "h-14 rounded-2xl border-white/20 bg-white/60 px-8 text-base backdrop-blur-xl",
                  "dark:bg-white/5"
                )}
                asChild
              >
                <Link href="/demo">
                  <Play className="mr-2 h-4 w-4 fill-current" />
                  Watch Demo
                </Link>
              </Button>
            </motion.div>

            {/* Trust Items */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-muted-foreground"
            >
              <span>✨ Free forever plan</span>
              <span>⚡ 5,000 words/month</span>
              <span>🚀 No credit card required</span>
            </motion.div>
          </div>

          {/* Right Side */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.25 }}
            className="relative lg:pl-4"
          >
            <AiPreviewCard />
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          onClick={scrollToFeatures}
          className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
            Explore
          </span>

          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
            }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </motion.button>
      </section>
    </AuroraBackground>
  );
}