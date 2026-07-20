import { Experience, type ExperienceItem, type EducationItem } from "@/components/Experience";
import { Achievements, type AchievementItem } from "@/components/Achievements";
import { Metadata } from 'next';
import { getExperience, getEducation, getAchievements } from "@/lib/db";

const baseUrl = 'https://mohammedkhizershaikh.netlify.app';

// Entity-dense metadata for career and education
export const metadata: Metadata = {
  title: 'Career & Education History — Mohammed Khizer Shaikh | Python Developer',
  description: 'Discover the professional career timeline, Python developer internship at Way to Web, and educational background of Mohammed Khizer Shaikh in Ahmedabad, India. Includes professional certifications.',
  alternates: {
    canonical: `${baseUrl}/experience`,
  },
  openGraph: {
    title: 'Career & Education History — Mohammed Khizer Shaikh',
    description: 'Explore the academic background, professional experience, and verified technical certifications of Mohammed Khizer Shaikh.',
    url: `${baseUrl}/experience`,
  },
};

export const dynamic = 'force-dynamic';

export default async function ExperiencePage() {
  const [rawExperience, rawEducation, rawAchievements] = await Promise.all([
    getExperience(),
    getEducation(),
    getAchievements(),
  ]);

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



  const achievements: AchievementItem[] = rawAchievements.map((a: any) => ({
    id: a.id || String(a._id),
    title: a.title,
    issuer: a.issuer,
    date: a.date,
    description: a.description,
    images: a.images || [],
  }));

  // JSON-LD for Career and Education page
  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${baseUrl}/experience#webpage`,
        url: `${baseUrl}/experience`,
        name: 'Career & Education — Mohammed Khizer Shaikh',
        description: 'Professional experience, educational background, and technical certifications of Mohammed Khizer Shaikh.',
        inLanguage: 'en-US',
        isPartOf: { '@id': `${baseUrl}/#website` },
        author: { '@id': `${baseUrl}/#person` },
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
            name: 'Experience & Education',
            item: `${baseUrl}/experience`,
          },
        ],
      },
    ],
  };

  return (
    <main className="py-12 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
      <div className="container mx-auto px-4 md:px-6 pt-8 text-center md:text-left">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
          Career &amp; <span className="text-primary">Education</span>
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-xl">
          Explore my professional journey, academic background, and certified skills.
        </p>
      </div>
      <Experience initialExperiences={experience} initialEducation={education} />
      <Achievements initialData={achievements} />
    </main>
  );
}
