"use client";

import { useRef, Fragment } from "react";
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
    description: "Explore the power of AI writing with no upfront commitment.",
    cta: "Get Started Free",
    ctaHref: "/register",
    highlighted: false,
    features: [
      { label: "5 documents per month", included: true },
      { label: "1 standard AI agent", included: true },
      { label: "Community support", included: true },
      { label: "Team workspace", included: false },
      { label: "Admin dashboard", included: false },
      { label: "Advanced analytics", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$12",
    period: "per month",
    description: "For content creators and marketers who publish consistently.",
    cta: "Start Pro Trial",
    ctaHref: "/register?plan=pro",
    highlighted: true,
    badge: "Most Popular",
    features: [
      { label: "Unlimited documents", included: true },
      { label: "All premium AI agents", included: true },
      { label: "Priority support", included: true },
      { label: "Team workspace", included: false },
      { label: "Admin dashboard", included: false },
      { label: "Advanced analytics", included: false },
    ],
  },
  {
    id: "team",
    name: "Team",
    price: "$39",
    period: "per month",
    description: "For agencies and content teams that need scale and control.",
    cta: "Start Team Trial",
    ctaHref: "/register?plan=team",
    highlighted: false,
    features: [
      { label: "Unlimited documents", included: true },
      { label: "All premium AI agents", included: true },
      { label: "Priority support", included: true },
      { label: "Team workspace & collaboration", included: true },
      { label: "Admin dashboard controls", included: true },
      { label: "Workspace & usage analytics", included: true },
    ],
  },
] as const;

const comparisonFeatures = [
  {
    category: "Core Features & Writing",
    items: [
      { name: "Monthly Documents", free: "5 documents", pro: "Unlimited", team: "Unlimited" },
      { name: "AI Writing Agents", free: "1 standard agent", pro: "All premium agents", team: "All premium agents" },
      { name: "Tone & Style Rewrite", free: "Basic (3 tones)", pro: "Advanced (12+ tones)", team: "Advanced (12+ tones)" },
      { name: "SEO Analyzer & Optimizer", free: false, pro: true, team: true },
    ],
  },
  {
    category: "Workspace & Team",
    items: [
      { name: "Team Workspaces", free: false, pro: false, team: "Unlimited" },
      { name: "Collaborative Editing", free: false, pro: false, team: "Live Presence" },
      { name: "Admin Control Dashboard", free: false, pro: false, team: true },
      { name: "Workspace Analytics & Reports", free: false, pro: false, team: true },
    ],
  },
  {
    category: "Platform & Support",
    items: [
      { name: "Support Level", free: "Community", pro: "Priority Support", team: "24/7 Dedicated Support" },
      { name: "Custom Brand Voices", free: false, pro: false, team: true },
      { name: "Export Formats", free: "Markdown, TXT", pro: "PDF, DOCX, Markdown, TXT", team: "All formats + Direct CMS Publish" },
      { name: "REST API Access", free: false, pro: false, team: "Full API Access" },
    ],
  },
];

// ─── Feature Row ──────────────────────────────────────────────────────────────

function FeatureRow({
  label,
  included,
  highlighted,
}: {
  label: string;
  included: boolean;
  highlighted: boolean;
}) {
  return (
    <li className="flex items-start gap-3 py-1.5">
      {included ? (
        <Check className={cn("mt-0.5 h-4 w-4 shrink-0", highlighted ? "text-primary-foreground" : "text-emerald-500")} />
      ) : (
        <X className={cn("mt-0.5 h-4 w-4 shrink-0", highlighted ? "text-primary-foreground/30" : "text-muted-foreground/40")} />
      )}
      <span
        className={cn(
          "text-sm leading-snug",
          included
            ? highlighted
              ? "text-primary-foreground"
              : "text-foreground"
            : highlighted
            ? "text-primary-foreground/50"
            : "text-muted-foreground/60"
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
        "relative flex flex-col rounded-2xl border p-7 shadow-sm transition-all duration-300",
        plan.highlighted
          ? "border-primary bg-primary text-primary-foreground shadow-lg scale-[1.02] hover:scale-[1.04]"
          : "border-border bg-card hover:border-primary/20 hover:shadow-md"
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
            "text-sm leading-relaxed min-h-[40px]",
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
        className="w-full font-semibold h-11"
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
      <ul className="flex-1 space-y-0.5 mb-2">
        {plan.features.map((f) => (
          <FeatureRow
            key={f.label}
            label={f.label}
            included={f.included}
            highlighted={plan.highlighted}
          />
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

        {/* Feature Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-20 hidden md:block"
        >
          <div className="text-center mb-10">
            <h3 className="text-xl font-bold text-foreground">Compare all plans side-by-side</h3>
            <p className="text-sm text-muted-foreground mt-1">Detailed feature breakdown to help you make the right choice.</p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground px-6">Features</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground w-1/5 text-center">Free</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground w-1/5 text-center bg-primary/5 text-primary">Pro</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground w-1/5 text-center">Team</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {comparisonFeatures.map((section) => (
                    <Fragment key={section.category}>
                      <tr className="bg-muted/10 border-t border-border">
                        <td colSpan={4} className="p-3 text-xs font-bold text-foreground/80 tracking-wide uppercase px-6">
                          {section.category}
                        </td>
                      </tr>
                      {section.items.map((item) => (
                        <tr key={item.name} className="hover:bg-muted/5 transition-colors">
                          <td className="p-4 text-sm font-medium text-foreground px-6">{item.name}</td>
                          <td className="p-4 text-sm text-muted-foreground text-center">
                            {typeof item.free === "boolean" ? (
                              item.free ? <Check className="mx-auto h-4 w-4 text-emerald-500" /> : <X className="mx-auto h-4 w-4 text-muted-foreground/30" />
                            ) : (
                              item.free
                            )}
                          </td>
                          <td className="p-4 text-sm text-foreground text-center bg-primary/[0.02] border-x border-primary/10">
                            {typeof item.pro === "boolean" ? (
                              item.pro ? <Check className="mx-auto h-4 w-4 text-primary" /> : <X className="mx-auto h-4 w-4 text-muted-foreground/30" />
                            ) : (
                              item.pro
                            )}
                          </td>
                          <td className="p-4 text-sm text-muted-foreground text-center">
                            {typeof item.team === "boolean" ? (
                              item.team ? <Check className="mx-auto h-4 w-4 text-emerald-500" /> : <X className="mx-auto h-4 w-4 text-muted-foreground/30" />
                            ) : (
                              item.team
                            )}
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

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
