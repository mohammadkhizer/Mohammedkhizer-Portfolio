import { Contact } from "@/components/Contact";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Me',
  description: 'Get in touch with Mohammed Khizer Shaikh for collaborations, technical inquiries, or professional opportunities.',
};

export default function ContactPage() {
  return (
    <main className="py-12">
      <Contact />
    </main>
  );
}
