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

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    await dbConnect();

    // 2. Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (existingAdmin) {
      return NextResponse.json(
        { message: 'An account with this email already exists.' },
        { status: 400 }
      );
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Determine admin privilege:
    // If the email matches the portfolio owner's email, automatically grant admin access.
    const isOwner = email.toLowerCase().trim() === 'work.mkhizer@gmail.com';

    // 4. Create new admin
    const newAdmin = await Admin.create({
      email: email.toLowerCase().trim(),
      passwordHash,
      isAdmin: true, // Default (signup) role as admin
      isMaster: isOwner,
    });

    // 5. Set session cookie
    const success = await setSessionCookie(newAdmin.email, newAdmin._id.toString(), newAdmin.isAdmin);
    if (!success) {
      return NextResponse.json(
        { message: 'Failed to create session.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        uid: newAdmin._id.toString(),
        email: newAdmin.email,
        isAdmin: newAdmin.isAdmin,
      }
    });

  } catch (error) {
    console.error('Signup API error:', error);
    return NextResponse.json(
      { message: 'An error occurred during signup.' },
      { status: 500 }
    );
  }
}
