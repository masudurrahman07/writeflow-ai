"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { Container } from "@/components/shared/Container";
import Link from "next/link";

// ─── Data ─────────────────────────────────────────────────────────────────────

const faqs = [
  {
    id: "faq-1",
    question: "What pricing plans do you offer, and is there a free tier?",
    answer:
      "Yes! We offer a Free plan that includes 5 documents per month, 1 standard AI agent, and community support. For creators and professionals, our Pro plan is $12/month and includes unlimited documents, all premium AI agents, and priority support. For teams and agencies, our Team plan is $39/month and includes everything in Pro plus team workspaces, admin dashboards, and usage analytics.",
  },
  {
    id: "faq-2",
    question: "How does WriteFlow AI ensure high-quality and natural-sounding output?",
    answer:
      "WriteFlow AI utilizes custom, state-of-the-art language models and prompt-engineered templates built specifically for professional content generation. Instead of general-purpose chat tools that produce repetitive or robotic copy, our system structures articles, emails, and ads using industry-proven content frameworks. You can customize your brand voice, adjust tone parameters, and use advanced tone rewriting tools to ensure the output reads exactly like it was written by an expert copywriter.",
  },
  {
    id: "faq-3",
    question: "Is my data and generated content secure and private?",
    answer:
      "Absolutely. We prioritize your privacy and data security above all else. All documents are fully encrypted at rest and in transit. Most importantly, we never use your data or generated content to train our AI models, and we never share your copy with third parties. Your IP and intellectual property remain 100% yours.",
  },
  {
    id: "faq-4",
    question: "How do team workspaces and collaboration features work?",
    answer:
      "On our Team plan, you can invite team members via email and assign them specific roles (Admin, Editor, or Viewer). Multiple teammates can collaborate on the same document simultaneously with live cursor presence and real-time edits. You can create shared template libraries, set consistent workspace-wide brand voices, and manage all billing and access from a centralized admin control dashboard.",
  },
  {
    id: "faq-5",
    question: "Can I cancel my subscription at any time, and is there a refund policy?",
    answer:
      "Yes, you can cancel your subscription at any time with a single click from your account dashboard — no questions asked. There are no long-term contracts or cancellation fees. If you cancel, your paid benefits will remain active until the end of your billing cycle. We also offer a 14-day free trial on our paid plans and a 30-day refund window for any paid subscriptions if you are not fully satisfied.",
  },
] as const;

// ─── FAQ Section ──────────────────────────────────────────────────────────────

export function FAQSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="faq"
      ref={ref}
      className="py-20 sm:py-24 lg:py-32 bg-muted/30"
    >
      <Container size="narrow">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12 sm:mb-14"
        >
          <SectionTitle
            heading="Frequently asked questions"
            subheading="Everything you need to know before you start. Can't find your answer? Reach out to our support team."
            align="center"
            highlight="Frequently asked questions"
          />
        </motion.div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <Accordion type="single" collapsible className="w-full space-y-2">
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <AccordionItem
                  value={faq.id}
                  className="rounded-lg border border-border bg-card px-5 data-[state=open]:border-primary/30 transition-colors"
                >
                  <AccordionTrigger className="text-left text-sm font-semibold text-foreground hover:no-underline py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>

        {/* CTA */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center text-sm text-muted-foreground"
        >
          Still have questions?{" "}
          <Link
            href="/contact"
            className="font-medium text-foreground underline underline-offset-4 hover:text-primary transition-colors"
          >
            Contact our support team →
          </Link>
        </motion.p>
      </Container>
    </section>
  );
}
