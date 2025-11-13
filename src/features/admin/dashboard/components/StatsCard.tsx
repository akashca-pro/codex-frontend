import type React from "react"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: number | string
  subtitle?: string
  icon?: React.ReactNode
  variant?: "default" | "success" | "warning" | "destructive"
  trend?: {
    value: number
    isPositive: boolean
  }
  delay?: number
}

export function StatsCard({ title, value, subtitle, icon, variant = "default", trend, delay = 0 }: StatsCardProps) {
  const variantStyles = {
    default: "border-primary/20 hover:border-primary/40",
    success: "border-green-500/20 hover:border-green-500/40",
    warning: "border-yellow-500/20 hover:border-yellow-500/40",
    destructive: "border-red-500/20 hover:border-red-500/40",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
    >
      <Card className={cn("relative overflow-hidden border-2 transition-all", variantStyles[variant])}>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-3xl font-bold">{value}</p>
                {trend && (
                  <span className={cn("text-xs font-semibold", trend.isPositive ? "text-green-500" : "text-red-500")}>
                    {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                  </span>
                )}
              </div>
              {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
            </div>
            {icon && <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">{icon}</div>}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
