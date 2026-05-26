"use client";

import { LayoutTemplate, Lightbulb, Sparkles, Send } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { GradientCard } from "@/components/ui/gradient-card";

const steps = [
  {
    icon: <LayoutTemplate className="w-5 h-5 text-violet-500" />,
    title: "Choose a Writing Template",
    description:
      "Start with professionally crafted templates for blogs, ads, emails, and social posts — built to remove blank-page anxiety.",
    step: "01",
  },
  {
    icon: <Lightbulb className="w-5 h-5 text-blue-500" />,
    title: "Share Your Idea",
    description:
      "Describe your topic, audience, and tone. WriteFlow AI understands context to generate content that actually sounds like you.",
    step: "02",
  },
  {
    icon: <Sparkles className="w-5 h-5 text-emerald-500" />,
    title: "AI Writes Instantly",
    description:
      "Get structured, high-quality drafts in seconds — not fluff, but production-ready content with real clarity and flow.",
    step: "03",
  },
  {
    icon: <Send className="w-5 h-5 text-amber-500" />,
    title: "Edit & Publish Anywhere",
    description:
      "Refine your content, improve tone, and export directly to your platform — or publish instantly with one click.",
    step: "04",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden bg-background">
      {/* subtle background glow */}
      <div className="absolute inset-0 -z-10 opacity-40">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-500/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px]" />
      </div>

      <Container>
        {/* header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            From idea → to published content
          </h2>
          <p className="mt-4 text-muted-foreground text-sm sm:text-base leading-relaxed">
            WriteFlow AI turns messy thoughts into structured, high-quality writing in just a few steps.
          </p>
        </div>

        {/* grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <GradientCard
              key={i}
              icon={step.icon}
              title={step.title}
              description={step.description}
              step={step.step}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}