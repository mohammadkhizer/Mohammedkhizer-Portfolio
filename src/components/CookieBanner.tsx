"use client";

import * as React from "react";
import { Cookie, X, Check, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const COOKIE_CONSENT_KEY = "mks_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!consent) {
        // Show after small delay for smooth intro
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // LocalStorage unavailable
    }
  }, []);

  const handleConsent = (choice: "all" | "essential") => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
        choice,
        timestamp: new Date().toISOString()
      }));
    } catch {
      // Handle privacy mode errors
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Cookie Consent"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-in fade-in slide-in-from-bottom-8 duration-500"
    >
      <div className="glass border border-border/60 dark:border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-xl bg-background/90 text-foreground space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 text-primary font-bold text-base">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Cookie className="h-5 w-5" />
            </div>
            <span>Cookie & Privacy Settings</span>
          </div>
          <button
            onClick={() => handleConsent("essential")}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-secondary"
            aria-label="Close cookie banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          We use essential cookies and analytical tracking to optimize site performance, analyze traffic, and enhance your user experience. No personal data is sold.
        </p>

        <div className="flex items-center gap-2 pt-1">
          <Button
            size="sm"
            onClick={() => handleConsent("all")}
            className="flex-1 font-semibold text-xs py-2 gap-1.5 rounded-xl shadow-md"
          >
            <Check className="h-3.5 w-3.5" />
            Accept All
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleConsent("essential")}
            className="flex-1 font-semibold text-xs py-2 gap-1.5 rounded-xl border-border/60 hover:bg-secondary"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Essential Only
          </Button>
        </div>
      </div>
    </aside>
  );
}
