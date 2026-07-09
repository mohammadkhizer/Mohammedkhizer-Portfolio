import { About } from "@/components/About";
import { Metadata } from 'next';
import { getUserProfile } from "@/lib/db";

export const metadata: Metadata = {
  title: 'About Me',
  description: 'Learn more about Mohammed Khizer Shaikh, a Full-Stack Developer and AI/ML Enthusiast based in Ahmedabad. Discover his educational background and technical passion.',
};

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const rawProfile = await getUserProfile();

  const profileData = rawProfile ? {
    fullName: rawProfile.fullName,
    tagline: rawProfile.tagline,
    professionalSummary: rawProfile.professionalSummary,
    introductionSummary: rawProfile.introductionSummary,
    cvDownloadUrl: rawProfile.cvDownloadUrl,
  } : null;

  return (
    <main className="py-12">
      <About profileData={profileData} />
    </main>
  );
}
