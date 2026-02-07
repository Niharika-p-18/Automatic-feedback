"use client"

import { AppShell } from "@/components/app-shell"
import { StatCard } from "@/components/stat-card"
import { RecentActivity } from "@/components/recent-activity"
import { SkillOverview } from "@/components/skill-overview"
import { StreakCard } from "@/components/streak-card"
import { FileCheck, TrendingUp, Target, Clock } from "lucide-react"

const recentItems = [
  {
    id: "1",
    type: "essay" as const,
    title: "Climate Change Argumentative Essay",
    score: 85,
    date: "2 hours ago",
    status: "reviewed" as const,
  },
  {
    id: "2",
    type: "coding" as const,
    title: "Binary Search Tree Implementation",
    score: 72,
    date: "Yesterday",
    status: "reviewed" as const,
  },
  {
    id: "3",
    type: "maths" as const,
    title: "Calculus Integration Problem Set",
    score: 64,
    date: "2 days ago",
    status: "reviewed" as const,
  },
  {
    id: "4",
    type: "essay" as const,
    title: "Shakespeare Literary Analysis",
    score: 91,
    date: "3 days ago",
    status: "reviewed" as const,
  },
]

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
            Hey there
          </h1>
          <p className="text-muted-foreground mt-1">
            {"Here's how you're doing this week. Keep crushing it."}
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Submissions"
            value="24"
            subtitle="this month"
            icon={FileCheck}
            trend="up"
            trendValue="12%"
          />
          <StatCard
            title="Avg Score"
            value="78"
            subtitle="out of 100"
            icon={Target}
            trend="up"
            trendValue="5pts"
          />
          <StatCard
            title="Improvement"
            value="+15%"
            subtitle="vs last month"
            icon={TrendingUp}
            trend="up"
            trendValue="3%"
          />
          <StatCard
            title="Study Time"
            value="12h"
            subtitle="this week"
            icon={Clock}
            trend="neutral"
            trendValue="same"
          />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <RecentActivity items={recentItems} />
          </div>
          <div className="flex flex-col gap-6">
            <StreakCard />
            <SkillOverview />
          </div>
        </div>
      </div>
    </AppShell>
  )
}
