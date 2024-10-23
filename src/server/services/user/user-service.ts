import { db } from "@/server/db";
import {
  projectMembers,
  projects,
  teamMembers,
  teams,
  users,
} from "@/server/db/schema";
import type { User } from "@auth/core/types";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

/**
 * Ensures a user exists in the database, creating them if necessary.
 * @param authUser - The authenticated user object.
 * @returns The database user object.
 */
export async function ensureUserExists(authUser: User) {
  let dbUser = await db.query.users.findFirst({
    where: eq(users.id, authUser.id),
  });

  if (!dbUser) {
    if (!authUser.email) {
      throw new Error("User does not have a primary email");
    }

    const newUser = {
      ...authUser,
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

/**
 * Creates a default team and project for a new user.
 * @param userId - The ID of the user.
 */
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

/**
 * Retrieves all projects associated with a user.
 * @param userId - The ID of the user.
 * @returns A list of projects.
 */
export const getUserProjects = async (userId: string) => {
  return db.query.projectMembers.findMany({
    where: eq(projectMembers.userId, userId),
    with: {
      project: true,
    },
  });
};
