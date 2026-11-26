'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import dbConnect from '@/lib/mongodb';
import { requireAdmin, logAuditAction } from '@/lib/auth-guard';
import HomeHero from '@/models/HomeHero';
import AboutHero from '@/models/AboutHero';
import Service from '@/models/Service';
import HowIWork from '@/models/HowIWork';
import ClosingCta from '@/models/ClosingCta';
import Testimonial from '@/models/Testimonial';
import Project from '@/models/Project';
import SiteSettings from '@/models/SiteSettings';

function sanitizeText(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .trim();
}

// -----------------------------------------------------------------------------
// 1. HOME HERO ACTIONS
// -----------------------------------------------------------------------------
const HomeHeroSchema = z.object({
  tagline: z.string().min(1).max(100),
  subtitle: z.string().min(1).max(200),
  primaryButtonText: z.string().min(1).max(50),
  primaryButtonUrl: z.string().min(1).max(100),
  secondaryButtonText: z.string().min(1).max(50),
  secondaryButtonUrl: z.string().min(1).max(100),
  cvDownloadUrl: z.string().max(300).optional(),
  stats: z.array(
    z.object({
      label: z.string().min(1).max(50),
      value: z.string().min(1).max(50),
    })
  ).min(1),
  isPublished: z.boolean().default(true),
});

export async function saveHomeHeroAction(formData: z.infer<typeof HomeHeroSchema>) {
  const admin = await requireAdmin();
  const parsed = HomeHeroSchema.parse(formData);

  await dbConnect();
  let doc = await HomeHero.findOne();

  const data = {
    tagline: sanitizeText(parsed.tagline),
    subtitle: sanitizeText(parsed.subtitle),
    primaryButtonText: sanitizeText(parsed.primaryButtonText),
    primaryButtonUrl: sanitizeText(parsed.primaryButtonUrl),
    secondaryButtonText: sanitizeText(parsed.secondaryButtonText),
    secondaryButtonUrl: sanitizeText(parsed.secondaryButtonUrl),
    cvDownloadUrl: sanitizeText(parsed.cvDownloadUrl || ''),
    stats: parsed.stats.map(s => ({
      label: sanitizeText(s.label),
      value: sanitizeText(s.value),
    })),
    isPublished: parsed.isPublished,
    updatedBy: admin.email,
  };

  if (doc) {
    Object.assign(doc, data);
    await doc.save();
  } else {
    await HomeHero.create({
      id: 'main-hero',
      ...data,
    });
  }

  await logAuditAction('UPDATE_HOME_HERO', admin.email, { fields: Object.keys(data) });
  revalidatePath('/');
  return { success: true };
}

// -----------------------------------------------------------------------------
// 2. ABOUT HERO ACTIONS
// -----------------------------------------------------------------------------
const AboutHeroSchema = z.object({
  pillText: z.string().min(1).max(100),
  headline: z.string().min(1).max(150),
  headlineHighlight: z.string().min(1).max(150),
  subline: z.string().min(1).max(300),
  chips: z.array(z.string().min(1).max(100)),
  primaryButtonText: z.string().min(1).max(50),
  primaryButtonUrl: z.string().min(1).max(100),
  secondaryButtonText: z.string().min(1).max(50),
  secondaryButtonUrl: z.string().min(1).max(100),
  isPublished: z.boolean().default(true),
});

export async function saveAboutHeroAction(formData: z.infer<typeof AboutHeroSchema>) {
  const admin = await requireAdmin();
  const parsed = AboutHeroSchema.parse(formData);

  await dbConnect();
  let doc = await AboutHero.findOne();

  const data = {
    pillText: sanitizeText(parsed.pillText),
    headline: sanitizeText(parsed.headline),
    headlineHighlight: sanitizeText(parsed.headlineHighlight),
    subline: sanitizeText(parsed.subline),
    chips: parsed.chips.map(c => sanitizeText(c)),
    primaryButtonText: sanitizeText(parsed.primaryButtonText),
    primaryButtonUrl: sanitizeText(parsed.primaryButtonUrl),
    secondaryButtonText: sanitizeText(parsed.secondaryButtonText),
    secondaryButtonUrl: sanitizeText(parsed.secondaryButtonUrl),
    isPublished: parsed.isPublished,
    updatedBy: admin.email,
  };

  if (doc) {
    Object.assign(doc, data);
    await doc.save();
  } else {
    await AboutHero.create({
      id: 'main-about-hero',
      ...data,
    });
  }

  await logAuditAction('UPDATE_ABOUT_HERO', admin.email, { fields: Object.keys(data) });
  revalidatePath('/about');
  return { success: true };
}

