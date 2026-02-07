"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Lightbulb,
  Target,
  BookOpen,
} from "lucide-react"

interface FeedbackData {
  overallScore: number
  summary: string
  strengths: { title: string; description: string }[]
  improvements: { title: string; description: string; severity: string }[]
  annotations: {
    text: string
    issue: string
    suggestion: string
    category: string
  }[]
  weakTopics: string[]
  practiceRecommendations: {
    topic: string
    description: string
    difficulty: string
  }[]
  letterGrade: string
}

function ScoreRing({ score, grade }: { score: number; grade: string }) {
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (score / 100) * circumference
  const color =
    score >= 80
      ? "text-success"
      : score >= 60
        ? "text-warning"
        : "text-destructive"

  return (
    <div className="relative flex items-center justify-center">
      <svg width="140" height="140" className="-rotate-90">
        <circle
          cx="70"
          cy="70"
          r="54"
          fill="none"
          strokeWidth="10"
          className="stroke-secondary"
        />
        <circle
          cx="70"
          cy="70"
          r="54"
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn("transition-all duration-1000 ease-out", color === "text-success" ? "stroke-success" : color === "text-warning" ? "stroke-warning" : "stroke-destructive")}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={cn("text-3xl font-bold", color)}>{score}</span>
        <span className="text-sm font-semibold text-muted-foreground">{grade}</span>
      </div>
    </div>
  )
}

export function FeedbackDisplay({ data }: { data: Partial<FeedbackData> }) {
  const hasScore = data.overallScore !== undefined && data.letterGrade

  return (
    <div className="flex flex-col gap-6">
      {/* Score & Summary */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {hasScore && (
            <ScoreRing
              score={data.overallScore!}
              grade={data.letterGrade!}
            />
          )}
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-foreground mb-2">
              Overall Assessment
            </h3>
            {data.summary ? (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {data.summary}
              </p>
            ) : (
              <div className="h-12 w-full animate-pulse rounded-lg bg-secondary" />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        {data.strengths && data.strengths.length > 0 && (
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <h4 className="text-base font-semibold text-foreground">
                What You Nailed
              </h4>
            </div>
            <div className="flex flex-col gap-3">
              {data.strengths.map((s, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-success/5 border border-success/10 p-4"
                >
                  <p className="text-sm font-semibold text-foreground">
                    {s.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Improvements */}
        {data.improvements && data.improvements.length > 0 && (
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <ArrowUpRight className="h-5 w-5 text-accent" />
              <h4 className="text-base font-semibold text-foreground">
                Level Up Here
              </h4>
            </div>
            <div className="flex flex-col gap-3">
              {data.improvements.map((imp, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-accent/5 border border-accent/10 p-4"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-foreground">
                      {imp.title}
                    </p>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-[10px] rounded-md",
                        imp.severity === "high" && "bg-destructive/10 text-destructive",
                        imp.severity === "medium" && "bg-warning/10 text-warning",
                        imp.severity === "low" && "bg-muted text-muted-foreground"
                      )}
                    >
                      {imp.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {imp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Inline Annotations */}
      {data.annotations && data.annotations.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <h4 className="text-base font-semibold text-foreground">
              Highlighted Issues
            </h4>
          </div>
          <div className="flex flex-col gap-3">
            {data.annotations.map((ann, i) => (
              <div
                key={i}
                className="rounded-xl border border-border p-4 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Badge
                    variant="secondary"
                    className="text-[10px] rounded-md shrink-0 mt-0.5 bg-primary/10 text-primary"
                  >
                    {ann.category}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono text-destructive bg-destructive/5 rounded-md px-2 py-1 mb-2 break-all">
                      {ann.text}
                    </p>
                    <p className="text-xs text-muted-foreground mb-1">
                      <span className="font-semibold text-foreground">Issue:</span>{" "}
                      {ann.issue}
                    </p>
                    <p className="text-xs text-success">
                      <span className="font-semibold">Fix:</span>{" "}
                      {ann.suggestion}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weak Topics & Practice */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data.weakTopics && data.weakTopics.length > 0 && (
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-chart-1" />
              <h4 className="text-base font-semibold text-foreground">
                Topics to Review
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.weakTopics.map((topic, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="rounded-lg px-3 py-1.5 text-xs bg-chart-1/10 text-chart-1 border border-chart-1/20"
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {data.practiceRecommendations &&
          data.practiceRecommendations.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-chart-5" />
                <h4 className="text-base font-semibold text-foreground">
                  Practice These
                </h4>
              </div>
              <div className="flex flex-col gap-2">
                {data.practiceRecommendations.map((rec, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl bg-secondary/50 p-3"
                  >
                    <Lightbulb className="h-4 w-4 text-chart-4 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">
                          {rec.topic}
                        </p>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[10px] rounded-md",
                            rec.difficulty === "beginner" && "bg-success/10 text-success",
                            rec.difficulty === "intermediate" && "bg-warning/10 text-warning",
                            rec.difficulty === "advanced" && "bg-destructive/10 text-destructive"
                          )}
                        >
                          {rec.difficulty}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {rec.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  )
}
