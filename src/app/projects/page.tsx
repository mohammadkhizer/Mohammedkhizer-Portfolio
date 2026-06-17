import { Projects } from "@/components/Projects";
import { Metadata } from 'next';
import { getProjects } from "@/lib/db";

export const metadata: Metadata = {
  title: 'Projects Showcase',
  description: 'Explore the technical portfolio of Mohammed Khizer Shaikh, featuring web applications, AI/ML integrations, and hardware projects.',
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  
  return (
    <main className="py-12 space-y-24">
      <Projects initialData={projects as any} />
    </main>
  );
}

