"use client";

import { signIn } from "next-auth/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface GoogleAuthButtonProps {
  disabled?: boolean;
  className?: string;
}

export function GoogleAuthButton({
  disabled = false,
  className,
}: GoogleAuthButtonProps) {
  const handleClick = async () => {
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch {
      toast.error("Google sign-in failed. Please try again.");
    }
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={className}
    >
      Continue with Google
    </Button>
  );
}
