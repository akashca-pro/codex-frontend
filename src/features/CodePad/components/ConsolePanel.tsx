import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { ChevronUp, ChevronDown, Trash2, Copy, AlertCircle, CheckCircle, XCircle, Terminal, Zap, Play } from "lucide-react"
import { useRef, useEffect } from "react"

interface ConsoleMessage {
  id: string
  type: "log" | "error" | "warning" | "success" | "output"
  content: string
  timestamp: Date
}

interface ConsolePanelProps {
  onRun: () => void
  isRunning?: boolean
  isOpen: boolean
  onToggle: () => void
  messages: ConsoleMessage[]
  onClear: () => void
  height?: number
}

export default function ConsolePanel({
  onRun,
  isRunning = false,
  isOpen,
  onToggle,
  messages,
  onClear,
  height = 200,
}: ConsolePanelProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const getMessageIcon = (type: ConsoleMessage["type"]) => {
    switch (type) {
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Terminal className="h-4 w-4 text-gray-400" />
    }
  }

  const getMessageColor = (type: ConsoleMessage["type"]) => {
    switch (type) {
      case "error":
        return "text-red-400"
      case "warning":
        return "text-yellow-400"
      case "success":
        return "text-green-400"
      default:
        return "text-gray-200"
    }
  }

  return (
    <motion.div
      className="border-t border-gray-800 bg-black/50 backdrop-blur-sm"
      initial={false}
      animate={{ height: isOpen ? height : 40 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
        {/* Left Section: Output Toggle */}
        <div className="flex items-start gap-2">
          <Button variant="ghost" size="sm" onClick={onToggle} className="h-6 w-6 p-0">
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
          <h3 className="text-sm font-medium text-white">Output</h3>
          <Badge variant="secondary" className="text-xs bg-gray-800 text-gray-300">
            {messages.length}
          </Badge>
        </div>

        {/* Right Section: Run, Clear, Copy */}
        <div className="flex items-center gap-2">
          <Button variant="default" size="sm" onClick={onRun} disabled={isRunning} className="h-8 gap-2">
            {isRunning ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Zap className="h-4 w-4" />
              </motion.div>
            ) : (
              <Play className="h-4 w-4" />
            )}
            {isRunning ? "Running..." : "Run"}
          </Button>

          <Button variant="ghost" size="sm" onClick={onClear} className="h-6 w-6 p-0 hover:bg-red-500/10">
            <Trash2 className="h-3 w-3 text-red-400" />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-500/10">
            <Copy className="h-3 w-3 text-gray-400" />
          </Button>
        </div>
      </div>
      {/* Messages */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ScrollArea className="flex-1 p-2 font-mono text-sm" ref={scrollAreaRef}>
              <div className="space-y-1">
                {messages.length === 0 && (
                  <p className="text-gray-500 text-xs text-center mt-4">No output yet</p>
                )}
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className="flex items-start gap-2 text-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {getMessageIcon(message.type)}
                    <span className="text-xs text-gray-500">{message.timestamp.toLocaleTimeString()}</span>
                    <span className={getMessageColor(message.type)}>{message.content}</span>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
