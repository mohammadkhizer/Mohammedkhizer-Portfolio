import { Skills, type Skill } from "@/components/Skills";
import { Metadata } from 'next';
import { getSkills } from "@/lib/db";

export const metadata: Metadata = {
  title: 'Technical Skills',
  description: 'A deep dive into the tech stack of Mohammed Khizer Shaikh, including React, Next.js, MongoDB, Python, and AI/ML expertise.',
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

  return (
    <main className="py-12">
      <Skills initialData={skills} />
    </main>
  );
}
