import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ChevronDown, Sparkles, Loader2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import type { IHints } from "@/types/problem-api-types/responses/user"

interface AIHintsTabProps {
  previousHints: IHints[]
  newHint?: string
  usedHints: number
  maxHints: number
  requestHint: any
  isRequestingHint: boolean
  error?: string
}

export default function AIHintsTab({
  previousHints = [],
  newHint,
  usedHints,
  maxHints,
  requestHint,
  isRequestingHint,
  error,
}: AIHintsTabProps) {
  const [expandedHints, setExpandedHints] = useState<Set<number>>(new Set())
  const canRequestHint = usedHints < maxHints

  const toggleHint = (index: number) => {
    setExpandedHints((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const handleRequestHint = async () => {
    if (!canRequestHint || isRequestingHint) return
    try {
      await requestHint()
    } catch (err) {
      console.error("Failed to request hint:", err)
    }
  }

const levelColors = {
  1: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30",
  2: "bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/30",
  3: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
  4: "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/30",
  5: "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/30",
};

  return (
    <div className="w-full space-y-4">
      {/* Header with hint counter and request button */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span className="text-sm font-medium">
            Hints used: <span className="text-primary font-semibold">{usedHints}</span>/
            <span className="text-muted-foreground">{maxHints}</span>
          </span>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleRequestHint}
                disabled={!canRequestHint || isRequestingHint}
                size="sm"
                className={cn(
                  "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600",
                  !canRequestHint && "opacity-50 cursor-not-allowed",
                )}
              >
                {isRequestingHint ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    Getting hint...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                    Ask AI for next hint
                  </>
                )}
              </Button>
            </TooltipTrigger>
            {!canRequestHint && <TooltipContent>No more hints available.</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      </div>

      <Separator />

      {/* Error state */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3"
        >
          <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </motion.div>
      )}

      {/* Previous hints list */}
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-2">
            {/* New hint first */}
            {newHint && (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
            >
                <div className="rounded-md border border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-orange-500/5 p-4 shadow-md">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
                    <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                    ✨ New Hint
                    </span>
                </div>
                <p className="text-sm leading-relaxed text-foreground">{newHint}</p>
                </div>
            </motion.div>
            )}
            {previousHints.length === 0 ? (
            <div className="flex items-center justify-center h-[240px] text-center">
                <div className="text-muted-foreground">
                <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No hints yet. Ask AI to get started!</p>
                </div>
            </div>
            ) : (
            previousHints
            .slice()
            .reverse()
            .map((h, idx) => {
                const displayIndex = previousHints.length - idx
                const isExpanded = expandedHints.has(idx)
                const difficultyLevel = Math.min(5, Math.max(1, h.level)) as 1 | 2 | 3 | 4 | 5
                const levelLabel = `Level ${difficultyLevel}`
                const createdDate = new Date(h.createdAt)
                const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true })

                return (
                <motion.div
                    key={`hint-${idx}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (idx + (newHint ? 1 : 0)) * 0.05 }} // adjust delay if newHint is present
                >
                    <Card className="overflow-hidden border bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
                    <button onClick={() => toggleHint(idx)} className="w-full text-left">
                        <CardHeader className="pb-3 cursor-pointer">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1">
                            <span className="text-xs font-semibold text-muted-foreground">
                                Hint {displayIndex}
                            </span>

                            <Badge
                                variant="outline"
                                className={cn("text-[11px] border", levelColors[difficultyLevel])}
                            >
                                {levelLabel}
                            </Badge>

                            <span className="text-xs text-muted-foreground">{timeAgo}</span>
                            </div>

                            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </motion.div>
                        </div>
                        </CardHeader>
                    </button>

                    <AnimatePresence>
                        {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Separator />
                            <CardContent className="pt-3">
                            <p className="text-sm leading-relaxed text-foreground">{h.hint}</p>
                            </CardContent>
                        </motion.div>
                        )}
                    </AnimatePresence>
                    </Card>
                </motion.div>
                )
            })
            )}
        </div>
      </ScrollArea>

      {/* Info footer */}
      <Separator />
      <div className="text-xs text-muted-foreground text-center">
        Use hints wisely. You have {maxHints - usedHints} hints remaining.
      </div>
    </div>
  )
}
