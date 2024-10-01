/**
 * API Endpoint: /api/ai/autocomplete
 * Description:
 * This endpoint receives a text input from the user and provides
 * suggestions for auto-completion using the OpenAI GPT-3.5 Turbo model.
 * It returns an object with:
 * - `suggestion`: A string containing the suggested continuation of the text.
 */

import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your OpenAI API key is set in environment variables
});

export const POST = async (req: Request) => {
  const { text } = await req.json();

  if (!text) {
    return NextResponse.json(
      { error: "Text input is required." },
      { status: 400 },
    );
  }

  const messages = [
    {
      role: "system",
      content:
        "You are an AI assistant that helps complete the user's text input. Provide a natural continuation of the text without adding any questions or extra conversation.",
    },
    {
      role: "user",
      content: text,
    },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 10,
      temperature: 0.5,
      n: 1,
      stop: null, // Ensure that the assistant doesn't stop early
    });

    const suggestion = response.choices[0].message.content.trim();

    return NextResponse.json({ suggestion });
  } catch (error) {
    console.error("Error fetching suggestion:", error);
    return NextResponse.json(
      { error: "Error fetching suggestion" },
      { status: 500 },
    );
  }
};
