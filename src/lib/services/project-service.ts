import { db } from "@/server/db";
import { projectMembers, projects, teamMembers, teams } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

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

export async function createProject(teamId: string, projectName: string, creatorUserId: string) {
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

export async function getUserTeams(userId: string) {
  return db.query.teamMembers.findMany({
    where: eq(teamMembers.userId, userId),
    with: {
      team: true,
    },
  });
}

export async function getTeamProjects(teamId: string) {
  return db.query.projects.findMany({
    where: eq(projects.teamId, teamId),
  });
}

export async function userHasAccessToProject(userId: string, projectId: string): Promise<boolean> {
  const projectMember = await db.query.projectMembers.findFirst({
    where: and(
      eq(projectMembers.userId, userId),
      eq(projectMembers.projectId, projectId)
    ),
  });

  return !!projectMember;
}