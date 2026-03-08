import { Skills } from "@/components/Skills";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Technical Skills',
  description: 'A deep dive into the tech stack of Mohammed Khizer Shaikh, including React, Next.js, Firebase, Python, and AI/ML expertise.',
};

export default function SkillsPage() {
  return (
    <main className="py-12">
      <Skills />
    </main>
  );
}
