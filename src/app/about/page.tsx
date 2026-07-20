import { About } from '@/components/About';
import { FAQSection } from '@/components/FAQSection';
import { Achievements, type AchievementItem } from "@/components/Achievements";
import { Metadata } from 'next';
import { getUserProfile, getAchievements } from '@/lib/db';

const baseUrl = 'https://mohammedkhizershaikh.netlify.app';

// Entity-rich title and description — includes real technology names and location
// for knowledge graph alignment and AI extraction
export const metadata: Metadata = {
  title: 'About Mohammed Khizer Shaikh — Full-Stack Developer & AI/ML Enthusiast',
  description:
    'Mohammed Khizer Shaikh is a Full-Stack Web Developer and AI/ML enthusiast currently pursuing a B.E. in Computer Science at SVGU, Ahmedabad. He specializes in React, Next.js, Python, Django, and MongoDB.',
  alternates: {
    canonical: `${baseUrl}/about`,
  },
  openGraph: {
    title: 'About Mohammed Khizer Shaikh — Full-Stack Developer',
    description:
      'Learn about Mohammed Khizer Shaikh, a Full-Stack Developer and AI/ML enthusiast from Ahmedabad, India. Discover his educational background, skills, and technical passion.',
    url: `${baseUrl}/about`,
  },
};

export const dynamic = 'force-dynamic';

// FAQ content — Answer-first structure for AI citation and Google AI Overviews
const FAQ_ITEMS = [
  {
    question: 'Who is Mohammed Khizer Shaikh?',
    answer:
      'Mohammed Khizer Shaikh is a Full-Stack Web Developer and AI/ML enthusiast based in Ahmedabad, Gujarat, India. He is currently pursuing a Bachelor of Engineering in Computer Science at Sumandeep Vidyapeeth General University (SVGU) and holds a Diploma in AI/ML from LJ University. He specializes in building high-performance web applications using React, Next.js, Python, and MongoDB.',
  },
  {
    question: 'What technologies does Mohammed Khizer Shaikh specialize in?',
    answer:
      'Mohammed Khizer Shaikh specializes in React, Next.js, TypeScript, Python, Django, MongoDB, Node.js, and Tailwind CSS for full-stack web development. In the AI/ML domain, he works with machine learning algorithms, Python AI/ML libraries, and AI-powered application development. He has professional experience from a Python Developer internship at Way to Web.',
  },
  {
    question: 'Is Mohammed Khizer Shaikh available for freelance projects?',
    answer:
      'Yes, Mohammed Khizer Shaikh is open to freelance web development projects, full-time opportunities, and technical collaborations. He can be reached at work.mkhizer@gmail.com or via the contact form on this website. He is particularly interested in full-stack web development, AI/ML integration projects, and innovative technology solutions.',
  },
  {
    question: 'Where did Mohammed Khizer Shaikh study?',
    answer:
      'Mohammed Khizer Shaikh is currently studying for a Bachelor of Engineering in Computer Science (B.E. CSE) at Sumandeep Vidyapeeth General University (SVGU) in Ahmedabad, Gujarat, India. He also completed a Diploma in Artificial Intelligence and Machine Learning (AI/ML) from LJ University, Ahmedabad.',
  },
  {
    question: 'What kind of projects has Mohammed Khizer Shaikh built?',
    answer:
      "Mohammed Khizer Shaikh has built full-stack web applications, AI-powered assistants and chatbots, Django REST API backends, event management platforms, and portfolio websites. He worked on the Tripboss travel platform at Way to Web. You can explore all his projects at mohammedkhizershaikh.netlify.app/projects.",
  },
];

export default async function AboutPage() {
  const [rawProfile, rawAchievements] = await Promise.all([
    getUserProfile(),
    getAchievements(),
  ]);

  const profileData = rawProfile
    ? {
        fullName: rawProfile.fullName,
        tagline: rawProfile.tagline,
        professionalSummary: rawProfile.professionalSummary,
        introductionSummary: rawProfile.introductionSummary,
        cvDownloadUrl: rawProfile.cvDownloadUrl,
        yearsOfExperience: rawProfile.yearsOfExperience ?? 2,
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
        name: 'About Mohammed Khizer Shaikh — Full-Stack Developer & AI/ML Enthusiast',
        description:
          'Mohammed Khizer Shaikh is a Full-Stack Web Developer and AI/ML enthusiast from Ahmedabad, India, specializing in React, Next.js, Python, Django, and MongoDB.',
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
      <About profileData={profileData} />
      <Achievements initialData={achievements} />
      <FAQSection
        title="Frequently Asked Questions About Mohammed Khizer Shaikh"
        items={FAQ_ITEMS}
      />
    </main>
  );
}
