import { db } from '@/server/db';
import { apiKeys } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { key: string } }
) {
  const apiKey = params.key;

  if (!apiKey) {
    return NextResponse.json({ error: 'API key is required' }, { status: 400 });
  }

  try {
    const apiKeyRecord = await db.query.apiKeys.findFirst({
      where: eq(apiKeys.key, apiKey),
    });

    const isValid = !!apiKeyRecord;

    return NextResponse.json({ isValid });
  } catch (error) {
    console.error('Error checking API key:', error);
    return NextResponse.json({ error: 'Failed to check API key' }, { status: 500 });
  }
}
