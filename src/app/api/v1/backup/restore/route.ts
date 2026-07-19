import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { isAdmin } from '@/lib/security';
import Project from '@/models/Project';
import Skill from '@/models/Skill';
import Experience from '@/models/Experience';
import Education from '@/models/Education';
import Certification from '@/models/Certification';
import Achievement from '@/models/Achievement';
import Testimonial from '@/models/Testimonial';
import UserProfile from '@/models/UserProfile';
import ProjectCategory from '@/models/ProjectCategory';
import ContactSubmission from '@/models/ContactSubmission';

// Map collection keys to their Mongoose models
const COLLECTION_MAP: Record<string, any> = {
  projects: Project,
  skills: Skill,
  experiences: Experience,
  education: Education,
  certifications: Certification,
  achievements: Achievement,
  testimonials: Testimonial,
  userProfiles: UserProfile,
  projectCategories: ProjectCategory,
  contactSubmissions: ContactSubmission,
};

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let backup: any;
  try {
    backup = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  // Basic validation: must have _meta and at least one known collection key
  if (!backup?._meta?.backupDate || !backup?._meta?.version) {
    return NextResponse.json(
      { error: 'Invalid backup file: missing _meta block. Make sure you upload a file exported from this system.' },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    const results: Record<string, { restored: number; error?: string }> = {};

    for (const [key, Model] of Object.entries(COLLECTION_MAP)) {
      try {
        const records: any[] = backup[key];

        if (!Array.isArray(records)) {
          results[key] = { restored: 0, error: 'Missing or invalid collection in backup' };
          continue;
        }

        // Strip Mongoose internal fields that would conflict on re-insert
        const cleaned = records.map(({ _id, __v, ...rest }: any) => rest);

        await Model.deleteMany({});
        if (cleaned.length > 0) {
          await Model.insertMany(cleaned, { ordered: false });
        }

        results[key] = { restored: cleaned.length };
      } catch (colErr: any) {
        console.error(`Failed to restore collection "${key}":`, colErr);
        results[key] = { restored: 0, error: colErr.message || 'Unknown error' };
      }
    }

    const totalRestored = Object.values(results).reduce((acc, r) => acc + r.restored, 0);

    return NextResponse.json({
      success: true,
      totalRestored,
      results,
      restoredAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Restore failed:', error);
    return NextResponse.json({ error: 'Restore failed: ' + (error.message || 'Unknown error') }, { status: 500 });
  }
}
