import { BoneyardPreloader } from "@/components/BoneyardPreloader";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="relative min-h-[70vh]">
      {/* Top glowing loader indicator */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-blue-500 to-emerald-400 animate-pulse z-[100]" />
      <div className="flex items-center justify-center py-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 text-xs font-semibold text-primary animate-pulse shadow-lg">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading content...</span>
        </div>
      </div>
      <BoneyardPreloader />
    </div>
  );
}
