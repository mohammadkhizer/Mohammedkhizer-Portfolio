"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Download } from "lucide-react";
import Link from "next/link";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";

export function Hero() {
  const [displayText, setDisplayText] = React.useState("");
  const fullText = "Full-Stack Web Developer & AI/ML Enthusiast";
  
  const firestore = useFirestore();
  // Guard: firestore is null before Firebase initializes (SSR / first render)
  const profileRef = useMemoFirebase(
    () => firestore ? collection(firestore, "userProfiles") : null,
    [firestore]
  );
  const { data: profiles, isLoading: isProfileLoading } = useCollection(profileRef);
  const profile = profiles?.[0];


  React.useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, current));
      current++;
      if (current > fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-primary/10 rounded-full blur-[80px] md:blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 md:w-96 md:h-96 bg-accent/10 rounded-full blur-[80px] md:blur-[120px] -z-10 animate-pulse delay-700" />
      
      <div className="container mx-auto px-4 sm:px-6 text-center z-10">
        <div className="space-y-6 md:space-y-8 animate-fade-in-up">
          <h2 className="text-primary text-xs md:text-sm font-bold tracking-[0.3em] uppercase opacity-80">Welcome to my space</h2>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight leading-[1.1]">
            {profile?.fullName || "Mohammed Khizer"} <span className="text-primary">{profile?.fullName ? "" : "Shaikh"}</span>
          </h1>
          <div className="text-lg md:text-2xl text-muted-foreground font-medium min-h-[5rem] sm:min-h-[4rem] md:min-h-[2rem] flex items-center justify-center">
            <p>
              {displayText}
              <span className="animate-blink inline-block w-1 h-6 md:h-8 bg-primary ml-1" aria-hidden="true" />
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button size="lg" className="w-full sm:w-auto px-10 rounded-full text-base md:text-lg font-bold shadow-lg shadow-primary/20" asChild>
              <Link href="/projects">View Projects</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto px-10 rounded-full text-base md:text-lg font-bold flex items-center gap-2"
              asChild
            >
              <a 
                href={profile?.cvDownloadUrl || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Download CV as PDF"
                onClick={(e) => {
                  if (!profile?.cvDownloadUrl) {
                    e.preventDefault();
                    alert("CV link not yet configured in Admin.");
                  }
                }}
              >
                <Download className="h-5 w-5" aria-hidden="true" />
                Download CV
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
        <Link href="#about" aria-label="Scroll down to About section">
          <ChevronDown className="h-8 w-8 text-muted-foreground/50 hover:text-primary transition-colors" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
