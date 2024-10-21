import { db } from "@/server/db";
import { apiKeys } from "@/server/db/schema";
import { btoa } from "base64-js";
import { crypto } from "crypto";
import { eq } from "drizzle-orm";

/**
 * Retrieves the ID of an API key from the key string.
 * @param apiKey - The API key string.
 * @returns The ID of the API key.
 */
export const getApiKeyIdFromApiKey = async (apiKey: string) => {
  const apiKeyRecord = await db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.key, apiKey));
  return apiKeyRecord[0]?.id;
};

/**
 * Creates a new API key for a project.
 * @param projectId - The ID of the project.
 * @param expiresAt - Optional expiration date for the API key.
 * @returns The created API key.
 */
export async function createApiKey(projectId: string, expiresAt?: Date) {
  const [newApiKey] = await db
    .insert(apiKeys)
    .values({
      id: crypto.randomUUID(),
      key: generateApiKey(),
      projectId: projectId,
      createdAt: new Date(),
      expiresAt: expiresAt,
    })
    .returning();

  return newApiKey;
}

/**
 * Helper function to generate a secure API key.
 * @returns A new API key string.
 */
function generateApiKey(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
}
