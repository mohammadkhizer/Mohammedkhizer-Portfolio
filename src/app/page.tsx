
"use client";

import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Experience } from "@/components/Experience";
import { Testimonials } from "@/components/Testimonials";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <Hero />
      
      <div className="container mx-auto px-4 sm:px-6 space-y-16 md:space-y-32 pb-24">
        {/* About Section Preview */}
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

        {/* Skills Section Preview */}
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

        {/* Projects Section Preview */}
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

        {/* Experience & Education Section Preview */}
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

        {/* Testimonials Section Preview */}
        <section className="space-y-8 md:space-y-12">
          <Testimonials isPreview={true} />
        </section>
      </div>
    </main>
  );
}
