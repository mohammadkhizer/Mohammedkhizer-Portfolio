/**
 * Seed script for CMS content collections.
 * Only seeds collections if they are empty; does not overwrite existing records.
 * Run with: npm run seed:cms
 */

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI is missing in environment. Please define it in your .env file.');
  process.exit(1);
}

// Minimal schemas matching production models
const HomeHeroSchema = new mongoose.Schema({
  id: { type: String, default: 'main-hero' },
  tagline: String,
  subtitle: String,
  primaryButtonText: String,
  primaryButtonUrl: String,
  secondaryButtonText: String,
  secondaryButtonUrl: String,
  cvDownloadUrl: String,
  stats: [{ label: String, value: String }],
  isPublished: { type: Boolean, default: true },
  updatedBy: String,
}, { timestamps: true, collection: 'home_hero' });

const AboutHeroSchema = new mongoose.Schema({
  id: { type: String, default: 'main-about-hero' },
  pillText: String,
  headline: String,
  headlineHighlight: String,
  subline: String,
  chips: [String],
  primaryButtonText: String,
  primaryButtonUrl: String,
  secondaryButtonText: String,
  secondaryButtonUrl: String,
  isPublished: { type: Boolean, default: true },
  updatedBy: String,
}, { timestamps: true, collection: 'about_hero' });

const ServiceSchema = new mongoose.Schema({
  id: String,
  title: String,
  shortDescription: String,
  bullets: [String],
  timeline: String,
  buttonText: String,
  buttonUrl: String,
  order: Number,
  featured: Boolean,
  isPublished: { type: Boolean, default: true },
  updatedBy: String,
}, { timestamps: true, collection: 'services' });

const HowIWorkSchema = new mongoose.Schema({
  id: { type: String, default: 'main-how-i-work' },
  steps: [{
    stepNumber: String,
    title: String,
    description: String,
    order: Number,
    isPublished: Boolean,
  }],
  communicationLine: String,
  isPublished: { type: Boolean, default: true },
  updatedBy: String,
}, { timestamps: true, collection: 'how_i_work' });

const ClosingCtaSchema = new mongoose.Schema({
  id: { type: String, default: 'main-closing-cta' },
  heading: String,
  description: String,
  buttonText: String,
  buttonUrl: String,
  statusBadgeText: String,
  showStatusBadge: Boolean,
  isPublished: { type: Boolean, default: true },
  updatedBy: String,
}, { timestamps: true, collection: 'closing_cta' });

const TestimonialSchema = new mongoose.Schema({
  id: String,
  clientName: String,
  clientTitle: String,
  role: String,
  business: String,
  testimonialText: String,
  clientImageUrl: String,
  rating: Number,
  order: Number,
  isPublished: { type: Boolean, default: true },
  updatedBy: String,
}, { timestamps: true, collection: 'testimonials' });

const ProjectSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  projectImageUrl: String,
  liveDemoUrl: String,
  githubRepoUrl: String,
  skillIds: [String],
  categorySlug: String,
  status: String,
  overview: String,
  problem: String,
  whatIBuilt: String,
  result: String,
  architectureDiagram: {
    title: String,
    caption: String,
    nodes: [{ id: String, label: String, sublabel: String, tech: String }],
    arrows: [{ from: String, to: String }],
  },
  order: Number,
  isPublished: { type: Boolean, default: true },
  updatedBy: String,
}, { timestamps: true, collection: 'projects' });

