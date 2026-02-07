"use client"

import { AppShell } from "@/components/app-shell"
import { SubmissionForm } from "@/components/submission-form"

export default function SubmitPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
            Submit Your Work
          </h1>
          <p className="text-muted-foreground mt-1">
            Drop your assignment below and get instant AI-powered feedback
          </p>
        </div>
        <SubmissionForm />
      </div>
    </AppShell>
  )
}
