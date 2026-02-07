import { generateObject } from "ai"
import { google } from "@ai-sdk/google"
import { z } from "zod"

export const maxDuration = 60

const practiceSchema = z.object({
  question: z.string().describe("The practice question or prompt"),
  hints: z.array(z.string()).describe("2-3 progressive hints"),
  sampleAnswer: z.string().describe("A model answer or solution"),
  explanation: z.string().describe("Detailed explanation of the answer"),
  keyConceptsToReview: z
    .array(z.string())
    .describe("Key concepts this question tests"),
})

export async function POST(req: Request) {
  try {
    const { topic, difficulty, type } = await req.json()

    const { object } = await generateObject({
      // Using the stable flash model to avoid the "Not Found" error
      model: google("gemini-3-flash-preview"),
      system: `You are a creative and encouraging tutor who generates practice problems.
Your tone is friendly and Gen Z-accessible. Make problems interesting and relevant to real life when possible.
Generate a ${difficulty} level ${type} practice problem about: ${topic}.`,
      prompt: `Create a ${difficulty} difficulty ${type} practice exercise about "${topic}".
Make it engaging and educational. Include progressive hints that guide without giving away the answer.`,
      schema: practiceSchema,
    })

    return Response.json(object)
  } catch (err) {
    console.error("[Practice API Error]:", err)
    return Response.json(
      { error: err instanceof Error ? err.message : "Failed to generate practice problem" },
      { status: 500 }
    )
  }
}