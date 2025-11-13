import { motion } from "framer-motion"
import { Users } from "lucide-react"
import { StatsCard } from "./StatsCard"

interface UserStatsProps {
  totalUsers: number
  todaysUsers: number
  delay?: number
}

export function UserStats({ totalUsers, todaysUsers, delay = 0 }: UserStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="grid gap-4 md:grid-cols-2"
    >
      <StatsCard
        title="Total Users"
        value={totalUsers}
        icon={<Users className="h-5 w-5 text-primary" />}
        variant="success"
        delay={delay + 0.1}
      />
      <StatsCard
        title="New Users Today"
        value={todaysUsers}
        subtitle="Users joined in the last 24 hours"
        variant="default"
        delay={delay + 0.2}
      />
    </motion.div>
  )
}
