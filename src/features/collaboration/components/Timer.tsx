import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock } from "lucide-react"

interface TimerDisplayProps {
  timerStart?: number
  duration?: number
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ timerStart, duration }) => {
  const [elapsed, setElapsed] = useState("00:00:00")

  useEffect(() => {
    const interval = setInterval(() => {
      if (timerStart && duration) {
        const now = Date.now()
        const elapsedMs = now - timerStart
        const totalMs = duration * 1000

        if (elapsedMs >= totalMs) {
          setElapsed("Time's up!")
          clearInterval(interval)
        } else {
          const hours = Math.floor(elapsedMs / 3600000)
          const minutes = Math.floor((elapsedMs % 3600000) / 60000)
          const seconds = Math.floor((elapsedMs % 60000) / 1000)

          setElapsed(
            `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
          )
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [timerStart, duration])

  return (
    <motion.div
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/50 border border-border"
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
    >
      <Clock className="h-3.5 w-3.5 text-primary" />
      <span className="font-mono text-sm font-semibold">{elapsed}</span>
    </motion.div>
  )
}

export default TimerDisplay
