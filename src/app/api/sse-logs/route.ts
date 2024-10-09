import { getLogStreamForApiKey } from '@/utils/logger';
import { NextResponse } from 'next/server';

/**
 * Handles the GET request for live logs using Server-Sent Events
 * @param req - The incoming request object
 */
export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const apiKey = searchParams.get('apiKey');

  if (!apiKey) {
    return new NextResponse('API key is required', { status: 400 });
  }

  const logStream = await getLogStreamForApiKey(apiKey);

  if (!logStream) {
    return new NextResponse('Invalid API key', { status: 401 });
  }

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