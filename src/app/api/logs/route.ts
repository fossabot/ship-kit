import { db } from '@/server/db';
import { apiKeys, logs, projectMembers } from '@/server/db/schema';
import { stackServerApp } from '@/stack';
import { and, desc, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const apiKeyId = searchParams.get('id');

    if (!apiKeyId) {
      return NextResponse.json({ error: 'API key ID is required' }, { status: 400 });
    }

    const user = await stackServerApp.getUser();

    // Find the API key record
    const apiKeyRecord = await db.query.apiKeys.findFirst({
      where: eq(apiKeys.id, apiKeyId),
      with: {
        project: true,
      },
    });

    if (!apiKeyRecord) {
      return NextResponse.json({ error: 'Invalid API key ID' }, { status: 401 });
    }

    // Check permissions
    if (apiKeyRecord.projectId) {
      // API key is associated with a project
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const userProjectMember = await db.query.projectMembers.findFirst({
        where: and(
          eq(projectMembers.projectId, apiKeyRecord.projectId),
          eq(projectMembers.userId, user.id)
        ),
      });

      if (!userProjectMember) {
        return NextResponse.json({ error: 'Unauthorized access to project' }, { status: 403 });
      }
    } else {
      // API key is not associated with a project
      if (user) {
        return NextResponse.json({ error: 'Unauthorized access to non-project API key' }, { status: 403 });
      }
    }

    // Get logs for the specified API key
    const logEntries = await db.select()
      .from(logs)
      .where(eq(logs.apiKeyId, apiKeyRecord.id))
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

    // Convert timestamp to a number if it's not already
    const numericTimestamp = typeof timestamp === 'string' ? Date.parse(timestamp) / 1000 : 
                             timestamp instanceof Date ? Math.floor(timestamp.getTime() / 1000) : 
                             Math.floor(Number(timestamp) / 1000);

    await db.insert(logs).values({ 
      timestamp: timestamp instanceof Date ? timestamp : new Date(),
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