// -----------------------------------------------------------------------------
// 3. SERVICES ACTIONS
// -----------------------------------------------------------------------------
const ServiceSchema = z.object({
  _id: z.string().optional(),
  id: z.string().optional(),
  title: z.string().min(1).max(120),
  shortDescription: z.string().max(300).optional(),
  bullets: z.array(z.string().min(1).max(200)).min(1),
  timeline: z.string().min(1).max(100),
  buttonText: z.string().min(1).max(50),
  buttonUrl: z.string().min(1).max(100),
  order: z.number().int().default(0),
  featured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
});

export async function saveServiceAction(formData: z.infer<typeof ServiceSchema>) {
  const admin = await requireAdmin();
  const parsed = ServiceSchema.parse(formData);

  await dbConnect();
  const serviceId = parsed.id || parsed.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const data = {
    id: serviceId,
    title: sanitizeText(parsed.title),
    shortDescription: sanitizeText(parsed.shortDescription || ''),
    bullets: parsed.bullets.map(b => sanitizeText(b)),
    timeline: sanitizeText(parsed.timeline),
    buttonText: sanitizeText(parsed.buttonText),
    buttonUrl: sanitizeText(parsed.buttonUrl),
    order: parsed.order,
    featured: parsed.featured,
    isPublished: parsed.isPublished,
    updatedBy: admin.email,
  };

  if (parsed._id) {
    await Service.findByIdAndUpdate(parsed._id, data);
  } else {
    await Service.findOneAndUpdate({ id: serviceId }, data, { upsert: true, new: true });
  }

  await logAuditAction('SAVE_SERVICE', admin.email, { title: parsed.title });
  revalidatePath('/');
  return { success: true };
}

export async function deleteServiceAction(idOrMongoId: string) {
  const admin = await requireAdmin();
  await dbConnect();
  await Service.findOneAndDelete({
    $or: [{ _id: idOrMongoId.match(/^[0-9a-fA-F]{24}$/) ? idOrMongoId : null }, { id: idOrMongoId }],
  });
  await logAuditAction('DELETE_SERVICE', admin.email, { target: idOrMongoId });
  revalidatePath('/');
  return { success: true };
}

export async function reorderServicesAction(orderedIds: string[]) {
  const admin = await requireAdmin();
  await dbConnect();
  await Promise.all(
    orderedIds.map((id, index) =>
      Service.findOneAndUpdate(
        { $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { id }] },
        { order: index, updatedBy: admin.email }
      )
    )
  );
  await logAuditAction('REORDER_SERVICES', admin.email, { count: orderedIds.length });
  revalidatePath('/');
  return { success: true };
}

// -----------------------------------------------------------------------------
// 4. HOW I WORK ACTIONS
// -----------------------------------------------------------------------------
const HowIWorkSchema = z.object({
  steps: z.array(
    z.object({
      stepNumber: z.string().min(1).max(20),
      title: z.string().min(1).max(150),
      description: z.string().min(1).max(400),
      order: z.number().int().default(0),
      isPublished: z.boolean().default(true),
    })
  ).min(1),
  communicationLine: z.string().min(1).max(300),
  isPublished: z.boolean().default(true),
});

export async function saveHowIWorkAction(formData: z.infer<typeof HowIWorkSchema>) {
  const admin = await requireAdmin();
  const parsed = HowIWorkSchema.parse(formData);

  await dbConnect();
  let doc = await HowIWork.findOne();

  const sanitizedSteps = parsed.steps.map((s, idx) => ({
    stepNumber: sanitizeText(s.stepNumber || `0${idx + 1}`),
    title: sanitizeText(s.title),
    description: sanitizeText(s.description),
    order: s.order ?? idx + 1,
    isPublished: s.isPublished !== false,
  }));

  const data = {
    steps: sanitizedSteps,
    communicationLine: sanitizeText(parsed.communicationLine),
    isPublished: parsed.isPublished,
    updatedBy: admin.email,
  };

  if (doc) {
    Object.assign(doc, data);
    await doc.save();
  } else {
    await HowIWork.create({
      id: 'main-how-i-work',
      ...data,
    });
  }

  await logAuditAction('UPDATE_HOW_I_WORK', admin.email, { count: sanitizedSteps.length });
  revalidatePath('/');
  return { success: true };
}

// -----------------------------------------------------------------------------
// 5. CLOSING CTA ACTIONS
// -----------------------------------------------------------------------------
const ClosingCtaSchema = z.object({
  heading: z.string().min(1).max(150),
  description: z.string().max(400).optional(),
  buttonText: z.string().min(1).max(50),
  buttonUrl: z.string().min(1).max(100),
  statusBadgeText: z.string().min(1).max(80),
  showStatusBadge: z.boolean().default(true),
  isPublished: z.boolean().default(true),
});

