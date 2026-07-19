import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
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

// Map of collection key → { model, collectionName }
const COLLECTION_DEFS: Record<string, { model: any; collectionName: string }> = {
  projects:           { model: Project,          collectionName: 'projects' },
  skills:             { model: Skill,            collectionName: 'skills' },
  experiences:        { model: Experience,       collectionName: 'experiences' },
  education:          { model: Education,        collectionName: 'education' },
  certifications:     { model: Certification,    collectionName: 'certifications' },
  achievements:       { model: Achievement,      collectionName: 'achievements' },
  testimonials:       { model: Testimonial,      collectionName: 'testimonials' },
  userProfiles:       { model: UserProfile,      collectionName: 'userprofiles' },
  projectCategories:  { model: ProjectCategory,  collectionName: 'projectcategories' },
  contactSubmissions: { model: ContactSubmission, collectionName: 'contactsubmissions' },
};

type TransferDirection = 'push' | 'pull';

/**
 * POST /api/v1/backup/db-transfer
 *
 * Body: { targetUri: string; direction: "push" | "pull" }
 *   push → current DB → target DB
 *   pull → target DB → current DB
 */
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { targetUri?: string; direction?: TransferDirection };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const { targetUri, direction } = body;

  if (!targetUri || typeof targetUri !== 'string' || !targetUri.startsWith('mongodb')) {
    return NextResponse.json(
      { error: 'Invalid or missing targetUri. Must be a valid MongoDB connection string.' },
      { status: 400 }
    );
  }

  if (direction !== 'push' && direction !== 'pull') {
    return NextResponse.json(
      { error: 'Invalid direction. Must be "push" or "pull".' },
      { status: 400 }
    );
  }

  // ── Connect to both databases ──────────────────────────────────────────────

  let targetConn: mongoose.Connection | null = null;

  try {
    // Ensure the primary (current) DB connection is alive
    await dbConnect();

    // Open a separate connection to the target URI
    targetConn = await mongoose
      .createConnection(targetUri, { bufferCommands: false })
      .asPromise();

    const results: Record<string, { transferred: number; error?: string }> = {};

    for (const [key, { model, collectionName }] of Object.entries(COLLECTION_DEFS)) {
      try {
        if (direction === 'push') {
          // Read all documents from the current (source) DB
          const docs = await model.find().lean();

          // Get a raw collection handle on the target connection
          const targetCollection = targetConn.collection(collectionName);

          // Wipe the target collection and re-insert
          await targetCollection.deleteMany({});
          if (docs.length > 0) {
            await targetCollection.insertMany(docs as any[], { ordered: false });
          }

          results[key] = { transferred: docs.length };
        } else {
          // pull: read from target, write to current DB

          const sourceCollection = targetConn.collection(collectionName);
          const docs = await sourceCollection.find({}).toArray();

          // Strip _id to let Mongoose re-assign
          const cleaned = docs.map(({ _id, __v, ...rest }: any) => rest);

          await model.deleteMany({});
          if (cleaned.length > 0) {
            await model.insertMany(cleaned, { ordered: false });
          }

          results[key] = { transferred: cleaned.length };
        }
      } catch (colErr: any) {
        console.error(`DB transfer failed for collection "${key}":`, colErr);
        results[key] = { transferred: 0, error: colErr.message || 'Unknown error' };
      }
    }

    const totalTransferred = Object.values(results).reduce(
      (acc, r) => acc + r.transferred,
      0
    );

    return NextResponse.json({
      success: true,
      direction,
      totalTransferred,
      results,
      transferredAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('DB transfer failed:', err);
    return NextResponse.json(
      { error: 'Transfer failed: ' + (err.message || 'Unknown error') },
      { status: 500 }
    );
  } finally {
    // Always close the secondary connection to avoid leaks
    if (targetConn) {
      try {
        await targetConn.close();
      } catch {
        // ignore close errors
      }
    }
  }
}
