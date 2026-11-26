import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { getProject } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  AlertCircle,
  Clock,
  ExternalLink,
  FileText,
  Github,
  Layers,
  TrendingUp,
  Wrench,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

const baseUrl = 'https://mohammedkhizershaikh.netlify.app';

interface CaseStudyOverride {
  displayTitle?: string;
  statusLabel?: string;
  overview: string;
  problem: string;
  built: string;
  result: string;
  stack: string[];
  externalUrl?: string;
  externalLabel?: string;
  showArchitectureDiagram?: boolean;
}

function getCaseStudyDetails(project: {
  id: string;
  title: string;
  description: string;
  skillIds?: string[];
  liveDemoUrl?: string;
}): CaseStudyOverride {
  const titleLower = project.title.toLowerCase();

  // Inventory & Billing System
  if (
    titleLower.includes('inventory') ||
    project.id === '292b1c3e-9783-4071-85d5-c04c222fe85d'
  ) {
    return {
      displayTitle: 'Inventory & Billing System',
      overview:
        'A responsive web application designed to help businesses track, manage, and organize inventory and billing in real time.',
      problem:
        'Stock and sales were tracked manually, causing errors and slow invoicing.',
      built:
        'Real-time inventory tracking, orders, barcode generator, sales overview, and invoicing.',
      // {{TODO: Replace with verified measurable result for Inventory & Billing System}}
      result: '{{TODO: measurable result}}',
      stack: ['Next.js', 'TypeScript', 'Firebase', 'Tailwind'],
      showArchitectureDiagram: true,
    };
  }

  // Tech Kurukshetra
  if (
    titleLower.includes('kurukshetra') ||
    project.id === '135d0773-db93-4752-ab6a-7b0f630a3497'
  ) {
    return {
      displayTitle: 'Tech Kurukshetra',
      overview: 'Public event platform for Tech Kurukshetra.',
      problem:
        'Participants and organizers needed one central public event platform to view schedules, event tracks, and updates.',
      built:
        'Public event platform built with Next.js, TypeScript, MongoDB, and Tailwind.',
      // {{TODO: Replace with verified visitors/participants metric for Tech Kurukshetra}}
      result: '{{TODO: visitors/participants}}',
      stack: ['Next.js', 'TypeScript', 'MongoDB', 'Tailwind'],
      externalUrl: 'https://techkurukshetra.in',
      externalLabel: 'techkurukshetra.in',
    };
  }

  // Campus Hub
  if (
    titleLower.includes('campus hub') ||
    project.id === '4b8e0a63-ca29-4ef9-8196-d90bb828bf06'
  ) {
    return {
      displayTitle: 'Campus Hub',
      statusLabel: 'In development',
      overview:
        'Academic quiz platform featuring smart quizzes with instant feedback, detailed performance analytics, and an anti-cheating system for fair and secure examinations.',
      problem:
        'Delivering online assessments with instant feedback, detailed performance analytics, and anti-cheating safeguards.',
      built:
        'Academic quiz platform with smart quizzes, instant feedback, performance analytics, and an anti-cheating system.',
      result: 'Currently in development',
      stack: ['Next.js', 'TypeScript', 'MongoDB', 'Redis', 'LiveKit'],
    };
  }

  // Default fallback for any other project in the database (uses only existing project facts)
  return {
    overview: project.description,
    // {{TODO: Add verified problem statement using existing project facts}}
    problem: '{{TODO: problem statement}}',
    built: project.description,
    // {{TODO: Add verified measurable result}}
    result: '{{TODO: measurable result}}',
    stack: project.skillIds && project.skillIds.length > 0 ? project.skillIds : [],
  };
}

/**
 * Inline SVG architecture diagram matching the dark theme and orange accent.
 * Flow: Client (web/mobile) -> Next.js app -> Firebase (auth + database) -> Admin dashboard -> Hosting
 */
