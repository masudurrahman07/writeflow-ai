"use client";

import { SectionTitle } from "@/components/shared/SectionTitle";
import { Container } from "@/components/shared/Container";

const features = [
  {
    title: "AI Drafting",
    description:
      "Generate high-quality blogs, emails, and captions instantly with WriteFlow AI.",
    color: "bg-violet-500",
  },
  {
    title: "Smart Rewriting",
    description:
      "Transform tone and clarity — from formal to casual or persuasive in one click.",
    color: "bg-blue-500",
  },
  {
    title: "Team Collaboration",
    description:
      "Work with your team in real-time and manage content in one shared workspace.",
    color: "bg-emerald-500",
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-background py-12 sm:py-16 lg:py-24 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="hidden sm:block absolute top-20 right-20 w-3 h-3 bg-yellow-400 rounded-full" />
      <div className="hidden sm:block absolute top-32 right-32 w-2 h-2 bg-violet-400 rotate-45" />
      <div className="hidden sm:block absolute top-40 right-16 w-1 h-6 bg-violet-500" />
      <div className="hidden sm:block absolute top-48 right-24 w-4 h-1 bg-yellow-400" />

      <Container>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* LEFT TEXT */}
          <div className="text-center lg:text-left">
            <SectionTitle
              heading="Write smarter with AI assistance"
              subheading="WriteFlow AI helps you generate, refine, and scale content effortlessly — whether you're a creator, marketer, or team."
              align="left"
              highlight="AI assistance"
            />

            <p className="text-muted-foreground text-base sm:text-lg mt-6 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Stop struggling with blank pages. Generate ideas, rewrite content,
              and collaborate with your team — all powered by intelligent AI workflows.
            </p>
          </div>

          {/* RIGHT DASHBOARD CARD */}
          <div className="relative mt-8 lg:mt-0">
            <div
              className="
              relative rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl
              bg-card border border-border
              transform rotate-3 sm:rotate-6 hover:rotate-0 transition-transform duration-300
              max-w-sm mx-auto lg:max-w-none
            "
            >
              <div className="mb-4">
                <div className="text-xs text-muted-foreground mb-1">
                  WriteFlow Live
                </div>
                <div className="text-sm font-medium text-foreground">
                  AI Content Engine
                </div>
              </div>

              {/* Pixel grid */}
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-1 mb-5">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div
                    key={i}
                    className={`
                      w-2 h-2 sm:w-3 sm:h-3 rounded-sm
                      ${
                        Math.random() > 0.75
                          ? Math.random() > 0.5
                            ? "bg-violet-500"
                            : Math.random() > 0.5
                            ? "bg-blue-500"
                            : "bg-emerald-500"
                          : "bg-muted"
                      }
                    `}
                  />
                ))}
              </div>

              {/* Stats */}
              <div className="flex justify-between text-xs sm:text-sm text-foreground">
                <div>
                  <div className="font-medium">AI Model</div>
                  <div className="text-muted-foreground">WriteFlow Core</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">Speed</div>
                  <div className="text-muted-foreground">0.4s avg</div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-3 -left-3 w-6 h-6 bg-violet-400 rounded-lg rotate-45" />
            <div className="absolute -bottom-3 -right-3 w-4 h-4 bg-yellow-400 rounded-full" />
            <div className="hidden sm:block absolute top-1/2 -right-8 w-4 h-10 bg-blue-500" />
          </div>
        </div>

        {/* FEATURES ROW */}
        <div className="mt-14 sm:mt-16 pt-6 border-t border-border">
          <div className="flex flex-wrap justify-center lg:justify-between gap-6 opacity-80">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-sm ${f.color}`} />
                <span className="text-sm sm:text-base text-foreground font-medium">
                  {f.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}