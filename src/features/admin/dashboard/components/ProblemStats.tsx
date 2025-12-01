import { motion } from "framer-motion"
import { BookOpen } from "lucide-react"
import { StatsCard } from "./StatsCard"
import { PieChart } from "./PieChart"

interface ProblemStatsProps {
  totalProblems: number
  todaysProblems: number
  difficultyWise: { difficulty: string; count: number }[]
  delay?: number
}

export function ProblemStats({ totalProblems, todaysProblems, difficultyWise, delay = 0 }: ProblemStatsProps) {
  const difficultyData = difficultyWise.map((item) => ({
    name: item.difficulty,
    value: item.count,
  }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="space-y-6"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <StatsCard
          title="Total Problems"
          value={totalProblems}
          icon={<BookOpen className="h-5 w-5 text-primary" />}
          variant="success"
          delay={delay + 0.1}
        />
        <StatsCard
          title="Today's Problems"
          value={todaysProblems}
          subtitle="New problems added today"
          variant="default"
          delay={delay + 0.2}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.3 }}
      >
        <PieChart title="Problems Difficulty Distribution" data={difficultyData} />
      </motion.div>
    </motion.div>
  )
}