export async function saveClosingCtaAction(formData: z.infer<typeof ClosingCtaSchema>) {
  const admin = await requireAdmin();
  const parsed = ClosingCtaSchema.parse(formData);

  await dbConnect();
  let doc = await ClosingCta.findOne();

  const data = {
    heading: sanitizeText(parsed.heading),
    description: sanitizeText(parsed.description || ''),
    buttonText: sanitizeText(parsed.buttonText),
    buttonUrl: sanitizeText(parsed.buttonUrl),
    statusBadgeText: sanitizeText(parsed.statusBadgeText),
    showStatusBadge: parsed.showStatusBadge,
    isPublished: parsed.isPublished,
    updatedBy: admin.email,
  };

  if (doc) {
    Object.assign(doc, data);
    await doc.save();
  } else {
    await ClosingCta.create({
      id: 'main-closing-cta',
      ...data,
    });
  }

  await logAuditAction('UPDATE_CLOSING_CTA', admin.email, { heading: parsed.heading });
  revalidatePath('/');
  return { success: true };
}

// -----------------------------------------------------------------------------
// 6. TESTIMONIALS ACTIONS
// -----------------------------------------------------------------------------
const TestimonialSchema = z.object({
  _id: z.string().optional(),
  id: z.string().optional(),
  clientName: z.string().min(1).max(100),
  clientTitle: z.string().max(100).optional(),
  role: z.string().max(100).optional(),
  business: z.string().max(100).optional(),
  testimonialText: z.string().min(1).max(800),
  clientImageUrl: z.string().max(300).optional(),
  rating: z.number().int().min(1).max(5).default(5),
  order: z.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export async function saveTestimonialAction(formData: z.infer<typeof TestimonialSchema>) {
  const admin = await requireAdmin();
  const parsed = TestimonialSchema.parse(formData);

  await dbConnect();
  const testId = parsed.id || parsed.clientName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `testimonial-${Date.now()}`;

  const data = {
    id: testId,
    clientName: sanitizeText(parsed.clientName),
    clientTitle: sanitizeText(parsed.clientTitle || ''),
    role: sanitizeText(parsed.role || ''),
    business: sanitizeText(parsed.business || ''),
    testimonialText: sanitizeText(parsed.testimonialText),
    clientImageUrl: sanitizeText(parsed.clientImageUrl || ''),
    rating: parsed.rating,
    order: parsed.order,
    isPublished: parsed.isPublished,
    updatedBy: admin.email,
  };

  if (parsed._id) {
    await Testimonial.findByIdAndUpdate(parsed._id, data);
  } else {
    await Testimonial.findOneAndUpdate({ id: testId }, data, { upsert: true, new: true });
  }

  await logAuditAction('SAVE_TESTIMONIAL', admin.email, { clientName: parsed.clientName });
  revalidatePath('/');
  return { success: true };
}

export async function deleteTestimonialAction(idOrMongoId: string) {
  const admin = await requireAdmin();
  await dbConnect();
  await Testimonial.findOneAndDelete({
    $or: [{ _id: idOrMongoId.match(/^[0-9a-fA-F]{24}$/) ? idOrMongoId : null }, { id: idOrMongoId }],
  });
  await logAuditAction('DELETE_TESTIMONIAL', admin.email, { target: idOrMongoId });
  revalidatePath('/');
  return { success: true };
}

export async function reorderTestimonialsAction(orderedIds: string[]) {
  const admin = await requireAdmin();
  await dbConnect();
  await Promise.all(
    orderedIds.map((id, index) =>
      Testimonial.findOneAndUpdate(
        { $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { id }] },
        { order: index, updatedBy: admin.email }
      )
    )
  );
  await logAuditAction('REORDER_TESTIMONIALS', admin.email, { count: orderedIds.length });
  revalidatePath('/');
  return { success: true };
}

// -----------------------------------------------------------------------------
// 7. PROJECTS / CASE STUDIES ACTIONS
// -----------------------------------------------------------------------------
const StructuredNodeSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  sublabel: z.string().optional(),
  tech: z.string().optional(),
});

const StructuredArrowSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
});

const ArchitectureDiagramSchema = z.object({
  title: z.string().optional(),
  caption: z.string().optional(),
  nodes: z.array(StructuredNodeSchema).default([]),
  arrows: z.array(StructuredArrowSchema).default([]),
}).optional().nullable();

