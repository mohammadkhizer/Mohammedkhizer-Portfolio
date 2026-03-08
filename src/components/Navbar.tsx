"use client";

import * as React from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
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
  const pathname = usePathname();

  // Don't show public navbar on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "glass h-16 shadow-lg" : "bg-transparent h-20"
      )}
    >
      <div className="container mx-auto h-full px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tighter">
          MK<span className="text-primary">.</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-primary font-bold" : "text-foreground/80"
              )}
            >
              {link.name}
            </Link>
          ))}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-background z-[60] md:hidden flex flex-col items-center justify-center gap-8 transition-transform duration-300",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-6 right-6"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X className="h-8 w-8" />
        </Button>
        {NAV_LINKS.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              "text-2xl font-bold hover:text-primary",
              pathname === link.href ? "text-primary" : ""
            )}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}