"use client"

import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Code,
  Calculator,
  Sparkles,
  Loader2,
  Lightbulb,
  Eye,
  EyeOff,
  ChevronRight,
  BookOpen,
  RotateCcw,
} from "lucide-react"

interface PracticeData {
  question?: string
  hints?: string[]
  sampleAnswer?: string
  explanation?: string
  keyConceptsToReview?: string[]
}

const topicSuggestions = {
  essay: [
    "Persuasive Writing",
    "Thesis Statements",
    "Evidence Analysis",
    "Counter-Arguments",
    "Transitions & Flow",
    "Conclusion Writing",
  ],
  coding: [
    "Binary Search",
    "Recursion",
    "Dynamic Programming",
    "Graph Traversal",
    "Sorting Algorithms",
    "OOP Design",
  ],
  maths: [
    "Integration",
    "Derivatives",
    "Matrix Operations",
    "Probability",
    "Linear Algebra",
    "Trigonometry",
  ],
}

const difficulties = [
  {
    id: "beginner",
    label: "Beginner",
    color: "bg-success/10 text-success border-success/20",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    color: "bg-warning/10 text-warning border-warning/20",
  },
  {
    id: "advanced",
    label: "Advanced",
    color: "bg-destructive/10 text-destructive border-destructive/20",
  },
]

const types = [
  { id: "essay", label: "Essay", icon: FileText },
  { id: "coding", label: "Coding", icon: Code },
  { id: "maths", label: "Maths", icon: Calculator },
]

