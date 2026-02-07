import { generateText, Output } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

export const maxDuration = 60

const feedbackSchema = z.object({
  overallScore: z.number().describe("Overall score from 0-100"),
  summary: z.string().describe("2-3 sentence summary of the overall quality"),
  strengths: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    )
    .describe("List of 2-4 strong points"),
  improvements: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        severity: z.enum(["high", "medium", "low"]),
      })
    )
    .describe("List of 2-5 areas that need improvement with severity"),
  annotations: z
    .array(
      z.object({
        text: z
          .string()
          .describe("The exact problematic text snippet or line reference"),
        issue: z.string().describe("What the issue is"),
        suggestion: z.string().describe("How to fix it"),
        category: z.enum([
          "grammar",
          "logic",
          "style",
          "accuracy",
          "syntax",
          "optimization",
          "clarity",
        ]),
      })
    )
    .describe("Specific inline annotations highlighting problem areas"),
  weakTopics: z
    .array(z.string())
    .describe("List of 2-4 topic areas the student should practice more"),
  practiceRecommendations: z
    .array(
      z.object({
        topic: z.string(),
        description: z.string(),
        difficulty: z.enum(["beginner", "intermediate", "advanced"]),
      })
    )
    .describe(
      "3-5 specific practice exercises recommended based on weaknesses"
    ),
  letterGrade: z.string().describe("Letter grade A+ through F"),
})

export async function POST(req: Request) {
  const { content, type } = await req.json()

  const typeInstructions: Record<string, string> = {
    essay: `You are an expert writing tutor and essay grader. Evaluate the essay for:
- Thesis clarity and strength
- Argument structure and logical flow
- Evidence and supporting details
- Grammar, spelling, and punctuation
- Style, tone, and word choice
- Conclusion effectiveness
Be encouraging but honest. Speak in a friendly, Gen Z-accessible tone.`,
    coding: `You are an expert programming tutor and code reviewer. Evaluate the code for:
- Correctness and functionality
- Code style and readability
- Efficiency and optimization
- Error handling
- Best practices and design patterns
- Documentation and comments
Be encouraging but thorough. Speak in a friendly, Gen Z-accessible tone.`,
    maths: `You are an expert math tutor and problem grader. Evaluate the work for:
- Mathematical accuracy
- Problem-solving approach
- Step-by-step reasoning
- Notation and presentation
- Understanding of concepts
- Completeness of solution
Be encouraging but precise. Speak in a friendly, Gen Z-accessible tone.`,
  }

  const systemPrompt = typeInstructions[type] || typeInstructions.essay

  try {
    const result = await generateText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      prompt: `Please evaluate the following ${type} submission and provide detailed feedback:\n\n${content}`,
      output: Output.object({ schema: feedbackSchema }),
    })

    console.log("[v0] generateText result.output:", JSON.stringify(result.output)?.slice(0, 200))

    if (!result.output) {
      console.log("[v0] result.text:", result.text?.slice(0, 500))
      return Response.json(
        { error: "AI did not return structured feedback. Please try again." },
        { status: 500 }
      )
    }

    return Response.json(result.output)
  } catch (err) {
    console.error("[v0] Feedback API error:", err)
    return Response.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    )
  }
}
