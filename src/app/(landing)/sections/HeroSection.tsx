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
// Floating Stats
// ───────────────────────────────────────────────────────────────────────────────

function FloatingPill({
  className,
  children,
  delay = 0,
}: {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className={cn(
        "absolute hidden lg:flex items-center gap-2 rounded-full",
        "border border-slate-200 bg-slate-100/80 backdrop-blur-md",
        "px-4 py-2 text-sm text-slate-800 shadow-sm",
        className
      )}
    >
      {children}
    </motion.div>
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
      {/* Background radial soft shadow matching image instead of intense neon glow */}
      <div className="absolute inset-0 bg-slate-200/40 blur-3xl rounded-full -z-10" />

      {/* Card Container */}
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl border border-slate-100",
          "bg-white shadow-2xl shadow-slate-200/80"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 bg-slate-50/50">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#FF5F56]" />
            <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
            <div className="h-3 w-3 rounded-full bg-[#27C93F]" />
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <Sparkles className="h-3.5 w-3.5 text-slate-800" />
            AI Assistant
          </div>
        </div>

        {/* Body */}
        <div className="space-y-5 p-6 bg-white">
          {/* Prompt input field container */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
            <p className="text-sm text-slate-600">
              Generate a high-converting launch email for a new SaaS product.
            </p>
          </div>

          {/* AI Output Lines */}
          <div className="space-y-3 pt-2">
            <div className="h-3 w-full rounded-full bg-slate-100" />
            <div className="h-3 w-11/12 rounded-full bg-slate-100" />
            <div className="h-3 w-10/12 rounded-full bg-slate-100" />
            <div className="h-3 w-8/12 rounded-full bg-slate-300" />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="h-2 w-2 rounded-full bg-[#27C93F]" />
              AI generated in 3.2s
            </div>

            <Badge className="rounded-full px-3 py-1 bg-slate-900 text-white font-medium text-xs hover:bg-slate-800">
              Optimized Copy
            </Badge>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// Background
// ───────────────────────────────────────────────────────────────────────────────

function HeroBackground() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden -z-10 bg-white"
    >
      {/* Light Blur Glow Orbs around the landing layout */}
      <div className="absolute left-[10%] top-[20%] h-[400px] w-[400px] rounded-full bg-cyan-100/40 blur-3xl" />
      <div className="absolute right-[5%] bottom-[10%] h-[500px] w-[500px] rounded-full bg-purple-100/30 blur-3xl" />
    </div>
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
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative overflow-hidden py-20 sm:py-28 lg:min-h-screen bg-white flex items-center"
    >
      <HeroBackground />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8 w-full">
        
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
              className="rounded-full border border-slate-200 bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-800"
            >
              <Stars className="mr-2 h-3.5 w-3.5 text-slate-800" />
              Powered by Gemini AI
            </Badge>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="max-w-3xl text-5xl font-black tracking-tight text-slate-900 sm:text-6xl lg:text-7xl xl:text-8xl leading-[1.1]"
          >
            Create content
            <br />
            at the speed of
            <br />
            <span className="relative inline-block text-slate-900">
              thought
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  delay: 0.8,
                  duration: 0.8,
                }}
                className="absolute bottom-2 left-0 h-1 w-full origin-left rounded-full bg-slate-400"
              />
            </span>
          </motion.h1>

          {/* Typing Line */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="mt-8 text-xl text-slate-500 sm:text-2xl"
          >
            Instantly generate{" "}
            <span className="font-semibold text-slate-900">
              {typed || "Mar"}
            </span>
            <span className="ml-0.5 inline-block h-6 w-[2px] animate-pulse bg-slate-900 align-middle" />
          </motion.div>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-slate-500"
          >
            WriteFlow AI helps creators, startups, and teams generate high-quality content with AI-powered writing, rewriting, and collaboration tools — all in one beautiful workspace.
          </motion.p>

          {/* Buttons */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row w-full sm:w-auto"
          >
            <Button
              size="lg"
              className="group h-14 rounded-2xl px-8 text-base font-semibold bg-slate-900 text-white shadow-xl shadow-slate-900/10 hover:bg-slate-800"
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
              className="h-14 rounded-2xl px-8 text-base border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
              asChild
            >
              <Link href="/demo">
                <Play className="mr-2 h-4 w-4 fill-current" />
                Watch Demo
              </Link>
            </Button>
          </motion.div>

          {/* Bottom Trust Items */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-slate-500"
          >
            <span>✨ Free forever plan</span>
            <span>⚡ 5,000 words/month</span>
            <span>🚀 No credit card required</span>
          </motion.div>

          {/* Floating Pills Absolute Positioning */}
          {/* Floating Pills removed as requested */}
        </div>

        {/* Right Side Image Layout Wrapper */}
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
        className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1.5 text-slate-400 transition-colors hover:text-slate-800"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
          Explore
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut"
          }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.button>
    </section>
  );
}