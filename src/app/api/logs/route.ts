import { getApiKeyIdFromApiKey } from '@/lib/services/api-keys/api-keys';
import { createLog, getApiKeyLogs, getUserLogs, userHasAccessToApiKey } from '@/lib/services/logs/log-service';
import { stackServerApp } from '@/stack';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get('key');
    let apiKeyId = searchParams.get('id');
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 100;

    const user = await stackServerApp.getUser();

    if (apiKey) {
      apiKeyId = await getApiKeyIdFromApiKey(apiKey) ?? null;
      if (!apiKeyId) {
        return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
      }
    }

    if (!apiKeyId) {
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const userLogs = await getUserLogs(user.id, limit);
      return NextResponse.json(userLogs);
    }

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasAccess = await userHasAccessToApiKey(user.id, apiKeyId);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Unauthorized access to API key' }, { status: 403 });
    }

    const logEntries = await getApiKeyLogs(apiKeyId, limit);
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

    const createdLog = await createLog({
      level,
      message,
      timestamp: new Date(timestamp),
      prefix,
      emoji,
      metadata,
      apiKey: api_key,
    });

    return NextResponse.json({ success: true, log: createdLog });
  } catch (error) {
    console.error('Error creating log:', error);
    return NextResponse.json({ error: 'Failed to create log' }, { status: 500 });
  }
}