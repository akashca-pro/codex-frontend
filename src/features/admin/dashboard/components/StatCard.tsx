import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface Language {
  name: string
  count: number
  color: string
}

interface StatCardProps {
  title: string
  count: number
  todayCount: number
  todayLabel?: string
  icon: LucideIcon
  isLoading: boolean
  languages?: Language[]
}

export default function StatCard({
  title,
  count,
  todayCount,
  todayLabel = "Today",
  icon: Icon,
  isLoading,
  languages,
}: StatCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const isPositive = todayCount > 0
  const percentageChange = count > 0 ? ((todayCount / count) * 100).toFixed(1) : "0"

  if (isLoading) {
    return (
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4 rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-4 w-20" />
          {languages && (
            <div className="mt-4 space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-8" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div whileHover={{ scale: 1.02, y: -2 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
      <Card className="relative overflow-hidden border border-gray-700 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">{formatNumber(count)}</div>

          <div className="flex items-center gap-2">
            <Badge
              variant={isPositive ? "default" : "secondary"}
              className={`flex items-center gap-1 ${
                isPositive
                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                  : "bg-gray-500/10 text-gray-500 border-gray-500/20"
              }`}
            >
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {formatNumber(todayCount)}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {todayLabel} (+{percentageChange}%)
            </span>
          </div>

          {/* Language breakdown for submissions */}
          {languages && (
            <div className="mt-4 space-y-2">
              <div className="text-xs font-medium text-muted-foreground mb-2">Top Languages</div>
              {languages.slice(0, 3).map((lang) => (
                <div key={lang.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: lang.color }} />
                    <span>{lang.name}</span>
                  </div>
                  <span className="text-muted-foreground">{formatNumber(lang.count)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
