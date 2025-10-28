import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Play, Zap } from "lucide-react"
import { useRef, useEffect } from "react"

interface ConsolePanelProps {
  onRun: () => void
  isRunning?: boolean
  message: string
  height?: number
}

export default function ConsolePanel({
  onRun,
  isRunning = false,
  message,
  height = 200,
}: ConsolePanelProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [message])

  return (
    <motion.div
      className="border-t border-gray-800 bg-black/50 backdrop-blur-sm"
      initial={false}
      animate={{ height }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
        <h3 className="text-sm font-medium text-white">Output</h3>

        {/* Run button */}
        <Button
          variant="default"
          size="sm"
          onClick={onRun}
          disabled={isRunning}
          className="h-8 gap-2"
        >
          {isRunning ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              <Zap className="h-4 w-4" />
            </motion.div>
          ) : (
            <Play className="h-4 w-4" />
          )}
          {isRunning ? "Running..." : "Run"}
        </Button>
      </div>

      {/* Messages */}
      <div className="h-full">
        <ScrollArea
          className="flex-1 p-2 font-mono text-sm text-gray-200"
          ref={scrollAreaRef}
        >
            <motion.div
              className="flex items-start gap-2 text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <span style={{ color: '#D4D4D4', whiteSpace: 'pre-wrap' }}>{message}</span>
            </motion.div>
        </ScrollArea>
      </div>
    </motion.div>
  )
}
