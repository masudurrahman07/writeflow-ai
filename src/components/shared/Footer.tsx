import Link from "next/link";
import { PenLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { Separator } from "@/components/ui/separator";

// ─── Social icon SVGs ─────────────────────────────────────────────────────────
// lucide-react v1.x removed brand icons. We use minimal inline SVGs instead —
// same visual result, zero extra dependencies.

function TwitterXIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

// ─── Social links ─────────────────────────────────────────────────────────────

const socialLinks = [
  {
    label: "Twitter / X",
    href: siteConfig.links.twitter,
    Icon: TwitterXIcon,
  },
  {
    label: "LinkedIn",
    href: siteConfig.links.linkedin,
    Icon: LinkedInIcon,
  },
  {
    label: "GitHub",
    href: siteConfig.links.github,
    Icon: GitHubIcon,
  },
] as const;

// ─── Footer link columns ──────────────────────────────────────────────────────

const footerColumns = [
  {
    heading: "Product",
    links: [
      { label: "Explore", href: "/explore" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "My Documents", href: "/dashboard/documents" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
] as const;

// ─── Inline nav links for bottom bar ─────────────────────────────────────────

const bottomNavLinks = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

// ─── Footer ───────────────────────────────────────────────────────────────────

/**
 * Footer
 *
 * Full-width site footer with:
 * - Brand logo + tagline (left column)
 * - Social media icons: Twitter, LinkedIn, GitHub (lucide-react)
 * - Navigation link columns: Product, Company, Legal
 * - Bottom bar: copyright + inline nav links
 *
 * Fully responsive (1 col → 2 col → 4 col) and dark-mode aware.
 */
export function Footer() {
  return (
    <footer
      className="w-full border-t border-border bg-background"
      aria-label="Site footer"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Top section ── */}
        <div className="grid grid-cols-1 gap-10 py-10 sm:grid-cols-2 sm:py-12 lg:grid-cols-4 lg:py-16">

          {/* Brand column */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            {/* Logo */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="WriteFlow AI home"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <PenLine className="h-4 w-4" />
              </span>
              <span className="font-bold text-base tracking-tight text-foreground">
                WriteFlow <span className="text-primary">AI</span>
              </span>
            </Link>

            {/* Tagline */}
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>

            {/* Social icons — lucide-react */}
            <div className="flex items-center gap-2 pt-1">
              {socialLinks.map(({ label, href, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-md",
                    "text-muted-foreground transition-colors",
                    "hover:bg-accent hover:text-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.heading} className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
                {col.heading}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="bg-border/60" />

        {/* ── Bottom bar ── */}
        <div className="flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
          {/* Copyright */}
          <p className="text-center text-xs text-muted-foreground sm:text-left">
            &copy; 2024{" "}
            <Link
              href="/"
              className="font-medium transition-colors hover:text-foreground"
            >
              WriteFlow AI
            </Link>
            . All rights reserved.
          </p>

          {/* Inline nav links */}
          <nav
            className="flex flex-wrap justify-center gap-x-4 gap-y-1"
            aria-label="Footer navigation"
          >
            {bottomNavLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
