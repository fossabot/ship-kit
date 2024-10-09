import { db } from '@/server/db';
import { apiKeys, projects, teamMembers } from '@/server/db/schema';
import { createApiKey, createProjectForTeam } from '@/server/utils/team-utils';
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
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId, isTestKey } = await request.json();

    // Get user's team
    const userTeam = await db.query.teamMembers.findFirst({
      where: eq(teamMembers.userId, user.id),
    });

    if (!userTeam) {
      return NextResponse.json({ error: 'User not associated with a team' }, { status: 400 });
    }

    let targetProject;

    if (!projectId) {
      // Check if the team already has a project
      const teamProjects = await db.query.projects.findMany({
        where: eq(projects.teamId, userTeam.teamId),
      });

      if (teamProjects.length === 0) {
        // Create a new project if the team doesn't have one
        targetProject = await createProjectForTeam(userTeam.teamId, 'Default Project');
      } else if (teamProjects.length === 1) {
        // Use the existing project
        targetProject = teamProjects[0];
      } else {
        // For now, just use the first project. You may want to implement a different logic here.
        targetProject = teamProjects[0];
      }
    } else {
      // Verify that the provided projectId belongs to the user's team
      targetProject = await db.query.projects.findFirst({
        where: eq(projects.id, projectId),
      });

      if (!targetProject || targetProject.teamId !== userTeam.teamId) {
        return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
      }
    }

    if (!targetProject) {
      return NextResponse.json({ error: 'Failed to create or find a valid project' }, { status: 500 });
    }

    const expiresIn = isTestKey ? 24 * 60 * 60 * 1000 : undefined; // 24 hours for test keys
    
    try {
      const newApiKey = await createApiKey(targetProject.id, expiresIn);
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