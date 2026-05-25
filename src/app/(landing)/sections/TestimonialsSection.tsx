"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { Container } from "@/components/shared/Container";

// ─── Data ─────────────────────────────────────────────────────────────────────

const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Content Marketing Manager",
    company: "Vercel",
    avatar: "",
    initials: "SC",
    rating: 5,
    review:
      "WriteFlow AI cut our blog production time from 4 hours per post to under 45 minutes. The tone rewriting feature alone is worth the subscription — we use it to adapt technical docs into customer-friendly copy every single week.",
    highlight: "cut our blog production time from 4 hours to 45 minutes",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "Founder & CEO",
    company: "LaunchPad Studio",
    avatar: "",
    initials: "MJ",
    rating: 5,
    review:
      "I was skeptical about AI writing tools, but WriteFlow AI genuinely surprised me. The output doesn't sound robotic — it sounds like a skilled copywriter who actually understands our product. We've shipped 3x more landing pages this quarter.",
    highlight: "shipped 3x more landing pages this quarter",
  },
  {
    id: 3,
    name: "Priya Nair",
    role: "Senior SEO Strategist",
    company: "GrowthHive",
    avatar: "",
    initials: "PN",
    rating: 5,
    review:
      "The SEO optimization built into WriteFlow AI is genuinely useful — not just keyword stuffing, but real structural guidance. Our organic traffic increased 40% in two months after switching our content workflow to WriteFlow.",
    highlight: "organic traffic increased 40% in two months",
  },
  {
    id: 4,
    name: "Tom Eriksson",
    role: "Head of Growth",
    company: "Northstar SaaS",
    avatar: "",
    initials: "TE",
    rating: 5,
    review:
      "Team collaboration is seamless. Our writers, editors, and designers all work inside WriteFlow AI now. No more Google Docs chaos, no more version conflicts. It's become the single source of truth for all our content.",
    highlight: "single source of truth for all our content",
  },
  {
    id: 5,
    name: "Amara Osei",
    role: "Freelance Copywriter",
    company: "Self-employed",
    avatar: "",
    initials: "AO",
    rating: 5,
    review:
      "As a freelancer, speed is money. WriteFlow AI lets me take on twice as many clients without sacrificing quality. The templates are a game-changer — I can go from brief to first draft in under 10 minutes.",
    highlight: "go from brief to first draft in under 10 minutes",
  },
  {
    id: 6,
    name: "Daniel Park",
    role: "E-commerce Director",
    company: "Bloom & Co.",
    avatar: "",
    initials: "DP",
    rating: 5,
    review:
      "We have 2,000+ product SKUs and writing descriptions was a nightmare. WriteFlow AI's bulk generation feature let us rewrite our entire catalog in a week. Conversion rates on updated pages are up 22%.",
    highlight: "conversion rates on updated pages are up 22%",
  },
] as const;

// ─── Star Rating ──────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted"
          )}
        />
      ))}
    </div>
  );
}

// ─── Testimonial Card ─────────────────────────────────────────────────────────

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: (typeof testimonials)[number];
  index: number;
}) {
  // Bold the highlight phrase inside the review
  const parts = testimonial.review.split(testimonial.highlight);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm",
        "hover:border-primary/20 hover:shadow-md transition-all duration-300"
      )}
    >
      {/* Quote icon + stars */}
      <div className="flex items-start justify-between">
        <Quote className="h-6 w-6 text-primary/30 shrink-0" />
        <StarRating rating={testimonial.rating} />
      </div>

      {/* Review text */}
      <blockquote className="flex-1 text-sm text-muted-foreground leading-relaxed">
        {parts.map((part, i) => (
          <span key={i}>
            {part}
            {i < parts.length - 1 && (
              <strong className="font-semibold text-foreground">
                {testimonial.highlight}
              </strong>
            )}
          </span>
        ))}
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3 pt-2 border-t border-border/60">
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
          <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
            {testimonial.initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {testimonial.name}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {testimonial.role} · {testimonial.company}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Testimonials Section ─────────────────────────────────────────────────────

export function TestimonialsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="testimonials"
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
            heading="What our writers are saying"
            subheading="Real results from real teams. No cherry-picked quotes — these are the outcomes our users report after switching to WriteFlow AI."
            align="center"
            highlight="Real results"
          />
        </motion.div>

        {/* Masonry-style grid — 1 col → 2 col → 3 col */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.id} testimonial={t} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
