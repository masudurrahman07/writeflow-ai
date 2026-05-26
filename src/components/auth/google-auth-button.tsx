"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface GoogleAuthButtonProps {
  onCredential: (credential: string) => void;
  disabled?: boolean;
  className?: string;
}

interface GoogleCredentialResponse {
  credential?: string;
}

interface GoogleIdentityServices {
  accounts: {
    id: {
      initialize: (options: {
        client_id: string;
        callback: (response: GoogleCredentialResponse) => void;
      }) => void;
      prompt: () => void;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleIdentityServices;
  }
}

const GOOGLE_SCRIPT_ID = "google-gsi-script";
const GOOGLE_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

async function loadGoogleScript(): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("window is unavailable");
  }

  if (window.google?.accounts?.id) {
    return;
  }

  const existingScript = document.getElementById(GOOGLE_SCRIPT_ID);

  if (existingScript) {
    await new Promise<void>((resolve, reject) => {
      existingScript.addEventListener(
        "load",
        () => resolve(),
        { once: true }
      );
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Failed to load Google script")),
        { once: true }
      );
    });
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.src = GOOGLE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google script"));
    document.body.appendChild(script);
  });
}

export function GoogleAuthButton({
  onCredential,
  disabled = false,
  className,
}: GoogleAuthButtonProps) {
  const callbackRef = useRef(onCredential);
  const initializedRef = useRef(false);

  callbackRef.current = onCredential;

  useEffect(() => {
    let cancelled = false;

    const initializeGoogle = async () => {
      try {
        await loadGoogleScript();

        if (cancelled) {
          return;
        }

        const google = window.google;
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

        if (!google?.accounts?.id) {
          throw new Error("Google Identity Services is unavailable");
        }

        if (!initializedRef.current) {
          google.accounts.id.initialize({
            client_id: clientId || "",
            callback: (response: GoogleCredentialResponse) => {
              if (response?.credential) {
                callbackRef.current(response.credential);
                return;
              }

              toast.error("Google sign-in failed. Please try again.");
            },
          });

          initializedRef.current = true;
        }
      } catch {
        if (!cancelled) {
          toast.error("Google sign-in failed. Please try again.");
        }
      }
    };

    initializeGoogle();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleGoogleClick = async () => {
    try {
      await loadGoogleScript();

      const google = window.google;

      if (!google?.accounts?.id) {
        throw new Error("Google Identity Services is unavailable");
      }

      google.accounts.id.prompt();
    } catch {
      toast.error("Google sign-in failed. Please try again.");
    }
  };

  return (
    <Button
      type="button"
      onClick={handleGoogleClick}
      disabled={disabled}
      className={className}
    >
      Continue with Google
    </Button>
  );
}
