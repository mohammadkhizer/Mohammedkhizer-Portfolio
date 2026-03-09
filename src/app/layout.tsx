import type {Metadata} from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Toaster } from "@/components/ui/toaster";
import { CursorHighlighter } from "@/components/CursorHighlighter";
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
  title: {
    default: 'Mohammed Khizer Shaikh | Full-Stack Developer & AI Enthusiast',
    template: '%s | Mohammed Khizer Shaikh'
  },
  description: 'Portfolio of Mohammed Khizer Shaikh, a passionate Full-Stack Web Developer and AI/ML enthusiast specializing in building performant, user-centric applications.',
  keywords: ['Full-Stack Developer', 'AI/ML Enthusiast', 'Web Development', 'React', 'Next.js', 'Firebase', 'Portfolio', 'Mohammed Khizer Shaikh', 'Ahmedabad Developer'],
  authors: [{ name: 'Mohammed Khizer Shaikh' }],
  creator: 'Mohammed Khizer Shaikh',
  verification: {
    google: 'be3bbb85635a85f3',
  },
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
        url: '/og-image.jpg',
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

        <FirebaseClientProvider>
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
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
