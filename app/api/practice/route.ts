import { generateText, Output } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { z } from "zod"

const ollama = createOpenAI({
  baseURL: "http://localhost:11434/v1",
  apiKey: "ollama",
});

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
  const { topic, difficulty, type } = await req.json()

  const result = await generateText({
    model: ollama("llama3"),
    system: `You are a creative and encouraging tutor who generates practice problems. 
Your tone is friendly and Gen Z-accessible. Make problems interesting and relevant to real life when possible.
Generate a ${difficulty} level ${type} practice problem about: ${topic}.`,
    prompt: `Create a ${difficulty} difficulty ${type} practice exercise about "${topic}". 
Make it engaging and educational. Include progressive hints that guide without giving away the answer.`,
    output: Output.object({ schema: practiceSchema }),
  })

  return Response.json(result.output)
}
