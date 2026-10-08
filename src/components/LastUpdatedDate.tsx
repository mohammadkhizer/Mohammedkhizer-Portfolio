"use client";

import * as React from "react";
import { Clock } from "lucide-react";

interface LastUpdatedDateProps {
  date?: string;
  className?: string;
}

export function LastUpdatedDate({
  date = "October 2026",
  className = "",
}: LastUpdatedDateProps) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/60 text-muted-foreground text-xs font-medium border border-border/40 ${className}`}
    >
      <Clock className="h-3 w-3 text-primary shrink-0" />
      <span>Last updated: <time>{date}</time></span>
    </div>
  );
}
