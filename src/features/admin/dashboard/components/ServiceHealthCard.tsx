import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCw, Clock, Zap } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface ServiceHealth {
  name: string
  status: "UP" | "DOWN"
  lastChecked: string
  responseTime: number
  icon: LucideIcon
}

interface ServiceHealthCardProps {
  service: ServiceHealth
  onRefresh: () => void
  isLoading: boolean
  delay?: number
}

export default function ServiceHealthCard({ service, onRefresh, isLoading, delay = 0 }: ServiceHealthCardProps) {
  const Icon = service.icon

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-6 w-12 rounded-full" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const isHealthy = service.status === "UP"
  const isChecking = service.lastChecked === "Checking..."

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      <Card
        className={`relative overflow-hidden border border-gray-700 bg-card/50 backdrop-blur-sm transition-all duration-300 ${
          isHealthy ? "hover:border-green-500/30 hover:bg-green-500/5" : "hover:border-red-500/30 hover:bg-red-500/5"
        }`}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">{service.name}</CardTitle>
          </div>

          <motion.div
            animate={{
              scale: isHealthy ? 1 : [1, 1.1, 1],
              opacity: isHealthy ? 1 : [1, 0.7, 1],
            }}
            transition={{
              duration: isHealthy ? 0 : 2,
              repeat: isHealthy ? 0 : Number.POSITIVE_INFINITY,
            }}
          >
            <Badge
              variant={isHealthy ? "default" : "destructive"}
              className={`${
                isHealthy
                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                  : "bg-red-500/10 text-red-500 border-red-500/20"
              }`}
            >
              {service.status}
            </Badge>
          </motion.div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Last checked:</span>
              </div>
              <span className={isChecking ? "text-yellow-500" : ""}>{service.lastChecked}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Zap className="h-3 w-3" />
                <span>Response time:</span>
              </div>
              <span
                className={`${
                  service.responseTime === 0
                    ? "text-red-500"
                    : service.responseTime > 100
                      ? "text-yellow-500"
                      : "text-green-500"
                }`}
              >
                {service.responseTime === 0 ? "N/A" : `${service.responseTime}ms`}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full bg-transparent"
              onClick={onRefresh}
              disabled={isChecking}
            >
              <motion.div
                animate={{ rotate: isChecking ? 360 : 0 }}
                transition={{
                  duration: 1,
                  repeat: isChecking ? Number.POSITIVE_INFINITY : 0,
                  ease: "linear",
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
              </motion.div>
              {isChecking ? "Checking..." : "Check Health"}
            </Button>
          </div>
        </CardContent>

        {/* Status indicator line */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 ${isHealthy ? "bg-green-500" : "bg-red-500"}`} />
      </Card>
    </motion.div>
  )
}
