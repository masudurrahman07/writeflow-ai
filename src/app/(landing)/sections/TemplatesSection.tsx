"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  FileText,
  Mail,
  Megaphone,
  Briefcase,
  ShoppingBag,
  Newspaper,
  MessageSquare,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { Container } from "@/components/shared/Container";
import Link from "next/link";

// ─── Data ─────────────────────────────────────────────────────────────────────

const templates = [
  {
    id: "blog-post",
    icon: FileText,
    title: "Long-Form Blog Post",
    description:
      "SEO-optimized articles with structured headings, intro hooks, and compelling CTAs. Ideal for thought leadership and organic traffic.",
    category: "Content",
    uses: "12.4k uses",
    color: "text-violet-500",
    bg: "bg-violet-500/10 dark:bg-violet-500/15",
  },
  {
    id: "email-sequence",
    icon: Mail,
    title: "Email Drip Sequence",
    description:
      "Multi-step nurture campaigns that guide subscribers from awareness to conversion. Includes subject lines, preview text, and body copy.",
    category: "Email",
    uses: "8.9k uses",
    color: "text-blue-500",
    bg: "bg-blue-500/10 dark:bg-blue-500/15",
  },
  {
    id: "ad-copy",
    icon: Megaphone,
    title: "Ad Copy & Headlines",
    description:
      "High-converting copy for Google Ads, Meta campaigns, and display banners. Multiple variants generated for A/B testing.",
    category: "Marketing",
    uses: "15.2k uses",
    color: "text-rose-500",
    bg: "bg-rose-500/10 dark:bg-rose-500/15",
  },
  {
    id: "linkedin-post",
    icon: Briefcase,
    title: "LinkedIn Post",
    description:
      "Thought-provoking professional posts that drive engagement and grow your personal brand. Hooks, storytelling, and clear takeaways included.",
    category: "Social",
    uses: "21.7k uses",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10 dark:bg-cyan-500/15",
  },
  {
    id: "product-description",
    icon: ShoppingBag,
    title: "Product Description",
    description:
      "Benefit-focused copy that turns features into reasons to buy. Works for e-commerce listings, SaaS landing pages, and app stores.",
    category: "E-commerce",
    uses: "9.3k uses",
    color: "text-amber-500",
    bg: "bg-amber-500/10 dark:bg-amber-500/15",
  },
  {
    id: "press-release",
    icon: Newspaper,
    title: "Press Release",
    description:
      "Professionally structured announcements for product launches, partnerships, and company milestones — ready to send to journalists.",
    category: "PR",
    uses: "3.1k uses",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
  },
  {
    id: "social-caption",
    icon: MessageSquare,
    title: "Social Media Caption",
    description:
      "Scroll-stopping captions for Instagram, Twitter/X, and Facebook. Includes hashtag suggestions and emoji placement.",
    category: "Social",
    uses: "18.6k uses",
    color: "text-pink-500",
    bg: "bg-pink-500/10 dark:bg-pink-500/15",
  },
  {
    id: "landing-page",
    icon: Globe,
    title: "Landing Page Copy",
    description:
      "Full-page copy with hero headline, feature bullets, social proof, and a persuasive CTA section — structured for maximum conversion.",
    category: "Marketing",
    uses: "6.8k uses",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10 dark:bg-indigo-500/15",
  },
] as const;

// ─── Template Card ────────────────────────────────────────────────────────────

function TemplateCard({
  template,
  index,
}: {
  template: (typeof templates)[number];
  index: number;
}) {
  const Icon = template.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm",
        "hover:border-primary/30 hover:shadow-md transition-all duration-300 cursor-pointer"
      )}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            template.bg
          )}
        >
          <Icon className={cn("h-4.5 w-4.5", template.color)} />
        </div>
        <Badge variant="secondary" className="text-xs shrink-0">
          {template.category}
        </Badge>
      </div>

      {/* Content */}
      <div className="space-y-1.5 flex-1">
        <h3 className="text-sm font-semibold text-foreground leading-snug">
          {template.title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
          {template.description}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-border/60">
        <span className="text-xs text-muted-foreground">{template.uses}</span>
        <span
          className={cn(
            "text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity",
            template.color
          )}
        >
          Use template →
        </span>
      </div>
    </motion.div>
  );
}

// ─── Templates Section ────────────────────────────────────────────────────────

export function TemplatesSection() {
  const [loading, setLoading] = useState(true);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // Simulate async template fetch
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      id="templates"
      ref={ref}
      className="py-20 sm:py-24 lg:py-32 bg-muted/30"
    >
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12 sm:mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <SectionTitle
            heading="Popular templates to get you started"
            subheading="50+ templates across every content category. Pick one and publish in minutes."
            highlight="Popular templates"
          />
          <Button variant="outline" size="sm" className="shrink-0 self-start sm:self-auto" asChild>
            <Link href="/explore">Browse all templates →</Link>
          </Button>
        </motion.div>

        {/* Grid — 1 col → 2 col → 4 col */}
        {loading ? (
          <SkeletonCard variant="document" count={8} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {templates.map((t, i) => (
              <TemplateCard key={t.id} template={t} index={i} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
