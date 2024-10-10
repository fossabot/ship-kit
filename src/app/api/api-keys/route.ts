import { ensureUserExists, getUserProjects } from '@/lib/services/user/user-service';
import { db } from '@/server/db';
import { apiKeys, projectMembers, projects } from '@/server/db/schema';
import { createApiKey, createTestProject } from '@/server/utils/team-utils';
import { stackServerApp } from '@/stack';
import { eq, inArray } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await ensureUserExists(user);
    if (!dbUser) {
      return NextResponse.json({ error: 'Failed to create or retrieve user' }, { status: 500 });
    }

    const userProjects = await getUserProjects(dbUser.id);

    // Get API keys for all user projects
    const userApiKeys = await db.select().from(apiKeys).where(
      inArray(apiKeys.projectId, userProjects.map(up => up.project.id))
    );

    return NextResponse.json(userApiKeys);
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json({ error: 'Failed to fetch API keys' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    let { isTestKey, projectId } = await request.json().catch(() => {
      return { isTestKey: false, projectId: undefined };
    });

    console.log(`POST request received. isTestKey: ${isTestKey}, projectId: ${projectId}`);

    let newApiKey;
    if (isTestKey) {
      console.log('Creating test API key');
      newApiKey = await createApiKey(undefined, 24 * 60 * 60 * 1000);
    } else {
      const user = await stackServerApp.getUser();
      if (!user) {
        console.log('User not authenticated');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      console.log(`User authenticated: ${user.id}`);

      const dbUser = await ensureUserExists(user);
      if (!dbUser) {
        return NextResponse.json({ error: 'Failed to create or retrieve user' }, { status: 500 });
      }

      let userProjects = await getUserProjects(dbUser.id);
      console.log(`User projects:`, userProjects);

      if (userProjects.length === 0) {
        console.log('User has no projects, creating test project');
        const testProject = await createTestProject();
        projectId = testProject.id;
        
        try {
          console.log(`Attempting to add user to test project: ${testProject.id}`);
          const newProjectMember = await db.insert(projectMembers).values({
            id: nanoid(),
            projectId: testProject.id,
            userId: dbUser.id,
            role: 'owner',
          }).returning();
          console.log(`User added as member of test project: ${testProject.id}`, newProjectMember);
        } catch (error) {
          console.error('Error adding user to test project:', error);
          if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
          }
          // Check if the project still exists
          const projectExists = await db.query.projects.findFirst({
            where: eq(projects.id, testProject.id),
          });
          console.log(`Project exists: ${!!projectExists}`);
          return NextResponse.json({ error: 'Failed to add user to test project' }, { status: 500 });
        }
      } else if (!projectId) {
        const firstProject = userProjects[0]?.project;
        if (!firstProject) {
          return NextResponse.json({ error: 'No valid project found' }, { status: 404 });
        }
        projectId = firstProject.id;
        console.log(`Using first project: ${projectId}`);
      } else {
        const hasAccess = userProjects.some(up => up.project.id === projectId);
        if (!hasAccess) {
          console.log(`User does not have access to project: ${projectId}`);
          return NextResponse.json({ error: 'User does not have access to the specified project' }, { status: 403 });
        }
      }

      if (!projectId) {
        console.log('No project found or created');
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }

      console.log(`Creating API key for project: ${projectId}`);
      newApiKey = await createApiKey(projectId);
    }

    if (!newApiKey) {
      throw new Error('Failed to create API key');
    }

    console.log(`API key created successfully: ${newApiKey.id}`);
    return NextResponse.json({ key: newApiKey.key, id: newApiKey.id });
  } catch (error) {
    console.error('Error in API key creation process:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}