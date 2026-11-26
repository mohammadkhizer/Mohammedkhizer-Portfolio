import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { HowIWork } from "@/components/HowIWork";
import { Testimonials, type Testimonial } from "@/components/Testimonials";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Code2, Award, ShieldCheck, Sparkles, Send } from "lucide-react";
import {
  getHomeHeroData,
  getServicesData,
  getHowIWorkData,
  getClosingCtaData,
  getTestimonialsData,
} from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [homeHero, services, howIWork, closingCta, rawTestimonials] =
    await Promise.all([
      getHomeHeroData(),
      getServicesData(),
      getHowIWorkData(),
      getClosingCtaData(),
      getTestimonialsData(),
    ]);

  const testimonials: Testimonial[] = rawTestimonials.map((t: any) => ({
    id: String(t.id || t._id),
    clientName: t.clientName,
    clientTitle:
      t.clientTitle ||
      (t.role && t.business ? `${t.role}, ${t.business}` : t.role || t.business || ""),
    clientImageUrl: t.clientImageUrl,
    testimonialText: t.testimonialText,
    rating: t.rating || 5,
  }));

  const stats = homeHero.stats && homeHero.stats.length > 0
    ? homeHero.stats
    : [
        { label: "Post-launch Support", value: "30 Days" },
        { label: "Projects Built", value: "10+" },
        { label: "Certifications", value: "8+" },
        { label: "Tech Stack Entities", value: "15+" },
      ];

  const statIcons = [ShieldCheck, Code2, Award, Sparkles];

  return (
    <main className="overflow-x-hidden">
      {/* a) Hero */}
      <Hero initialData={homeHero} />

      <div className="container mx-auto px-4 sm:px-6 space-y-16 md:space-y-28 pb-24">
        {/* Stats Row */}
        <section aria-label="Key professional metrics" className="pt-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat: { label: string; value: string }, idx: number) => {
              const IconComp = statIcons[idx % statIcons.length];
              const isPrimary = idx % 2 === 0;
              return (
                <Card
                  key={idx}
                  className="glass border-border/40 bg-secondary/5 hover:border-primary/30 transition-colors"
                >
                  <CardContent className="p-6 flex items-center gap-4">
                    <div
                      className={`p-3 rounded-xl shrink-0 ${
                        isPrimary
                          ? "bg-primary/10 text-primary"
                          : "bg-accent/10 text-accent"
                      }`}
                    >
                      <IconComp className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div>
                      <p
                        className={`text-2xl md:text-3xl font-black tracking-tight ${
                          isPrimary ? "text-primary" : "text-accent"
                        }`}
                      >
                        {stat.value}
                      </p>
                      <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest font-bold">
                        {stat.label}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* b) Services */}
        <Services initialData={services} />

        {/* c) How I Work */}
        <HowIWork initialData={howIWork} />

        {/* d) Closing CTA Band */}
        <section id="cta" aria-labelledby="cta-heading" className="py-8">
          <div className="glass border border-border/40 rounded-3xl p-8 md:p-12 text-center space-y-6 max-w-4xl mx-auto">
            {closingCta.showStatusBadge && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest border border-primary/20">
                {closingCta.statusBadgeText || "Taking on new projects"}
              </div>
            )}
            <h2 id="cta-heading" className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {closingCta.heading || "Let's Build Something Exceptional Together"}
            </h2>
            {closingCta.description && (
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {closingCta.description}
              </p>
            )}
            <div className="flex justify-center pt-4">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 font-bold shadow-lg shadow-primary/20 h-12"
              >
                <Link
                  href={closingCta.buttonUrl || "/contact"}
                  className="flex items-center gap-2"
                >
                  {closingCta.buttonText || "Discuss your project"}{" "}
                  <Send className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* e) Testimonials (LAST section before footer) */}
        <section id="testimonials" className="space-y-8 md:space-y-12">
          <Testimonials isPreview={true} initialData={testimonials} />
        </section>
      </div>
    </main>
  );
}
