"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Wand2,
  RefreshCw,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { Container } from "@/components/shared/Container";

// ─── Data ─────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: Wand2,
    title: "AI Drafting",
    description:
      "Generate full blog posts, captions, and emails in seconds.",
    accent: "text-violet-500",
    bg: "bg-violet-500/10 dark:bg-violet-500/15",
  },
  {
    icon: RefreshCw,
    title: "Tone Rewriting",
    description:
      "Rewrite any content as formal, casual, or persuasive instantly.",
    accent: "text-blue-500",
    bg: "bg-blue-500/10 dark:bg-blue-500/15",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Invite teammates and manage content together in one workspace.",
    accent: "text-emerald-500",
    bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
  },
] as const;

// ─── Feature Card ─────────────────────────────────────────────────────────────

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[number];
  index: number;
}) {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative flex flex-col gap-4 rounded-xl border border-border",
        "bg-card p-6 shadow-sm",
        "hover:border-primary/30 hover:shadow-md transition-all duration-300"
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-lg",
          feature.bg
        )}
      >
        <Icon className={cn("h-5 w-5", feature.accent)} />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 className="text-base font-semibold text-foreground">
          {feature.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {feature.description}
        </p>
      </div>

      {/* Hover accent line */}
      <span
        className={cn(
          "absolute bottom-0 left-6 right-6 h-0.5 rounded-full opacity-0",
          "group-hover:opacity-100 transition-opacity duration-300",
          feature.bg.replace("/10", "/60").replace("/15", "/60")
        )}
      />
    </motion.div>
  );
}

// ─── Features Section ─────────────────────────────────────────────────────────

export function FeaturesSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="features"
      ref={ref}
      className="py-20 sm:py-24 lg:py-32 bg-muted/30"
    >
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12 sm:mb-16"
        >
          <SectionTitle
            heading="Everything you need to write better, faster"
            subheading="WriteFlow AI brings together AI generation, smart editing tools, and team workflows — so you spend less time staring at a blank page and more time shipping great content."
            align="center"
            highlight="write better, faster"
          />
        </motion.div>

        {/* 3-column card grid — 1 col mobile, 3 col desktop */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
