// Get logs from the database for the current user
import { db } from '@/server/db';
import { logs } from '@/server/db/schema';
import { stackServerApp } from '@/stack';
import { desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const logEntries = await db.select().from(logs).orderBy(desc(logs.timestamp)).limit(100);
    return NextResponse.json(logEntries);
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { level, message } = await request.json();
    const timestamp = new Date().toISOString();

    await db.insert(logs).values({ timestamp, level, message });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating log:', error);
    return NextResponse.json({ error: 'Failed to create log' }, { status: 500 });
  }
}