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
          className="peer h-12 bg-background/80 pt-5 pb-2"
          {...props}
        />
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-3 top-2.5 text-sm text-muted-foreground transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs"
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
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (res.ok && json.success && json.data?.accessToken) {
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

        toast.success("Logged in successfully!");
        router.push("/dashboard");
      } else {
        toast.error(json.message || "Invalid credentials");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (email: string, password: string) => {
    setValue("email", email);
    setValue("password", password);
    await handleSubmit(onSubmit)();
  };

  const handleGoogle = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/google-callback" });
    setLoading(false);
  };

  return (
    <AuthPageShell
      badge="Welcome Back"
      title="Login to WriteFlow AI"
      subtitle="Sign in to continue your writing journey with a secure, fast, and beautifully designed workspace."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              className="peer h-12 bg-background/80 pt-5 pb-2 pr-11"
              disabled={loading}
              {...register("password")}
            />
            <label
              htmlFor="password"
              className="pointer-events-none absolute left-3 top-2.5 text-sm text-muted-foreground transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:-translate-y-0 peer-[&:not(:placeholder-shown)]:text-xs"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password ? (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          ) : null}
        </div>

        <Button type="submit" className="w-full h-11" disabled={loading}>
          {loading ? <Spinner className="mr-2 h-4 w-4" /> : null}
          Sign In
        </Button>
      </form>

      <div className="w-full space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            type="button"
            variant="outline"
            className="h-11 justify-center"
            onClick={() => demoLogin("user@writeflow.com", "123456")}
            disabled={loading}
          >
            Demo User
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 justify-center"
            onClick={() => demoLogin("admin@writeflow.com", "123456")}
            disabled={loading}
          >
            Demo Admin
          </Button>
        </div>

        <Button
          type="button"
          variant="secondary"
          className="w-full h-11"
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