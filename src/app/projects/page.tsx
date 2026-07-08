import { Projects, type Project } from "@/components/Projects";
import { Metadata } from 'next';
import { getProjects } from "@/lib/db";

export const metadata: Metadata = {
  title: 'Projects Showcase',
  description: 'Explore the technical portfolio of Mohammed Khizer Shaikh, featuring web applications, AI/ML integrations, and hardware projects.',
};

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const rawProjects = await getProjects();

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

  return (
    <main className="py-12 space-y-24">
      <Projects initialData={projects} />
    </main>
  );
}
