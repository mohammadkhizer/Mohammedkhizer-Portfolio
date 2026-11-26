import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/mongodb';
import HomeHero from '@/models/HomeHero';
import AboutHero from '@/models/AboutHero';
import Service from '@/models/Service';
import HowIWork from '@/models/HowIWork';
import ClosingCta from '@/models/ClosingCta';
import Testimonial from '@/models/Testimonial';
import Project from '@/models/Project';
import SiteSettings from '@/models/SiteSettings';

// ── STATIC DEFAULTS ──────────────────────────────────────────────────────────

export const DEFAULT_HOME_HERO = {
  tagline: 'Welcome to my space',
  subtitle: 'Full-Stack Web & Mobile Developer',
  primaryButtonText: 'Discuss your project',
  primaryButtonUrl: '/contact',
  secondaryButtonText: 'View Projects',
  secondaryButtonUrl: '/projects',
  cvDownloadUrl: 'https://portfolioimageskhizer.netlify.app/Mohammed-Khizer-Shaikh-CV-2.pdf',
  stats: [
    { label: 'Post-launch Support', value: '30 Days' },
    { label: 'Projects Built', value: '10+' },
    { label: 'Certifications', value: '8+' },
    { label: 'Tech Stack Entities', value: '15+' },
  ],
  isPublished: true,
};

export const DEFAULT_ABOUT_HERO = {
  pillText: 'Mohammed Khizer Shaikh • Gujarat, India',
  headline: 'I build systems that save businesses',
  headlineHighlight: 'hours every week.',
  subline: 'Web and mobile apps for businesses across industries.',
  chips: [
    'End-to-end custom systems',
    'Clean, maintainable architecture',
    '30 days dedicated post-launch support',
  ],
  primaryButtonText: 'Discuss your project',
  primaryButtonUrl: '/contact',
  secondaryButtonText: 'See my work',
  secondaryButtonUrl: '/projects',
  isPublished: true,
};

export const DEFAULT_SERVICES = [
  {
    id: 'inventory-billing',
    title: 'Inventory & Billing Systems',
    shortDescription: 'Replace spreadsheets and manual billing with one reliable system for your business.',
    bullets: [
      'Real-time stock tracking across items, categories, and variants',
      'Clean invoicing, order records, and payment tracking',
      'Sales and inventory reports in one place',
      'Role-based admin dashboard for daily operations',
    ],
    // {{TODO: Replace with your typical delivery range in weeks}}
    timeline: 'Typical timeline: {{TODO: weeks}} weeks',
    buttonText: 'Discuss your project',
    buttonUrl: '/contact',
    order: 1,
    featured: true,
    isPublished: true,
  },
  {
    id: 'website-admin',
    title: 'Business Website + Admin Panel',
    shortDescription: 'A fast, responsive website paired with a private panel to manage everything yourself.',
    bullets: [
      'Fast, mobile-responsive site built to turn visitors into enquiries',
      'Admin panel to manage pages, content, products, and services',
      'Structured enquiry inbox so no customer lead is missed',
      'Search-friendly structure, performance tuning, and SSL setup',
    ],
    // {{TODO: Replace with your typical delivery range in weeks}}
    timeline: 'Typical timeline: {{TODO: weeks}} weeks',
    buttonText: 'Discuss your project',
    buttonUrl: '/contact',
    order: 2,
    featured: false,
    isPublished: true,
  },
  {
    id: 'mobile-app',
    title: 'Mobile App Development',
    shortDescription: 'Android and iOS apps built for customer login, orders or bookings, and management.',
    bullets: [
      'Android & iOS app with smooth, responsive performance',
      'Secure user login, profiles, and saved activity',
      'Order placement or booking management with status updates',
      'Admin panel to manage users, listings, and requests',
    ],
    // {{TODO: Replace with your typical delivery range in weeks}}
    timeline: 'Typical timeline: {{TODO: weeks}} weeks',
    buttonText: 'Discuss your project',
    buttonUrl: '/contact',
    order: 3,
    featured: false,
    isPublished: true,
  },
];