export function PracticeMode() {
  const [selectedType, setSelectedType] = useState("essay")
  const [selectedDifficulty, setSelectedDifficulty] = useState("intermediate")
  const [selectedTopic, setSelectedTopic] = useState("")
  const [userAnswer, setUserAnswer] = useState("")
  const [showHints, setShowHints] = useState(false)
  const [revealedHints, setRevealedHints] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [practiceData, setPracticeData] = useState<PracticeData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = useCallback(async () => {
    if (!selectedTopic) return
    setShowHints(false)
    setRevealedHints(0)
    setShowAnswer(false)
    setUserAnswer("")
    setIsLoading(true)
    setPracticeData(null)
    setError(null)

    try {
      const response = await fetch("/api/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: selectedTopic,
          difficulty: selectedDifficulty,
          type: selectedType,
        }),
      })

      if (!response.ok) {
        const errText = await response.text()
        throw new Error(errText || "Failed to generate practice")
      }

      const data = await response.json()
      setPracticeData(data)
    } catch (err) {
      console.error("Practice generation error:", err)
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again!"
      )
    } finally {
      setIsLoading(false)
    }
  }, [selectedTopic, selectedDifficulty, selectedType])

  const handleReset = () => {
    setSelectedTopic("")
    setUserAnswer("")
    setShowHints(false)
    setRevealedHints(0)
    setShowAnswer(false)
    setPracticeData(null)
    setError(null)
    setIsLoading(false)
  }

  const currentTopics =
    topicSuggestions[selectedType as keyof typeof topicSuggestions]

  return (
    <div className="flex flex-col gap-6">
      {/* Config panel */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-col gap-6">
          {/* Type */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-foreground">
              Subject
            </label>
            <div className="flex flex-wrap gap-3">
              {types.map((type) => {
                const isActive = selectedType === type.id
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => {
                      setSelectedType(type.id)
                      setSelectedTopic("")
                    }}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl border px-5 py-3 text-sm font-medium transition-all",
                      isActive
                        ? "border-primary bg-primary text-primary-foreground glow-primary"
                        : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
                    )}
                  >
                    <type.icon className="h-4 w-4" />
                    {type.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Difficulty */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-foreground">
              Difficulty
            </label>
            <div className="flex flex-wrap gap-2">
              {difficulties.map((diff) => (
                <button
                  key={diff.id}
                  type="button"
                  onClick={() => setSelectedDifficulty(diff.id)}
                  className={cn(
                    "rounded-xl border px-4 py-2 text-sm font-medium transition-all",
                    selectedDifficulty === diff.id
                      ? diff.color
                      : "border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </div>

          {/* Topic */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-foreground">
              Pick a Topic
            </label>
            <div className="flex flex-wrap gap-2">
              {currentTopics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => setSelectedTopic(topic)}
                  className={cn(
                    "rounded-xl border px-4 py-2 text-sm font-medium transition-all",
                    selectedTopic === topic
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  )}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleGenerate}
              disabled={!selectedTopic || isLoading}
              className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Exercise
                </>
              )}
            </Button>
            {practiceData && (
              <Button
                variant="ghost"
                onClick={handleReset}
                className="rounded-xl text-muted-foreground"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                New Problem
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-col gap-3">
            <div className="h-5 w-32 rounded-lg bg-secondary animate-pulse" />
            <div className="h-4 w-full rounded-lg bg-secondary animate-pulse" />
            <div className="h-4 w-3/4 rounded-lg bg-secondary animate-pulse" />
            <div className="h-4 w-1/2 rounded-lg bg-secondary animate-pulse" />
          </div>
        </div>
      )}

      {/* Question display */}
      {practiceData?.question && (
        <div className="flex flex-col gap-6">
          {/* The question */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-5 w-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">
                Practice Problem
              </h3>
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs rounded-lg ml-auto",
                  selectedDifficulty === "beginner" &&
                    "bg-success/10 text-success",
                  selectedDifficulty === "intermediate" &&
                    "bg-warning/10 text-warning",
                  selectedDifficulty === "advanced" &&
                    "bg-destructive/10 text-destructive"
                )}
              >
                {selectedDifficulty}
              </Badge>
            </div>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {practiceData.question}
            </p>
          </div>

          {/* Answer area */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <label className="text-sm font-medium text-foreground mb-3 block">
              Your Answer
            </label>
            <Textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Work on your answer here..."
              className="min-h-[160px] rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground/50 font-mono text-sm leading-relaxed"
            />
          </div>

          {/* Hints section */}
          {practiceData.hints && practiceData.hints.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-chart-4" />
                  <h4 className="text-base font-semibold text-foreground">
                    Hints
                  </h4>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHints(!showHints)}
                  className="rounded-xl text-muted-foreground"
                >
                  {showHints ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5 mr-1.5" />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5 mr-1.5" />
                      Show Hints
                    </>
                  )}
                </Button>
              </div>
              {showHints && (
                <div className="flex flex-col gap-3">
                  {practiceData.hints.map((hint, i) => (
                    <div key={i}>
                      {i <= revealedHints ? (
                        <div className="rounded-xl bg-chart-4/5 border border-chart-4/10 p-4">
                          <p className="text-xs font-semibold text-chart-4 mb-1">
                            Hint {i + 1}
                          </p>
                          <p className="text-sm text-foreground leading-relaxed">
                            {hint}
                          </p>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setRevealedHints(i)}
                          className="flex items-center gap-2 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground hover:border-chart-4/40 hover:text-chart-4 transition-colors w-full text-left"
                        >
                          <ChevronRight className="h-4 w-4" />
                          Reveal Hint {i + 1}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sample answer */}
          {practiceData.sampleAnswer && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-semibold text-foreground">
                  Model Answer
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="rounded-xl text-muted-foreground"
                >
                  {showAnswer ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5 mr-1.5" />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5 mr-1.5" />
                      Reveal Answer
                    </>
                  )}
                </Button>
              </div>
              {showAnswer && (
                <div className="flex flex-col gap-4">
                  <div className="rounded-xl bg-success/5 border border-success/10 p-4">
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                      {practiceData.sampleAnswer}
                    </p>
                  </div>
                  {practiceData.explanation && (
                    <div className="rounded-xl bg-secondary/50 p-4">
                      <p className="text-xs font-semibold text-foreground mb-1">
                        Explanation
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {practiceData.explanation}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Key concepts */}
          {practiceData.keyConceptsToReview &&
            practiceData.keyConceptsToReview.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-6">
                <h4 className="text-base font-semibold text-foreground mb-3">
                  Key Concepts Tested
                </h4>
                <div className="flex flex-wrap gap-2">
                  {practiceData.keyConceptsToReview.map((concept, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="rounded-lg px-3 py-1.5 text-xs bg-primary/10 text-primary border border-primary/20"
                    >
                      {concept}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}

      {/* Empty state */}
      {!practiceData && !isLoading && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Ready to practice?
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Pick a subject, difficulty, and topic above to generate a custom
            exercise just for you
          </p>
        </div>
      )}
    </div>
  )
}
