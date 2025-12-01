"use client"

import { motion } from "framer-motion"
import { RefreshCw, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardHeaderProps {
  onRefresh: () => void
  isLoading?: boolean
}

export function DashboardHeader({ onRefresh, isLoading = false }: DashboardHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <BarChart3 className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Monitor platform metrics and analytics</p>
        </div>
      </div>
      <Button
        onClick={onRefresh}
        disabled={isLoading}
        variant="outline"
        size="icon"
        className="h-10 w-10 bg-transparent"
      >
        <motion.div
          animate={{ rotate: isLoading ? 360 : 0 }}
          transition={{ duration: 1, repeat: isLoading ? Number.POSITIVE_INFINITY : 0 }}
        >
          <RefreshCw className="h-4 w-4" />
        </motion.div>
      </Button>
    </motion.div>
  )
}
