"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  AuthPageShell,
  GithubIcon,
  LinkedinIcon,
  SocialIconButton,
  TwitterIcon,
} from "@/components/auth/auth-page-shell";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { api } from "@/lib/api";
import { getAuthToken, getAuthUser, setAuthToken, setAuthUser } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginForm = z.infer<typeof loginSchema>;

function FloatingInput({
  id,
  label,
  type = "text",
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="relative">
        <Input
          id={id}
          type={type}
          placeholder=" "
          className="peer h-14 rounded-[1.15rem] border border-white/25 bg-white/70 px-4 pb-2 pt-6 text-sm text-foreground shadow-[0_16px_50px_-28px_rgba(59,130,246,0.45)] backdrop-blur-xl transition-all duration-200 placeholder:text-transparent focus-visible:outline-none focus-visible:border-primary/60 focus-visible:ring-0 dark:border-white/10 dark:bg-slate-950/45"
          {...props}
        />
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-4 top-3.5 text-sm text-muted-foreground transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:-top-1 peer-focus:text-[11px] peer-focus:font-medium peer-focus:text-primary peer-[&:not(:placeholder-shown)]:-top-1 peer-[&:not(:placeholder-shown)]:text-[11px]"
        >
          {label}
        </label>
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [router, status]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const loginWithCredentials = async (data: LoginForm) => {
    setLoading(true);

    try {
      const response = await api.post("/api/auth/login", data);
      const json = response.data;

      if (!json.success || !json.data?.accessToken) {
        toast.error(json.message || "Invalid credentials");
        return;
      }

      setAuthToken(json.data.accessToken);

      if (json.data.user) {
        setAuthUser({
          id: String(json.data.user.id),
          name: json.data.user.name,
          email: json.data.user.email,
          role: json.data.user.role ?? "USER",
        });
      }

      const persistedToken = getAuthToken();
      const persistedUser = getAuthUser();

      if (!persistedToken || !persistedUser) {
        toast.error("Login failed to persist session. Please try again.");
        return;
      }

      toast.success("Logged in successfully!");
      router.replace("/dashboard");
    } catch (error) {
      const message =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data
              ?.message
          : undefined;

      toast.error(message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: LoginForm) => {
    await loginWithCredentials(data);
  };

  const demoLogin = async (email: string, password: string) => {
    setValue("email", email);
    setValue("password", password);
    await loginWithCredentials({ email, password });
  };

  return (
    <AuthPageShell
      badge="Welcome Back"
      title="Login to WriteFlow AI"
      subtitle="Sign in to continue your writing journey with a secure, fast, and beautifully designed workspace."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FloatingInput
          id="email"
          label="Email address"
          type="email"
          autoComplete="email"
          disabled={loading}
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="space-y-1.5">
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder=" "
              className="peer h-14 rounded-[1.15rem] border border-white/25 bg-white/70 px-4 pb-2 pt-6 pr-12 text-sm text-foreground shadow-[0_16px_50px_-28px_rgba(59,130,246,0.45)] backdrop-blur-xl transition-all duration-200 placeholder:text-transparent focus-visible:outline-none focus-visible:border-primary/60 focus-visible:ring-0 dark:border-white/10 dark:bg-slate-950/45"
              disabled={loading}
              {...register("password")}
            />
            <label
              htmlFor="password"
              className="pointer-events-none absolute left-4 top-3.5 text-sm text-muted-foreground transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:-top-1 peer-focus:text-[11px] peer-focus:font-medium peer-focus:text-primary peer-[&:not(:placeholder-shown)]:-top-1 peer-[&:not(:placeholder-shown)]:text-[11px]"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/25 bg-white/70 p-2 text-muted-foreground transition-all duration-200 hover:border-primary/60 hover:text-foreground dark:border-white/10 dark:bg-slate-950/45"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password ? (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          ) : null}
        </div>

        <Button
          type="submit"
          className="h-12 w-full rounded-[1.1rem] bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 text-sm font-semibold text-white shadow-[0_20px_60px_-22px_rgba(59,130,246,0.8)] transition-transform duration-200 hover:scale-[1.01]"
          disabled={loading}
        >
          {loading ? <Spinner className="mr-2 h-4 w-4" /> : null}
          Sign In
        </Button>
      </form>

      <div className="w-full space-y-4 pt-2">
        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            type="button"
            className="h-12 justify-center rounded-[1.1rem] border border-white/25 bg-white/65 text-foreground shadow-[0_16px_40px_-28px_rgba(59,130,246,0.45)] backdrop-blur-xl transition-transform duration-200 hover:scale-[1.01] dark:border-white/10 dark:bg-slate-950/45"
            onClick={() => demoLogin("user@writeflow.com", "123456")}
            disabled={loading}
          >
            Demo User
          </Button>
          <Button
            type="button"
            className="h-12 justify-center rounded-[1.1rem] border border-white/25 bg-white/65 text-foreground shadow-[0_16px_40px_-28px_rgba(59,130,246,0.45)] backdrop-blur-xl transition-transform duration-200 hover:scale-[1.01] dark:border-white/10 dark:bg-slate-950/45"
            onClick={() => demoLogin("admin@writeflow.com", "123456")}
            disabled={loading}
          >
            Demo Admin
          </Button>
        </div>

        <GoogleAuthButton
          disabled={loading}
          className="h-12 w-full rounded-[1.1rem] border border-white/25 bg-white/65 text-foreground shadow-[0_16px_40px_-28px_rgba(59,130,246,0.45)] backdrop-blur-xl transition-transform duration-200 hover:scale-[1.01] dark:border-white/10 dark:bg-slate-950/45"
        />

        <div className="flex items-center justify-center gap-3 pt-1">
          <SocialIconButton icon={GithubIcon} label="Github" />
          <SocialIconButton icon={TwitterIcon} label="Twitter" />
          <SocialIconButton icon={LinkedinIcon} label="Linkedin" />
        </div>

        <div className="flex flex-col gap-2 text-center text-sm text-muted-foreground">
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-primary underline-offset-4 hover:underline">
              Register
            </Link>
          </p>
          <Link href="/forgot-password" className="text-primary underline-offset-4 hover:underline">
            Forgot password?
          </Link>
        </div>
      </div>
    </AuthPageShell>
  );
}