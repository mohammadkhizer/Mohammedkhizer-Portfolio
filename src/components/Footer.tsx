"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const [year, setYear] = React.useState<number | null>(null);
  const pathname = usePathname();

  React.useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  // Don't show public footer on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }
  
  return (
    <footer className="py-12 border-t border-border/50">
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-muted-foreground text-sm">
          © {year || "..."} Mohammed Khizer Shaikh. Built with Passion.
        </p>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm font-medium text-muted-foreground">
          <a href="https://www.linkedin.com/in/mohammad-khizer-shaikh-14a362275" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">LinkedIn</a>
          <a href="https://github.com/mohammadkhizer" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">GitHub</a>
          <a href="https://www.instagram.com/khizerrrr11/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Instagram</a>
          <Link href="/projects" className="hover:text-primary transition-colors">Projects</Link>
          <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
}