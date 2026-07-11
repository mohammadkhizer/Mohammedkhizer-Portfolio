import { Projects, type Project, type ProjectCategory } from '@/components/Projects';
import { Metadata } from 'next';
import { getProjects, getProjectCategories } from '@/lib/db';

const baseUrl = 'https://mohammedkhizershaikh.netlify.app';

// Entity-rich metadata — domain keywords (web apps, AI/ML, Django) for topic authority
export const metadata: Metadata = {
  title: 'Portfolio Projects — Full-Stack Web & AI/ML Applications',
  description:
    'Explore the technical project portfolio of Mohammed Khizer Shaikh: full-stack web applications, AI-powered tools, Django REST API backends, React frontends, and MongoDB-powered systems built in Ahmedabad, India.',
  alternates: {
    canonical: `${baseUrl}/projects`,
  },
  openGraph: {
    title: 'Portfolio Projects — Mohammed Khizer Shaikh',
    description:
      'Full-stack web applications, AI-powered tools, and Django backends built by Mohammed Khizer Shaikh, a developer from Ahmedabad, India.',
    url: `${baseUrl}/projects`,
  },
};

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const [rawProjects, rawCategories] = await Promise.all([
    getProjects(),
    getProjectCategories(),
  ]);

  const projects: Project[] = rawProjects.map((p: any) => ({
    id: String(p._id || p.id),
    title: p.title,
    description: p.description,
    projectImageUrl: p.projectImageUrl,
    liveDemoUrl: p.liveDemoUrl,
    githubRepoUrl: p.githubRepoUrl,
    skillIds: p.skillIds,
    categorySlug: p.categorySlug,
    createdAt: p.createdAt,
  }));

  const categories: ProjectCategory[] = rawCategories.map((c: any) => ({
    id: String(c._id || c.id),
    name: c.name,
    slug: c.slug,
    order: c.order,
  }));

  // WebPage + BreadcrumbList + ItemList JSON-LD.
  // ItemList schema wraps the project collection so AI systems understand
  // this page is an enumerable list of creative works, not just a landing page.
  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${baseUrl}/projects#webpage`,
        url: `${baseUrl}/projects`,
        name: 'Portfolio Projects — Full-Stack Web & AI/ML Applications | Mohammed Khizer Shaikh',
        description:
          'Technical project portfolio of Mohammed Khizer Shaikh including full-stack web applications, AI-powered tools, Django backends, and React frontends.',
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
            name: 'Projects',
            item: `${baseUrl}/projects`,
          },
        ],
      },
      // ItemList: tells AI systems this page is a curated list of portfolio items.
      // Each project becomes a SoftwareSourceCode / CreativeWork entity.
      {
        '@type': 'ItemList',
        name: 'Portfolio Projects by Mohammed Khizer Shaikh',
        description:
          'A collection of full-stack web applications, AI/ML tools, and backend systems built by Mohammed Khizer Shaikh.',
        url: `${baseUrl}/projects`,
        author: { '@id': `${baseUrl}/#person` },
        numberOfItems: projects.length,
        itemListElement: projects.map((project, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'SoftwareSourceCode',
            name: project.title,
            description: project.description,
            url: project.liveDemoUrl || `${baseUrl}/projects`,
            codeRepository: project.githubRepoUrl || undefined,
            programmingLanguage: project.skillIds?.join(', ') || undefined,
            author: { '@id': `${baseUrl}/#person` },
          },
        })),
      },
    ],
  };

  return (
    <main className="py-12 space-y-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
      <Projects initialData={projects} categories={categories} />
    </main>
  );
}
