"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Menu, ChevronDown, LogOut, Settings, User } from "lucide-react";
import { toast } from "sonner";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
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
import { AuthUser, getAuthUser, getAuthToken, logout, setAuthUser } from "@/lib/auth";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/documents": "My Documents",
  "/dashboard/profile": "My Profile",
  "/dashboard/ai-history": "AI Usage History",
  "/dashboard/usage": "AI Usage History",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const pageTitle =
    pageTitles[pathname] ??
    (pathname.startsWith("/dashboard") ? "Dashboard" : "Dashboard");

  useEffect(() => {
    const syncAuthState = () => {
      if (status === "authenticated" && session?.user) {
        const nextUser = {
          id: session.user.email ?? "nextauth-user",
          name: session.user.name ?? "User",
          email: session.user.email ?? "",
          role: "USER" as const,
        } as AuthUser;

        setAuthUser(nextUser);
        setUser(nextUser);
        setReady(true);
        return;
      }

      if (status === "loading") {
        return;
      }

      const token = getAuthToken();
      const storedUser = getAuthUser();

      if (!token || !storedUser) {
        router.replace("/login");
        return;
      }

      setUser(storedUser);
      setReady(true);
    };

    syncAuthState();

    window.addEventListener("auth:changed", syncAuthState);

    return () => {
      window.removeEventListener("auth:changed", syncAuthState);
    };
  }, [router, session, status]);

  const handleLogout = async () => {
    try {
      if (status === "authenticated") {
        await signOut({ callbackUrl: "/login" });
      }

      logout();
      toast.success("Logged out");
      router.push("/login");
    } catch {
      toast.error("Unable to log out right now.");
    }
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
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card lg:block">
        <DashboardSidebar user={user} />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <DashboardSidebar
            user={user}
            onNavigate={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-foreground truncate">
              {pageTitle}
            </h1>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 max-w-[200px]">
                <span className="truncate text-sm">
                  {user?.name ?? "Account"}
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
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
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
