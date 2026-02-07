"use client"

import { AppShell } from "@/components/app-shell"
import { PracticeMode } from "@/components/practice-mode"

export default function PracticePage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
            Practice Mode
          </h1>
          <p className="text-muted-foreground mt-1">
            Get AI-generated exercises tailored to your weak spots
          </p>
        </div>
        <PracticeMode />
      </div>
    </AppShell>
  )
}
