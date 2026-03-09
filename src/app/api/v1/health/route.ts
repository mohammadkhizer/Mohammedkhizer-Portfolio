/**
 * @fileOverview API Versioning v1: Health Check Route.
 */

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'operational',
    version: 'v1',
    timestamp: new Date().toISOString(),
    api_docs: '/docs/api/v1'
  });
}
