import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Play, Pause, RotateCcw } from "lucide-react"

interface TimerProps {
  autoStart?: boolean
}

export default function Timer({ autoStart = true }: TimerProps) {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(autoStart)

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined
    if (isRunning) {
      interval = setInterval(() => setTime((t) => t + 1), 1000)
    }
    return () => interval && clearInterval(interval)
  }, [isRunning])

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return h > 0
      ? `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`
      : `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`
  }

  return (
    <Card className="px-2 py-1 bg-zinc-900/40 border border-zinc-800 rounded-lg shadow-sm h-8 flex items-center">
      <div className="flex items-center justify-between gap-2 w-full">
        {/* Timer Display */}
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-zinc-400" />
          <span className="font-mono text-xs text-zinc-100">
            {formatTime(time)}
          </span>
        </div>

        {/* Controls */}
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsRunning(!isRunning)}
            className="h-6 w-6 p-0 hover:bg-zinc-800 rounded-md"
          >
            {isRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setTime(0)
              setIsRunning(false)
            }}
            className="h-6 w-6 p-0 hover:bg-zinc-800 rounded-md"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
