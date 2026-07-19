import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Achievement from '@/models/Achievement';
import { isAdmin } from '@/lib/security';

export async function GET() {
  try {
    await dbConnect();
    const achievements = await Achievement.find().sort({ date: -1 }).lean();
    return NextResponse.json(achievements);
  } catch (error) {
    console.error('Failed to fetch achievements:', error);
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    await dbConnect();
    const newAchievement = await Achievement.create(data);
    return NextResponse.json(newAchievement);
  } catch (error) {
    console.error('Failed to create achievement:', error);
    return NextResponse.json({ error: 'Failed to create achievement' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    if (!data.id) {
      return NextResponse.json({ error: 'Missing achievement ID' }, { status: 400 });
    }

    await dbConnect();
    const result = await Achievement.updateOne({ id: data.id }, { $set: data });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update achievement:', error);
    return NextResponse.json({ error: 'Failed to update achievement' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing achievement ID' }, { status: 400 });
    }

    await dbConnect();
    const result = await Achievement.deleteOne({ id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete achievement:', error);
    return NextResponse.json({ error: 'Failed to delete achievement' }, { status: 500 });
  }
}
