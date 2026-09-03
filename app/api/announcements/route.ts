import { NextResponse } from 'next/server';
import { listAnnouncements } from '@/lib/rio-db';
export async function GET() {
  return NextResponse.json(
    { announcements: await listAnnouncements(false) },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
