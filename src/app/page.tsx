
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Skills, type Skill } from "@/components/Skills";
import { Projects, type Project } from "@/components/Projects";
import { Experience, type ExperienceItem, type EducationItem } from "@/components/Experience";
import { Testimonials, type Testimonial } from "@/components/Testimonials";
import { getProjects, getSkills, getExperience, getEducation, getTestimonials, getUserProfile } from "@/lib/db";

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
      </div>
    </main>
  );
}
