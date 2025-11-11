import { useMemo } from "react"

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
  count: number // count < 0 means it's a padding cell
}

// --- Constants ---
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
// The week starts on Sunday (index 0) in this implementation.
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
// Column width: w-3 (12px) + gap-1 (4px) = 16px per week.
const COLUMN_WIDTH = 16; 

// --- Helper ---
const toDateString = (date: Date): string => date.toISOString().split("T")[0]

// --- Component ---
export default function CalendarHeatmap({ data }: CalendarHeatmapProps) {
  // Prepare the last 365 days
  const now = new Date()
  
  // Set time to end of day for 'now' to ensure today is included
  now.setHours(23, 59, 59, 999); 
  
  const oneYearAgo = useMemo(() => {
    const d = new Date(now)
    // Adjust by 365 days instead of a full year to avoid leap year issues
    d.setDate(d.getDate() - 365)
    // Set time to start of day for 'oneYearAgo'
    d.setHours(0, 0, 0, 0); 
    return d
  }, [now])

  //Filter only past year data (already timezone-adjusted from backend)
  const filteredData = useMemo(() => {
    return data.filter((d) => {
      const date = new Date(d.date)
      return date >= oneYearAgo && date <= now
    })
  }, [data, oneYearAgo, now])

  // Map of date → count
  const submissionsMap = useMemo(() => {
    const map = new Map<string, number>()
    for (const item of filteredData) {
      map.set(item.date, item.count)
    }
    return map
  }, [filteredData])

  // Generate every day between past year → now, and add padding
  const days: Day[] = useMemo(() => {
    const list: Day[] = []
    const start = new Date(oneYearAgo)
    start.setHours(0, 0, 0, 0)

    // date.getDay() returns 0 for Sunday
    const startDayOfWeek = start.getDay(); 

    // Add padding days (count = -1) to start on Sunday
    for (let i = 0; i < startDayOfWeek; i++) {
        const padDate = new Date(start);
        padDate.setDate(start.getDate() - (startDayOfWeek - i));
        list.push({ date: padDate, count: -1 }); 
    }

    // --- Fill the real days ---
    const current = new Date(start);
    while (current <= now) {
      const dateStr = toDateString(current)
      const count = submissionsMap.get(dateStr) || 0
      list.push({ date: new Date(current), count })
      current.setDate(current.getDate() + 1)
    }

    // --- Pad the end to complete the last week ---
    const endDayOfWeek = (list.length % 7);
    if (endDayOfWeek > 0) {
        for (let i = 0; i < (7 - endDayOfWeek); i++) {
            const padDate = new Date(current);
            padDate.setDate(current.getDate() + i);
            list.push({ date: padDate, count: -1 }); 
        }
    }

    return list
  }, [submissionsMap, oneYearAgo, now])

  // Group by weeks (each column = 7 days)
  const weeks: Day[][] = useMemo(() => {
    const grouped: Day[][] = []
    for (let i = 0; i < days.length; i += 7) {
      grouped.push(days.slice(i, i + 7))
    }
    return grouped
  }, [days])
  
  // Calculate month starting positions for precise labels
  const monthStarts = useMemo(() => {
      const starts: { month: string; weekIndex: number }[] = []
      let currentMonth = -1
      
      weeks.forEach((week, weekIndex) => {
          // Check the first valid day of the week
          const firstDay = week.find(d => d.count !== -1) || week[0];
          
          if (firstDay) {
              const dayMonth = firstDay.date.getMonth();
              
              if (dayMonth !== currentMonth || weekIndex === 0) {
                  // Only label if the day is valid or it's the very first column
                  if (firstDay.count !== -1 || weekIndex === 0) {
                       // Check if the actual month start is in this column
                       if (firstDay.date.getDate() <= 7) {
                            starts.push({
                                month: MONTH_NAMES[dayMonth],
                                weekIndex: weekIndex,
                            })
                            currentMonth = dayMonth
                       }
                  }
              }
          }
      })
      
      // Post-process: Remove duplicate month labels that might occur if a month 
      // is already displayed in the previous week's label calculation.
      const uniqueStarts = starts.filter((start, index, self) => 
          index === 0 || start.month !== self[index - 1].month
      );
      
      return uniqueStarts;
  }, [weeks])

  // Color intensity
  const getIntensity = (count: number) => {
    if (count < 0) return "bg-transparent"; // For padding cells
    if (count === 0) return "bg-gray-800"
    if (count === 1) return "bg-green-900"
    if (count === 2) return "bg-green-700"
    if (count === 3) return "bg-green-500"
    return "bg-green-400"
  }

  // --- Render ---
  return (
    <div>
      {/* Info header */}
      <div className="flex justify-between items-center mb-3 text-sm text-muted-foreground">
        <span>
          Showing activity from{" "}
          <strong>
            {oneYearAgo.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
          </strong>{" "}
          to{" "}
          <strong>
            {now.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
          </strong>
        </span>
      </div>

{/* Heatmap */}
<div className="flex w-full overflow-x-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent pr-4">
  {/* Day Labels (Vertical Axis) */}
  <div
    className="flex flex-col gap-1 mr-2 text-xs text-muted-foreground justify-between py-1"
    style={{ paddingTop: "1px" }}
  >
    {DAY_LABELS.map((label, i) => (
      <div key={i} className="h-3 flex items-center">
        {i === 1 || i === 3 || i === 5 ? label : ""}
      </div>
    ))}
  </div>

  {/* Grid Container */}
  <div className="flex flex-col flex-1 min-w-max">
    {/* Month Labels */}
    <div className="relative" style={{ height: "1rem", marginBottom: "4px" }}>
      {monthStarts.map(({ month, weekIndex }) => (
        <div
          key={`${month}-${weekIndex}`}
          className="absolute top-0 text-xs text-muted-foreground whitespace-nowrap"
          style={{ left: `${weekIndex * COLUMN_WIDTH}px` }}
        >
          {month}
        </div>
      ))}
    </div>

    {/* Heatmap Grid */}
    <div className="flex justify-start overflow-hidden gap-1">
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="flex flex-col gap-1">
          {week.map((day, dayIndex) => (
            <div
              key={`${weekIndex}-${dayIndex}`}
              className={`w-3 h-3 rounded-sm ${getIntensity(day.count)} transition-colors ${
                day.count >= 0 ? "hover:ring-2 hover:ring-primary" : ""
              }`}
              title={
                day.count >= 0
                  ? `${day.date.toDateString()}: ${day.count} ${
                      day.count === 1 ? "submission" : "submissions"
                    }`
                  : ""
              }
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