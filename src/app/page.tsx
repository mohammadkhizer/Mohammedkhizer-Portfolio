import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { HowIWork } from "@/components/HowIWork";
import { Testimonials, type Testimonial } from "@/components/Testimonials";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Code2, Award, ShieldCheck, Sparkles, Send } from "lucide-react";
import { getTestimonials, getUserProfile } from "@/lib/db";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [rawTestimonials, rawProfile] = await Promise.all([
    getTestimonials(),
    getUserProfile(),
  ]);

  const profileData = rawProfile ? {
    projectsCount: rawProfile.projectsCount ?? 10,
    certificationsCount: rawProfile.certificationsCount ?? 8,
    skillsCount: rawProfile.skillsCount ?? 15,
  } : null;

  // Serialize to plain objects safe to pass to client components
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
      {/* a) Hero */}
      <Hero />

      <div className="container mx-auto px-4 sm:px-6 space-y-16 md:space-y-28 pb-24">
        {/* Stats Row */}
        <section aria-label="Key professional metrics" className="pt-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <Card className="glass border-border/40 bg-secondary/5">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
                  <ShieldCheck className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-black tracking-tight text-primary">
                    30 Days
                  </p>
                  <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest font-bold">
                    Post-launch Support
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="glass border-border/40 bg-secondary/5">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-xl text-accent shrink-0">
                  <Code2 className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-black tracking-tight text-accent">
                    {profileData?.projectsCount ?? 10}+
                  </p>
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
                  <p className="text-2xl md:text-3xl font-black tracking-tight text-primary">
                    {profileData?.certificationsCount ?? 8}+
                  </p>
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
                  <p className="text-2xl md:text-3xl font-black tracking-tight text-accent">
                    {profileData?.skillsCount ?? 15}+
                  </p>
                  <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest font-bold">Tech Stack Entities</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* b) Services */}
        <Services />

        {/* c) How I Work */}
        <HowIWork />

        {/* d) Closing CTA Band */}
        <section aria-labelledby="cta-heading" className="py-8">
          <div className="glass border border-border/40 rounded-3xl p-8 md:p-12 text-center space-y-6 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest border border-primary/20">
              Taking on new projects
            </div>
            <h2 id="cta-heading" className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Let&apos;s Build Something <span className="text-primary">Exceptional</span> Together
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Need a custom web or mobile system built cleanly from start to finish? Let&apos;s talk through your requirements and scope.
            </p>
            <div className="flex justify-center pt-4">
              <Button asChild size="lg" className="rounded-full px-8 font-bold shadow-lg shadow-primary/20 h-12">
                <Link href="/contact" className="flex items-center gap-2">
                  Discuss your project <Send className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* e) Testimonials (LAST section before footer) */}
        <section className="space-y-8 md:space-y-12">
          <Testimonials isPreview={true} initialData={testimonials} />
        </section>
      </div>
    </main>
  );
}
