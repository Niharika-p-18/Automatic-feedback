import { generateObject } from "ai"
import { google } from "@ai-sdk/google" // Ensure you have @ai-sdk/google installed
import { z } from "zod"

// 1. Defined the schema (kept your original feedbackSchema)
const feedbackSchema = z.object({
  overallScore: z.number().describe("Overall score from 0-100"),
  summary: z.string().describe("2-3 sentence summary of the overall quality"),
  strengths: z.array(z.object({ title: z.string(), description: z.string() })),
  improvements: z.array(z.object({ title: z.string(), description: z.string(), severity: z.enum(["high", "medium", "low"]) })),
  annotations: z.array(z.object({
    text: z.string(),
    issue: z.string(),
    suggestion: z.string(),
    category: z.enum(["grammar", "logic", "style", "accuracy", "syntax", "optimization", "clarity"]),
  })),
  weakTopics: z.array(z.string()),
  practiceRecommendations: z.array(z.object({
    topic: z.string(),
    description: z.string(),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  })),
  letterGrade: z.string(),
})

const typeInstructions: Record<string, string> = {
  essay: `You are an expert writing tutor and essay grader...`,
  coding: `You are an expert programming tutor and code reviewer...`,
  maths: `You are an expert math tutor and problem grader...`,
}

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { content, type } = await req.json()
    const systemPrompt = typeInstructions[type] || typeInstructions.essay

    // 2. Updated to use Google Gemini with generateObject
    const { object } = await generateObject({
      model: google("gemini-3-flash-preview"),
      schema: feedbackSchema,
      system: systemPrompt,
      prompt: `Please evaluate the following ${type} submission and provide detailed feedback:\n\n${content}`,
    })

    return Response.json(object)
  } catch (err) {
    console.error("[Feedback API Error]:", err)
    const errorMessage = err instanceof Error ? err.message : "Internal server error"
    
    return Response.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}