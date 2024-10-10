import { db } from '@/server/db';
import { apiKeys, projectMembers } from '@/server/db/schema';
import { stackServerApp } from '@/stack';
import { streamApiLogs } from '@/utils/logger/stream-api-logs';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

/**
 * Handles the GET request for live logs using Server-Sent Events
 * @param req - The incoming request object
 */
export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const apiKeyId = searchParams.get('id');
  const apiKey = searchParams.get('key');

  if (!apiKeyId && !apiKey) {
    return new NextResponse('API key ID or key is required', { status: 400 });
  }

  const user = await stackServerApp.getUser();
  // Find the API key record
  const apiKeyRecord = await db.query.apiKeys.findFirst({
    where: apiKeyId ? eq(apiKeys.id, apiKeyId) : eq(apiKeys.key, apiKey as string),
    with: {
      project: true,
    },
  });

  if (!apiKeyRecord) {
    return new NextResponse('Invalid API key ID or key', { status: 401 });
  }

  // Check if it's a test key
  const isTestKey = !apiKeyRecord.projectId;

  // Check permissions only if it's not a test key
  if (!isTestKey && apiKeyRecord.projectId) {
    // API key is associated with a project
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const userProjectMember = await db.query.projectMembers.findFirst({
      where: and(
        eq(projectMembers.projectId, apiKeyRecord.projectId),
        eq(projectMembers.userId, user.id)
      ),
    });

    if (!userProjectMember) {
      return new NextResponse('Unauthorized access to project', { status: 403 });
    }
  }

  const logStream = streamApiLogs(apiKeyRecord.id);

  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  // Set up SSE headers
  const headers = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  };

  // Start sending events
  const sendEvents = async () => {
    try {
      for await (const log of logStream) {
        const data = JSON.stringify(log);
        await writer.write(encoder.encode(`data: ${data}\n\n`));
      }
    } finally {
      writer.close();
    }
  };

  sendEvents();

  return new NextResponse(responseStream.readable, { headers });
};