import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import UserProfile from '@/models/UserProfile';
import { isAdmin } from '@/lib/security';

export async function GET() {
  try {
    await dbConnect();
    // Fetch user profiles. There should be only one main-profile.
    const profiles = await UserProfile.find().lean();
    return NextResponse.json(profiles);
  } catch (error) {
    console.error('Failed to fetch user profiles:', error);
    return NextResponse.json({ error: 'Failed to fetch user profiles' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    await dbConnect();
    
    // We can use a fixed ID for the main profile to prevent duplicates
    const id = data.id || 'main-profile';
    const profile = await UserProfile.findOneAndUpdate(
      { id },
      { ...data, id },
      { upsert: true, new: true }
    );
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Failed to save profile:', error);
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    if (!data.id) {
      return NextResponse.json({ error: 'Missing profile ID' }, { status: 400 });
    }

    await dbConnect();
    const result = await UserProfile.updateOne({ id: data.id }, { $set: data });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
