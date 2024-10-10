import { db } from "@/server/db";
import { apiKeys, projects, teamMembers, teams, users } from "@/server/db/schema";
import { User } from "@stackframe/stack";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function ensureUserHasTeam(authUser: User) {
  // First, check if the user exists
  let user = await db.query.users.findFirst({
    where: eq(users.id, authUser.id),
  });

  if (!user) {
    // Create the user if they don't exist
    const newUser = {
      id: authUser.id,
      email: authUser.primaryEmail ?? "",
      name: authUser.displayName ?? null,
      emailVerified: authUser.primaryEmailVerified ?? false,
      image: authUser.profileImageUrl ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.insert(users).values(newUser);
    user = await db.query.users.findFirst({
      where: eq(users.id, authUser.id),
    });
    if (!user) {
      throw new Error('Failed to create user');
    }
  }

  // Check if the user is already in a team
  const existingTeamMember = await db.query.teamMembers.findFirst({
    where: eq(teamMembers.userId, user.id),
  });

  if (existingTeamMember) {
    return existingTeamMember.teamId;
  }

  // If not, create a new team, team membership, and default project
  const newTeamId = nanoid();
  const newProjectId = nanoid();

  await db.transaction(async (tx) => {
    await tx.insert(teams).values({
      id: newTeamId,
      name: "My Team",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("creating new team");

    await tx.insert(teamMembers).values({
      id: nanoid(),
      userId: user.id,
      teamId: newTeamId,
      role: "owner",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await tx.insert(projects).values({
      id: newProjectId,
      name: "Default Project",
      teamId: newTeamId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  return newTeamId;
}

export async function createProjectForTeam(teamId: string, projectName: string) {
  const newProjectId = nanoid();
  await db.insert(projects).values({
    id: newProjectId,
    name: projectName,
    teamId: teamId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return { id: newProjectId, name: projectName, teamId };
}

export async function createApiKey(projectId?: string, expiresIn?: number) {
  console.log(`Creating API key, projectId: ${projectId}, expiresIn: ${expiresIn}`);
  const newApiKeyId = nanoid();
  const key = nanoid(32);
  const createdAt = new Date();
  const expiresAt = expiresIn ? new Date(Date.now() + expiresIn) : undefined;

  try {
    let project;
    if (projectId) {
      // Double-check that the project exists
      project = await db.query.projects.findFirst({
        where: eq(projects.id, projectId),
      });
      
      if (!project) {
        throw new Error(`Project with id ${projectId} not found`);
      }
      
      console.log(`Project found:`, project);
    }
    
    console.log(`Inserting API key${projectId ? ` for project: ${projectId}` : ' (test key)'}`);
    console.log('API key details:', {
      id: newApiKeyId,
      key: key,
      projectId: projectId,
      createdAt: createdAt,
      expiresAt: expiresAt,
    });

    const result = await db.insert(apiKeys).values({
      id: newApiKeyId,
      key: key,
      projectId: projectId, // This will be undefined for test keys
      createdAt: createdAt,
      updatedAt: createdAt,
      expiresAt: expiresAt,
    });
    
    console.log(`API key insertion result:`, result);
    
    return { id: newApiKeyId, key: key, projectId: projectId };
  } catch (error) {
    console.error('Error inserting API key:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw new Error("Failed to create API key");
  }
}

export async function createTestProject() {
  const testTeamId = 'test-team-' + nanoid();
  const testProjectId = 'test-project-' + nanoid();

  try {
    await db.transaction(async (tx) => {
      // Create a test team
      await tx.insert(teams).values({
        id: testTeamId,
        name: "Test Team",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`Test team created with ID: ${testTeamId}`);

      // Create a test project
      await tx.insert(projects).values({
        id: testProjectId,
        name: "Test Project",
        teamId: testTeamId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`Test project created with ID: ${testProjectId}`);
    });

    // Verify that the project was created
    const createdProject = await db.query.projects.findFirst({
      where: eq(projects.id, testProjectId),
    });
    console.log('Created project:', createdProject);

    if (!createdProject) {
      throw new Error("Failed to create test project");
    }

    return createdProject;
  } catch (error) {
    console.error('Error creating test project:', error);
    throw new Error("Failed to create test project");
  }
}

export async function getTeamProjects(teamId: string) {
  return db.query.projects.findMany({
    where: eq(projects.teamId, teamId),
  });
}

export async function isTeamPremium(teamId: string) {
  // Implement your logic to check if a team is premium
  // For now, we'll return false as a placeholder
  return false;
}