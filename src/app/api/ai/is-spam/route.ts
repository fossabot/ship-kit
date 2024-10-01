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

import { logger } from "@/lib/logger";
import { isSpam } from "@/server/api/services/is-spam";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Handles both GET and POST requests to determine if an email is spam or a phishing attempt.
 * Accepts content either in the request body or search params.
 */
const handler = async (request: NextRequest) => {
  let content: string | null = null;
  let sender: string | null = null;

  if (request.method === "POST") {
    try {
      const data = await request.json();
      content = data.content;
      sender = data.sender;
    } catch (error) {
      logger.error("Error parsing request body:", error);
    }
  }

  // If content is not in the body or it's a GET request, check search params
  if (!content) {
    const searchParams = request.nextUrl.searchParams;
    content = searchParams.get("content");
    sender = searchParams.get("sender");
  }

  if (!content) {
    return NextResponse.json(
      { error: "Content is required." },
      { status: 400 },
    );
  }

  const result = await isSpam({ content, sender }).catch((error) => {
    logger.error("Error checking spam:", error);
    return NextResponse.json({ error: "Error checking spam" }, { status: 400 });
  });

  return NextResponse.json(result);
};

export { handler as GET, handler as POST };
