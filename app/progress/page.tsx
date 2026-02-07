"use client"

import { AppShell } from "@/components/app-shell"
import { ProgressChart } from "@/components/progress-chart"
import { TopicBreakdown } from "@/components/topic-breakdown"
import { AchievementGrid } from "@/components/achievement-grid"
import { WeeklyHeatmap } from "@/components/weekly-heatmap"

export default function ProgressPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
            Your Progress
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your growth over time and see where you shine
          </p>
        </div>

        {/* Score history chart */}
        <ProgressChart />

        {/* Topics & Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopicBreakdown />
          <WeeklyHeatmap />
        </div>

        {/* Achievements */}
        <AchievementGrid />
      </div>
    </AppShell>
  )
}
