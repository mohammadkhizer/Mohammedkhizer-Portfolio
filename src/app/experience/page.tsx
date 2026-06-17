import { Experience } from "@/components/Experience";
import { Certifications } from "@/components/Certifications";
import { Metadata } from 'next';
import { getExperience, getSkills, getCertifications } from "@/lib/db";

export const metadata: Metadata = {
  title: 'Career & Education',
  description: 'The professional journey and educational background of Mohammed Khizer Shaikh, including internships and technical certifications.',
};

export default async function ExperiencePage() {
  const [experience, certifications] = await Promise.all([
    getExperience(),
    getCertifications(),
  ]);

  return (
    <main className="py-12 space-y-12">
      <Experience initialExperiences={experience as any} />
      <Certifications initialData={certifications as any} />
    </main>
  );
}

