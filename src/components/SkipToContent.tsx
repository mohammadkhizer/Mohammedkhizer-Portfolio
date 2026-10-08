"use client";

import * as React from "react";

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-5 focus:py-3 focus:bg-primary focus:text-primary-foreground focus:font-semibold focus:rounded-xl focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-primary/40 transition-all duration-200"
    >
      Skip to main content
    </a>
  );
}