export const DEFAULT_HOW_I_WORK = {
  steps: [
    {
      stepNumber: '01',
      title: 'Discovery call: understand your needs and goals',
      description: 'We review how your business operates today, where time is lost, and what the system needs to deliver.',
      order: 1,
      isPublished: true,
    },
    {
      stepNumber: '02',
      title: 'Scope and fixed quote within 48 hours',
      description: 'You receive a written breakdown of features, delivery milestones, and a clear fixed quote within 48 hours.',
      order: 2,
      isPublished: true,
    },
    {
      stepNumber: '03',
      title: 'Weekly build demos',
      description: 'Development moves in weekly iterations so you can test live progress and confirm every detail early.',
      order: 3,
      isPublished: true,
    },
    {
      stepNumber: '04',
      title: 'Launch and 30 days of support',
      description: 'Full production launch, walkthrough for your team, and 30 days of dedicated post-launch support.',
      order: 4,
      isPublished: true,
    },
  ],
  communicationLine: 'One point of contact, WhatsApp/email updates, weekly demo call.',
  isPublished: true,
};

export const DEFAULT_CLOSING_CTA = {
  heading: "Let's Build Something Exceptional Together",
  description: "Need a custom web or mobile system built cleanly from start to finish? Let's talk through your requirements and scope.",
  buttonText: 'Discuss your project',
  buttonUrl: '/contact',
  statusBadgeText: 'Taking on new projects',
  showStatusBadge: true,
  isPublished: true,
};

export const DEFAULT_TESTIMONIALS = [
  {
    id: 'placeholder-client-2',
    clientName: '{{TODO: NAME}}',
    clientTitle: '{{TODO: ROLE}}, {{TODO: BUSINESS}}',
    role: '{{TODO: ROLE}}',
    business: '{{TODO: BUSINESS}}',
    testimonialText: '{{TODO: QUOTE}}',
    clientImageUrl: '',
    rating: 5,
    order: 1,
    isPublished: true,
  },
];

export const DEFAULT_SITE_SETTINGS = {
  metaTitle: 'Mohammed Khizer Shaikh | Web & Mobile Systems for Businesses',
  metaDescription: 'Full-Stack Web & Mobile Developer building web and mobile systems for businesses.',
  footerBio: 'Full-Stack Web & Mobile Developer building web and mobile systems for businesses.',
  contactEmail: 'work.mkhizer@gmail.com',
  contactPhone: '+91 9510865651',
  socialLinks: {
    github: 'https://github.com/mohammadkhizer',
    linkedin: 'https://in.linkedin.com/in/mohammed-khizer-shaikh',
    instagram: 'https://www.instagram.com/khizerrrr11/',
    twitter: '',
  },
  isPublished: true,
};

// ── DATA FETCHERS (WITH CACHE FALLBACK) ───────────────────────────────────────

export async function getHomeHeroData() {
  try {
    await dbConnect();
    const doc = await HomeHero.findOne({ isPublished: true }).lean();
    if (!doc) return DEFAULT_HOME_HERO;
    return {
      tagline: doc.tagline || DEFAULT_HOME_HERO.tagline,
      subtitle: doc.subtitle || DEFAULT_HOME_HERO.subtitle,
      primaryButtonText: doc.primaryButtonText || DEFAULT_HOME_HERO.primaryButtonText,
      primaryButtonUrl: doc.primaryButtonUrl || DEFAULT_HOME_HERO.primaryButtonUrl,
      secondaryButtonText: doc.secondaryButtonText || DEFAULT_HOME_HERO.secondaryButtonText,
      secondaryButtonUrl: doc.secondaryButtonUrl || DEFAULT_HOME_HERO.secondaryButtonUrl,
      cvDownloadUrl: doc.cvDownloadUrl || DEFAULT_HOME_HERO.cvDownloadUrl,
      stats: doc.stats?.length ? doc.stats.map((s: any) => ({ label: s.label, value: s.value })) : DEFAULT_HOME_HERO.stats,
      isPublished: true,
    };
  } catch {
    return DEFAULT_HOME_HERO;
  }
}

