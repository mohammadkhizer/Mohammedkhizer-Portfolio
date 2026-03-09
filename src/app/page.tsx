
"use client";

import dynamic from "next/dynamic";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";

// Dynamic imports for components below the fold to reduce initial JS bundle
const Skills = dynamic(() => import("@/components/Skills").then(mod => mod.Skills), {
  loading: () => <div className="h-96 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary/20" /></div>
});

const Projects = dynamic(() => import("@/components/Projects").then(mod => mod.Projects), {
  loading: () => <div className="h-96 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary/20" /></div>
});

const Experience = dynamic(() => import("@/components/Experience").then(mod => mod.Experience), {
  loading: () => <div className="h-96 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary/20" /></div>
});

const Testimonials = dynamic(() => import("@/components/Testimonials").then(mod => mod.Testimonials), {
  loading: () => <div className="h-64 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary/20" /></div>
});

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <Hero />
      
      <div className="container mx-auto px-4 sm:px-6 space-y-16 md:space-y-32 pb-24">
        {/* About Section - Loaded early but with priority optimization in component */}
        <section className="space-y-8 md:space-y-12">
          <About isPreview={true} />
          <div className="flex justify-center px-4">
            <Button asChild variant="outline" className="w-full sm:w-auto rounded-full h-12 px-8">
              <Link href="/about" className="flex items-center justify-center gap-2">
                More About Me <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Dynamic sections below the fold */}
        <section className="space-y-8 md:space-y-12">
          <Skills isPreview={true} />
          <div className="flex justify-center px-4">
            <Button asChild variant="outline" className="w-full sm:w-auto rounded-full h-12 px-8">
              <Link href="/skills" className="flex items-center justify-center gap-2">
                Full Tech Stack <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="space-y-8 md:space-y-12">
          <Projects isPreview={true} />
          <div className="flex justify-center px-4">
            <Button asChild variant="outline" className="w-full sm:w-auto rounded-full h-12 px-8">
              <Link href="/projects" className="flex items-center justify-center gap-2">
                All Portfolio Projects <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="space-y-8 md:space-y-12">
          <Experience isPreview={true} />
          <div className="flex justify-center px-4">
            <Button asChild variant="outline" className="w-full sm:w-auto rounded-full h-12 px-8">
              <Link href="/experience" className="flex items-center justify-center gap-2">
                Career Timeline <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="space-y-8 md:space-y-12">
          <Testimonials isPreview={true} />
        </section>
      </div>
    </main>
  );
}
