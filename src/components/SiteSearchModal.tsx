"use client";

import * as React from "react";
import { Search, X, ArrowRight, CornerDownLeft, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { SEARCH_INDEX, SearchItem } from "@/lib/searchIndex";

interface SiteSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SiteSearchModal({ isOpen, onClose }: SiteSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Filter items based on query
  const filteredItems = React.useMemo(() => {
    if (!query.trim()) return SEARCH_INDEX.slice(0, 6); // Default top items

    const q = query.toLowerCase();
    return SEARCH_INDEX.filter((item) => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.tags?.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [query]);

  // Focus input on open & manage escape/arrows
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
      } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
        e.preventDefault();
        handleSelect(filteredItems[selectedIndex].url);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  const handleSelect = (url: string) => {
    onClose();
    router.push(url);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Site Search"
      className="fixed inset-0 z-[100] flex items-start justify-center pt-16 md:pt-24 px-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="glass border border-border/60 dark:border-white/10 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl bg-background/95 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border/50">
          <Search className="h-5 w-5 text-primary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search projects, skills, pages, FAQs... (e.g. Next.js, Hire)"
            className="w-full bg-transparent text-base focus:outline-none placeholder:text-muted-foreground/60"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-muted-foreground hover:text-foreground p-1 rounded-md"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <span className="hidden md:inline-flex items-center text-[10px] uppercase font-bold text-muted-foreground bg-secondary px-2 py-1 rounded-md border border-border/50">
            ESC to close
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground space-y-2">
              <Sparkles className="h-8 w-8 mx-auto text-primary/40 animate-pulse" />
              <p className="text-sm">No search results found for &quot;{query}&quot;</p>
              <p className="text-xs opacity-75">Try searching for &quot;React&quot;, &quot;Projects&quot;, or &quot;Contact&quot;</p>
            </div>
          ) : (
            filteredItems.map((item: SearchItem, idx: number) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.url)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left p-3.5 rounded-xl flex items-center justify-between gap-4 transition-all duration-150 ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-secondary/70 text-foreground"
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {item.category}
                      </span>
                      <h4 className="text-sm font-semibold truncate">{item.title}</h4>
                    </div>
                    <p
                      className={`text-xs truncate ${
                        isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-1">
                    {isSelected && (
                      <span className="flex items-center text-[10px] font-medium gap-1 opacity-90">
                        Select <CornerDownLeft className="h-3 w-3" />
                      </span>
                    )}
                    <ArrowRight
                      className={`h-4 w-4 ${
                        isSelected ? "text-white" : "text-muted-foreground opacity-50"
                      }`}
                    />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-5 py-3 border-t border-border/40 bg-secondary/30 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span><strong className="text-foreground">↑↓</strong> Navigate</span>
            <span><strong className="text-foreground">↵</strong> Open</span>
          </div>
          <span>Mohammed Khizer Shaikh Portfolio</span>
        </div>
      </div>
    </div>
  );
}
