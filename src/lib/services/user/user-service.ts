import { db } from "@/server/db";
import { projectMembers, projects, teamMembers, teams, users } from "@/server/db/schema";
import { User } from "@stackframe/stack";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function ensureUserExists(authUser: User) {
  let dbUser = await db.query.users.findFirst({
    where: eq(users.id, authUser.id),
  });

  if (!dbUser) {
    if (!authUser.primaryEmail) {
      throw new Error('User does not have a primary email');
    }

    const newUser = {
      id: authUser.id,
      email: authUser.primaryEmail,
      name: authUser.displayName ?? null,
      emailVerified: authUser.primaryEmailVerified ?? false,
      image: authUser.profileImageUrl ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    [dbUser] = await db.insert(users).values(newUser).returning();

    if (dbUser) {
      console.log(`New user created: ${dbUser.id}`);
      await createTeamAndProjectForUser(dbUser.id);
    } else {
      console.error(`Failed to create user: ${authUser.id}`);
    }
  }

  return dbUser;
}

async function createTeamAndProjectForUser(userId: string) {
  const teamId = nanoid();
  const projectId = nanoid();

  await db.transaction(async (tx) => {
    await tx.insert(teams).values({
      id: teamId,
      name: "My Team",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await tx.insert(teamMembers).values({
      id: nanoid(),
      userId: userId,
      teamId: teamId,
      role: "owner",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await tx.insert(projects).values({
      id: projectId,
      name: "My First Project",
      teamId: teamId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await tx.insert(projectMembers).values({
      id: nanoid(),
      projectId: projectId,
      userId: userId,
      role: "owner",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  console.log(`Team and project created for user: ${userId}`);
  return { teamId, projectId };
}

export async function getUserProjects(userId: string) {
  return db.query.projectMembers.findMany({
    where: eq(projectMembers.userId, userId),
    with: {
      project: true,
    },
  });
}