"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, ChevronDown, LogOut, User, Shield } from "lucide-react";
import { toast } from "sonner";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { apiFetch } from "@/lib/api";
import {
  AuthUser,
  isAuthenticated,
  logout,
  setAuthUser,
} from "@/lib/auth";

const pageTitles: Record<string, string> = {
  "/admin": "Analytics Overview",
  "/admin/users": "Manage Users",
  "/admin/templates": "Manage Templates",
  "/admin/reviews": "Manage Reviews",
  "/admin/settings": "Site Settings",
};

interface MeResponse {
  success: boolean;
  data: { user: AuthUser };
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const pageTitle = pageTitles[pathname] ?? "Admin Panel";

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    async function loadUser() {
      try {
        const res = await apiFetch<MeResponse>("/api/auth/me");
        setAuthUser(res.data.user);

        if (res.data.user.role !== "ADMIN") {
          router.replace("/dashboard");
          return;
        }

        setUser(res.data.user);
        setReady(true);
      } catch {
        toast.error("Session expired. Please log in again.");
        logout();
        router.replace("/login");
      }
    }

    loadUser();
  }, [router]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    router.push("/login");
  };

  if (!ready) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-border lg:block">
        <AdminSidebar />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Admin navigation</SheetTitle>
          <AdminSidebar onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="lg:hidden shrink-0"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="min-w-0">
              <p className="text-xs font-medium text-primary flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Admin Panel
              </p>
              <h1 className="text-lg font-semibold text-foreground truncate">
                {pageTitle}
              </h1>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 max-w-[200px]">
                <span className="truncate text-sm">
                  {user?.name ?? "Admin"}
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
