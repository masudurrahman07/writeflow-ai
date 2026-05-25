"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      // Simulate API call – replace with real request later
      await new Promise((res) => setTimeout(res, 1500));
      toast.success("If an account exists, a reset link has been sent to your email.");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-indigo-100 to-white dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-gray-900 p-8 shadow-lg backdrop-blur-sm border border-border">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-gray-100">
          Forgot Password
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              placeholder="Email"
              type="email"
              {...register("email")}
              disabled={loading}
              className={errors.email ? "border-destructive" : undefined}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Spinner className="h-5 w-5 mr-2" /> : null}
            Send Reset Link
          </Button>
        </form>
      </div>
    </div>
  );
}
