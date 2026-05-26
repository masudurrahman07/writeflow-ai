"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/api";

interface GoogleLoginResponse {
  success: boolean;
  data?: {
    accessToken?: string;
    user?: { id: string; name: string; email: string; role?: string };
  };
  message?: string;
}

export default function GoogleCallbackPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [exchanging, setExchanging] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    async function exchange() {
      const idToken = (session as unknown as { idToken?: string })?.idToken;
      if (!idToken) {
        toast.error("Google sign-in failed. Please try again.");
        router.replace("/login");
        return;
      }

      setExchanging(true);
      try {
        const response = await api.post("/api/auth/google", { idToken });
        const json = response.data as GoogleLoginResponse;
        if (json.success && json.data?.accessToken) {
          const { setAuthToken, setAuthUser } = await import("@/lib/auth");
          setAuthToken(json.data.accessToken);
          if (json.data.user) {
            setAuthUser({
              id: String(json.data.user.id),
              name: json.data.user.name,
              email: json.data.user.email,
              role: (json.data.user.role ?? "USER") as "USER" | "ADMIN",
            });
          }
          toast.success("Logged in successfully!");
          router.replace("/dashboard");
          return;
        }
        toast.error(json.message || "Google login failed.");
        router.replace("/login");
      } catch {
        toast.error("Google login failed.");
        router.replace("/login");
      } finally {
        setExchanging(false);
      }
    }

    if (!exchanging) {
      exchange();
    }
  }, [router, session, status, exchanging]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner className="h-4 w-4" />
        Completing Google sign-in…
      </div>
    </div>
  );
}
