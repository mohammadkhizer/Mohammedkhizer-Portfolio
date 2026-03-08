import { Experience } from "@/components/Experience";
import { Certifications } from "@/components/Certifications";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Career & Education',
  description: 'The professional journey and educational background of Mohammed Khizer Shaikh, including internships and technical certifications.',
};

export default function ExperiencePage() {
  return (
    <main className="py-12 space-y-12">
      <Experience />
      <Certifications />
    </main>
  );
}