function ArchitectureDiagram() {
  return (
    <section aria-labelledby="architecture-heading" className="pt-6 border-t border-border/40 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" aria-hidden="true" />
          <h2 id="architecture-heading" className="text-sm font-black uppercase tracking-wider text-primary">
            How the system is structured
          </h2>
        </div>
        <span className="text-[11px] text-muted-foreground font-mono">
          Client (web/mobile) &rarr; Next.js app &rarr; Firebase (auth + database) &rarr; Admin dashboard &rarr; Hosting
        </span>
      </div>

      <div className="w-full bg-secondary/20 dark:bg-black/30 border border-border/50 rounded-2xl p-4 md:p-6 overflow-x-auto">
        <svg
          viewBox="0 0 920 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full min-w-[760px] h-auto select-none"
          role="img"
          aria-label="How the system is structured: Client (web/mobile) to Next.js app to Firebase (auth + database) to Admin dashboard to Hosting"
        >
          <defs>
            <linearGradient id="projArchPrimaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.22" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="projArchArrowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
            <filter id="projArchGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="hsl(var(--primary))" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Node 1: Client (web/mobile) */}
          <g transform="translate(10, 15)">
            <rect
              width="150"
              height="85"
              rx="12"
              fill="url(#projArchPrimaryGrad)"
              stroke="hsl(var(--primary))"
              strokeWidth="1.5"
              filter="url(#projArchGlow)"
            />
            <text x="75" y="42" textAnchor="middle" fill="currentColor" className="text-[12px] font-black" fontWeight="bold">
              Client
            </text>
            <text x="75" y="60" textAnchor="middle" fill="hsl(var(--muted-foreground))" className="text-[10px]" fontWeight="500">
              (web / mobile)
            </text>
          </g>

          {/* Arrow 1 */}
          <path d="M165 57 L195 57" stroke="url(#projArchArrowGrad)" strokeWidth="2.5" />
          <polygon points="195,57 186,52 186,62" fill="hsl(var(--primary))" />

          {/* Node 2: Next.js app */}
          <g transform="translate(200, 15)">
            <rect
              width="150"
              height="85"
              rx="12"
              fill="url(#projArchPrimaryGrad)"
              stroke="hsl(var(--border))"
              strokeWidth="1.5"
            />
            <text x="75" y="42" textAnchor="middle" fill="currentColor" className="text-[12px] font-black" fontWeight="bold">
              Next.js app
            </text>
            <text x="75" y="60" textAnchor="middle" fill="hsl(var(--muted-foreground))" className="text-[10px]" fontWeight="500">
              UI &amp; App Routes
            </text>
          </g>

          {/* Arrow 2 */}
          <path d="M355 57 L385 57" stroke="url(#projArchArrowGrad)" strokeWidth="2.5" />
          <polygon points="385,57 376,52 376,62" fill="hsl(var(--primary))" />

          {/* Node 3: Firebase (auth + database) */}
          <g transform="translate(390, 15)">
            <rect
              width="150"
              height="85"
              rx="12"
              fill="url(#projArchPrimaryGrad)"
              stroke="hsl(var(--border))"
              strokeWidth="1.5"
            />
            <text x="75" y="42" textAnchor="middle" fill="currentColor" className="text-[12px] font-black" fontWeight="bold">
              Firebase
            </text>
            <text x="75" y="60" textAnchor="middle" fill="hsl(var(--muted-foreground))" className="text-[10px]" fontWeight="500">
              (auth + database)
            </text>
          </g>

          {/* Arrow 3 */}
          <path d="M545 57 L575 57" stroke="url(#projArchArrowGrad)" strokeWidth="2.5" />
          <polygon points="575,57 566,52 566,62" fill="hsl(var(--primary))" />

          {/* Node 4: Admin dashboard */}
          <g transform="translate(580, 15)">
            <rect
              width="150"
              height="85"
              rx="12"
              fill="url(#projArchPrimaryGrad)"
              stroke="hsl(var(--primary))"
              strokeWidth="1.5"
              filter="url(#projArchGlow)"
            />
            <text x="75" y="42" textAnchor="middle" fill="currentColor" className="text-[12px] font-black" fontWeight="bold">
              Admin dashboard
            </text>
            <text x="75" y="60" textAnchor="middle" fill="hsl(var(--muted-foreground))" className="text-[10px]" fontWeight="500">
              Stock, Orders, Billing
            </text>
          </g>

          {/* Arrow 4 */}
          <path d="M735 57 L765 57" stroke="url(#projArchArrowGrad)" strokeWidth="2.5" />
          <polygon points="765,57 756,52 756,62" fill="hsl(var(--primary))" />

          {/* Node 5: Hosting — {{verify hosting}} */}
          <g transform="translate(770, 15)">
            <rect
              width="140"
              height="85"
              rx="12"
              fill="url(#projArchPrimaryGrad)"
              stroke="hsl(var(--border))"
              strokeWidth="1.5"
            />
            <text x="70" y="42" textAnchor="middle" fill="currentColor" className="text-[12px] font-black" fontWeight="bold">
              Hosting
            </text>
            <text x="70" y="60" textAnchor="middle" fill="hsl(var(--muted-foreground))" className="text-[10px]" fontWeight="500">
              Live Web Deployment
            </text>
          </g>
        </svg>
      </div>
    </section>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found.',
    };
  }

  const details = getCaseStudyDetails(project);
  const displayTitle = details.displayTitle || project.title;

  return {
    title: `${displayTitle} — Mohammed Khizer Shaikh`,
    description: details.overview.slice(0, 155),
    alternates: {
      canonical: `${baseUrl}/projects/${id}`,
    },
    openGraph: {
      title: `${displayTitle} — Mohammed Khizer Shaikh`,
      description: details.overview.slice(0, 155),
      url: `${baseUrl}/projects/${id}`,
    },
  };
}

