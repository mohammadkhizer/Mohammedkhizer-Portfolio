import type {Metadata} from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";
import { Toaster } from "@/components/ui/toaster";
import { CursorHighlighter } from "@/components/CursorHighlighter";

const baseUrl = 'https://mohammedkhizer.com'; // Replace with your production URL

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Mohammed Khizer Shaikh | Full-Stack Developer & AI Enthusiast',
    template: '%s | Mohammed Khizer Shaikh'
  },
  description: 'Portfolio of Mohammed Khizer Shaikh, a passionate Full-Stack Web Developer and AI/ML enthusiast specializing in building performant, user-centric applications.',
  keywords: ['Full-Stack Developer', 'AI/ML Enthusiast', 'Web Development', 'React', 'Next.js', 'Firebase', 'Portfolio', 'Mohammed Khizer Shaikh', 'Ahmedabad Developer'],
  authors: [{ name: 'Mohammed Khizer Shaikh' }],
  creator: 'Mohammed Khizer Shaikh',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    title: 'Mohammed Khizer Shaikh | Portfolio',
    description: 'Explore the technical projects and professional journey of Mohammed Khizer Shaikh.',
    siteName: 'Mohammed Khizer Shaikh Portfolio',
    images: [
      {
        url: '/og-image.jpg', // Ensure you place an OG image in your public folder eventually
        width: 1200,
        height: 630,
        alt: 'Mohammed Khizer Shaikh Portfolio Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mohammed Khizer Shaikh | Portfolio',
    description: 'Full-Stack Developer & AI Enthusiast specializing in React, Next.js, and Machine Learning.',
    creator: '@mkhizershaikh',
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Mohammed Khizer Shaikh",
    "url": baseUrl,
    "jobTitle": "Full-Stack Web Developer",
    "description": "Full-Stack Web Developer and AI/ML Enthusiast specializing in React, Next.js, and Firebase.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Ahmedabad",
      "addressRegion": "Gujarat",
      "addressCountry": "India"
    },
    "sameAs": [
      "https://www.linkedin.com/in/mohammad-khizer-shaikh-14a362275",
      "https://github.com/mohammadkhizer",
      "https://www.instagram.com/khizerrrr11/"
    ],
    "knowsAbout": ["Web Development", "AI/ML", "React", "Next.js", "Firebase", "Python", "Django", "Machine Learning"]
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body antialiased selection:bg-primary/30">
        <FirebaseClientProvider>
          <ThemeProvider>
            <CursorHighlighter />
            <Navbar />
            <div className="pt-20 min-h-screen">
              {children}
            </div>
            <Footer />
            <Chatbot />
            <Toaster />
          </ThemeProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
