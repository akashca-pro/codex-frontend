import { useMemo, useState } from "react"

// --- Type Definitions ---
type HeatmapData = {
  date: string // e.g., "2025-11-06"
  count: number
}

interface CalendarHeatmapProps {
  data: HeatmapData[]
}

type Day = {
  date: Date
  count: number
}

// --- Constants ---
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""]

// --- Helper Function ---
const toDateString = (date: Date): string => date.toISOString().split("T")[0]

// --- Component ---
export default function CalendarHeatmap({ data }: CalendarHeatmapProps) {
  const [year, setYear] = useState<number>(new Date().getFullYear())

  // Filter data only for the selected year
  const filteredData = useMemo(() => {
    return data.filter(d => new Date(d.date).getFullYear() === year)
  }, [data, year])

  // Map of date → count
  const submissionsMap = useMemo(() => {
    const map = new Map<string, number>()
    for (const item of filteredData) {
      map.set(item.date, item.count)
    }
    return map
  }, [filteredData])

  // Generate all days in the selected year
  const days: Day[] = useMemo(() => {
    const start = new Date(year, 0, 1) // Jan 1
    const end = new Date(year, 11, 31) // Dec 31
    const daysList: Day[] = []

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dateString = toDateString(date)
      const count = submissionsMap.get(dateString) || 0
      daysList.push({ date: new Date(date), count })
    }

    return daysList
  }, [submissionsMap, year])

  // Group by weeks (each column = 7 days)
  const weeks: Day[][] = useMemo(() => {
    const grouped: Day[][] = []
    let week: Day[] = []
    days.forEach(day => {
      week.push(day)
      if (week.length === 7) {
        grouped.push(week)
        week = []
      }
    })
    if (week.length > 0) grouped.push(week)
    return grouped
  }, [days])

  // Intensity function
  const getIntensity = (count: number) => {
    if (count === 0) return "bg-gray-800"
    if (count === 1) return "bg-green-900"
    if (count === 2) return "bg-green-700"
    if (count === 3) return "bg-green-500"
    return "bg-green-400"
  }

  // --- Render ---
  return (
    <div>
      {/* Year Selector */}
      <div className="flex justify-end mb-3">
        <select
          value={year}
          onChange={e => setYear(Number(e.target.value))}
          className="bg-gray-900 text-white border border-gray-700 rounded p-1 text-sm"
        >
          {[2023, 2024, 2025, 2026].map(y => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Heatmap */}
      <div className="flex w-full">
        {/* Day Labels */}
        <div className="flex flex-col gap-1 mr-2 text-xs text-muted-foreground justify-between py-1" style={{ paddingTop: '1.25rem' }}>
          {DAY_LABELS.map((label, i) => (
            <div key={i} className="h-3 flex items-center">
              {label}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex flex-col w-full">
          {/* Month Labels */}
          <div className="flex justify-between" style={{ height: '1rem', marginBottom: '4px' }}>
            {MONTH_NAMES.map(month => (
              <div key={month} className="text-xs text-muted-foreground" style={{ minWidth: 'calc(100% / 12)', textAlign: 'center' }}>
                {month}
              </div>
            ))}
          </div>

          {/* Heatmap Grid */}
          <div className="flex justify-between overflow-hidden">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`w-3 h-3 rounded-sm ${getIntensity(day.count)} transition-colors hover:ring-2 hover:ring-primary`}
                    title={`${day.date.toDateString()}: ${day.count} ${
                      day.count === 1 ? "submission" : "submissions"
                    }`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground mt-2">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-gray-800" />
        <div className="w-3 h-3 rounded-sm bg-green-900" />
        <div className="w-3 h-3 rounded-sm bg-green-700" />
        <div className="w-3 h-3 rounded-sm bg-green-500" />
        <div className="w-3 h-3 rounded-sm bg-green-400" />
        <span>More</span>
      </div>
    </div>
  )
}