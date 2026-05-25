/**
 * WriteFlow AI — Landing Page
 *
 * Sections (in order):
 *  1. Hero            — animated headline, typing effect, CTA
 *  2. Features        — 3-column card grid (6 features)
 *  3. How It Works    — 4-step process
 *  4. Templates       — 4-per-row grid with skeleton loaders
 *  5. Pricing         — 3 tiers with feature comparison
 *  6. Stats           — animated counters
 *  7. Testimonials    — avatar + review cards
 *  8. FAQ             — shadcn Accordion
 *  9. Newsletter      — email signup with Zod validation + Sonner toast
 * 10. Footer          — imported shared component
 */

import { Toaster } from "sonner";
import { HeroSection } from "./(landing)/sections/HeroSection";
import { FeaturesSection } from "./(landing)/sections/FeaturesSection";
import { HowItWorksSection } from "./(landing)/sections/HowItWorksSection";
import { TemplatesSection } from "./(landing)/sections/TemplatesSection";
import { PricingSection } from "./(landing)/sections/PricingSection";
import { StatsSection } from "./(landing)/sections/StatsSection";
import { TestimonialsSection } from "./(landing)/sections/TestimonialsSection";
import { FAQSection } from "./(landing)/sections/FAQSection";
import { NewsletterSection } from "./(landing)/sections/NewsletterSection";

export default function HomePage() {
  return (
    <>
      {/* Sonner toast provider — required for newsletter success toast */}
      <Toaster position="bottom-right" richColors closeButton />

      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TemplatesSection />
      <PricingSection />
      <StatsSection />
      <TestimonialsSection />
      <FAQSection />
      <NewsletterSection />

      {/*
       * Footer is rendered by the root layout (src/app/layout.tsx)
       * so it appears on every page — no need to import it here.
       */}
    </>
  );
}
