import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, logAuditAction } from '@/lib/auth-guard';
import { isRateLimited } from '@/lib/security';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_MIME_TYPES = new Map<string, string>([
  ['image/jpeg', '.jpg'],
  ['image/jpg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
]);

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();

    if (await isRateLimited()) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a moment.' },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 2MB limit' },
        { status: 400 }
      );
    }

    const mimeType = file.type.toLowerCase();
    const extension = ALLOWED_MIME_TYPES.get(mimeType);

    if (!extension) {
      return NextResponse.json(
        { error: 'Invalid file format. Only JPG, PNG, and WebP are allowed' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Verify magic bytes for extra security
    const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8;
    const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
    const isWebp =
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46 &&
      buffer[8] === 0x57 &&
      buffer[9] === 0x45 &&
      buffer[10] === 0x42 &&
      buffer[11] === 0x50;

    if (!isJpeg && !isPng && !isWebp) {
      return NextResponse.json(
        { error: 'File content does not match allowed image formats' },
        { status: 400 }
      );
    }

    const randomizedName = `${crypto.randomUUID()}${extension}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, randomizedName), buffer);

    const publicUrl = `/uploads/${randomizedName}`;

    await logAuditAction('IMAGE_UPLOAD', admin.email, {
      filename: randomizedName,
      originalName: file.name,
      size: file.size,
      mimeType,
      url: publicUrl,
    });

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: randomizedName,
    });
  } catch (error: any) {
    if (error.message?.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Image upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process image upload' },
      { status: 500 }
    );
  }
}
