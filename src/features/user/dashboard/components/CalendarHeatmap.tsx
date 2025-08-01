import { useMemo } from "react"

type Day = { date: Date; count: number }

export default function CalendarHeatmap() {
  const data: Day[] = useMemo(() => {
    const today = new Date()
    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())
    const days: Day[] = []

    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
      days.push({
        date: new Date(d),
        count: Math.floor(Math.random() * 5),
      })
    }

    return days
  }, [])

  const getIntensity = (count: number) => {
    if (count === 0) return "bg-muted"
    if (count === 1) return "bg-green-900"
    if (count === 2) return "bg-green-700"
    if (count === 3) return "bg-green-500"
    return "bg-green-400"
  }

  const weeks: Day[][] = useMemo(() => {
    const weeks: Day[][] = []
    let currentWeek: Day[] = []

    data.forEach((day, index) => {
      if (index > 0 && day.date.getDay() === 0) {
        weeks.push(currentWeek)
        currentWeek = []
      }
      currentWeek.push(day)
    })

    if (currentWeek.length > 0) {
      weeks.push(currentWeek)
    }

    return weeks
  }, [data])

  return (
    <div className="flex gap-1 overflow-x-auto pb-4">
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="flex flex-col gap-1">
          {week.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className={`w-3 h-3 rounded-sm ${getIntensity(day.count)} transition-colors hover:ring-2 hover:ring-primary`}
              title={`${day.date.toDateString()}: ${day.count} problems solved`}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
