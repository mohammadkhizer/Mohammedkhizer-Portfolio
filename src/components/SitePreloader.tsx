"use client";

import * as React from "react";

const LOADING_STEPS = [
  "Initializing system...",
  "Loading portfolio assets...",
  "Configuring interactive components...",
  "Ready!",
];

export function SitePreloader() {
  const [progress, setProgress] = React.useState(0);
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [shouldRender, setShouldRender] = React.useState(true);

  React.useEffect(() => {
    // Lock scroll during preloader animation
    document.body.style.overflow = "hidden";

    let intervalId: NodeJS.Timeout;
    const startTime = Date.now();
    const duration = 1600; // 1.6 seconds total loading sequence

    intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, Math.floor((elapsed / duration) * 100));

      setProgress(currentProgress);

      if (currentProgress < 30) {
        setCurrentStepIndex(0);
      } else if (currentProgress < 70) {
        setCurrentStepIndex(1);
      } else if (currentProgress < 95) {
        setCurrentStepIndex(2);
      } else {
        setCurrentStepIndex(3);
      }

      if (currentProgress >= 100) {
        clearInterval(intervalId);
        setTimeout(() => {
          setIsLoading(false);
          document.body.style.overflow = "unset";
          // Unmount DOM after fade-out transition finishes
          setTimeout(() => setShouldRender(false), 700);
        }, 200);
      }
    }, 20);

    return () => {
      clearInterval(intervalId);
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-all duration-700 ease-in-out ${
        isLoading ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
      }`}
    >
      {/* Background glowing gradient orb */}
      <div className="absolute w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center space-y-8 px-6 max-w-sm w-full">
        {/* Animated Brand Logo */}
        <div className="relative">
          <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl animate-ping opacity-40" />
          <div className="relative text-5xl md:text-6xl font-black tracking-tighter text-foreground drop-shadow-2xl">
            MK<span className="text-primary animate-pulse">.</span>
          </div>
        </div>

        {/* Text & Progress Container */}
        <div className="w-full space-y-4">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <span className="truncate max-w-[200px] text-left">
              {LOADING_STEPS[currentStepIndex]}
            </span>
            <span className="text-primary font-mono text-sm">{progress}%</span>
          </div>

          {/* Progress Bar Container */}
          <div className="w-full h-1.5 bg-secondary/80 rounded-full overflow-hidden border border-border/40 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-primary via-orange-500 to-emerald-400 rounded-full transition-all duration-75 ease-out shadow-[0_0_12px_rgba(249,115,22,0.6)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-muted-foreground/60">
          Mohammed Khizer Shaikh
        </p>
      </div>
    </div>
  );
}
