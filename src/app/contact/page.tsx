import { Contact } from "@/components/Contact";
import { FAQSection } from "@/components/FAQSection";
import { Metadata } from 'next';

const baseUrl = 'https://mohammedkhizershaikh.netlify.app';

// Entity-rich metadata for contact page
export const metadata: Metadata = {
  title: 'Contact Mohammed Khizer Shaikh — Hire a Full-Stack Developer in Ahmedabad',
  description: 'Get in touch with Mohammed Khizer Shaikh for full-stack web development projects, AI/ML integrations, freelance opportunities, or technical collaborations. Based in Ahmedabad, India.',
  alternates: {
    canonical: `${baseUrl}/contact`,
  },
  openGraph: {
    title: 'Contact Mohammed Khizer Shaikh',
    description: 'Reach out to Mohammed Khizer Shaikh for software development collaborations, inquiries, or professional roles.',
    url: `${baseUrl}/contact`,
  },
};

// FAQ content — Answer-first structure for AI citation and contact intent queries
const FAQ_ITEMS = [
  {
    question: 'How can I contact Mohammed Khizer Shaikh?',
    answer: 'You can contact Mohammed Khizer Shaikh by filling out the secure contact form on this page, emailing work.mkhizer@gmail.com, or calling +91 9510865651. He is located in Ahmedabad, Gujarat, India, and is open to local, hybrid, and remote engagements.'
  },
  {
    question: 'What is the typical response time for inquiries?',
    answer: 'Mohammed Khizer Shaikh typically responds to all professional inquiries, project proposals, and freelance requests within 24 to 48 business hours.'
  },
  {
    question: 'What information should I include in the contact form?',
    answer: 'When reaching out, please include your name, email, a descriptive subject (such as "Project Inquiry" or "Freelance Collaboration"), and a detailed message outlining your requirements, technology stack, and timeline.'
  },
  {
    question: 'Are you open to contract or freelance opportunities?',
    answer: 'Yes, Mohammed Khizer Shaikh is open to freelance web development contracts, full-stack development roles, AI/ML application prototyping, and technical collaborations. Please use the contact form to share details about your project.'
  }
];

export default function ContactPage() {
  // JSON-LD for Contact Page including FAQPage schema
  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ContactPage',
        '@id': `${baseUrl}/contact#webpage`,
        url: `${baseUrl}/contact`,
        name: 'Contact Mohammed Khizer Shaikh — Full-Stack Developer Portfolio',
        description: 'Get in touch with Mohammed Khizer Shaikh for collaborations, full-stack web development services, and professional opportunities.',
        inLanguage: 'en-US',
        isPartOf: { '@id': `${baseUrl}/#website` },
        author: { '@id': `${baseUrl}/#person` },
        dateModified: '2026-07-01',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${baseUrl}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Contact',
            item: `${baseUrl}/contact`,
          },
        ],
      },
    ],
  };

  return (
    <main className="py-12 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
      <Contact />
      <FAQSection 
        title="Frequently Asked Contact Questions" 
        items={FAQ_ITEMS} 
      />
    </main>
  );
}
