
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Code2, Award, Briefcase, Sparkles, Send } from "lucide-react";
import { Skills, type Skill } from "@/components/Skills";
import { Projects, type Project } from "@/components/Projects";
import { Experience, type ExperienceItem, type EducationItem } from "@/components/Experience";
import { Testimonials, type Testimonial } from "@/components/Testimonials";
import { getProjects, getSkills, getExperience, getEducation, getTestimonials, getUserProfile } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [rawProjects, rawSkills, rawExperience, rawEducation, rawTestimonials, rawProfile] = await Promise.all([
    getProjects(),
    getSkills(),
    getExperience(),
    getEducation(),
    getTestimonials(),
    getUserProfile(),
  ]);

  const profileData = rawProfile ? {
    fullName: rawProfile.fullName,
    tagline: rawProfile.tagline,
    professionalSummary: rawProfile.professionalSummary,
    introductionSummary: rawProfile.introductionSummary,
    cvDownloadUrl: rawProfile.cvDownloadUrl,
  } : null;


  // Serialize to plain objects that are safe to pass to client components
  const skills: Skill[] = rawSkills.map((s: any) => ({
    id: String(s._id || s.id),
    name: s.name,
    category: s.category,
    proficiency: s.proficiency,
  }));

  const projects: Project[] = rawProjects.map((p: any) => ({
    id: String(p._id || p.id),
    title: p.title,
    description: p.description,
    projectImageUrl: p.projectImageUrl,
    liveDemoUrl: p.liveDemoUrl,
    githubRepoUrl: p.githubRepoUrl,
    skillIds: p.skillIds,
    createdAt: p.createdAt,
  }));

  const experience: ExperienceItem[] = rawExperience.map((e: any) => ({
    id: String(e._id || e.id),
    jobTitle: e.jobTitle,
    companyName: e.companyName,
    startDate: e.startDate,
    endDate: e.endDate,
    description: e.description,
  }));

  const education: EducationItem[] = rawEducation.map((e: any) => ({
    id: String(e._id || e.id),
    degree: e.degree,
    institutionName: e.institutionName,
    startDate: e.startDate,
    endDate: e.endDate,
    description: e.description,
  }));

  const testimonials: Testimonial[] = rawTestimonials.map((t: any) => ({
    id: String(t._id || t.id),
    clientName: t.clientName,
    clientTitle: t.clientTitle,
    clientImageUrl: t.clientImageUrl,
    testimonialText: t.testimonialText,
    rating: t.rating,
  }));

  return (
    <main className="overflow-x-hidden">
      <Hero />
      
      <div className="container mx-auto px-4 sm:px-6 space-y-16 md:space-y-32 pb-24">
        {/* Stats Bar Section — High-Value Facts for AI Crawlers */}
        <section aria-label="Key professional metrics" className="pt-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <Card className="glass border-border/40 bg-secondary/5">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
                  <Briefcase className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-black tracking-tight text-primary">2+</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest font-bold">Years Experience</p>
                </div>
              </CardContent>
            </Card>
            <Card className="glass border-border/40 bg-secondary/5">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-xl text-accent shrink-0">
                  <Code2 className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-black tracking-tight text-accent">10+</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest font-bold">Projects Built</p>
                </div>
              </CardContent>
            </Card>
            <Card className="glass border-border/40 bg-secondary/5">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
                  <Award className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-black tracking-tight text-primary">8+</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest font-bold">Certifications</p>
                </div>
              </CardContent>
            </Card>
            <Card className="glass border-border/40 bg-secondary/5">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-xl text-accent shrink-0">
                  <Sparkles className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-black tracking-tight text-accent">15+</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest font-bold">Tech Stack Entities</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* About Section */}
        <section className="space-y-8 md:space-y-12">
          <About isPreview={true} profileData={profileData} />
          <div className="flex justify-center px-4">
            <Button asChild variant="outline" className="w-full sm:w-auto rounded-full h-12 px-8">
              <Link href="/about" className="flex items-center justify-center gap-2">
                More About Me <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Skills Section */}
        <section className="space-y-8 md:space-y-12">
          <Skills isPreview={true} initialData={skills} />
          <div className="flex justify-center px-4">
            <Button asChild variant="outline" className="w-full sm:w-auto rounded-full h-12 px-8">
              <Link href="/skills" className="flex items-center justify-center gap-2">
                Full Tech Stack <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Projects Section */}
        <section className="space-y-8 md:space-y-12">
          <Projects isPreview={true} initialData={projects} />
          <div className="flex justify-center px-4">
            <Button asChild variant="outline" className="w-full sm:w-auto rounded-full h-12 px-8">
              <Link href="/projects" className="flex items-center justify-center gap-2">
                All Portfolio Projects <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Experience & Education Section */}
        <section className="space-y-8 md:space-y-12">
          <Experience isPreview={true} initialExperiences={experience} initialEducation={education} />
          <div className="flex justify-center px-4">
            <Button asChild variant="outline" className="w-full sm:w-auto rounded-full h-12 px-8">
              <Link href="/experience" className="flex items-center justify-center gap-2">
                Career Timeline <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="space-y-8 md:space-y-12">
          <Testimonials isPreview={true} initialData={testimonials} />
        </section>

        {/* Contact CTA Section — Essential Internal Linking for Conversion & GEO */}
        <section aria-labelledby="cta-heading" className="py-12 border-t border-border/20">
          <div className="glass border border-border/40 rounded-3xl p-8 md:p-12 text-center space-y-6 max-w-4xl mx-auto">
            <h2 id="cta-heading" className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Let&apos;s Build Something <span className="text-primary">Exceptional</span> Together
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              If you are seeking a dedicated full-stack developer who bridges the gap between clean, performant frontend user interfaces and robust, scalable backend APIs, let&apos;s connect and discuss your project.
            </p>
            <div className="flex justify-center pt-4">
              <Button asChild size="lg" className="rounded-full px-8 font-bold shadow-lg shadow-primary/20 h-12">
                <Link href="/contact" className="flex items-center gap-2">
                  Get in Touch <Send className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
