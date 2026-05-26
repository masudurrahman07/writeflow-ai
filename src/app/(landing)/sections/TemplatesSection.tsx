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
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { Container } from "@/components/shared/Container";
import Link from "next/link";

// ─── Data ─────────────────────────────────────────────

const templates = [
  {
    id: "blog-post",
    icon: FileText,
    title: "Long-Form Blog Post",
    description:
      "SEO-optimized articles with structure, hooks, and conversion-focused flow.",
    category: "Content",
    uses: "12.4k",
    rating: 4.9,
    color: "text-violet-500",
    bg: "from-violet-500/20",
  },
  {
    id: "email-sequence",
    icon: Mail,
    title: "Email Drip Sequence",
    description:
      "Automated email flows that convert readers into loyal customers.",
    category: "Email",
    uses: "8.9k",
    rating: 4.8,
    color: "text-blue-500",
    bg: "from-blue-500/20",
  },
  {
    id: "ad-copy",
    icon: Megaphone,
    title: "Ad Copy Generator",
    description:
      "High-converting ad variations for A/B testing and performance scaling.",
    category: "Marketing",
    uses: "15.2k",
    rating: 4.9,
    color: "text-rose-500",
    bg: "from-rose-500/20",
  },
  {
    id: "linkedin-post",
    icon: Briefcase,
    title: "LinkedIn Posts",
    description:
      "Professional storytelling posts that grow authority and engagement.",
    category: "Social",
    uses: "21.7k",
    rating: 4.7,
    color: "text-cyan-500",
    bg: "from-cyan-500/20",
  },
  {
    id: "product-description",
    icon: ShoppingBag,
    title: "Product Descriptions",
    description:
      "Persuasive copy that turns features into buying decisions.",
    category: "E-commerce",
    uses: "9.3k",
    rating: 4.8,
    color: "text-amber-500",
    bg: "from-amber-500/20",
  },
  {
    id: "press-release",
    icon: Newspaper,
    title: "Press Releases",
    description:
      "Professional announcements ready for media distribution.",
    category: "PR",
    uses: "3.1k",
    rating: 4.6,
    color: "text-emerald-500",
    bg: "from-emerald-500/20",
  },
  {
    id: "social-caption",
    icon: MessageSquare,
    title: "Social Captions",
    description:
      "Scroll-stopping captions for Instagram, X, and TikTok.",
    category: "Social",
    uses: "18.6k",
    rating: 4.9,
    color: "text-pink-500",
    bg: "from-pink-500/20",
  },
  {
    id: "landing-page",
    icon: Globe,
    title: "Landing Pages",
    description:
      "Full conversion-focused landing page copy in seconds.",
    category: "Marketing",
    uses: "6.8k",
    rating: 4.8,
    color: "text-indigo-500",
    bg: "from-indigo-500/20",
  },
];

// ─── Card ─────────────────────────────────────────────

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
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        "group relative rounded-2xl border border-border",
        "bg-card/60 backdrop-blur-xl",
        "overflow-hidden shadow-sm hover:shadow-xl",
        "transition-all duration-300"
      )}
    >
      {/* Glow background */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          "bg-gradient-to-br",
          template.bg
        )}
      />

      <div className="relative p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div
            className={cn(
              "h-10 w-10 rounded-xl flex items-center justify-center",
              "bg-background border border-border shadow-sm"
            )}
          >
            <Icon className={cn("h-5 w-5", template.color)} />
          </div>

          <Badge
            variant="secondary"
            className="text-[10px] uppercase tracking-wider"
          >
            {template.category}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-foreground leading-snug">
          {template.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          {template.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-3 w-3",
                  i < Math.floor(template.rating)
                    ? "text-amber-400 fill-amber-400"
                    : "text-muted"
                )}
              />
            ))}
            <span className="text-[11px] ml-1 text-muted-foreground">
              {template.rating}
            </span>
          </div>

          <span className="text-[11px] text-muted-foreground">
            {template.uses} uses
          </span>
        </div>

        {/* Hover CTA */}
        <div className="opacity-0 group-hover:opacity-100 transition-all text-xs font-medium text-primary">
          Use template →
        </div>
      </div>
    </motion.div>
  );
}

// ─── Section ─────────────────────────────────────────────

export function TemplatesSection() {
  const [loading, setLoading] = useState(true);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      id="templates"
      ref={ref}
      className="relative py-24 lg:py-32 bg-background overflow-hidden"
    >
      {/* ambient glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-500/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px]" />
      </div>

      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12"
        >
          <SectionTitle
            heading="Templates built for real-world writing"
            subheading="From blogs to ads — generate structured, high-converting content instantly."
            highlight="real-world writing"
          />

          <Button asChild variant="outline" size="sm">
            <Link href="/explore">Explore all</Link>
          </Button>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <SkeletonCard variant="document" count={8} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {templates.map((t, i) => (
              <TemplateCard key={t.id} template={t} index={i} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}