/**
 * API Endpoint: /api/ai/is-spam
 * Description:
 * This endpoint receives an email content and an optional sender,
 * then determines if the email is spam or a phishing attempt.
 * It returns an object with:
 * - `isSpam`: A boolean indicating spam status.
 * - `threshold`: A number between 0 and 1 indicating confidence level.
 * Utilizes OpenAI GPT-3.5 Turbo model for analysis.
 */

import { isSpam } from "@/server/api/services/is-spam";
import { createSafeRoute } from "next-safe-route";
import { z } from "zod";

/**
 * Handles both GET and POST requests to determine if an email is spam or a phishing attempt.
 * Accepts content either in the request body or search params.
 */

const querySchema = z.object({
  content: z.string(),
  sender: z.string().optional(),
});

const bodySchema = z.object({
  content: z.string(),
  sender: z.string().optional(),
});

const handler = async (request: Request, context: any) => {
  const content = context?.query?.content ?? context?.body?.content;
  const sender = context?.query?.sender ?? context?.body?.sender;

  const result = await isSpam({ content, sender });
  return Response.json(result, { status: 200 });
};

export const GET = createSafeRoute().query(querySchema).handler(handler);
export const POST = createSafeRoute().body(bodySchema).handler(handler);
