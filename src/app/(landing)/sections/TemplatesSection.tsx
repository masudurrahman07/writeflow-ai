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

// ─── Data ─────────────────────────────────────────────────────────────────────

const templates = [
  {
    id: "blog-post",
    icon: FileText,
    title: "Long-Form Blog Post",
    description:
      "SEO-optimized articles with structured headings, intro hooks, and compelling CTAs. Ideal for thought leadership and organic traffic.",
    category: "Content",
    uses: "12.4k",
    rating: 4.9,
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
    uses: "8.9k",
    rating: 4.8,
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
    uses: "15.2k",
    rating: 4.9,
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
    uses: "21.7k",
    rating: 4.7,
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
    uses: "9.3k",
    rating: 4.8,
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
    uses: "3.1k",
    rating: 4.6,
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
    uses: "18.6k",
    rating: 4.9,
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
    uses: "6.8k",
    rating: 4.8,
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
        "group flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm",
        "hover:border-primary/30 hover:shadow-md transition-all duration-300 cursor-pointer"
      )}
    >
      {/* Thumbnail Placeholder */}
      <div className="h-40 w-full rounded-md bg-muted/20 relative overflow-hidden flex items-center justify-center border border-border/40 group-hover:border-primary/20 transition-all duration-300">
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Glowing Ambient Gradient behind the card */}
        <div className={cn("absolute -bottom-8 w-24 h-24 rounded-full blur-xl opacity-20 transition-opacity duration-300 group-hover:opacity-30", template.bg)} />

        {/* Floating Mini Document Canvas */}
        <div className="relative w-28 h-20 bg-background/80 dark:bg-background/50 backdrop-blur-md rounded-lg border border-border/80 shadow-sm p-2.5 flex flex-col gap-1.5 transition-all duration-300 group-hover:scale-[1.04] group-hover:-translate-y-1">
          {/* Header of Mini Document */}
          <div className="flex items-center justify-between">
            <div className={cn("p-1 rounded-sm", template.bg)}>
              <Icon className={cn("h-3 w-3", template.color)} />
            </div>
            <div className="h-1.5 w-6 rounded bg-muted-foreground/15" />
          </div>
          {/* Content Lines */}
          <div className="space-y-1 pt-0.5">
            <div className="h-1 w-full rounded bg-muted-foreground/20" />
            <div className="h-1 w-5/6 rounded bg-muted-foreground/25" />
            <div className="h-1 w-4/6 rounded bg-muted-foreground/15" />
          </div>
          {/* Action indicator at bottom */}
          <div className="flex justify-between items-center mt-auto pt-1">
            <div className="h-1 w-8 rounded bg-muted-foreground/10" />
            <div className={cn("h-1.5 w-1.5 rounded-full", template.color.replace("text-", "bg-"))} />
          </div>
        </div>
      </div>

      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-1 group-hover:text-primary transition-colors">
          {template.title}
        </h3>
        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0 uppercase tracking-wider font-semibold font-mono">
          {template.category}
        </Badge>
      </div>

      {/* Content */}
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1">
        {template.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border/60">
        <div className="flex items-center gap-1">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-3 w-3",
                  i < Math.floor(template.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-muted text-muted"
                )}
              />
            ))}
          </div>
          <span className="text-[11px] font-semibold text-foreground ml-1">{template.rating}</span>
          <span className="text-[10px] text-muted-foreground">({template.uses} uses)</span>
        </div>
        <span
          className={cn(
            "text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1 group-hover:translate-x-0",
            template.color
          )}
        >
          Use →
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
            <Link href="/explore">View All Templates</Link>
          </Button>
        </motion.div>

        {/* Grid — 1 col → 2 col → 4 col */}
        {loading ? (
          <SkeletonCard variant="document" count={8} />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {templates.map((t, i) => (
              <TemplateCard key={t.id} template={t} index={i} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
