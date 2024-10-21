import { db } from "@/server/db";
import {
  projectMembers,
  projects,
  teamMembers,
  teams,
} from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

/**
 * Creates a new team and assigns the user as the owner.
 * @param userId - The ID of the user.
 * @param teamName - The name of the team.
 * @returns The ID of the created team.
 */
export async function createTeam(userId: string, teamName: string) {
  const teamId = crypto.randomUUID();

  await db.transaction(async (tx) => {
    await tx.insert(teams).values({
      id: teamId,
      name: teamName,
    });

    await tx.insert(teamMembers).values({
      id: crypto.randomUUID(),
      userId: userId,
      teamId: teamId,
      role: "owner",
    });
  });

  return teamId;
}

/**
 * Creates a new project under a team and assigns the creator as the owner.
 * @param teamId - The ID of the team.
 * @param projectName - The name of the project.
 * @param creatorUserId - The ID of the user creating the project.
 * @returns The ID of the created project.
 */
export async function createProject(
  teamId: string,
  projectName: string,
  creatorUserId: string,
) {
  const projectId = crypto.randomUUID();

  await db.transaction(async (tx) => {
    await tx.insert(projects).values({
      id: projectId,
      name: projectName,
      teamId: teamId,
    });

    await tx.insert(projectMembers).values({
      id: crypto.randomUUID(),
      projectId: projectId,
      userId: creatorUserId,
      role: "owner",
    });
  });

  return projectId;
}

/**
 * Retrieves all teams associated with a user.
 * @param userId - The ID of the user.
 * @returns A list of teams.
 */
export async function getUserTeams(userId: string) {
  return db.query.teamMembers.findMany({
    where: eq(teamMembers.userId, userId),
    with: {
      team: true,
    },
  });
}

/**
 * Retrieves all projects associated with a team.
 * @param teamId - The ID of the team.
 * @returns A list of projects.
 */
export async function getTeamProjects(teamId: string) {
  return db.query.projects.findMany({
    where: eq(projects.teamId, teamId),
  });
}

/**
 * Checks if a user has access to a specific project.
 * @param userId - The ID of the user.
 * @param projectId - The ID of the project.
 * @returns True if the user has access, otherwise false.
 */
export async function userHasAccessToProject(
  userId: string,
  projectId: string,
): Promise<boolean> {
  const projectMember = await db.query.projectMembers.findFirst({
    where: and(
      eq(projectMembers.userId, userId),
      eq(projectMembers.projectId, projectId),
    ),
  });

  return !!projectMember;
}
