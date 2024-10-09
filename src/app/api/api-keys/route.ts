import { db } from '@/server/db';
import { apiKeys, projects, teamMembers } from '@/server/db/schema';
import { createApiKey } from '@/server/utils/team-utils';
import { stackServerApp } from '@/stack';
import { eq, inArray } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's team
    const userTeam = await db.query.teamMembers.findFirst({
      where: eq(teamMembers.userId, user.id),
    });

    if (!userTeam) {
      return NextResponse.json({ error: 'User not associated with a team' }, { status: 400 });
    }

    // Get team's projects
    const teamProjects = await db.query.projects.findMany({
      where: eq(projects.teamId, userTeam.teamId),
    });

    // Get API keys for all team projects
    const userApiKeys = await db.select().from(apiKeys).where(
      inArray(apiKeys.projectId, teamProjects.map(project => project.id))
    );

    return NextResponse.json(userApiKeys);
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json({ error: 'Failed to fetch API keys' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  console.log('POST request to /api/api-keys received');
  try {
    const { isTestKey, projectId } = await request.json();
    console.log(`Request body: isTestKey=${isTestKey}, projectId=${projectId}`);

    let expiresIn: number | undefined;
    if (isTestKey) {
      console.log('Creating test API key');
      expiresIn = 24 * 60 * 60 * 1000; // 24 hours for test keys
    }

    try {
      const newApiKey = await createApiKey(projectId, expiresIn);
      console.log('API key created successfully');
      return NextResponse.json(newApiKey);
    } catch (error) {
      console.error('Error creating API key:', error);
      return NextResponse.json({ error: 'Failed to create API key' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in API key creation process:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}