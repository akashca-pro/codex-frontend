import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Play, CheckCircle, XCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface TestResultProps {
  totalCount: number
  stdOut?: string | undefined
  testResults: {
    Id?: string
    index?: string
    input: string
    output: string
    expectedOutput?: string
    passed: boolean
    executionTimeMs: number
    memoryMB: number
  }[]
}


const TestResult = (props: TestResultProps) => {
  const [stdOut,setStdOut] = useState(props.stdOut);
  useEffect(()=>{
    setStdOut(props.stdOut)
  },[stdOut, props.stdOut])
  return (
    <div>
      {props.totalCount >= 0 ? (
        <>
          {/* Summary chips */}
          <ScrollArea className="w-full">
            <div className="flex items-center gap-2 pb-2">
              {props.testResults.map((rc, i) => {
                return (
                    <div
                    key={rc.Id}
                    className={cn(
                        "inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium",
                        rc.passed
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400"
                    )}
                    >
                    {rc.passed ? <CheckCircle className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                    {"Case " + (i + 1)}
                    {typeof rc.executionTimeMs === "number" && (
                        <Badge variant="outline" className="ml-2 h-5 text-[10px]">
                        <Clock className="h-3 w-3 mr-1" />
                        {rc.executionTimeMs}ms
                        </Badge>
                    )}
                    </div>
                )
              })}
            </div>
          </ScrollArea>

          {/* Detailed results */}
          <ScrollArea className="h-[180px]">
            <div className="space-y-3">
              {props.testResults.map((rc, i) => (
                <motion.div
                  key={rc.Id + "-detail-" + i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={cn(
                    "p-3 rounded-lg border",
                    rc.passed
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : "border-red-500/30 bg-red-500/5"
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {rc.passed ? (
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm font-medium">{"Test Case " + (i + 1)}</span>
                    {typeof rc.executionTimeMs === "number" && (
                      <Badge variant="outline" className="ml-auto text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {rc.executionTimeMs}ms
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm font-mono">
                    <div>
                      <span className="text-muted-foreground">Input:</span>{" "}
                      <span className="text-foreground break-words">{rc.input}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Output:</span>{" "}
                      <span className={cn(rc.passed ? "text-emerald-500" : "text-red-500")}>
                        {rc.output}
                      </span>
                    </div>
                    {typeof rc.expectedOutput !== "undefined" && (
                      <div>
                        <span className="text-muted-foreground">Expected:</span>{" "}
                        <span className="text-foreground break-words">{rc.expectedOutput}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            {stdOut && (
              <div className="mt-3 rounded-md border bg-muted/40 p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Stdout</div>
                </div>
                <pre className="whitespace-pre-wrap font-mono text-xs mt-2">{stdOut.split('\n')[0]}</pre>
              </div>
            )}
            </div>
          </ScrollArea>
        </>
      ) : (
        <div className="flex items-center justify-center h-[180px] text-muted-foreground">
          <div className="text-center">
            <Play className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Run your code to see results</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default TestResult
