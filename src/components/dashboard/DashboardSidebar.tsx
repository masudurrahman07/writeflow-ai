"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  History,
  LayoutDashboard,
  Shield,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { AuthUser } from "@/lib/auth";

const navItems = [
  { href: "/dashboard/documents", label: "My Documents", icon: FileText },
  { href: "/dashboard/profile", label: "My Profile", icon: User },
  { href: "/dashboard/ai-history", label: "AI Usage History", icon: History },
];

interface DashboardSidebarProps {
  user: AuthUser | null;
  onNavigate?: () => void;
}

export function DashboardSidebar({ user, onNavigate }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-4 py-5">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold text-foreground"
          onClick={onNavigate}
        >
          <LayoutDashboard className="h-5 w-5" />
          WriteFlow
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
        {user?.role === "ADMIN" && (
          <Link
            href="/admin"
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname.startsWith("/admin")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Shield className="h-4 w-4 shrink-0" />
            Admin Dashboard
          </Link>
        )}
      </nav>
    </div>
  );
}
