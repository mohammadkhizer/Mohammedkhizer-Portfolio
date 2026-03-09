"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="relative">
          <h1 className="text-9xl font-black text-primary/10 select-none">404</h1>
          <p className="absolute inset-0 flex items-center justify-center text-4xl font-bold tracking-tighter">
            Lost in Space?
          </p>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Page Not Found</h2>
          <p className="text-muted-foreground leading-relaxed">
            The page you're looking for doesn't exist or has been moved. 
            Don't worry, even the best developers hit a 404 once in a while.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button asChild variant="default" className="w-full sm:w-auto rounded-full h-12 px-8 font-bold gap-2 shadow-lg shadow-primary/20">
            <Link href="/">
              <Home className="h-4 w-4" />
              Return Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto rounded-full h-12 px-8 font-bold gap-2">
            <button onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </Button>
        </div>
      </div>
    </div>
  );
}
