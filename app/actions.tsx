"use server";
import { messageRateLimit } from "@/libs/rate-limit";

import { generateCarouselSlides } from "@/libs/langchain";
import { headers } from "next/headers";

export async function generateCarouselSlidesAction(userPrompt: string) {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  const ip = headers().get("x-real-ip") ?? "local";
  const rl = await messageRateLimit.limit(ip);

  if (!rl.success) {
    // TODO: Handle returning errors
    return null;
  }

  const generatedSlides = await generateCarouselSlides(
    userPrompt,
    process.env.OPENAI_API_KEY
  );
  return generatedSlides;
}