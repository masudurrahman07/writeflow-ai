"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

// Google Cloud Console must allow these origins for the configured client ID:
// - https://writeflow-ai-five.vercel.app
// - http://localhost:3000
interface GoogleAuthButtonProps {
  onCredential: (credential: string) => void;
  disabled?: boolean;
  className?: string;
}

interface GoogleCredentialResponse {
  credential?: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
          }) => void;
          renderButton: (
            element: HTMLElement | null,
            options: {
              theme: "outline";
              size: "large";
              type?: "standard";
              shape?: "pill";
            }
          ) => void;
        };
      };
    };
  }
}

function waitForGoogleSDK(timeoutMs = 5000): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("window is unavailable"));
  }

  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const check = () => {
      if (window.google?.accounts?.id) {
        resolve();
        return;
      }

      if (Date.now() - startTime >= timeoutMs) {
        reject(new Error("Google Identity Services did not load in time"));
        return;
      }

      setTimeout(check, 100);
    };

    check();
  });
}

export function GoogleAuthButton({
  onCredential,
  disabled = false,
  className,
}: GoogleAuthButtonProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    let cancelled = false;

    console.log("Google origin:", window.location.origin);
    console.log("Google clientId:", clientId);

    if (!clientId) {
      console.error("Missing Google Client ID");
      setErrorMessage("Google login not configured");
      toast.error("Google login not configured");
      return () => {
        cancelled = true;
      };
    }

    setErrorMessage(null);

    const initializeGoogle = async () => {
      try {
        await waitForGoogleSDK();

        if (cancelled) {
          return;
        }

        if (!window.google?.accounts?.id) {
          throw new Error("Google Identity Services is unavailable");
        }

        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          callback: (response: GoogleCredentialResponse) => {
            console.log("Received idToken:", response.credential);

            if (response.credential) {
              onCredential(response.credential);
              return;
            }

            setErrorMessage("Google login failed. Please try again.");
            toast.error("Google sign-in failed. Please try again.");
          },
        });

        console.log("GIS initialized successfully");

        const buttonContainer = document.getElementById("googleBtn");

        if (!buttonContainer) {
          throw new Error("Google button container not found");
        }

        window.google.accounts.id.renderButton(buttonContainer, {
          theme: "outline",
          size: "large",
          type: "standard",
          shape: "pill",
        });
      } catch (error) {
        console.error("Google GIS initialization failed", error);
        setErrorMessage("Google login failed. Please refresh and try again.");

        if (!cancelled) {
          toast.error("Google sign-in failed. Please try again.");
        }
      }
    };

    initializeGoogle();

    return () => {
      cancelled = true;
    };
  }, [clientId, onCredential]);

  return (
    <div
      className={className}
      style={{
        width: "100%",
        opacity: disabled ? 0.7 : 1,
        pointerEvents: disabled ? "none" : "auto",
      }}
    >
      <div id="googleBtn" className="w-full" />
      {errorMessage ? (
        <p className="mt-2 text-sm text-destructive">{errorMessage}</p>
      ) : null}
    </div>
  );
}
