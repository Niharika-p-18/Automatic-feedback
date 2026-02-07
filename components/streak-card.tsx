"use client"

import { cn } from "@/lib/utils"
import { Flame } from "lucide-react"

const days = ["M", "T", "W", "T", "F", "S", "S"]
const streakData = [true, true, true, true, true, false, false]

export function StreakCard() {
  const currentStreak = streakData.filter(Boolean).length

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
          <Flame className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">{currentStreak} Day Streak</h3>
          <p className="text-xs text-muted-foreground">Keep the momentum going</p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        {days.map((day, i) => (
          <div key={`${day}-${i}`} className="flex flex-col items-center gap-2">
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition-all",
                streakData[i]
                  ? "bg-primary text-primary-foreground glow-primary"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              {streakData[i] ? (
                <Flame className="h-4 w-4" />
              ) : (
                <span className="text-xs">{day}</span>
              )}
            </div>
            <span className="text-[10px] font-medium text-muted-foreground">{day}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
