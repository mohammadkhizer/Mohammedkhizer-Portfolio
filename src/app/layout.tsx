import type { Metadata } from 'next';
import './globals.css';

import { ThemeProvider } from '@/components/ThemeProvider';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollToTop } from '@/components/ScrollToTop';
import { Toaster } from '@/components/ui/toaster';
import { CursorHighlighter } from '@/components/CursorHighlighter';
import Script from 'next/script';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const baseUrl = 'https://mohammedkhizershaikh.netlify.app';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  icons: {
    icon: '/favicon.ico',
  },
  title: {
    default: 'Mohammed Khizer Shaikh | Full-Stack Developer & AI/ML Engineer',
    template: '%s | Mohammed Khizer Shaikh',
  },
  // Entity-rich description for AI extraction and knowledge graph alignment
  description:
    'Mohammed Khizer Shaikh is a Full-Stack Web Developer and AI/ML engineer from Ahmedabad, India. Expert in React, Next.js, Python, Django, and MongoDB. View projects, skills, and career timeline.',
  keywords: [
    'Mohammed Khizer Shaikh',
    'Mohammed Khizer',
    'Full-Stack Developer',
    'AI/ML Enthusiast',
    'AI ML Developer India',
    'Web Development',
    'React Developer',
    'Next.js Developer',
    'Next.js Developer India',
    'React Developer Ahmedabad',
    'MongoDB Developer',
    'Python Developer',
    'Python Developer Gujarat',
    'Django Developer',
    'TypeScript Developer',
    'Portfolio',
    'Ahmedabad Developer',
    'Gujarat Developer',
    'SVGU CSE Student',
    'Full Stack Developer Portfolio',
    'Machine Learning Engineer',
  ],
  authors: [{ name: 'Mohammed Khizer Shaikh', url: baseUrl }],
  creator: 'Mohammed Khizer Shaikh',
  publisher: 'Mohammed Khizer Shaikh',
  verification: {
    google: 'be3bbb85635a85f3',
  },
  // Absolute canonical — prevents sub-page duplication at root level
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    title: 'Mohammed Khizer Shaikh | Full-Stack Developer & AI/ML Engineer',
    description:
      'Mohammed Khizer Shaikh is a Full-Stack Web Developer and AI/ML engineer from Ahmedabad, India, specializing in React, Next.js, Python, and MongoDB.',
    siteName: 'Mohammed Khizer Shaikh Portfolio',
    images: [
      {
        // Points to Next.js dynamic OG image route (src/app/opengraph-image.tsx)
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Mohammed Khizer Shaikh Full-Stack Developer & AI/ML Engineer Portfolio',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mohammed Khizer Shaikh | Full-Stack Developer & AI/ML Engineer',
    description:
      'Full-Stack Developer & AI/ML Engineer specializing in React, Next.js, Python, and Machine Learning. Based in Ahmedabad, India.',
    creator: '@mkhizershaikh',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ── Structured Data: @graph with Person + WebSite + ProfilePage ──────────────
  // Using @graph pattern for entity disambiguation — the gold standard for AI
  // knowledge graph recognition. Each entity has a stable @id so schemas across
  // all pages can cross-reference with { "@id": ".../#person" } instead of
  // repeating all person data, reducing ambiguity for LLM retrievers.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${baseUrl}/#person`,
        name: 'Mohammed Khizer Shaikh',
        alternateName: ['MK', 'Mohammad Khizer', 'Mohammed Khizer'],
        url: baseUrl,
        image: {
          '@type': 'ImageObject',
          url: 'https://techaura26.netlify.app/Assets/khizer.jpeg',
          description: 'Mohammed Khizer Shaikh — Full-Stack Web Developer',
        },
        jobTitle: 'Full-Stack Web Developer',
        description:
          'Mohammed Khizer Shaikh is a Full-Stack Web Developer and AI/ML enthusiast based in Ahmedabad, India, specializing in React, Next.js, Python, Django, and MongoDB. Currently pursuing a Bachelor of Engineering in Computer Science at SVGU.',
        email: 'work.mkhizer@gmail.com',
        telephone: '+91-9510865651',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Ahmedabad',
          addressRegion: 'Gujarat',
          addressCountry: 'IN',
        },
        // alumniOf enables AI systems to place this person in an educational context
        alumniOf: [
          {
            '@type': 'EducationalOrganization',
            name: 'Sumandeep Vidyapeeth General University',
            alternateName: 'SVGU',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Ahmedabad',
              addressRegion: 'Gujarat',
              addressCountry: 'IN',
            },
          },
          {
            '@type': 'EducationalOrganization',
            name: 'LJ University',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Ahmedabad',
              addressRegion: 'Gujarat',
              addressCountry: 'IN',
            },
          },
        ],
        // knowsAbout creates semantic links to technology entities
        knowsAbout: [
          'React',
          'Next.js',
          'TypeScript',
          'JavaScript',
          'Python',
          'Django',
          'MongoDB',
          'Node.js',
          'Tailwind CSS',
          'Machine Learning',
          'Artificial Intelligence',
          'Full-Stack Web Development',
          'REST API Development',
          'Computer Science',
          'Database Design',
        ],
        knowsLanguage: ['en', 'ur', 'hi', 'gu'],
        nationality: { '@type': 'Country', name: 'India' },
        // sameAs links to authoritative social profiles for identity verification
        sameAs: [
          'https://www.linkedin.com/in/mohammad-khizer-shaikh-14a362275',
          'https://github.com/mohammadkhizer',
          'https://www.instagram.com/khizerrrr11/',
        ],
        mainEntityOfPage: { '@id': `${baseUrl}/#profilepage` },
      },
      {
        // WebSite schema with SearchAction tells AI this site is a searchable entity
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: 'Mohammed Khizer Shaikh | Full-Stack Developer Portfolio',
        description:
          'Official portfolio website of Mohammed Khizer Shaikh, a Full-Stack Web Developer and AI/ML engineer from Ahmedabad, India.',
        author: { '@id': `${baseUrl}/#person` },
        publisher: { '@id': `${baseUrl}/#person` },
        inLanguage: 'en-US',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${baseUrl}/projects?search={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        // ProfilePage: Google's designated type for portfolio/author pages.
        // Signals to AI systems that this page represents a real professional identity.
        '@type': 'ProfilePage',
        '@id': `${baseUrl}/#profilepage`,
        url: baseUrl,
        name: 'Mohammed Khizer Shaikh — Full-Stack Developer & AI/ML Engineer Portfolio',
        description:
          'The official portfolio and professional profile of Mohammed Khizer Shaikh, a Full-Stack Web Developer specializing in React, Next.js, Python, Django, and AI/ML applications.',
        mainEntity: { '@id': `${baseUrl}/#person` },
        author: { '@id': `${baseUrl}/#person` },
        datePublished: '2024-01-01',
        dateModified: '2026-07-01',
        inLanguage: 'en-US',
        isPartOf: { '@id': `${baseUrl}/#website` },
      },
    ],
  };

  return (
    <html lang="en" className={`scroll-smooth ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body antialiased selection:bg-primary/30">
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1K7CD5H0ET"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1K7CD5H0ET');
          `}
        </Script>

        <ThemeProvider>
          <CursorHighlighter />
          <Navbar />
          <div className="pt-20 min-h-screen">
            {children}
          </div>
          <Footer />
          <ScrollToTop />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