export const dynamic = 'force-dynamic';

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  const details = getCaseStudyDetails(project);
  const displayTitle = details.displayTitle || project.title;
  const liveUrl =
    details.externalUrl ||
    (project.liveDemoUrl && project.liveDemoUrl !== '#' ? project.liveDemoUrl : undefined);
  const githubUrl =
    project.githubRepoUrl && project.githubRepoUrl !== '#' ? project.githubRepoUrl : undefined;

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${baseUrl}/projects/${id}#webpage`,
        url: `${baseUrl}/projects/${id}`,
        name: `${displayTitle} — Mohammed Khizer Shaikh`,
        description: details.overview.slice(0, 155),
        inLanguage: 'en-US',
        isPartOf: { '@id': `${baseUrl}/#website` },
        author: { '@id': `${baseUrl}/#person` },
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
          {
            '@type': 'ListItem',
            position: 3,
            name: displayTitle,
            item: `${baseUrl}/projects/${id}`,
          },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen py-24 bg-gradient-to-b from-background via-secondary/5 to-background relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />

      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-10 h-72 w-72 rounded-full bg-accent/5 blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-4xl">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
            Back to all projects
          </Link>
        </div>

        {/* Detail Card Container */}
        <article className="rounded-2xl border border-primary/10 bg-card/30 backdrop-blur-xl overflow-hidden shadow-2xl p-6 md:p-10 space-y-8">
          {/* Project Image */}
          {project.projectImageUrl && (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border/50 bg-secondary/20">
              <Image
                src={project.projectImageUrl}
                alt={displayTitle}
                fill
                sizes="(max-width: 768px) 100vw, 896px"
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Header Block */}
          <header className="space-y-4 border-b border-border/40 pb-6">
            <div className="flex flex-wrap items-center gap-2">
              {project.categorySlug && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
                  {project.categorySlug}
                </span>
              )}
              {details.statusLabel && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-secondary text-foreground border border-border/50">
                  <Clock className="h-3 w-3 text-primary" aria-hidden="true" />
                  {details.statusLabel}
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
                {displayTitle}
              </h1>

              <div className="flex flex-wrap items-center gap-3">
                {liveUrl && (
                  <Button asChild size="sm" variant="outline" className="rounded-full gap-1.5">
                    <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                      {details.externalLabel || 'Live Site'}
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </Button>
                )}
                {githubUrl && (
                  <Button asChild size="sm" variant="outline" className="rounded-full gap-1.5">
                    <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                      GitHub
                      <Github className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </header>

          {/* 1. Overview */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
              <FileText className="h-4 w-4 text-primary" aria-hidden="true" />
              <h2>Overview</h2>
            </div>
            <p className="text-sm md:text-base text-foreground/90 leading-relaxed pl-6">
              {details.overview}
            </p>
          </section>

          {/* 2. Problem */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
              <AlertCircle className="h-4 w-4 text-primary" aria-hidden="true" />
              <h2>Problem</h2>
            </div>
            <p className="text-sm md:text-base text-foreground/90 leading-relaxed pl-6">
              {details.problem}
            </p>
          </section>

          {/* 3. What I built */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
              <Wrench className="h-4 w-4 text-primary" aria-hidden="true" />
              <h2>What I built</h2>
            </div>
            <p className="text-sm md:text-base text-foreground/90 leading-relaxed pl-6">
              {details.built}
            </p>
          </section>

          {/* 4. Result */}
          <section className="space-y-2 bg-primary/5 border border-primary/20 rounded-xl p-5">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-500">
              <TrendingUp className="h-4 w-4 text-emerald-500" aria-hidden="true" />
              <h2>Result</h2>
            </div>
            <p className="text-sm md:text-base text-foreground font-semibold pl-6">
              {details.result}
            </p>
          </section>

          {/* 5. Stack */}
          {details.stack.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                Stack
              </h2>
              <div className="flex flex-wrap gap-2">
                {details.stack.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="bg-secondary/70 border border-border/50 text-xs px-3 py-1 font-semibold"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {/* 6. Architecture diagram (where listed) */}
          {details.showArchitectureDiagram && <ArchitectureDiagram />}
        </article>
      </div>
    </main>
  );
}
