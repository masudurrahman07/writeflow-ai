"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Analytics", icon: BarChart3 },
  { href: "/admin/users", label: "Manage Users", icon: Users },
  { href: "/admin/templates", label: "Manage Templates", icon: FileText },
  { href: "/admin/reviews", label: "Manage Reviews", icon: MessageSquare },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
];

interface AdminSidebarProps {
  onNavigate?: () => void;
}

export function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="border-b border-border px-4 py-5">
        <Link
          href="/admin"
          className="flex items-center gap-2 font-semibold text-foreground"
          onClick={onNavigate}
        >
          <LayoutDashboard className="h-5 w-5 text-primary" />
          Admin Panel
        </Link>
        <p className="mt-1 text-xs text-muted-foreground">WriteFlow AI</p>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
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
      </nav>
      <div className="border-t border-border p-4">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to User Dashboard
        </Link>
      </div>
    </div>
  );
}
