"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  Menu,
  Sun,
  Moon,
  PenLine,
  ChevronDown,
  LayoutDashboard,
  FileText,
  User,
  Settings,
  LogOut,
  Home,
  Compass,
  BookOpen,
  Info,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useMounted } from "@/hooks/use-mounted";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NavbarProps {
  /**
   * Pass the authenticated user to switch to the logged-in nav.
   * When null/undefined the public (logged-out) nav is shown.
   */
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
  } | null;
  /** Called when the user clicks "Logout" */
  onLogout?: () => void;
}

// ─── Nav item icon map ────────────────────────────────────────────────────────

const publicNavIcons: Record<string, React.ElementType> = {
  Home,
  Explore: Compass,
  Blog: BookOpen,
  About: Info,
  Contact: Mail,
};

const privateNavIcons: Record<string, React.ElementType> = {
  Dashboard: LayoutDashboard,
  "My Documents": FileText,
};

// ─── Theme Toggle ─────────────────────────────────────────────────────────────

function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useMounted();

  // Stable placeholder prevents layout shift before hydration
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn("h-9 w-9 shrink-0", className)}
        aria-label="Toggle theme"
        disabled
      >
        <span className="h-4 w-4" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground",
        className
      )}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}

// ─── Desktop Nav Link ─────────────────────────────────────────────────────────

function DesktopNavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = href === "/"
    ? pathname === "/"
    : pathname.startsWith(href + "/") || pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "relative text-sm font-medium transition-colors rounded-sm",
        "hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isActive
          ? "text-foreground after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-primary"
          : "text-muted-foreground"
      )}
    >
      {label}
    </Link>
  );
}

// ─── Profile Dropdown ─────────────────────────────────────────────────────────

function ProfileDropdown({
  user,
  onLogout,
}: {
  user: NonNullable<NavbarProps["user"]>;
  onLogout: () => void;
}) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-9 items-center gap-2 rounded-full px-2 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Open profile menu"
        >
          <Avatar className="h-7 w-7">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="text-xs font-semibold bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium sm:block max-w-[120px] truncate">
            {user.name.split(" ")[0]}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {/* User info header */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer gap-2">
            <User className="h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onLogout}
          className="gap-2 text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Mobile Sheet Menu ────────────────────────────────────────────────────────

function MobileSheetMenu({
  open,
  onOpenChange,
  user,
  onLogout,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: NavbarProps["user"];
  onLogout: () => void;
}) {
  const pathname = usePathname();
  const navItems = user ? siteConfig.navPrivate : siteConfig.navPublic;
  const iconMap = user ? privateNavIcons : publicNavIcons;

  const close = () => onOpenChange(false);

  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[280px] p-0 flex flex-col">
        {/* Sheet header */}
        <SheetHeader className="px-5 pt-5 pb-4 border-b border-border">
          <SheetTitle asChild>
            <Link
              href="/"
              onClick={close}
              className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              aria-label="WriteFlow AI home"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
                <PenLine className="h-4 w-4" />
              </span>
              <span className="font-bold text-base tracking-tight text-foreground">
                WriteFlow <span className="text-primary">AI</span>
              </span>
            </Link>
          </SheetTitle>
        </SheetHeader>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = iconMap[item.label as keyof typeof iconMap] ?? Home;
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");

            return (
              <SheetClose asChild key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              </SheetClose>
            );
          })}
        </nav>

        {/* Footer: auth section */}
        <div className="border-t border-border px-3 py-4 space-y-1">
          {user ? (
            <>
              {/* User info */}
              <div className="flex items-center gap-3 px-3 py-2 mb-2">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback className="text-xs font-semibold bg-primary text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              <Separator className="mb-2" />

              <SheetClose asChild>
                <Link
                  href="/profile"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <User className="h-4 w-4 shrink-0" />
                  Profile
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/settings"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <Settings className="h-4 w-4 shrink-0" />
                  Settings
                </Link>
              </SheetClose>
              <button
                onClick={() => {
                  onLogout?.();
                  close();
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 px-1">
              <SheetClose asChild>
                <Button variant="outline" className="w-full justify-start gap-2" asChild>
                  <Link href="/login">
                    <User className="h-4 w-4" />
                    Sign In
                  </Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button className="w-full justify-start gap-2" asChild>
                  <Link href="/register">
                    <PenLine className="h-4 w-4" />
                    Get Started Free
                  </Link>
                </Button>
              </SheetClose>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

/**
 * Navbar
 *
 * Sticky, full-width navigation bar.
 *
 * Logged-out:  Home · Explore · Blog · About · Contact  +  Sign In / Get Started
 * Logged-in:   Dashboard · My Documents  +  profile dropdown (Profile, Settings, Logout)
 *
 * Mobile (≤ md): hamburger button opens a shadcn Sheet sliding from the left.
 * Desktop (≥ md): inline nav links + theme toggle + auth controls.
 */
export function Navbar({ user: propUser, onLogout }: NavbarProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [localUser, setLocalUser] = useState<NavbarProps["user"]>(null);
  const pathname = usePathname();

  // Detect auth state from localStorage when user prop is not provided
  useEffect(() => {
    if (propUser) {
      setLocalUser(propUser);
      return;
    }
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const parsed = JSON.parse(raw);
        setLocalUser({
          name: parsed.name,
          email: parsed.email,
          avatarUrl: parsed.avatar,
        });
      } else {
        setLocalUser(null);
      }
    } catch {
      setLocalUser(null);
    }
  }, [propUser, pathname]);

  const user = propUser ?? localUser;

  const handleLogout = useCallback(() => {
    if (onLogout) {
      onLogout();
      return;
    }
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    toast.success("Logged out");
    window.location.href = "/login";
  }, [onLogout]);

  // Shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close sheet on route change
  useEffect(() => {
    setSheetOpen(false);
  }, [pathname]);

  const navItems = user ? siteConfig.navPrivate : siteConfig.navPublic;

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full",
          "transition-all duration-300 ease-out",
          "border-b border-border/30 bg-background/60 backdrop-blur-xl",
          scrolled && "bg-background/75 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)]"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            aria-label="WriteFlow AI home"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <PenLine className="h-4 w-4" />
            </span>
            <span className="font-bold text-base tracking-tight text-foreground">
              WriteFlow <span className="text-primary">AI</span>
            </span>
          </Link>

          {/* ── Desktop nav links ── */}
          <nav
            className="hidden md:flex items-center gap-6"
            aria-label="Main navigation"
          >
            {navItems.map((item) => (
              <DesktopNavLink
                key={item.href}
                href={item.href}
                label={item.label}
              />
            ))}
          </nav>

          {/* ── Right-side controls ── */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Theme toggle — always visible */}
            <ThemeToggle />

            {/* Desktop auth / profile */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <ProfileDropdown user={user} onLogout={handleLogout} />
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/register">Get Started</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile hamburger — opens Sheet */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 md:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setSheetOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={sheetOpen}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* ── Mobile Sheet (rendered outside header to avoid z-index issues) ── */}
      <MobileSheetMenu
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        user={user}
        onLogout={handleLogout}
      />
    </>
  );
}
