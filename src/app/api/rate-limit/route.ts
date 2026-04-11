import { NextResponse } from "next/server";
import { isRateLimited } from "@/lib/security";

export async function POST() {
  const limited = await isRateLimited();

  if (limited) {
    return NextResponse.json(
      {
        limited: true,
        message: "Too many login attempts. Please wait a minute before retrying.",
      },
      { status: 429 }
    );
  }

  return NextResponse.json({ limited: false });
}
