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

import { type NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your OpenAI API key is set in environment variables
});

export const POST = async (req: NextRequest) => {
  const data = (await req.json()) as { content: string; sender?: string };
  if (!data?.content) {
    return NextResponse.json(
      { error: "Invalid request data." },
      { status: 400 },
    );
  }
  const { content, sender } = data;

  if (!content) {
    return NextResponse.json(
      { error: "Content is required." },
      { status: 400 },
    );
  }

  const messages = [
    {
      role: "system",
      content:
        "You are an assistant that determines if an email is spam or a phishing attempt.",
    },
    {
      role: "user",
      content: `Please analyze the following email and determine if it is spam or a phishing attempt.

Content:
"${content}"

${sender ? `Sender: "${sender}"\n` : ""}

Respond only with a JSON object containing:
- "isSpam": true or false indicating if the email is spam.
- "threshold": A number between 0 and 1 indicating the confidence level.`,
    },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0,
    });

    const responseText = response.choices[0].message?.content.trim();

    // Parse the response as JSON
    const result = JSON.parse(responseText);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 },
    );
  }
};
