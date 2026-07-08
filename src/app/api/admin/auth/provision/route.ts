import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';

export async function POST() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.email.toLowerCase().trim() !== 'work.mkhizer@gmail.com') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();
    await Admin.updateOne(
      { email: user.email.toLowerCase().trim() },
      { $set: { isAdmin: true } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Provisioning error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