export async function getAboutHeroData() {
  try {
    await dbConnect();
    const doc = await AboutHero.findOne({ isPublished: true }).lean();
    if (!doc) return DEFAULT_ABOUT_HERO;
    return {
      pillText: doc.pillText || DEFAULT_ABOUT_HERO.pillText,
      headline: doc.headline || DEFAULT_ABOUT_HERO.headline,
      headlineHighlight: doc.headlineHighlight || DEFAULT_ABOUT_HERO.headlineHighlight,
      subline: doc.subline || DEFAULT_ABOUT_HERO.subline,
      chips: doc.chips?.length ? doc.chips : DEFAULT_ABOUT_HERO.chips,
      primaryButtonText: doc.primaryButtonText || DEFAULT_ABOUT_HERO.primaryButtonText,
      primaryButtonUrl: doc.primaryButtonUrl || DEFAULT_ABOUT_HERO.primaryButtonUrl,
      secondaryButtonText: doc.secondaryButtonText || DEFAULT_ABOUT_HERO.secondaryButtonText,
      secondaryButtonUrl: doc.secondaryButtonUrl || DEFAULT_ABOUT_HERO.secondaryButtonUrl,
      isPublished: true,
    };
  } catch {
    return DEFAULT_ABOUT_HERO;
  }
}

export async function getServicesData() {
  try {
    await dbConnect();
    const docs = await Service.find({ isPublished: true }).sort({ order: 1, createdAt: 1 }).lean();
    if (!docs || docs.length === 0) return DEFAULT_SERVICES;
    return docs.map((d: any) => ({
      id: d.id || String(d._id),
      title: d.title,
      shortDescription: d.shortDescription || '',
      bullets: d.bullets || [],
      timeline: d.timeline || 'Typical timeline: {{TODO: weeks}} weeks',
      buttonText: d.buttonText || 'Discuss your project',
      buttonUrl: d.buttonUrl || '/contact',
      order: d.order ?? 0,
      featured: !!d.featured,
      isPublished: true,
    }));
  } catch {
    return DEFAULT_SERVICES;
  }
}

export async function getHowIWorkData() {
  try {
    await dbConnect();
    const doc = await HowIWork.findOne({ isPublished: true }).lean();
    if (!doc) return DEFAULT_HOW_I_WORK;
    const steps = (doc.steps || [])
      .filter((s: any) => s.isPublished !== false)
      .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
      .map((s: any) => ({
        stepNumber: s.stepNumber,
        title: s.title,
        description: s.description,
        order: s.order,
        isPublished: true,
      }));
    return {
      steps: steps.length ? steps : DEFAULT_HOW_I_WORK.steps,
      communicationLine: doc.communicationLine || DEFAULT_HOW_I_WORK.communicationLine,
      isPublished: true,
    };
  } catch {
    return DEFAULT_HOW_I_WORK;
  }
}

export async function getClosingCtaData() {
  try {
    await dbConnect();
    const doc = await ClosingCta.findOne({ isPublished: true }).lean();
    if (!doc) return DEFAULT_CLOSING_CTA;
    return {
      heading: doc.heading || DEFAULT_CLOSING_CTA.heading,
      description: doc.description || DEFAULT_CLOSING_CTA.description,
      buttonText: doc.buttonText || DEFAULT_CLOSING_CTA.buttonText,
      buttonUrl: doc.buttonUrl || DEFAULT_CLOSING_CTA.buttonUrl,
      statusBadgeText: doc.statusBadgeText || DEFAULT_CLOSING_CTA.statusBadgeText,
      showStatusBadge: doc.showStatusBadge !== false,
      isPublished: true,
    };
  } catch {
    return DEFAULT_CLOSING_CTA;
  }
}

