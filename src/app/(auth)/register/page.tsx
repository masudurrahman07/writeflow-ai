/* src/app/(auth)/register/page.tsx */
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import Link from "next/link";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords don't match",
});

type RegisterForm = z.infer<typeof registerSchema>;



export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
      // TODO: replace with real registration API call
      await new Promise((res) => setTimeout(res, 1500));
      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (e) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container flex min-h-screen w-full flex-col items-center justify-center px-4 dark:bg-background">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Create your account
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Fill in the details below to get started.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Name
            </label>
            <Input id="name" type="text" {...register("name")} disabled={loading} />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Email
            </label>
            <Input id="email" type="email" {...register("email")} disabled={loading} />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Password
            </label>
            <Input id="password" type="password" {...register("password")} disabled={loading} />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Confirm Password
            </label>
            <Input id="confirmPassword" type="password" {...register("confirmPassword")} disabled={loading} />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Spinner className="w-4 h-4 mr-2" /> : null}
            Sign Up
          </Button>
        </form>
        <div className="flex justify-between items-center text-xs">
          <Link href="/login" className="text-slate-500 hover:underline dark:text-slate-400">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
}
