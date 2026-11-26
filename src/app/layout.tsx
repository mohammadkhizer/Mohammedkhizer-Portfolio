import type { Metadata } from 'next';
import './globals.css';

import { GlobalLayoutWrapper } from '@/components/GlobalLayoutWrapper';
import Script from 'next/script';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mohammedkhizershaikh.netlify.app';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  icons: {
    icon: '/favicon.ico',
  },
  title: {
    default: 'Mohammed Khizer Shaikh | Web & Mobile Systems for Businesses',
    template: '%s | Mohammed Khizer Shaikh',
  },
  // Entity-rich description for AI extraction and knowledge graph alignment
  description:
    'Full-Stack Web & Mobile Developer building web and mobile systems for businesses.',
  keywords: [
    'Shaikh Mohammed Khizer',
    'M. khizer',
    'Mohammed Khizer Shaikh',
    'Mo. khizer',
    'Mohammed Khizer',
    'Shaikh M. khizer',
    'Khizer Shaikh',
    'Shaikh Mo. khizer',
    'Khizer shaikh',
    'Shaikh Khizer',
    'Khizer',
    'Full-Stack Developer',
    'Web Development',
    'Mobile App Development',
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
    'Full Stack Developer Portfolio',
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
    title: 'Mohammed Khizer Shaikh | Web & Mobile Systems for Businesses',
    description:
      'Full-Stack Web & Mobile Developer building web and mobile systems for businesses.',
    siteName: 'Mohammed Khizer Shaikh Portfolio',
    images: [
      {
        // Points to Next.js dynamic OG image route (src/app/opengraph-image.tsx)
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Mohammed Khizer Shaikh | Web & Mobile Systems for Businesses',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mohammed Khizer Shaikh | Web & Mobile Systems for Businesses',
    description:
      'Full-Stack Web & Mobile Developer building web and mobile systems for businesses.',
    creator: '@mkhizershaikh',
    images: ['/opengraph-image'],
  },
  robots: {
    index: process.env.NEXT_PUBLIC_NOINDEX !== 'true',
    follow: process.env.NEXT_PUBLIC_NOINDEX !== 'true',
    googleBot: {
      index: process.env.NEXT_PUBLIC_NOINDEX !== 'true',
      follow: process.env.NEXT_PUBLIC_NOINDEX !== 'true',
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
        alternateName: [
          'MK',
          'Mohammad Khizer',
          'Mohammed Khizer',
          'Shaikh Mohammed Khizer',
          'M. khizer',
          'Mohammed Khizer Shaikh',
          'Mo. khizer',
          'Shaikh M. khizer',
          'Khizer Shaikh',
          'Shaikh Mo. khizer',
          'Khizer shaikh',
          'Shaikh Khizer',
          'Khizer'
        ],
        url: baseUrl,
        image: {
          '@type': 'ImageObject',
          url: 'https://techaura26.netlify.app/Assets/khizer.jpeg',
          description: 'Mohammed Khizer Shaikh — Full-Stack Web Developer',
        },
        jobTitle: 'Full-Stack Web & Mobile Developer',
        description:
          'Mohammed Khizer Shaikh is a Full-Stack Web & Mobile Developer based in Ahmedabad, India, building web and mobile systems for businesses using React, Next.js, TypeScript, Python, Django, Firebase, and MongoDB.',
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
          'Full-Stack Web Development',
          'Mobile App Development',
          'REST API Development',
          'Computer Science',
          'Database Design',
        ],
        knowsLanguage: ['en', 'ur', 'hi', 'gu'],
        nationality: { '@type': 'Country', name: 'India' },
        // sameAs links to authoritative social profiles for identity verification
        sameAs: [
          'https://in.linkedin.com/in/mohammed-khizer-shaikh',
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
        name: 'Mohammed Khizer Shaikh | Web & Mobile Systems for Businesses',
        description:
          'Full-Stack Web & Mobile Developer building web and mobile systems for businesses.',
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
        name: 'Mohammed Khizer Shaikh | Web & Mobile Systems for Businesses',
        description:
          'Full-Stack Web & Mobile Developer building web and mobile systems for businesses.',
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
    <html lang="en" className={`scroll-smooth ${inter.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
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

        <GlobalLayoutWrapper>
          {children}
        </GlobalLayoutWrapper>
      </body>
    </html>
  );
}
