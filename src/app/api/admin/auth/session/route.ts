import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth-guard';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (admin) {
      return NextResponse.json({
        user: {
          uid: admin.email,
          email: admin.email,
          name: admin.name,
          image: admin.image,
          isAdmin: true,
        },
      });
    }

    const legacyUser = await getAuthenticatedUser();
    if (legacyUser) {
      return NextResponse.json({ user: legacyUser });
    }

    return NextResponse.json({ user: null });
  } catch (error) {
    console.error('Session endpoint error:', error);
    return NextResponse.json({ user: null, error: 'Session error' }, { status: 500 });
  }
}
