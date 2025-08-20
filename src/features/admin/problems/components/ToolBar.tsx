import type React from "react"

import { motion } from "framer-motion"

interface ToolbarProps {
  children: React.ReactNode
  className?: string
}

export default function Toolbar({ children, className = "" }: ToolbarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-center justify-end gap-2 ${className}`}
    >
      {children}
    </motion.div>
  )
}
