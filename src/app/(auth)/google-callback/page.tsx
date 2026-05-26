"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function GoogleCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    toast.error("Google sign-in failed. Please try again.");
    router.replace("/login");
  }, [router]);

  return null;
}
