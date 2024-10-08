import { db } from '@/server/db';
import { apiKeys, users } from '@/server/db/schema';
import { stackServerApp } from '@/stack';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userApiKeys = await db.select().from(apiKeys).where(eq(apiKeys.userId, user.id));
    return NextResponse.json(userApiKeys);
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json({ error: 'Failed to fetch API keys' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if the user exists in the database
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, user.id),
    });

    if (!existingUser && user.primaryEmail) {
      // If the user doesn't exist, create them first
      await db.insert(users).values({
        id: user.id,
        primaryEmail: user.primaryEmail, // Add this line
        displayName: user.displayName || null,
      });
    }

    const newKey = {
      id: crypto.randomUUID(),
      key: crypto.randomBytes(32).toString('hex'),
      createdAt: new Date().toISOString(),
      userId: user.id,
    };

    await db.insert(apiKeys).values(newKey);
    return NextResponse.json(newKey);
  } catch (error) {
    console.error('Error generating API key:', error);
    return NextResponse.json({ error: 'Failed to generate API key' }, { status: 500 });
  }
}