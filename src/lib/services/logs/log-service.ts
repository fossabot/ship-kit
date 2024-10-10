import { db } from "@/server/db";
import { apiKeys, logs, projectMembers } from "@/server/db/schema";
import { and, desc, eq, inArray } from "drizzle-orm";

export async function getUserLogs(userId: string, limit: number = 100) {
  const userProjectIds = await db.select({ projectId: projectMembers.projectId })
    .from(projectMembers)
    .where(eq(projectMembers.userId, userId));

  const projectIds = userProjectIds.map(up => up.projectId);

  const apiKeyIds = await db.select({ id: apiKeys.id })
    .from(apiKeys)
    .where(inArray(apiKeys.projectId, projectIds));

  const keyIds = apiKeyIds.map(ak => ak.id);

  return db.query.logs.findMany({
    where: inArray(logs.apiKeyId, keyIds),
    orderBy: [desc(logs.timestamp)],
    limit: limit,
    with: {
      apiKey: {
        with: {
          project: true,
        },
      },
    },
  });
}

export async function getApiKeyLogs(apiKeyId: string, limit: number = 100) {
  return db.query.logs.findMany({
    where: eq(logs.apiKeyId, apiKeyId),
    orderBy: [desc(logs.timestamp)],
    limit: limit,
  });
}

export async function createLog(logData: {
  level: string;
  message: string;
  timestamp: Date;
  prefix?: string;
  emoji?: string;
  metadata?: Record<string, unknown>;
  apiKey: string;
}) {
  const apiKeyRecord = await db.query.apiKeys.findFirst({
    where: eq(apiKeys.key, logData.apiKey),
  });

  if (!apiKeyRecord) {
    throw new Error('Invalid API key');
  }

  const [createdLog] = await db.insert(logs).values({
    timestamp: logData.timestamp,
    level: logData.level,
    message: logData.message,
    prefix: logData.prefix,
    emoji: logData.emoji,
    metadata: logData.metadata ? JSON.stringify(logData.metadata) : null,
    apiKeyId: apiKeyRecord.id,
  }).returning();

  return createdLog;
}

export async function userHasAccessToApiKey(userId: string, apiKeyId: string): Promise<boolean> {
  const apiKeyRecord = await db.query.apiKeys.findFirst({
    where: eq(apiKeys.id, apiKeyId),
    with: {
      project: true,
    },
  });

  if (!apiKeyRecord || !apiKeyRecord.project) {
    return false;
  }

  const userProjectMember = await db.query.projectMembers.findFirst({
    where: and(
      eq(projectMembers.projectId, apiKeyRecord.project.id),
      eq(projectMembers.userId, userId)
    ),
  });

  return !!userProjectMember;
}

// New function to get user's projects
export async function getUserProjects(userId: string) {
  return db.query.projectMembers.findMany({
    where: eq(projectMembers.userId, userId),
    with: {
      project: true,
    },
  });
}

// New function to get project's API keys
export async function getProjectApiKeys(projectId: string) {
  return db.query.apiKeys.findMany({
    where: eq(apiKeys.projectId, projectId),
  });
}

// New function to create an API key for a project
export async function createApiKey(projectId: string, expiresAt?: Date) {
  const [newApiKey] = await db.insert(apiKeys).values({
    id: crypto.randomUUID(),
    key: generateApiKey(),
    projectId: projectId,
    createdAt: new Date(),
    expiresAt: expiresAt,
  }).returning();

  return newApiKey;
}

// Helper function to generate a secure API key
function generateApiKey(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
}