import { db } from '@/server/db';
import { apiKeys, logs } from '@/server/db/schema';
import { stackServerApp } from '@/stack';
import { desc, eq, inArray } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all API keys for the user
    const userApiKeys = await db.select({ id: apiKeys.id })
      .from(apiKeys)
      .where(eq(apiKeys.userId, user.id));

    const apiKeyIds = userApiKeys.map(key => key.id);

    // Get logs for all of the user's API keys
    const logEntries = await db.select()
      .from(logs)
      .where(inArray(logs.apiKeyId, apiKeyIds))
      .orderBy(desc(logs.timestamp))
      .limit(100);

    return NextResponse.json(logEntries);
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { level, message, timestamp, prefix, emoji, metadata, api_key } = await request.json();

    if (!api_key) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }

    const apiKeyRecord = await db.query.apiKeys.findFirst({
      where: eq(apiKeys.key, api_key),
    });

    if (!apiKeyRecord) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    await db.insert(logs).values({ 
      timestamp, 
      level, 
      message,
      prefix,
      emoji,
      metadata: JSON.stringify(metadata),
      apiKeyId: apiKeyRecord.id 
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating log:', error);
    return NextResponse.json({ error: 'Failed to create log' }, { status: 500 });
  }
}