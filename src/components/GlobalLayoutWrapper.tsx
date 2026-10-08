"use client";

import * as React from "react";
import { SitePreloader } from "@/components/SitePreloader";
import { SkipToContent } from "@/components/SkipToContent";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import { UTMTracker } from "@/components/UTMTracker";
import { CookieBanner } from "@/components/CookieBanner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Toaster } from "@/components/ui/toaster";
import { CursorHighlighter } from "@/components/CursorHighlighter";
import { ThemeProvider } from "@/components/ThemeProvider";

export function GlobalLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SitePreloader />
      <SkipToContent />
      <ScrollProgressBar />
      <UTMTracker />
      <CursorHighlighter />
      <Navbar />

      <main id="main-content" className="pt-20 min-h-screen">
        {children}
      </main>

      <Footer />
      <CookieBanner />
      <ScrollToTop />
      <Toaster />
    </ThemeProvider>
  );
}
