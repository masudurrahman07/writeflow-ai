export const siteConfig = {
  name: "WriteFlow AI",
  description: "AI-powered writing assistant for modern teams.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  links: {
    github: "https://github.com/your-org/writeflow-ai",
  },
} as const;

export type SiteConfig = typeof siteConfig;
