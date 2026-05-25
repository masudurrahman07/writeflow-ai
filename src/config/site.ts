export const siteConfig = {
  name: "WriteFlow AI",
  description: "AI-powered writing assistant for modern teams.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  links: {
    github: "https://github.com/your-org/writeflow-ai",
    twitter: "https://twitter.com/writeflowai",
    linkedin: "https://linkedin.com/company/writeflowai",
  },
  navPublic: [
    { label: "Home", href: "/" },
    { label: "Explore", href: "/explore" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  navPrivate: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "My Documents", href: "/documents" },
  ],
  footerLinks: [
    { label: "Home", href: "/" },
    { label: "Explore", href: "/explore" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
