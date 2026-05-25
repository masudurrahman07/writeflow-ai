"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { LayoutTemplate, Lightbulb, Sparkles, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { Container } from "@/components/shared/Container";

// ─── Data ─────────────────────────────────────────────────────────────────────

const steps = [
  {
    number: "01",
    icon: LayoutTemplate,
    title: "Pick a Template",
    description:
      "Browse 50+ templates built for every content type — blog posts, product pages, social captions, email sequences, and more. Each template is pre-structured so you never start from scratch.",
    color: "text-violet-500",
    bg: "bg-violet-500/10 dark:bg-violet-500/15",
    border: "border-violet-500/20",
  },
  {
    number: "02",
    icon: Lightbulb,
    title: "Enter Your Topic",
    description:
      "Tell WriteFlow AI what you want to write about. Add your target audience, preferred tone, and any key points you want covered. The more context you give, the better the output.",
    color: "text-blue-500",
    bg: "bg-blue-500/10 dark:bg-blue-500/15",
    border: "border-blue-500/20",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "AI Generates Content",
    description:
      "In seconds, WriteFlow AI produces a full, structured draft complete with headings, body copy, and a call to action. It's not filler — it's content that reads like a human wrote it.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
    border: "border-emerald-500/20",
  },
  {
    number: "04",
    icon: Send,
    title: "Edit & Publish",
    description:
      "Refine the draft in our rich-text editor, run a tone check, optimize for SEO, and collaborate with your team — then publish directly or export to your CMS with one click.",
    color: "text-amber-500",
    bg: "bg-amber-500/10 dark:bg-amber-500/15",
    border: "border-amber-500/20",
  },
] as const;

// ─── Step Card ────────────────────────────────────────────────────────────────

function StepCard({
  step,
  index,
  isLast,
}: {
  step: (typeof steps)[number];
  index: number;
  isLast: boolean;
}) {
  const Icon = step.icon;

  return (
    <div className="relative flex flex-col items-center text-center sm:items-start sm:text-left bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-lg">
      {/* Connector line between steps — hidden on last */}
      {!isLast && (
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.15 + 0.3 }}
          className={cn(
            "absolute top-6 left-[calc(50%+28px)] right-0 h-px origin-left",
            "hidden lg:block",
            "bg-gradient-to-r from-border to-transparent"
          )}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-4 sm:items-start"
      >
        {/* Icon + number */}
        <div className="relative">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl border",
              step.bg,
              step.border
            )}
          >
            <Icon className={cn("h-5 w-5", step.color)} />
          </div>
          {/* Step number badge */}
          <span
            className={cn(
              "absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center",
              "rounded-full text-[10px] font-bold text-white",
              step.color.replace("text-", "bg-")
            )}
          >
            {index + 1}
          </span>
        </div>

        {/* Text */}
        <div className="space-y-2 max-w-xs">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Step {step.number}
          </p>
          <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {step.description}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ─── How It Works Section ─────────────────────────────────────────────────────

export function HowItWorksSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="py-20 sm:py-24 lg:py-32"
    >
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-14 sm:mb-16"
        >
          <SectionTitle
            heading="From blank page to published in minutes"
            subheading="WriteFlow AI removes every bottleneck in the content creation process. Here's how it works."
            align="center"
            highlight="minutes"
          />
        </motion.div>

        {/* Steps grid — 1 col mobile, 2 col tablet, 4 col desktop */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {steps.map((step, i) => (
            <StepCard
              key={step.number}
              step={step}
              index={i}
              isLast={i === steps.length - 1}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
