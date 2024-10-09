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

  if (!apiKeyId) {
    return new NextResponse('API key ID is required', { status: 400 });
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
    return new NextResponse('Invalid API key ID', { status: 401 });
  }

  // Check permissions
  if (apiKeyRecord.projectId) {
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
  } else {
    // API key is not associated with a project
    if (user) {
      return new NextResponse('Unauthorized access to non-project API key', { status: 403 });
    }
  }

  const logStream = streamApiLogs(apiKeyId);

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