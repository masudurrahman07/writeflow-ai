"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold text-lg">{siteConfig.name}</span>
        </Link>

        <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
          <Link
            href="/dashboard"
            className="text-foreground/60 transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
        </nav>

        {/* Theme toggle and auth buttons will go here */}
        <div className="flex items-center space-x-2" />
      </div>
    </header>
  );
}
