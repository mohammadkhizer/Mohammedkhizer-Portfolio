"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Linkedin, Instagram, Mail, Phone, MapPin, ArrowUpRight, ShieldCheck } from "lucide-react";

export function Footer() {
  const [year, setYear] = React.useState<number | null>(null);
  const pathname = usePathname();

  React.useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="relative border-t border-border/50 bg-card/30 backdrop-blur-md pt-16 pb-12 transition-all">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/[0.02] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-border/20">

          {/* Brand Info Column */}
          <div className="md:col-span-6 space-y-4">
            <Link href="/" className="inline-block text-2xl font-black tracking-tighter hover:opacity-85 transition-opacity" aria-label="MK Portfolio Home">
              MK<span className="text-primary">.</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Mohammed Khizer Shaikh is a Full-Stack Web Developer and AI/ML engineer specializing in building high-performance web applications using React, Next.js, Django, and MongoDB.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-wider border border-green-500/20">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure, SSL Protected
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">Explore</h4>
            <ul className="space-y-2.5 text-sm font-semibold text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1 group">
                  Home <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors flex items-center gap-1 group">
                  About <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/skills" className="hover:text-primary transition-colors flex items-center gap-1 group">
                  Skills <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-primary transition-colors flex items-center gap-1 group">
                  Projects <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/experience" className="hover:text-primary transition-colors flex items-center gap-1 group">
                  Experience <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </li>
            </ul>
          </div>



          {/* Contact Details Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">Contact</h4>
            <address className="space-y-2.5 text-sm font-semibold text-muted-foreground not-italic">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                <span>Ahmedabad, Gujarat, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                <a href="mailto:work.mkhizer@gmail.com" className="hover:text-primary transition-colors">
                  work.mkhizer@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                <a href="tel:+919510865651" className="hover:text-primary transition-colors">
                  +91 9510865651
                </a>
              </div>
            </address>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8">
          <p className="text-xs text-muted-foreground font-semibold">
            &copy; {year || "..."} Mohammed Khizer Shaikh. All rights reserved.
          </p>

          {/* Social Profiles Grid */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/in/mohammad-khizer-shaikh-14a362275"
              target="_blank"
              rel="noopener noreferrer me"
              className="p-2 rounded-xl bg-secondary/50 border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="https://github.com/mohammadkhizer"
              target="_blank"
              rel="noopener noreferrer me"
              className="p-2 rounded-xl bg-secondary/50 border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all"
              aria-label="GitHub Profile"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://www.instagram.com/khizerrrr11/"
              target="_blank"
              rel="noopener noreferrer me"
              className="p-2 rounded-xl bg-secondary/50 border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all"
              aria-label="Instagram Profile"
            >
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
