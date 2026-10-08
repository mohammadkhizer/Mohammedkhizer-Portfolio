"use client";

import * as React from "react";
import { MessageSquare, X } from "lucide-react";
import { useRouter } from "next/navigation";

export function FloatingContactButton() {
  const router = useRouter();
  const [tooltipVisible, setTooltipVisible] = React.useState(false);

  const handleClick = () => {
    const contactElem = document.getElementById("contact");
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/contact");
    }
  };

  return (
    <div className="fixed bottom-20 right-6 md:bottom-24 md:right-8 z-40 flex items-center gap-3">
      {/* Tooltip on hover */}
      {tooltipVisible && (
        <div className="hidden sm:block glass px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-lg text-foreground border border-border/50 animate-in fade-in slide-in-from-right-2 duration-200">
          Get in Touch 👋
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
        aria-label="Contact Mohammed Khizer Shaikh"
        className="relative group p-4 rounded-full bg-primary text-primary-foreground shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/40"
      >
        {/* Pulse aura */}
        <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-25 group-hover:opacity-40" />

        <MessageSquare className="h-6 w-6 relative z-10" />
      </button>
    </div>
  );
}
