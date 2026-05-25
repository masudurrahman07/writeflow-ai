"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/shared/Container";

// ─── Schema ───────────────────────────────────────────────────────────────────

const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required.")
    .email("Please enter a valid email address."),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

// ─── Newsletter Section ───────────────────────────────────────────────────────

export function NewsletterSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterFormValues) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setSubmitted(true);
    reset();

    toast.success("You're on the list!", {
      description: `We'll send writing tips and product updates to ${data.email}`,
      duration: 5000,
    });
  };

  return (
    <section
      id="newsletter"
      ref={ref}
      className="py-20 sm:py-24 lg:py-32"
    >
      <Container size="narrow">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "relative overflow-hidden rounded-3xl border border-border",
            "bg-gradient-to-br from-primary/5 via-background to-primary/5",
            "px-6 py-12 sm:px-12 sm:py-16 text-center shadow-sm"
          )}
        >
          {/* Background decoration */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
          </div>

          <div className="relative z-10 space-y-6">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20"
            >
              <Mail className="h-6 w-6 text-primary" />
            </motion.div>

            {/* Heading */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Get writing tips delivered to your inbox
              </h2>
              <p className="mx-auto max-w-md text-sm sm:text-base text-muted-foreground leading-relaxed">
                Join 10,000+ writers who receive our weekly newsletter — packed
                with AI writing strategies, content frameworks, and early access
                to new WriteFlow AI features.
              </p>
            </div>

            {/* Form */}
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-3 py-4"
              >
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                <p className="text-base font-semibold text-foreground">
                  You&apos;re subscribed!
                </p>
                <p className="text-sm text-muted-foreground">
                  Check your inbox for a confirmation email.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSubmitted(false)}
                  className="mt-1 text-xs text-muted-foreground"
                >
                  Subscribe another email
                </Button>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="mx-auto max-w-md space-y-3"
              >
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="flex-1 space-y-1">
                    <Input
                      {...register("email")}
                      type="email"
                      placeholder="you@company.com"
                      autoComplete="email"
                      aria-label="Email address"
                      aria-describedby={
                        errors.email ? "newsletter-email-error" : undefined
                      }
                      className={cn(
                        "h-11 bg-background",
                        errors.email &&
                          "border-destructive focus-visible:ring-destructive"
                      )}
                      disabled={isSubmitting}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="h-11 gap-2 font-semibold shrink-0 group"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Subscribing…
                      </>
                    ) : (
                      <>
                        Subscribe
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </div>

                {/* Validation error */}
                {errors.email && (
                  <motion.p
                    id="newsletter-email-error"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    role="alert"
                    className="text-xs text-destructive text-left"
                  >
                    {errors.email.message}
                  </motion.p>
                )}

                <p className="text-xs text-muted-foreground">
                  No spam, ever. Unsubscribe in one click at any time.
                </p>
              </form>
            )}

            {/* Social proof */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2">
              {[
                "Weekly writing tips",
                "AI prompt templates",
                "Early feature access",
              ].map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
