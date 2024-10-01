import { env } from "@/env";
import { logger } from "@/lib/logger";
import OpenAI from "openai";
import { type ChatCompletionMessageParam } from "openai/resources/index.mjs";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY, // Ensure your OpenAI API key is set in environment variables
});

export type IsSpamProps = {
  content: string;
  sender?: string | null;
};

export const isSpam = async ({ content, sender }: IsSpamProps) => {
  const messages: ChatCompletionMessageParam[] = [
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

Respond only with an integer between -100 and 100 indicating the confidence level. Any value above 0 should be considered almost certainly spam and can be safely discarded.`,
    },
  ];

  logger.warn(`Calling OpenAI with messages: ${JSON.stringify(messages)}`);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0,
    });

    const responseContent = response?.choices?.[0]?.message?.content?.trim();

    if (!responseContent) {
      throw new Error("No response content from OpenAI");
    }

    // Parse the response as JSON
    const result = JSON.parse(responseContent);

    if (typeof result !== "number") {
      throw new Error("Invalid response from OpenAI");
    }

    return result;
  } catch (error) {
    logger.error(`Error in isSpam: ${String(error)}`);
    throw error;
  }
};
