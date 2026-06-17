import { Skills } from "@/components/Skills";
import { Metadata } from 'next';
import { getSkills } from "@/lib/db";

export const metadata: Metadata = {
  title: 'Technical Skills',
  description: 'A deep dive into the tech stack of Mohammed Khizer Shaikh, including React, Next.js, Firebase, Python, and AI/ML expertise.',
};

export default async function SkillsPage() {
  const skills = await getSkills();
  
  return (
    <main className="py-12">
      <Skills initialData={skills as any} />
    </main>
  );
}

