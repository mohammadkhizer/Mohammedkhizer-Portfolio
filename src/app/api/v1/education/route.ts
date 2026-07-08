import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Education from '@/models/Education';
import { isAdmin } from '@/lib/security';

export async function GET() {
  try {
    await dbConnect();
    const educations = await Education.find().sort({ startDate: -1 }).lean();
    return NextResponse.json(educations);
  } catch (error) {
    console.error('Failed to fetch education:', error);
    return NextResponse.json({ error: 'Failed to fetch education' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    await dbConnect();
    const newEducation = await Education.create(data);
    return NextResponse.json(newEducation);
  } catch (error) {
    console.error('Failed to create education entry:', error);
    return NextResponse.json({ error: 'Failed to create education entry' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    if (!data.id) {
      return NextResponse.json({ error: 'Missing education ID' }, { status: 400 });
    }

    await dbConnect();
    const result = await Education.updateOne({ id: data.id }, { $set: data });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Education entry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update education entry:', error);
    return NextResponse.json({ error: 'Failed to update education entry' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing education ID' }, { status: 400 });
    }

    await dbConnect();
    const result = await Education.deleteOne({ id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Education entry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete education entry:', error);
    return NextResponse.json({ error: 'Failed to delete education entry' }, { status: 500 });
  }
}
