import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Compass, User, Mail, ArrowLeft, Sparkles, HelpCircle } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found | Mohammed Khizer Shaikh",
  description: "The page you are looking for does not exist or has been moved.",
};

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />

      <div className="text-center space-y-8 max-w-xl mx-auto relative z-10">
        {/* Badge & Number */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-destructive/10 text-destructive rounded-full text-xs font-bold uppercase tracking-widest border border-destructive/20 shadow-sm">
            <HelpCircle className="h-3.5 w-3.5" />
            404 • Page Not Found
          </div>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground via-foreground/80 to-muted-foreground/40 drop-shadow-sm select-none">
            404
          </h1>
        </div>

        {/* Message Header */}
        <div className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Lost in Cyber Space?
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-md mx-auto">
            The link you followed might be broken, or the page may have been relocated. Don&apos;t worry, let&apos;s get you back on track.
          </p>
        </div>

        {/* Quick Destinations Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <Button
            asChild
            variant="outline"
            className="h-auto py-3.5 px-3 flex-col gap-1.5 rounded-2xl glass border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-all group"
          >
            <Link href="/">
              <Home className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold">Home</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-auto py-3.5 px-3 flex-col gap-1.5 rounded-2xl glass border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-all group"
          >
            <Link href="/projects">
              <Compass className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold">Projects</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-auto py-3.5 px-3 flex-col gap-1.5 rounded-2xl glass border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-all group"
          >
            <Link href="/about">
              <User className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold">About</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-auto py-3.5 px-3 flex-col gap-1.5 rounded-2xl glass border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-all group"
          >
            <Link href="/contact">
              <Mail className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold">Contact</span>
            </Link>
          </Button>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <Button
            asChild
            size="lg"
            className="rounded-2xl px-8 py-6 text-base font-bold gap-2.5 shadow-xl hover:shadow-primary/25 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
              Return to Safety
            </Link>
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/60 italic">
          <Sparkles className="h-3.5 w-3.5 text-primary/60" />
          <span>Mohammed Khizer Shaikh Portfolio</span>
        </div>
      </div>
    </div>
  );
}
