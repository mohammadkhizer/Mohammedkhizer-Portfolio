import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-guard';
import dbConnect from '@/lib/mongodb';
import HomeHero from '@/models/HomeHero';
import AboutHero from '@/models/AboutHero';
import Service from '@/models/Service';
import HowIWork from '@/models/HowIWork';
import ClosingCta from '@/models/ClosingCta';
import Testimonial from '@/models/Testimonial';
import Project from '@/models/Project';
import SiteSettings from '@/models/SiteSettings';
import {
  DEFAULT_HOME_HERO,
  DEFAULT_ABOUT_HERO,
  DEFAULT_SERVICES,
  DEFAULT_HOW_I_WORK,
  DEFAULT_CLOSING_CTA,
  DEFAULT_TESTIMONIALS,
  DEFAULT_SITE_SETTINGS,
} from '@/lib/cms';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ module: string }> }
) {
  try {
    await requireAdmin();
    const { module: mod } = await params;
    await dbConnect();

    switch (mod) {
      case 'home-hero': {
        const doc = await HomeHero.findOne().lean();
        return NextResponse.json({ data: doc || DEFAULT_HOME_HERO });
      }
      case 'about-hero': {
        const doc = await AboutHero.findOne().lean();
        return NextResponse.json({ data: doc || DEFAULT_ABOUT_HERO });
      }
      case 'services': {
        const docs = await Service.find().sort({ order: 1, createdAt: 1 }).lean();
        return NextResponse.json({ data: docs.length ? docs : DEFAULT_SERVICES });
      }
      case 'how-i-work': {
        const doc = await HowIWork.findOne().lean();
        return NextResponse.json({ data: doc || DEFAULT_HOW_I_WORK });
      }
      case 'closing-cta': {
        const doc = await ClosingCta.findOne().lean();
        return NextResponse.json({ data: doc || DEFAULT_CLOSING_CTA });
      }
      case 'testimonials': {
        const docs = await Testimonial.find().sort({ order: 1, createdAt: -1 }).lean();
        return NextResponse.json({ data: docs.length ? docs : DEFAULT_TESTIMONIALS });
      }
      case 'projects': {
        const docs = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
        return NextResponse.json({ data: docs });
      }
      case 'site-settings': {
        const doc = await SiteSettings.findOne().lean();
        return NextResponse.json({ data: doc || DEFAULT_SITE_SETTINGS });
      }
      default:
        return NextResponse.json({ error: 'Unknown CMS module' }, { status: 404 });
    }
  } catch (error: any) {
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('CMS fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch CMS module' }, { status: 500 });
  }
}
