'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Download } from 'lucide-react';
import Link from 'next/link';

// Static fallback values shown on first paint and used by crawlers.
// These are the SSR-visible values before the client-side API call resolves.
// Critical for GEO/SEO: without this, the <h1> is empty when crawlers visit.
const STATIC_NAME = 'Mohammed Khizer Shaikh';
const STATIC_TAGLINE = 'Full-Stack Web Developer & AI/ML Engineer';
const STATIC_CV_URL =
  'https://portfolioimageskhizer.netlify.app/Mohammed-Khizer-Shaikh-CV-2.pdf';

export function Hero() {
  const [displayText, setDisplayText] = React.useState('');
  const fullText = STATIC_TAGLINE;

  const [profile, setProfile] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Fetch live profile data (CV link, custom name) from the admin CMS
  React.useEffect(() => {
    fetch('/api/v1/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setProfile(data[0]);
        }
      })
      .catch((err) => console.error('Error fetching profile:', err))
      .finally(() => setIsLoading(false));
  }, []);

  // Typewriter animation — runs on client only (displayText starts empty)
  React.useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, current));
      current++;
      if (current > fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [fullText]);

  const personName = profile?.fullName || STATIC_NAME;
  const cvUrl = profile?.cvDownloadUrl || STATIC_CV_URL;

  return (
    <section
      aria-label="Hero — Introduction"
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20"
    >
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-primary/10 rounded-full blur-[80px] md:blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 md:w-96 md:h-96 bg-accent/10 rounded-full blur-[80px] md:blur-[120px] -z-10 animate-pulse delay-700" />

      <div className="container mx-auto px-4 sm:px-6 text-center z-10">
        <div className="space-y-6 md:space-y-8 animate-fade-in-up">
          {/* Eyebrow label */}
          <p className="text-primary text-xs md:text-sm font-bold tracking-[0.3em] uppercase opacity-80">
            Welcome to my space
          </p>

          {/*
           * H1 — The person's name. This is the primary heading of the page.
           * CRITICAL: Must be <h1> for correct heading hierarchy and SEO.
           * The static fallback (STATIC_NAME) is rendered server-side so crawlers
           * and AI systems see the name in the HTML before JS executes.
           */}
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight leading-[1.1]">
            {personName.split(' ').slice(0, -1).join(' ')}{' '}
            <span className="text-primary">{personName.split(' ').slice(-1)}</span>
          </h1>

          {/*
           * Typewriter tagline — client-rendered animation.
           * The static tagline is set as the initial value so the content is
           * meaningful even if JS is slow. aria-live announces changes to
           * screen readers once the animation completes.
           */}
          <div
            className="text-lg md:text-2xl text-muted-foreground font-medium min-h-[5rem] sm:min-h-[4rem] md:min-h-[2rem] flex items-center justify-center"
            aria-live="polite"
            aria-label={`Role: ${STATIC_TAGLINE}`}
          >
            <p>
              {displayText || STATIC_TAGLINE}
              <span
                className="animate-blink inline-block w-1 h-6 md:h-8 bg-primary ml-1"
                aria-hidden="true"
              />
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button
              size="lg"
              className="w-full sm:w-auto px-10 rounded-full text-base md:text-lg font-bold shadow-lg shadow-primary/20"
              asChild
            >
              <Link href="/projects">View Projects</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto px-10 rounded-full text-base md:text-lg font-bold flex items-center gap-2"
              asChild
            >
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download Mohammed Khizer Shaikh's CV as PDF"
              >
                <Download className="h-5 w-5" aria-hidden="true" />
                Download CV
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll-down indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
        <Link href="#about" aria-label="Scroll down to About section">
          <ChevronDown
            className="h-8 w-8 text-muted-foreground/50 hover:text-primary transition-colors"
            aria-hidden="true"
          />
        </Link>
      </div>
    </section>
  );
}
