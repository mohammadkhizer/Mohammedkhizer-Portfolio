import { Skills, type Skill } from '@/components/Skills';
import { Metadata } from 'next';
import { getSkills } from '@/lib/db';

const baseUrl = 'https://mohammedkhizershaikh.netlify.app';

// Metadata: technology entity names in title and description for semantic search
export const metadata: Metadata = {
  title: 'Technical Skills — React, Next.js, Python, MongoDB & More',
  description:
    'Full technical skills profile of Mohammed Khizer Shaikh including React, Next.js, TypeScript, JavaScript, Python, Django, MongoDB, Node.js, Tailwind CSS, and Machine Learning.',
  alternates: {
    canonical: `${baseUrl}/skills`,
  },
  openGraph: {
    title: 'Technical Skills — Mohammed Khizer Shaikh',
    description:
      'Explore the complete tech stack of Mohammed Khizer Shaikh: React, Next.js, Python, Django, MongoDB, Machine Learning, and more.',
    url: `${baseUrl}/skills`,
  },
};

export const dynamic = 'force-dynamic';

export default async function SkillsPage() {
  const rawSkills = await getSkills();

  const skills: Skill[] = rawSkills.map((s: any) => ({
    id: String(s._id || s.id),
    name: s.name,
    category: s.category,
    proficiency: s.proficiency,
  }));

  // WebPage + BreadcrumbList JSON-LD for the skills page
  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${baseUrl}/skills#webpage`,
        url: `${baseUrl}/skills`,
        name: 'Technical Skills — React, Next.js, Python, MongoDB & More | Mohammed Khizer Shaikh',
        description:
          'Full technical skills profile of Mohammed Khizer Shaikh including React, Next.js, TypeScript, Python, Django, MongoDB, and Machine Learning.',
        inLanguage: 'en-US',
        isPartOf: { '@id': `${baseUrl}/#website` },
        author: { '@id': `${baseUrl}/#person` },
        about: { '@id': `${baseUrl}/#person` },
        dateModified: '2026-07-01',
        // speakable marks sections AI assistants can read aloud — helps voice search
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['#skills h2', '#skills p'],
        },
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
            name: 'Skills',
            item: `${baseUrl}/skills`,
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
      <Skills initialData={skills} />
    </main>
  );
}
