import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ContactSubmission from '@/models/ContactSubmission';
import { isAdmin } from '@/lib/security';

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const submissions = await ContactSubmission.find().sort({ submissionDate: -1 }).lean();
    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Failed to fetch contact submissions:', error);
    return NextResponse.json({ error: 'Failed to fetch contact submissions' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    await dbConnect();
    const newSubmission = await ContactSubmission.create(data);
    return NextResponse.json(newSubmission);
  } catch (error) {
    console.error('Failed to create contact submission:', error);
    return NextResponse.json({ error: 'Failed to create contact submission' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    if (!data.id) {
      return NextResponse.json({ error: 'Missing submission ID' }, { status: 400 });
    }

    await dbConnect();
    const result = await ContactSubmission.updateOne({ id: data.id }, { $set: data });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update contact submission:', error);
    return NextResponse.json({ error: 'Failed to update contact submission' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing submission ID' }, { status: 400 });
    }

    await dbConnect();
    const result = await ContactSubmission.deleteOne({ id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete contact submission:', error);
    return NextResponse.json({ error: 'Failed to delete contact submission' }, { status: 500 });
  }
}
