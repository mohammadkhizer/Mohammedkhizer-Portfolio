import { About } from "@/components/About";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Me',
  description: 'Learn more about Mohammed Khizer Shaikh, a Full-Stack Developer and AI/ML Enthusiast based in Ahmedabad. Discover his educational background and technical passion.',
};

export default function AboutPage() {
  return (
    <main className="py-12">
      <About />
    </main>
  );
}