const ProjectSchema = z.object({
  _id: z.string().optional(),
  id: z.string().min(1).max(100),
  title: z.string().min(1).max(150),
  description: z.string().max(400).optional(),
  projectImageUrl: z.string().max(300).optional(),
  liveDemoUrl: z.string().max(300).optional(),
  githubRepoUrl: z.string().max(300).optional(),
  skillIds: z.array(z.string()).default([]),
  categorySlug: z.string().default('web'),
  status: z.enum(['Live', 'In development']).default('Live'),
  overview: z.string().max(600).optional(),
  problem: z.string().max(1000).optional(),
  whatIBuilt: z.string().max(1000).optional(),
  result: z.string().max(1000).optional(),
  architectureDiagram: ArchitectureDiagramSchema,
  order: z.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export async function saveProjectAction(formData: z.infer<typeof ProjectSchema>) {
  const admin = await requireAdmin();
  const parsed = ProjectSchema.parse(formData);

  await dbConnect();

  const data = {
    id: sanitizeText(parsed.id),
    title: sanitizeText(parsed.title),
    description: sanitizeText(parsed.description || parsed.overview || ''),
    projectImageUrl: sanitizeText(parsed.projectImageUrl || ''),
    liveDemoUrl: sanitizeText(parsed.liveDemoUrl || ''),
    githubRepoUrl: sanitizeText(parsed.githubRepoUrl || ''),
    skillIds: parsed.skillIds.map(s => sanitizeText(s)),
    categorySlug: sanitizeText(parsed.categorySlug),
    status: parsed.status,
    overview: sanitizeText(parsed.overview || ''),
    problem: sanitizeText(parsed.problem || ''),
    whatIBuilt: sanitizeText(parsed.whatIBuilt || ''),
    result: sanitizeText(parsed.result || ''),
    architectureDiagram: parsed.architectureDiagram || null,
    order: parsed.order,
    isPublished: parsed.isPublished,
    updatedBy: admin.email,
  };

  if (parsed._id) {
    await Project.findByIdAndUpdate(parsed._id, data);
  } else {
    await Project.findOneAndUpdate({ id: parsed.id }, data, { upsert: true, new: true });
  }

  await logAuditAction('SAVE_PROJECT', admin.email, { title: parsed.title, status: parsed.status });
  revalidatePath('/');
  revalidatePath('/projects');
  revalidatePath(`/projects/${parsed.id}`);
  return { success: true };
}

export async function deleteProjectAction(idOrMongoId: string) {
  const admin = await requireAdmin();
  await dbConnect();
  await Project.findOneAndDelete({
    $or: [{ _id: idOrMongoId.match(/^[0-9a-fA-F]{24}$/) ? idOrMongoId : null }, { id: idOrMongoId }],
  });
  await logAuditAction('DELETE_PROJECT', admin.email, { target: idOrMongoId });
  revalidatePath('/');
  revalidatePath('/projects');
  return { success: true };
}

export async function reorderProjectsAction(orderedIds: string[]) {
  const admin = await requireAdmin();
  await dbConnect();
  await Promise.all(
    orderedIds.map((id, index) =>
      Project.findOneAndUpdate(
        { $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { id }] },
        { order: index, updatedBy: admin.email }
      )
    )
  );
  await logAuditAction('REORDER_PROJECTS', admin.email, { count: orderedIds.length });
  revalidatePath('/');
  revalidatePath('/projects');
  return { success: true };
}

// -----------------------------------------------------------------------------
// 8. SITE SETTINGS ACTIONS
// -----------------------------------------------------------------------------
const SiteSettingsSchema = z.object({
  metaTitle: z.string().min(1).max(120),
  metaDescription: z.string().min(1).max(300),
  footerBio: z.string().min(1).max(300),
  contactEmail: z.string().email(),
  contactPhone: z.string().max(50).optional(),
  socialLinks: z.object({
    github: z.string().max(200).optional(),
    linkedin: z.string().max(200).optional(),
    instagram: z.string().max(200).optional(),
    twitter: z.string().max(200).optional(),
  }),
  isPublished: z.boolean().default(true),
});

export async function saveSiteSettingsAction(formData: z.infer<typeof SiteSettingsSchema>) {
  const admin = await requireAdmin();
  const parsed = SiteSettingsSchema.parse(formData);

  await dbConnect();
  let doc = await SiteSettings.findOne();

  const data = {
    metaTitle: sanitizeText(parsed.metaTitle),
    metaDescription: sanitizeText(parsed.metaDescription),
    footerBio: sanitizeText(parsed.footerBio),
    contactEmail: sanitizeText(parsed.contactEmail),
    contactPhone: sanitizeText(parsed.contactPhone || ''),
    socialLinks: {
      github: sanitizeText(parsed.socialLinks.github || ''),
      linkedin: sanitizeText(parsed.socialLinks.linkedin || ''),
      instagram: sanitizeText(parsed.socialLinks.instagram || ''),
      twitter: sanitizeText(parsed.socialLinks.twitter || ''),
    },
    isPublished: parsed.isPublished,
    updatedBy: admin.email,
  };

  if (doc) {
    Object.assign(doc, data);
    await doc.save();
  } else {
    await SiteSettings.create({
      id: 'main-site-settings',
      ...data,
    });
  }

  await logAuditAction('UPDATE_SITE_SETTINGS', admin.email, { metaTitle: parsed.metaTitle });
  revalidatePath('/', 'layout');
  return { success: true };
}
