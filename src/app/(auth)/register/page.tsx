/* src/app/(auth)/register/page.tsx */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
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
import { api } from "@/lib/api";

const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email({ message: "Enter a valid email address" }),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });

type RegisterForm = z.infer<typeof registerSchema>;

function FloatingField({
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

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  async function onSubmit(data: RegisterForm) {
    setLoading(true);
    try {
      const response = await api.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      const json = response.data;

      if (json.success && json.data?.accessToken) {
        const { setAuthToken, setAuthUser } = await import("@/lib/auth");

        setAuthToken(json.data.accessToken);

        if (json.data.user) {
          setAuthUser({
            id: String(json.data.user.id),
            name: json.data.user.name,
            email: json.data.user.email,
            role: json.data.user.role ?? "USER",
          });
        }

        toast.success("Account created successfully!");
        router.push("/dashboard");
      } else {
        toast.error(json.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      const message =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data
              ?.message
          : undefined;

      toast.error(message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleGoogle = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/google-callback" });
    setLoading(false);
  };

  return (
    <AuthPageShell
      badge="New Account"
      title="Create your account"
      subtitle="Set up your WriteFlow workspace and start creating polished, high-converting content in minutes."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" autoComplete="off">
        <FloatingField
          id="name"
          label="Full name"
          {...register("name")}
          disabled={loading}
          error={errors.name?.message}
        />

        <FloatingField
          id="email"
          label="Email address"
          type="email"
          autoComplete="email"
          {...register("email")}
          disabled={loading}
          error={errors.email?.message}
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

        <div className="space-y-1.5">
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder=" "
              className="peer h-14 rounded-[1.15rem] border border-white/25 bg-white/70 px-4 pb-2 pt-6 pr-12 text-sm text-foreground shadow-[0_16px_50px_-28px_rgba(59,130,246,0.45)] backdrop-blur-xl transition-all duration-200 placeholder:text-transparent focus-visible:outline-none focus-visible:border-primary/60 focus-visible:ring-0 dark:border-white/10 dark:bg-slate-950/45"
              disabled={loading}
              {...register("confirmPassword")}
            />
            <label
              htmlFor="confirmPassword"
              className="pointer-events-none absolute left-4 top-3.5 text-sm text-muted-foreground transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:-top-1 peer-focus:text-[11px] peer-focus:font-medium peer-focus:text-primary peer-[&:not(:placeholder-shown)]:-top-1 peer-[&:not(:placeholder-shown)]:text-[11px]"
            >
              Confirm password
            </label>
            <button
              type="button"
              onClick={() => setShowConfirmPassword((current) => !current)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/25 bg-white/70 p-2 text-muted-foreground transition-all duration-200 hover:border-primary/60 hover:text-foreground dark:border-white/10 dark:bg-slate-950/45"
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword ? (
            <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
          ) : null}
        </div>

        <Button
          type="submit"
          className="h-12 w-full rounded-[1.1rem] bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 text-sm font-semibold text-white shadow-[0_20px_60px_-22px_rgba(59,130,246,0.8)] transition-transform duration-200 hover:scale-[1.01]"
          disabled={loading}
        >
          {loading ? <Spinner className="mr-2 h-4 w-4" /> : null}
          Create account
        </Button>
      </form>

      <div className="w-full space-y-4 pt-2">
        <Button
          type="button"
          className="h-12 w-full rounded-[1.1rem] border border-white/25 bg-white/65 text-foreground shadow-[0_16px_40px_-28px_rgba(59,130,246,0.45)] backdrop-blur-xl transition-transform duration-200 hover:scale-[1.01] dark:border-white/10 dark:bg-slate-950/45"
          onClick={handleGoogle}
          disabled={loading}
        >
          {loading ? <Spinner className="mr-2 h-4 w-4" /> : null}
          Continue with Google
        </Button>

        <div className="flex items-center justify-center gap-3 pt-1">
          <SocialIconButton icon={GithubIcon} label="Github" />
          <SocialIconButton icon={TwitterIcon} label="Twitter" />
          <SocialIconButton icon={LinkedinIcon} label="Linkedin" />
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </AuthPageShell>
  );
}
