import { Experience, type ExperienceItem, type EducationItem } from "@/components/Experience";
import { Certifications, type Certification } from "@/components/Certifications";
import { Metadata } from 'next';
import { getExperience, getCertifications, getEducation } from "@/lib/db";

export const metadata: Metadata = {
  title: 'Career & Education',
  description: 'The professional journey and educational background of Mohammed Khizer Shaikh, including internships and technical certifications.',
};

export const dynamic = 'force-dynamic';

export default async function ExperiencePage() {
  const [rawExperience, rawEducation, rawCertifications] = await Promise.all([
    getExperience(),
    getEducation(),
    getCertifications(),
  ]);

  const experience: ExperienceItem[] = rawExperience.map((e: any) => ({
    id: String(e._id || e.id),
    jobTitle: e.jobTitle,
    companyName: e.companyName,
    startDate: e.startDate,
    endDate: e.endDate,
    description: e.description,
  }));

  const education: EducationItem[] = rawEducation.map((e: any) => ({
    id: String(e._id || e.id),
    degree: e.degree,
    institutionName: e.institutionName,
    startDate: e.startDate,
    endDate: e.endDate,
    description: e.description,
  }));

  const certifications: Certification[] = rawCertifications.map((c: any) => ({
    id: String(c._id || c.id),
    name: c.name,
    issuingBody: c.issuingBody,
    imageUrl: c.imageUrl,
    credentialUrl: c.credentialUrl,
    date: c.date || c.issueDate,
  }));

  return (
    <main className="py-12 space-y-12">
      <Experience initialExperiences={experience} initialEducation={education} />
      <Certifications initialData={certifications} />
    </main>
  );
}
