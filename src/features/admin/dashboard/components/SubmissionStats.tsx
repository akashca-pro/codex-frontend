import { motion } from "framer-motion"
import { Send } from "lucide-react"
import { StatsCard } from "./StatsCard"
import { BarChart } from "./BarChart"

interface SubmissionStatsProps {
  totalSubmissions: number
  todaysSubmissions: number
  languageWise: { language: string; count: number }[]
  delay?: number
}

export function SubmissionStats({
  totalSubmissions,
  todaysSubmissions,
  languageWise,
  delay = 0,
}: SubmissionStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="space-y-6"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <StatsCard
          title="Total Submissions"
          value={totalSubmissions}
          icon={<Send className="h-5 w-5 text-primary" />}
          variant="success"
          delay={delay + 0.1}
        />
        <StatsCard
          title="Today's Submissions"
          value={todaysSubmissions}
          subtitle="Submissions in the last 24 hours"
          variant="default"
          delay={delay + 0.2}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.3 }}
      >
        <BarChart title="Language-wise Submissions" data={languageWise} xKey="language" yKey="count" color="#3b82f6" />
      </motion.div>
    </motion.div>
  )
}
