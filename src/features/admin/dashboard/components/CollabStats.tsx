import { motion } from "framer-motion"
import { Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface CollabStatsProps {
  total: { active: number; ended: number; offline: number }
  today: { active: number; ended: number; offline: number }
  delay?: number
}

export function CollabStats({ total, today, delay = 0 }: CollabStatsProps) {
  const stats = [
    { label: "Active", value: total.active, todayValue: today.active, color: "bg-green-500/20 text-green-400" },
    { label: "Ended", value: total.ended, todayValue: today.ended, color: "bg-blue-500/20 text-blue-400" },
    { label: "Offline", value: total.offline, todayValue: today.offline, color: "bg-yellow-500/20 text-yellow-400" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: delay + 0.1 * (index + 1) }}
          whileHover={{ y: -4 }}
        >
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="h-4 w-4 text-primary" />
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-2xl font-bold">{stat.value}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Today</span>
                <Badge variant="outline" className={stat.color}>
                  {stat.todayValue}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
