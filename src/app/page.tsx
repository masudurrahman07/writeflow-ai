import Link from "next/link";

export default function HomePage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          WriteFlow AI &mdash; your intelligent writing companion.
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Craft, refine, and publish content faster with AI-powered assistance
          built for modern teams.
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
        >
          Get Started
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          Sign In
        </Link>
      </div>
    </section>
  );
}