export async function getTestimonialsData() {
  try {
    await dbConnect();
    const docs = await Testimonial.find({ isPublished: true }).sort({ order: 1, createdAt: -1 }).lean();
    if (!docs || docs.length === 0) return DEFAULT_TESTIMONIALS;
    return docs.map((d: any) => ({
      id: d.id || String(d._id),
      clientName: d.clientName,
      clientTitle: d.clientTitle || (d.role && d.business ? `${d.role}, ${d.business}` : d.role || d.business || ''),
      role: d.role || '',
      business: d.business || '',
      testimonialText: d.testimonialText,
      clientImageUrl: d.clientImageUrl || '',
      rating: d.rating || 5,
      order: d.order || 0,
      isPublished: true,
    }));
  } catch {
    return DEFAULT_TESTIMONIALS;
  }
}

export async function getProjectsData() {
  try {
    await dbConnect();
    const docs = await Project.find({ isPublished: true }).sort({ order: 1, createdAt: -1 }).lean();
    if (!docs || docs.length === 0) return [];
    return docs.map((p: any) => ({
      id: p.id || String(p._id),
      title: p.title,
      description: p.description,
      status: p.status || 'Live',
      overview: p.overview || p.description,
      problem: p.problem || '',
      whatIBuilt: p.whatIBuilt || '',
      result: p.result || '',
      projectImageUrl: p.projectImageUrl,
      liveDemoUrl: p.liveDemoUrl,
      githubRepoUrl: p.githubRepoUrl,
      skillIds: p.skillIds || [],
      categorySlug: p.categorySlug,
      architectureDiagram: p.architectureDiagram || null,
      order: p.order || 0,
      isPublished: true,
    }));
  } catch {
    return [];
  }
}

export async function getProjectData(id: string) {
  try {
    await dbConnect();
    let doc = await Project.findOne({ id, isPublished: true }).lean();
    if (!doc) {
      try {
        doc = await Project.findOne({ _id: id, isPublished: true }).lean();
      } catch {
        // Not a Mongo ObjectId
      }
    }
    if (!doc) return null;
    return {
      id: doc.id || String(doc._id),
      title: doc.title,
      description: doc.description,
      status: doc.status || 'Live',
      overview: doc.overview || doc.description,
      problem: doc.problem || '',
      whatIBuilt: doc.whatIBuilt || '',
      result: doc.result || '',
      projectImageUrl: doc.projectImageUrl,
      liveDemoUrl: doc.liveDemoUrl,
      githubRepoUrl: doc.githubRepoUrl,
      skillIds: doc.skillIds || [],
      categorySlug: doc.categorySlug,
      architectureDiagram: doc.architectureDiagram || null,
      order: doc.order || 0,
      isPublished: true,
    };
  } catch {
    return null;
  }
}

export async function getSiteSettingsData() {
  try {
    await dbConnect();
    const doc = await SiteSettings.findOne({ isPublished: true }).lean();
    if (!doc) return DEFAULT_SITE_SETTINGS;
    return {
      metaTitle: doc.metaTitle || DEFAULT_SITE_SETTINGS.metaTitle,
      metaDescription: doc.metaDescription || DEFAULT_SITE_SETTINGS.metaDescription,
      footerBio: doc.footerBio || DEFAULT_SITE_SETTINGS.footerBio,
      contactEmail: doc.contactEmail || DEFAULT_SITE_SETTINGS.contactEmail,
      contactPhone: doc.contactPhone || DEFAULT_SITE_SETTINGS.contactPhone,
      socialLinks: {
        github: doc.socialLinks?.github || DEFAULT_SITE_SETTINGS.socialLinks.github,
        linkedin: doc.socialLinks?.linkedin || DEFAULT_SITE_SETTINGS.socialLinks.linkedin,
        instagram: doc.socialLinks?.instagram || DEFAULT_SITE_SETTINGS.socialLinks.instagram,
        twitter: doc.socialLinks?.twitter || '',
      },
      isPublished: true,
    };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

// ── REVALIDATION UTILITIES ───────────────────────────────────────────────────

export async function revalidatePortfolio() {
  try {
    revalidatePath('/', 'page');
    revalidatePath('/about', 'page');
    revalidatePath('/projects', 'page');
    revalidatePath('/projects/[id]', 'page');
    revalidatePath('/sitemap.xml');
  } catch (error) {
    console.warn('Revalidation warning:', error);
  }
}
