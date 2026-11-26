'use client';

import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronDown, Download } from 'lucide-react';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const STATIC_NAME = 'Mohammed Khizer Shaikh';
const STATIC_TAGLINE = 'Full-Stack Web & Mobile Developer';
const STATIC_CV_URL =
  'https://portfolioimageskhizer.netlify.app/Mohammed-Khizer-Shaikh-CV-2.pdf';

export interface HeroProps {
  initialData?: {
    tagline?: string;
    subtitle?: string;
    primaryButtonText?: string;
    primaryButtonUrl?: string;
    secondaryButtonText?: string;
    secondaryButtonUrl?: string;
    cvDownloadUrl?: string;
    stats?: Array<{ label: string; value: string }>;
  };
}

export function Hero({ initialData }: HeroProps) {
  const fullText = initialData?.subtitle || STATIC_TAGLINE;
  const [displayText, setDisplayText] = React.useState('');
  const [profile, setProfile] = React.useState<any>(null);
  const profileImg = PlaceHolderImages.find((img) => img.id === 'profile-pic');

  React.useEffect(() => {
    fetch('/api/v1/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setProfile(data[0]);
        }
      })
      .catch((err) => console.error('Error fetching profile:', err));
  }, []);

  // Typewriter animation
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
  const cvUrl = initialData?.cvDownloadUrl || profile?.cvDownloadUrl || STATIC_CV_URL;
  const tagline = initialData?.tagline || 'Welcome to my space';
  const primaryText = initialData?.primaryButtonText || 'Discuss your project';
  const primaryUrl = initialData?.primaryButtonUrl || '/contact';
  const secondaryText = initialData?.secondaryButtonText || 'View Projects';
  const secondaryUrl = initialData?.secondaryButtonUrl || '/projects';

  return (
    <section
      aria-label="Hero — Introduction"
      className="relative min-h-[85vh] flex items-center overflow-hidden py-16 md:py-24"
    >
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-primary/10 rounded-full blur-[80px] md:blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 md:w-96 md:h-96 bg-accent/10 rounded-full blur-[80px] md:blur-[120px] -z-10 animate-pulse delay-700" />

      <div className="container mx-auto px-4 sm:px-6 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Intro copy + CTAs */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8 text-center lg:text-left motion-safe:animate-fade-in-up">
            {/* Eyebrow label */}
            <p className="text-primary text-xs md:text-sm font-bold tracking-[0.3em] uppercase opacity-80">
              {tagline}
            </p>

            {/* H1 — Primary heading */}
            <h1 className="text-4xl sm:6xl md:text-7xl font-black tracking-tight leading-[1.08]">
              {personName.split(' ').slice(0, -1).join(' ')}{' '}
              <span className="text-primary">{personName.split(' ').slice(-1)}</span>
            </h1>

            {/* Typewriter tagline */}
            <div
              className="text-lg md:text-2xl text-muted-foreground font-medium min-h-[3.5rem] sm:min-h-[2.5rem] flex items-center justify-center lg:justify-start"
              aria-live="polite"
              aria-label={`Role: ${fullText}`}
            >
              <p>
                {displayText || fullText}
                <span
                  className="animate-blink inline-block w-1 h-6 md:h-7 bg-primary ml-1 align-middle"
                  aria-hidden="true"
                />
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <Button
                size="lg"
                className="w-full sm:w-auto px-8 rounded-full text-base font-bold shadow-lg shadow-primary/20"
                asChild
              >
                <Link href={primaryUrl}>{primaryText}</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto px-8 rounded-full text-base font-bold"
                asChild
              >
                <Link href={secondaryUrl}>{secondaryText}</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto px-8 rounded-full text-base font-bold flex items-center gap-2"
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

          {/* Right: Photo Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[320px] sm:max-w-[360px]">
              <div className="absolute -inset-2 bg-gradient-to-tr from-primary/30 to-accent/30 rounded-3xl blur-2xl opacity-40" />
              <div className="relative bg-card rounded-3xl overflow-hidden border border-border/50 shadow-2xl aspect-square">
                <Image
                  src={profileImg?.imageUrl || 'https://techaura26.netlify.app/Assets/khizer.jpeg'}
                  alt={personName}
                  width={600}
                  height={600}
                  priority={true}
                  loading="eager"
                  sizes="(max-width: 768px) 320px, 360px"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white">
                  <p className="font-bold text-base tracking-tight">{personName}</p>
                  <p className="text-xs text-primary font-semibold uppercase tracking-widest mt-0.5">
                    {fullText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll-down indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
        <Link href="#services" aria-label="Scroll down to Services section">
          <ChevronDown
            className="h-8 w-8 text-muted-foreground/50 hover:text-primary transition-colors"
            aria-hidden="true"
          />
        </Link>
      </div>
    </section>
  );
}
