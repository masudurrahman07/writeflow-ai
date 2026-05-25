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
    question: "How is WriteFlow AI different from ChatGPT or other AI tools?",
    answer:
      "WriteFlow AI is purpose-built for content creation workflows — not general-purpose chat. It combines AI generation with structured templates, SEO scoring, tone controls, and team collaboration in a single workspace. You don't need to engineer prompts; the platform handles context, structure, and formatting automatically so your output is publish-ready, not just a raw text dump.",
  },
  {
    id: "faq-2",
    question: "Will the content pass AI detection tools?",
    answer:
      "WriteFlow AI generates content that reads naturally and is designed to be edited and refined by humans before publishing. We recommend treating AI output as a high-quality first draft — review it, add your expertise, and personalize it. This workflow produces content that reflects genuine human insight while dramatically reducing the time spent on initial drafting.",
  },
  {
    id: "faq-3",
    question: "What happens when I hit my monthly word limit?",
    answer:
      "On the Free plan, generation pauses until your limit resets at the start of the next billing cycle. You can upgrade to Pro or Team at any time to immediately unlock more capacity. We'll send you an email notification when you reach 80% of your limit so you're never caught off guard.",
  },
  {
    id: "faq-4",
    question: "Can I use WriteFlow AI for multiple clients or brands?",
    answer:
      "Yes. The Pro plan includes 3 separate workspaces, and the Team plan offers unlimited workspaces. Each workspace has its own brand voice settings, template library, and document history — making it easy to keep client work completely separate and maintain consistent tone across each brand.",
  },
  {
    id: "faq-5",
    question: "Does WriteFlow AI support languages other than English?",
    answer:
      "WriteFlow AI currently generates high-quality content in English, Spanish, French, German, Portuguese, and Dutch. We're actively expanding language support — check our roadmap for upcoming additions. The tone rewriting and SEO features are fully available in all supported languages.",
  },
  {
    id: "faq-6",
    question: "How does team collaboration work?",
    answer:
      "Invite teammates via email and assign them roles: Admin, Editor, or Viewer. Multiple team members can work on the same document simultaneously with live cursor presence. You can leave inline comments, suggest edits, and track the full revision history. The Team plan also includes an approval workflow so content goes through review before publishing.",
  },
  {
    id: "faq-7",
    question: "Can I export content to my CMS or website?",
    answer:
      "All plans support export to Markdown and plain text. The Pro plan adds HTML and DOCX export. The Team plan includes direct integrations with WordPress, Webflow, Contentful, and Notion, plus a REST API for custom CMS connections. One-click publishing means you never have to copy-paste again.",
  },
  {
    id: "faq-8",
    question: "Is my content private and secure?",
    answer:
      "Absolutely. Your documents are encrypted at rest and in transit. We do not use your content to train our AI models, and we never share your data with third parties. Enterprise customers can request a Data Processing Agreement (DPA) and SOC 2 compliance documentation.",
  },
  {
    id: "faq-9",
    question: "What is the refund policy?",
    answer:
      "We offer a 14-day free trial on all paid plans — no credit card required. If you upgrade and decide WriteFlow AI isn't right for you within the first 30 days of a paid subscription, contact our support team for a full refund. No questions asked.",
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