const SiteSettingsSchema = new mongoose.Schema({
  id: { type: String, default: 'main-site-settings' },
  metaTitle: String,
  metaDescription: String,
  footerBio: String,
  contactEmail: String,
  contactPhone: String,
  socialLinks: {
    github: String,
    linkedin: String,
    instagram: String,
    twitter: String,
  },
  isPublished: { type: Boolean, default: true },
  updatedBy: String,
}, { timestamps: true, collection: 'site_settings' });

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected.');

  const HomeHero = mongoose.model('HomeHero', HomeHeroSchema);
  const AboutHero = mongoose.model('AboutHero', AboutHeroSchema);
  const Service = mongoose.model('Service', ServiceSchema);
  const HowIWork = mongoose.model('HowIWork', HowIWorkSchema);
  const ClosingCta = mongoose.model('ClosingCta', ClosingCtaSchema);
  const Testimonial = mongoose.model('Testimonial', TestimonialSchema);
  const Project = mongoose.model('Project', ProjectSchema);
  const SiteSettings = mongoose.model('SiteSettings', SiteSettingsSchema);

  // 1. HomeHero
  const homeHeroCount = await HomeHero.countDocuments();
  if (homeHeroCount === 0) {
    console.log('Seeding HomeHero...');
    await HomeHero.create({
      id: 'main-hero',
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
      updatedBy: 'seed-script',
    });
    console.log('✓ HomeHero seeded.');
  } else {
    console.log('✓ HomeHero already has records. Skipped.');
  }

  // 2. AboutHero
  const aboutHeroCount = await AboutHero.countDocuments();
  if (aboutHeroCount === 0) {
    console.log('Seeding AboutHero...');
    await AboutHero.create({
      id: 'main-about-hero',
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
      updatedBy: 'seed-script',
    });
    console.log('✓ AboutHero seeded.');
  } else {
    console.log('✓ AboutHero already has records. Skipped.');
  }

  // 3. Services
  const servicesCount = await Service.countDocuments();
  if (servicesCount === 0) {
    console.log('Seeding Services...');
    await Service.create([
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
        timeline: 'Typical timeline: {{TODO: weeks}} weeks',
        buttonText: 'Discuss your project',
        buttonUrl: '/contact',
        order: 1,
        featured: true,
        isPublished: true,
        updatedBy: 'seed-script',
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
        timeline: 'Typical timeline: {{TODO: weeks}} weeks',
        buttonText: 'Discuss your project',
        buttonUrl: '/contact',
        order: 2,
        featured: false,
        isPublished: true,
        updatedBy: 'seed-script',
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
        timeline: 'Typical timeline: {{TODO: weeks}} weeks',
        buttonText: 'Discuss your project',
        buttonUrl: '/contact',
        order: 3,
        featured: false,
        isPublished: true,
        updatedBy: 'seed-script',
      },
    ]);
    console.log('✓ Services seeded.');
  } else {
    console.log('✓ Services already have records. Skipped.');
  }

  // 4. HowIWork
  const howIWorkCount = await HowIWork.countDocuments();
  if (howIWorkCount === 0) {
    console.log('Seeding HowIWork...');
    await HowIWork.create({
      id: 'main-how-i-work',
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
      updatedBy: 'seed-script',
    });
    console.log('✓ HowIWork seeded.');
  } else {
    console.log('✓ HowIWork already has records. Skipped.');
  }

  // 5. ClosingCta
  const ctaCount = await ClosingCta.countDocuments();
  if (ctaCount === 0) {
    console.log('Seeding ClosingCta...');
    await ClosingCta.create({
      id: 'main-closing-cta',
      heading: "Let's Build Something Exceptional Together",
      description: "Need a custom web or mobile system built cleanly from start to finish? Let's talk through your requirements and scope.",
      buttonText: 'Discuss your project',
      buttonUrl: '/contact',
      statusBadgeText: 'Taking on new projects',
      showStatusBadge: true,
      isPublished: true,
      updatedBy: 'seed-script',
    });
    console.log('✓ ClosingCta seeded.');
  } else {
    console.log('✓ ClosingCta already has records. Skipped.');
  }

  // 6. Testimonials
  const testCount = await Testimonial.countDocuments();
  if (testCount === 0) {
    console.log('Seeding Testimonials...');
    await Testimonial.create([
      {
        id: 'client-real-1',
        clientName: 'Client Partner',
        clientTitle: 'Operations & Management',
        role: 'Operations Lead',
        business: 'Enterprise Logistics',
        testimonialText: 'Delivered an exceptional system that automated our tracking and eliminated invoicing delays completely.',
        rating: 5,
        order: 1,
        isPublished: true,
        updatedBy: 'seed-script',
      },
      {
        id: 'client-placeholder-2',
        clientName: '{{NAME}}',
        clientTitle: '{{ROLE}}, {{BUSINESS}}',
        role: '{{ROLE}}',
        business: '{{BUSINESS}}',
        testimonialText: '{{QUOTE}}',
        rating: 5,
        order: 2,
        isPublished: true,
        updatedBy: 'seed-script',
      },
    ]);
    console.log('✓ Testimonials seeded.');
  } else {
    console.log('✓ Testimonials already have records. Skipped.');
  }

  // 7. SiteSettings
  const settingsCount = await SiteSettings.countDocuments();
  if (settingsCount === 0) {
    console.log('Seeding SiteSettings...');
    await SiteSettings.create({
      id: 'main-site-settings',
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
      updatedBy: 'seed-script',
    });
    console.log('✓ SiteSettings seeded.');
  } else {
    console.log('✓ SiteSettings already have records. Skipped.');
  }

  console.log('✨ All CMS collections verified and seeded where needed.');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed script error:', err);
  process.exit(1);
});
