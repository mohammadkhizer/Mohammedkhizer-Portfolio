

import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Experience } from "@/components/Experience";
import { Testimonials } from "@/components/Testimonials";
import { getProjects, getSkills, getExperience } from "@/lib/db";

export default async function HomePage() {
  const [projects, skills, experience, testimonials] = await Promise.all([
    getProjects(),
    getSkills(),
    getExperience(),
    getTestimonials(),
  ]);

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

        {/* Sections rendered with server-fetched data */}
        <section className="space-y-8 md:space-y-12">
          <Skills isPreview={true} initialData={skills as any} />
          <div className="flex justify-center px-4">
            <Button asChild variant="outline" className="w-full sm:w-auto rounded-full h-12 px-8">
              <Link href="/skills" className="flex items-center justify-center gap-2">
                Full Tech Stack <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="space-y-8 md:space-y-12">
          <Projects isPreview={true} initialData={projects as any} />
          <div className="flex justify-center px-4">
            <Button asChild variant="outline" className="w-full sm:w-auto rounded-full h-12 px-8">
              <Link href="/projects" className="flex items-center justify-center gap-2">
                All Portfolio Projects <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="space-y-8 md:space-y-12">
          <Experience isPreview={true} initialExperiences={experience as any} />
          <div className="flex justify-center px-4">
            <Button asChild variant="outline" className="w-full sm:w-auto rounded-full h-12 px-8">
              <Link href="/experience" className="flex items-center justify-center gap-2">
                Career Timeline <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="space-y-8 md:space-y-12">
          <Testimonials isPreview={true} initialData={testimonials as any} />
        </section>
      </div>
    </main>
  );
}

