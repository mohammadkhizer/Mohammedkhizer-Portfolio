"use client";

import * as React from "react";
import { Moon, Sun, Menu, X, ChevronRight } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Skills", href: "/skills" },
  { name: "Projects", href: "/projects" },
  { name: "Experience", href: "/experience" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Don't show public navbar on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  // Lock body scroll when mobile menu is open to prevent UI clashing
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Primary Navbar Container */}
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-[60] transition-all duration-300",
          isScrolled ? "glass h-16 shadow-lg border-b border-border/50" : "bg-transparent h-20"
        )}
      >
        <div className="container mx-auto h-full px-4 md:px-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-tighter">
            MK<span className="text-primary">.</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-bold uppercase tracking-widest transition-colors hover:text-primary",
                  pathname === link.href ? "text-primary" : "text-foreground/70"
                )}
              >
                {link.name}
              </Link>
            ))}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300"
            >
              {mounted ? (
                theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />
              ) : (
                <div className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Mobile UI Controls */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full h-10 w-10"
            >
              {mounted ? (
                theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />
              ) : (
                <div className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(true)}
              className="h-10 w-10 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-full transition-all"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Navigation (Side-Drawer) */}
      <div 
        className={cn(
          "fixed inset-0 z-[100] md:hidden transition-opacity duration-300",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Dark Backdrop Overlay */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Sidebar Panel - Slides from Right */}
        <aside 
          className={cn(
            "absolute top-0 right-0 bottom-0 w-[80%] max-w-[320px] bg-background border-l border-border shadow-2xl flex flex-col transition-transform duration-300 ease-in-out",
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          {/* Mobile Sidebar Header */}
          <div className="p-6 flex items-center justify-between border-b border-border shrink-0 bg-background">
            <span className="text-xl font-black tracking-tighter">
              MENU<span className="text-primary">.</span>
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-full h-10 w-10 dark:hover:bg-secondary"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Nav Links - Scrollable Area */}
          <nav className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-2xl text-lg font-black uppercase tracking-tight transition-all",
                    isActive 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "text-foreground dark:hover:bg-secondary"
                  )}
                >
                  {link.name}
                  <ChevronRight className={cn("h-5 w-5", isActive ? "text-white" : "text-primary")} />
                </Link>
              );
            })}
          </nav>

          {/* Mobile Sidebar Footer */}
          <div className="p-8 border-t border-border bg-secondary/20 shrink-0">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Portfolio of</p>
              <p className="text-sm font-bold">Mohammed Khizer Shaikh</p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
