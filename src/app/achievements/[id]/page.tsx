import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { getAchievement } from "@/lib/db";
import { AchievementCarousel } from "@/components/Achievements";
import { ArrowLeft, Calendar, Trophy, Award, Sparkles } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

const baseUrl = 'https://mohammedkhizershaikh.netlify.app';

// ─── Generate Metadata dynamically ──────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const achievement = await getAchievement(id);

  if (!achievement) {
    return {
      title: "Achievement Not Found",
      description: "The requested career milestone or achievement could not be found.",
    };
  }

  return {
    title: `${achievement.title} — Mohammed Khizer Shaikh`,
    description: `Read details about the milestone: "${achievement.title}" issued by ${achievement.issuer}.`,
    alternates: {
      canonical: `${baseUrl}/achievements/${id}`,
    },
    openGraph: {
      title: `${achievement.title} — Mohammed Khizer Shaikh`,
      description: achievement.description.slice(0, 150),
      url: `${baseUrl}/achievements/${id}`,
    },
  };
}

export const dynamic = 'force-dynamic';

export default async function AchievementDetailPage({ params }: PageProps) {
  const { id } = await params;
  const achievement = await getAchievement(id);

  if (!achievement) {
    notFound();
  }

  const hasImages = achievement.images && achievement.images.length > 0;

  // JSON-LD schema markup
  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${baseUrl}/achievements/${id}#webpage`,
        url: `${baseUrl}/achievements/${id}`,
        name: `${achievement.title} — Mohammed Khizer Shaikh`,
        description: achievement.description.slice(0, 150),
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
            name: 'Experience & Education',
            item: `${baseUrl}/experience`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: achievement.title,
            item: `${baseUrl}/achievements/${id}`,
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
            href="/experience#achievements"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Experience &amp; Education
          </Link>
        </div>

        {/* Detail Card Container */}
        <div className="rounded-2xl border border-primary/10 bg-card/30 backdrop-blur-xl overflow-hidden shadow-2xl p-6 md:p-10 space-y-8">
          {/* Images Section */}
          {hasImages && (
            <div className="max-w-2xl mx-auto">
              <AchievementCarousel images={achievement.images!} />
            </div>
          )}

          {/* Header Block */}
          <div className="space-y-4 border-b border-border/40 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="h-3 w-3 animate-pulse" />
              Verified Achievement
            </div>
            
            <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
              {achievement.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm mt-2">
              <div className="flex items-center gap-1.5 font-bold text-accent uppercase tracking-wider">
                <Award className="h-4 w-4" />
                {achievement.issuer}
              </div>
              <div className="hidden sm:block text-muted-foreground/30">|</div>
              <div className="flex items-center gap-1.5 text-muted-foreground font-semibold">
                <Calendar className="h-4 w-4 text-primary" />
                {achievement.date}
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
              <Trophy className="h-4 w-4 text-primary" />
              Accomplishment Details
            </div>
            <pre className="whitespace-pre-wrap font-sans text-sm md:text-base text-muted-foreground leading-relaxed">
              {achievement.description}
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
}
