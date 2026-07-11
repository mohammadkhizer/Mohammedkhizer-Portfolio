import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ProjectCategory from '@/models/ProjectCategory';
import { isAdmin } from '@/lib/security';

export async function GET() {
  try {
    await dbConnect();
    const categories = await ProjectCategory.find().sort({ order: 1, name: 1 }).lean();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Failed to fetch project categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    await dbConnect();
    const newCategory = await ProjectCategory.create({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return NextResponse.json(newCategory);
  } catch (error) {
    console.error('Failed to create project category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    if (!data.id) {
      return NextResponse.json({ error: 'Missing category ID' }, { status: 400 });
    }

    await dbConnect();
    const result = await ProjectCategory.updateOne(
      { id: data.id },
      {
        $set: {
          ...data,
          updatedAt: new Date().toISOString(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update project category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing category ID' }, { status: 400 });
    }

    await dbConnect();
    const result = await ProjectCategory.deleteOne({ id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete project category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
