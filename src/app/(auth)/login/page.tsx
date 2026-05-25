"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { z } from "zod";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";

const loginSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
      const res = await signIn("credentials", {
        ...data,
        redirect: false,
      });
      if (res?.ok) {
        toast.success("Logged in successfully!");
        router.push("/dashboard");
      } else {
        toast.error(res?.error || "Invalid credentials");
      }
    } catch (e) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = (email: string, password: string) => {
    setValue("email", email);
    setValue("password", password);
    handleSubmit(onSubmit)();
  };

  const handleGoogle = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
    setLoading(false);
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-background py-12">
      <Card className="w-full max-w-md bg-card/80 backdrop-blur-md border border-border shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <Badge variant="secondary" className="mx-auto text-sm">Welcome Back</Badge>
          <CardTitle className="text-2xl font-bold">Login to WriteFlow AI</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">Email</label>
              <Input id="email" type="email" placeholder="you@example.com" {...register("email")} disabled={loading} />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">Password</label>
              <Input id="password" type="password" placeholder="••••••••" {...register("password")} disabled={loading} />
              {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full flex items-center justify-center gap-2" disabled={loading}>
              {loading && <Spinner className="h-4 w-4" />}
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button variant="outline" className="w-full" onClick={() => demoLogin("user@writeflow.com", "123456")} disabled={loading}>
            Demo User Login
          </Button>
          <Button variant="outline" className="w-full" onClick={() => demoLogin("admin@writeflow.com", "123456")} disabled={loading}>
            Demo Admin Login
          </Button>
          <Button variant="ghost" className="w-full flex items-center justify-center gap-2" onClick={handleGoogle} disabled={loading}>
            {loading && <Spinner className="h-4 w-4" />}
            Continue with Google
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/register" className="font-medium text-primary hover:underline">Register</Link>
          </p>
          <p className="text-center text-sm text-muted-foreground">
            <Link href="/forgot-password" className="font-medium text-primary hover:underline">Forgot password?</Link>
          </p>
        </CardFooter>
      </Card>
    </section>
  );
}
