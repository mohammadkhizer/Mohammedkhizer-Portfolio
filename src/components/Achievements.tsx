"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Trophy, Calendar, Sparkles, ChevronLeft, ChevronRight, Award, ArrowRight, Images } from "lucide-react";

export interface AchievementItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  images?: string[];
}

// ─── Full Carousel — used on dynamic detail page ─────────────────────────────

export function AchievementCarousel({ images }: { images: string[] }) {
  const [current, setCurrent] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const total = images.length;

  React.useEffect(() => {
    if (total <= 1 || paused) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % total);
    }, 3500);
    return () => clearInterval(timer);
  }, [total, paused]);

  const prev = (e: React.MouseEvent) => { e.stopPropagation(); setCurrent((c) => (c - 1 + total) % total); };
  const next = (e: React.MouseEvent) => { e.stopPropagation(); setCurrent((c) => (c + 1) % total); };

  if (total === 1) {
    return (
      <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-primary/10 shadow-inner group/single">
        <Image src={images[0]} alt="Achievement media" fill className="object-cover transition-transform duration-700 group-hover/single:scale-105" unoptimized />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>
    );
  }

  return (
    <div
      className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-primary/10 group/carousel shadow-lg bg-secondary/10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {images.map((src, i) => (
        <div key={i} className={`absolute inset-0 transition-all duration-700 ease-in-out ${i === current ? "opacity-100 scale-100 z-10 translate-x-0" : "opacity-0 scale-95 z-0 translate-x-4 pointer-events-none"}`}>
          <Image src={src} alt={`Achievement media ${i + 1}`} fill className="object-cover" unoptimized />
        </div>
      ))}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black/30 to-transparent z-20 pointer-events-none" />
      <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 z-30 h-8 w-8 rounded-full bg-background/30 backdrop-blur-md hover:bg-primary hover:text-primary-foreground flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 border border-white/10" aria-label="Previous slide">
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 z-30 h-8 w-8 rounded-full bg-background/30 backdrop-blur-md hover:bg-primary hover:text-primary-foreground flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 border border-white/10" aria-label="Next slide">
        <ChevronRight className="h-4 w-4" />
      </button>
      <div className="absolute bottom-3 left-0 right-0 z-30 flex justify-center">
        <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
          {images.map((_, i) => (
            <button key={i} onClick={(e) => { e.stopPropagation(); setCurrent(i); }} className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-4 bg-primary" : "w-1.5 bg-white/50 hover:bg-white/80"}`} aria-label={`Go to slide ${i + 1}`} />
          ))}
        </div>
      </div>
      <span className="absolute top-3 right-3 z-30 text-[10px] font-black text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 shadow-sm">{current + 1} / {total}</span>
    </div>
  );
}

// ─── Individual Achievement Card (used in grid & homepage preview) ────────────

export function AchievementCard({ item }: { item: AchievementItem }) {
  const coverImage = item.images && item.images.length > 0 ? item.images[0] : null;
  const extraImages = item.images && item.images.length > 1 ? item.images.length - 1 : 0;

  const excerpt = item.description.split(/\s+/).length > 25
    ? item.description.split(/\s+/).slice(0, 25).join(" ") + "…"
    : item.description;

  return (
    <Link
      href={`/achievements/${item.id}`}
      className="group relative rounded-2xl border border-primary/10 bg-card/40 backdrop-blur-xl hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-500 flex flex-col overflow-hidden"
    >
      {/* ── Cover Image ────────────────────────────────────────── */}
      <div className="relative w-full aspect-video overflow-hidden bg-secondary/20">
        {coverImage ? (
          <>
            <Image
              src={coverImage}
              alt={`${item.title} cover`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            {/* Extra images badge */}
            {extraImages > 0 && (
              <span className="absolute bottom-3 right-3 flex items-center gap-1 text-[10px] font-black text-white bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                <Images className="h-3 w-3" />+{extraImages} more
              </span>
            )}
          </>
        ) : (
          /* Placeholder when no image */
          <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
            <Trophy className="h-12 w-12 text-primary/20" />
          </div>
        )}
      </div>

      {/* ── Card Body ──────────────────────────────────────────── */}
      <div className="flex flex-col flex-grow p-6 space-y-4 relative">
        {/* Decorative glow */}
        <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-all duration-500 -z-10" />

        {/* Header */}
        <div className="flex justify-between items-start gap-4">
          <div className="p-2.5 bg-primary/15 text-primary rounded-xl group-hover:bg-primary group-hover:text-primary-foreground group-hover:rotate-6 transition-all duration-300 shadow-sm">
            <Trophy className="h-4 w-4" />
          </div>
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-black uppercase tracking-wider bg-secondary/80 px-2.5 py-1 rounded-full border border-border/50">
            <Calendar className="h-3 w-3 text-primary" /> {item.date}
          </span>
        </div>

        {/* Text */}
        <div className="space-y-1.5 flex-grow">
          <h3 className="text-base md:text-lg font-bold leading-snug group-hover:text-primary transition-colors duration-300">
            {item.title}
          </h3>
          <p className="text-[11px] font-black uppercase tracking-widest text-accent/90 flex items-center gap-1">
            <Award className="h-3 w-3" />{item.issuer}
          </p>
          <pre className="whitespace-pre-wrap font-sans text-xs text-muted-foreground leading-relaxed mt-2">
            {excerpt}
          </pre>
        </div>

        {/* Footer CTA */}
        <div className="pt-3 border-t border-border/20 flex items-center justify-end">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary/80 group-hover:text-primary flex items-center gap-1 transition-colors">
            Read More <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Full Achievements Section (used on /experience page) ─────────────────────

export function Achievements({
  initialData = [],
  isPreview = false,
}: {
  initialData?: AchievementItem[];
  isPreview?: boolean;
}) {
  const displayData = isPreview ? initialData.slice(0, 3) : initialData;

  return (
    <section
      id="achievements"
      className="py-24 bg-gradient-to-b from-background via-secondary/10 to-background relative overflow-hidden"
    >
      <div className="absolute top-1/3 left-0 right-0 h-96 bg-primary/5 blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center justify-center text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 animate-pulse">
            <Sparkles className="h-3.5 w-3.5" />
            Milestones &amp; Honors
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Key <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">Achievements</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl leading-relaxed">
            A verified timeline of professional milestones, career recognitions, and certifications.
          </p>
        </div>

        {/* Grid */}
        {displayData.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {displayData.map((item) => (
                <AchievementCard key={item.id} item={item} />
              ))}
            </div>

            {/* "View All" button — shown in preview mode OR when there are more than 3 */}
            {(isPreview || initialData.length > 3) && (
              <div className="flex justify-center mt-12">
                <Link
                  href="/about#achievements"
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow hover:shadow-primary/20"
                >
                  All Achievements <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-card/20 border border-dashed border-border/60 rounded-2xl max-w-md mx-auto shadow-sm">
            <Trophy className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h4 className="font-bold text-lg mb-1">No Achievements Listed</h4>
            <p className="text-sm text-muted-foreground px-6">
              Achievements will appear here once they are added via the admin dashboard.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
