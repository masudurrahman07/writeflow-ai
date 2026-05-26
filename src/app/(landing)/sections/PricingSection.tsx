"use client";

import { CreativePricing } from "@/components/ui/creative-pricing";
import type { PricingTier } from "@/components/ui/creative-pricing";

import { Pencil, Star, Sparkles } from "lucide-react";

// ─── Pricing Data ─────────────────────────────────────────────

const sampleTiers: PricingTier[] = [
  {
    name: "Creator",
    icon: <Pencil className="w-6 h-6" />,
    price: 29,
    description: "Perfect for students and solo writers starting out",
    color: "amber",
    features: [
      "AI-powered article writing",
      "10 blog generations/month",
      "Basic tone rewriting",
      "Grammar & clarity assistant",
    ],
  },
  {
    name: "Influencer",
    icon: <Star className="w-6 h-6" />,
    price: 79,
    description: "For consistent content creators & marketers",
    color: "blue",
    popular: true,
    features: [
      "Unlimited AI writing",
      "Advanced tone & style control",
      "SEO-optimized content tools",
      "Priority AI response speed",
    ],
  },
  {
    name: "Pro Studio",
    icon: <Sparkles className="w-6 h-6" />,
    price: 149,
    description: "For teams and power users scaling content",
    color: "purple",
    features: [
      "Team collaboration workspace",
      "Brand voice customization",
      "Advanced analytics dashboard",
      "Full API access",
    ],
  },
];

// ─── Pricing Section ─────────────────────────────────────────────

export function PricingSection() {
  return (
    <section className="w-full py-24 relative">
      {/* Background glow (theme-safe) */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background to-background" />

      <div className="max-w-6xl mx-auto px-4">
        <CreativePricing
          tag="Simple Pricing"
          title="Write better content, faster"
          description="Powerful AI tools to help you create, improve, and scale your writing"
          tiers={sampleTiers}
        />
      </div>
    </section>
  );
}