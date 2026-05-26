"use client";

import { useEffect } from "react";
import { toast } from "sonner";

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
  useEffect(() => {
    let cancelled = false;
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    console.log("Google clientId:", clientId);

    if (!clientId) {
      console.error("Missing Google Client ID");
      toast.error("Google sign-in is not configured. Please contact support.");
      return () => {
        cancelled = true;
      };
    }

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
          client_id: clientId,
          callback: (response: GoogleCredentialResponse) => {
            console.log("Received idToken:", response.credential);

            if (response.credential) {
              onCredential(response.credential);
              return;
            }

            toast.error("Google sign-in failed. Please try again.");
          },
        });

        console.log("GIS initialized successfully");

        const buttonContainer = document.getElementById("google-gsi-button");

        if (buttonContainer) {
          window.google.accounts.id.renderButton(buttonContainer, {
            theme: "outline",
            size: "large",
          });
        } else {
          console.error("Google button container not found");
        }
      } catch (error) {
        console.error("Google GIS initialization failed", error);

        if (!cancelled) {
          toast.error("Google sign-in failed. Please try again.");
        }
      }
    };

    initializeGoogle();

    return () => {
      cancelled = true;
    };
  }, [onCredential]);

  return (
    <div
      className={className}
      style={{
        width: "100%",
        opacity: disabled ? 0.7 : 1,
        pointerEvents: disabled ? "none" : "auto",
      }}
    >
      <div id="google-gsi-button" className="w-full" />
    </div>
  );
}
