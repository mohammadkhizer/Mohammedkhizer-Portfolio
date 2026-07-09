import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { setSessionCookie } from '@/lib/auth';
import { isRateLimited } from '@/lib/security';

export async function POST(req: NextRequest) {
  // 1. Rate limiting
  const limited = await isRateLimited();
  if (limited) {
    return NextResponse.json(
      { message: 'Too many requests. Please try again in a minute.' },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: 'Invalid or missing JSON payload.' },
      { status: 400 }
    );
  }

  const { email, password } = body || {};

  if (!email || !password) {
    return NextResponse.json(
      { message: 'Email and password are required.' },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    // 2. Find admin by email
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return NextResponse.json(
        { message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // 3. Verify password
    const isPasswordCorrect = await bcrypt.compare(password, admin.passwordHash);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // 4. Set session cookie
    const success = await setSessionCookie(admin.email, admin._id.toString(), admin.isAdmin);
    if (!success) {
      return NextResponse.json(
        { message: 'Failed to create session.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        uid: admin._id.toString(),
        email: admin.email,
        isAdmin: admin.isAdmin,
      }
    });
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { message: 'An error occurred during login.' },
      { status: 500 }
    );
  }
}
