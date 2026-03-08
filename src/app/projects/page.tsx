import { Projects } from "@/components/Projects";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects Showcase',
  description: 'Explore the technical portfolio of Mohammed Khizer Shaikh, featuring web applications, AI/ML integrations, and hardware projects.',
};

export default function ProjectsPage() {
  return (
    <main className="py-12 space-y-24">
      <Projects />
    </main>
  );
}
