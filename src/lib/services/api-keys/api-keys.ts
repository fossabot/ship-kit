import { db } from "@/server/db";
import { apiKeys } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const getApiKeyIdFromApiKey = async (apiKey: string) => {
  const apiKeyRecord = await db.select().from(apiKeys).where(eq(apiKeys.key, apiKey));
  return apiKeyRecord[0]?.id;
};
