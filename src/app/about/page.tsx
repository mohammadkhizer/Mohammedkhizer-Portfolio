import { About } from '@/components/About';
import { FAQSection } from '@/components/FAQSection';
import { Achievements, type AchievementItem } from "@/components/Achievements";
import { Metadata } from 'next';
import { getUserProfile, getAchievements } from '@/lib/db';
import { getAboutHeroData } from '@/lib/cms';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const baseUrl = 'https://mohammedkhizershaikh.netlify.app';

// Entity-rich title and description — includes real technology names and location
// for knowledge graph alignment and AI extraction
export const metadata: Metadata = {
  title: 'About Mohammed Khizer Shaikh — Full-Stack Web & Mobile Developer',
  description:
    'Mohammed Khizer Shaikh is a Full-Stack Web & Mobile Developer based in Ahmedabad, Gujarat, India, specializing in React, Next.js, TypeScript, Python, Django, and MongoDB.',
  alternates: {
    canonical: `${baseUrl}/about`,
  },
  openGraph: {
    title: 'About Mohammed Khizer Shaikh — Full-Stack Web & Mobile Developer',
    description:
      'Learn about Mohammed Khizer Shaikh, a Full-Stack Web & Mobile Developer from Ahmedabad, India building custom web and mobile systems for businesses.',
    url: `${baseUrl}/about`,
  },
};

export const dynamic = 'force-dynamic';

// FAQ content — Answer-first structure
const FAQ_ITEMS = [
  {
    question: 'Who is Mohammed Khizer Shaikh?',
    answer:
      'Mohammed Khizer Shaikh is a Full-Stack Web & Mobile Developer based in Ahmedabad, Gujarat, India. He specializes in building high-performance web and mobile systems using React, Next.js, TypeScript, Python, Django, Firebase, and MongoDB.',
  },
  {
    question: 'What technologies does Mohammed Khizer Shaikh specialize in?',
    answer:
      'Mohammed Khizer Shaikh specializes in React, Next.js, TypeScript, Python, Django, MongoDB, Firebase, Node.js, and Tailwind CSS for full-stack web and mobile application development.',
  },
  {
    question: 'Is Mohammed Khizer Shaikh available for project engagements?',
    answer:
      'Yes, Mohammed Khizer Shaikh is taking on new custom web and mobile development projects. He can be reached at work.mkhizer@gmail.com or via the contact form on this website.',
  },
  {
    question: 'Where did Mohammed Khizer Shaikh study?',
    answer:
      'Mohammed Khizer Shaikh is pursuing a Bachelor of Engineering in Computer Science (B.E. CSE) at Sumandeep Vidyapeeth General University (SVGU) in Ahmedabad, Gujarat, India, and completed a technical diploma from LJ University, Ahmedabad.',
  },
  {
    question: 'What kind of systems has Mohammed Khizer Shaikh built?',
    answer:
      'Mohammed Khizer Shaikh has built inventory and billing systems, event registration platforms, business websites with admin panels, and mobile applications. You can explore his projects at mohammedkhizershaikh.netlify.app/projects.',
  },
];

export default async function AboutPage() {
  const [rawProfile, rawAchievements, aboutHero] = await Promise.all([
    getUserProfile(),
    getAchievements(),
    getAboutHeroData(),
  ]);

  const profileData = rawProfile
    ? {
        fullName: rawProfile.fullName,
        tagline: rawProfile.tagline,
        professionalSummary: rawProfile.professionalSummary,
        introductionSummary: rawProfile.introductionSummary,
        cvDownloadUrl: rawProfile.cvDownloadUrl,
        projectsCount: rawProfile.projectsCount ?? 10,
        certificationsCount: rawProfile.certificationsCount ?? 8,
        skillsCount: rawProfile.skillsCount ?? 15,
        studentYear: rawProfile.studentYear ?? "3rd",
      }
    : null;

  const achievements: AchievementItem[] = rawAchievements.map((a: any) => ({
    id: a.id || String(a._id),
    title: a.title,
    issuer: a.issuer,
    date: a.date,
    description: a.description,
    images: a.images || [],
  }));

  // WebPage + BreadcrumbList JSON-LD for this specific page.
  // Cross-references the Person entity defined in the root layout via @id.
  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${baseUrl}/about#webpage`,
        url: `${baseUrl}/about`,
        name: 'About Mohammed Khizer Shaikh — Full-Stack Web & Mobile Developer',
        description:
          'Mohammed Khizer Shaikh is a Full-Stack Web & Mobile Developer from Ahmedabad, India, specializing in React, Next.js, Python, Django, and MongoDB.',
        inLanguage: 'en-US',
        isPartOf: { '@id': `${baseUrl}/#website` },
        author: { '@id': `${baseUrl}/#person` },
        about: { '@id': `${baseUrl}/#person` },
        dateModified: '2026-07-01',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${baseUrl}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'About',
            item: `${baseUrl}/about`,
          },
        ],
      },
    ],
  };

  return (
    <main className="py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />

      {/* Moved Hero Section at the top of About */}
      <section
        aria-label="About — Introduction"
        className="relative overflow-hidden pt-10 pb-20 md:pt-16 md:pb-24"
      >
        <div className="absolute top-1/4 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-primary/10 rounded-full blur-[80px] md:blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 md:w-96 md:h-96 bg-accent/10 rounded-full blur-[80px] md:blur-[120px] -z-10 animate-pulse delay-700" />

        <div className="container mx-auto px-4 sm:px-6 text-center max-w-4xl space-y-6 md:space-y-8 motion-safe:animate-fade-in-up">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase border border-primary/20">
            {aboutHero.pillText}
          </div>

          {/* Headline with last line in orange */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
            {aboutHero.headline}{' '}
            <span className="block text-primary">{aboutHero.headlineHighlight}</span>
          </h1>

          {/* Subline */}
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
            {aboutHero.subline}
          </p>

          {/* Chips */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {(aboutHero.chips || []).map((chip: string) => (
              <span
                key={chip}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/50 border border-border/50 text-xs md:text-sm font-medium text-foreground/90"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
                {chip}
              </span>
            ))}
          </div>

          {/* Two CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="w-full sm:w-auto px-8 rounded-full text-base font-bold shadow-lg shadow-primary/20"
              asChild
            >
              <Link href={aboutHero.primaryButtonUrl || "/contact"} className="flex items-center gap-2">
                {aboutHero.primaryButtonText || "Discuss your project"}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto px-8 rounded-full text-base font-bold"
              asChild
            >
              <Link href={aboutHero.secondaryButtonUrl || "/projects"}>
                {aboutHero.secondaryButtonText || "See my work"}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <About profileData={profileData} headingAs="h2" />
      <Achievements initialData={achievements} />
      <FAQSection
        title="Frequently Asked Questions About Mohammed Khizer Shaikh"
        items={FAQ_ITEMS}
      />
    </main>
  );
}
