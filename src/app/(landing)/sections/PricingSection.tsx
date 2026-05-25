"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, X, Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { Container } from "@/components/shared/Container";

// ─── Data ─────────────────────────────────────────────────────────────────────

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for individuals exploring AI writing for the first time.",
    cta: "Get Started Free",
    ctaHref: "/register",
    highlighted: false,
    features: [
      { label: "5,000 words per month", included: true },
      { label: "10 template types", included: true },
      { label: "Basic tone rewriting", included: true },
      { label: "1 workspace", included: true },
      { label: "Export to Markdown", included: true },
      { label: "SEO optimization", included: false },
      { label: "Team collaboration", included: false },
      { label: "Priority AI generation", included: false },
      { label: "API access", included: false },
      { label: "Custom brand voice", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "For content creators and marketers who publish consistently.",
    cta: "Start Pro Trial",
    ctaHref: "/register?plan=pro",
    highlighted: true,
    badge: "Most Popular",
    features: [
      { label: "100,000 words per month", included: true },
      { label: "50+ template types", included: true },
      { label: "Advanced tone rewriting", included: true },
      { label: "3 workspaces", included: true },
      { label: "Export to Markdown, HTML, DOCX", included: true },
      { label: "SEO optimization", included: true },
      { label: "Team collaboration (up to 3)", included: true },
      { label: "Priority AI generation", included: true },
      { label: "API access", included: false },
      { label: "Custom brand voice", included: false },
    ],
  },
  {
    id: "team",
    name: "Team",
    price: "$49",
    period: "per month",
    description: "For agencies and content teams that need scale and control.",
    cta: "Start Team Trial",
    ctaHref: "/register?plan=team",
    highlighted: false,
    features: [
      { label: "Unlimited words", included: true },
      { label: "50+ template types", included: true },
      { label: "Advanced tone rewriting", included: true },
      { label: "Unlimited workspaces", included: true },
      { label: "Export to all formats + CMS", included: true },
      { label: "SEO optimization", included: true },
      { label: "Team collaboration (unlimited)", included: true },
      { label: "Priority AI generation", included: true },
      { label: "API access", included: true },
      { label: "Custom brand voice", included: true },
    ],
  },
] as const;

// ─── Feature Row ──────────────────────────────────────────────────────────────

function FeatureRow({
  label,
  included,
}: {
  label: string;
  included: boolean;
}) {
  return (
    <li className="flex items-start gap-3 py-1.5">
      {included ? (
        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
      ) : (
        <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40" />
      )}
      <span
        className={cn(
          "text-sm leading-snug",
          included ? "text-foreground" : "text-muted-foreground/60"
        )}
      >
        {label}
      </span>
    </li>
  );
}

// ─── Plan Card ────────────────────────────────────────────────────────────────

function PlanCard({
  plan,
  index,
}: {
  plan: (typeof plans)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative flex flex-col rounded-2xl border p-7 shadow-sm",
        plan.highlighted
          ? "border-primary bg-primary text-primary-foreground shadow-lg scale-[1.02]"
          : "border-border bg-card"
      )}
    >
      {/* Popular badge */}
      {"badge" in plan && plan.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <Badge className="gap-1 rounded-full px-3 py-1 text-xs font-semibold bg-background text-foreground border border-border shadow-sm">
            <Zap className="h-3 w-3 text-amber-500" />
            {plan.badge}
          </Badge>
        </div>
      )}

      {/* Plan header */}
      <div className="mb-6 space-y-2">
        <h3
          className={cn(
            "text-lg font-bold",
            plan.highlighted ? "text-primary-foreground" : "text-foreground"
          )}
        >
          {plan.name}
        </h3>
        <div className="flex items-baseline gap-1">
          <span
            className={cn(
              "text-4xl font-extrabold tracking-tight",
              plan.highlighted ? "text-primary-foreground" : "text-foreground"
            )}
          >
            {plan.price}
          </span>
          <span
            className={cn(
              "text-sm",
              plan.highlighted
                ? "text-primary-foreground/70"
                : "text-muted-foreground"
            )}
          >
            /{plan.period}
          </span>
        </div>
        <p
          className={cn(
            "text-sm leading-relaxed",
            plan.highlighted
              ? "text-primary-foreground/80"
              : "text-muted-foreground"
          )}
        >
          {plan.description}
        </p>
      </div>

      {/* CTA */}
      <Button
        asChild
        variant={plan.highlighted ? "secondary" : "default"}
        className="w-full font-semibold"
      >
        <Link href={plan.ctaHref}>{plan.cta}</Link>
      </Button>

      <Separator
        className={cn(
          "my-6",
          plan.highlighted ? "bg-primary-foreground/20" : "bg-border"
        )}
      />

      {/* Feature list */}
      <ul className="flex-1 space-y-0.5">
        {plan.features.map((f) => (
          <FeatureRow key={f.label} label={f.label} included={f.included} />
        ))}
      </ul>
    </motion.div>
  );
}

// ─── Pricing Section ──────────────────────────────────────────────────────────

export function PricingSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="pricing"
      ref={ref}
      className="py-20 sm:py-24 lg:py-32"
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
            heading="Simple, transparent pricing"
            subheading="Start free and scale as your content needs grow. No hidden fees, no surprise charges — cancel anytime."
            align="center"
            highlight="transparent pricing"
          />
        </motion.div>

        {/* Plan cards — 1 col → 3 col */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:gap-8 items-start">
          {plans.map((plan, i) => (
            <PlanCard key={plan.id} plan={plan} index={i} />
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 text-center text-sm text-muted-foreground"
        >
          All plans include a 14-day free trial. No credit card required to start.{" "}
          <Link href="/contact" className="underline underline-offset-4 hover:text-foreground transition-colors">
            Need a custom plan?
          </Link>
        </motion.p>
      </Container>
    </section>
  );
}
