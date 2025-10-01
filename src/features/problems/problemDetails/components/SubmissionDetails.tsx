import { useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, XCircle, Clock, Cpu, Code } from "lucide-react"

// Types aligned to your API
export type Stats = {
  totalTestCase: number
  passedTestCase: number
  failedTestCase: number
  executionTimeMs?: number
  memoryMB?: number
}

export type FailedTestCase = {
  index: number
  input: string
  output: string
  expectedOutput: string
}

export type ExecutionResult = {
  stats?: Stats
  failedTestCase?: FailedTestCase
}

export type Submission = {
  _id: string
  problemId: string
  userId: string
  country: string
  title: string
  battleId?: string | null
  score: number
  status: string // e.g., "Accepted", "Wrong Answer", "Runtime Error"
  language: string // "JAVASCRIPT" | "PYTHON" | "GO" etc.
  userCode: string
  executionResult?: ExecutionResult
  difficulty: string // e.g., "EASY" | "MEDIUM" | "HARD"
  isFirst: boolean
  updatedAt: string
  createdAt: string
}

function statusColor(status: string) {
  const s = status.toLowerCase()
  if (s.includes("accept")) return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
  if (s.includes("wrong") || s.includes("fail")) return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30"
  if (s.includes("runtime") || s.includes("error") || s.includes("time limit")) {
    return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30"
  }
  return "bg-muted/50 text-foreground border-border/50"
}

function langBadge(lang: string) {
  return lang?.toUpperCase() || "UNKNOWN"
}

function formatNumber(n?: number) {
  if (typeof n !== "number") return "-"
  if (Number.isInteger(n)) return n.toString()
  return n.toFixed(2)
}

function formatDate(iso?: string) {
  if (!iso) return "-"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "-"
  return d.toLocaleString()
}

export interface SubmissionDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  submission: Submission | null
}

export function SubmissionDetailsDialog({ open, onOpenChange, submission }: SubmissionDetailsDialogProps) {
  const stats = submission?.executionResult?.stats
  const failed = submission?.executionResult?.failedTestCase

  const accepted = useMemo(() => {
    if (!stats) return false
    return stats.totalTestCase > 0 && stats.passedTestCase === stats.totalTestCase && stats.failedTestCase === 0
  }, [stats])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="flex items-center gap-2">
            <span className="truncate">{submission?.title ?? "Submission Details"}</span>
            {submission?.status && (
              <Badge variant="outline" className={`border ${statusColor(submission.status)}`}>
                {submission.status}
              </Badge>
            )}
          </DialogTitle>
          <div className="px-0 pt-2 text-xs text-muted-foreground">
            <span>Language: </span>
            <Badge variant="secondary" className="ml-1">
              {langBadge(submission?.language || "")}
            </Badge>
            <span className="ml-3">Submitted:</span> <span className="ml-1">{formatDate(submission?.createdAt)}</span>
          </div>
        </DialogHeader>
        <Separator />

        <div className="px-6 py-4">
          {/* Summary metrics */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Total: {stats?.totalTestCase ?? "-"}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Passed: {stats?.passedTestCase ?? "-"}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Failed: {stats?.failedTestCase ?? "-"}
            </Badge>
            {typeof stats?.executionTimeMs === "number" && (
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {formatNumber(stats.executionTimeMs)} ms
              </Badge>
            )}
            {typeof stats?.memoryMB === "number" && (
              <Badge variant="outline" className="text-xs">
                <Cpu className="h-3 w-3 mr-1" />
                {formatNumber(stats.memoryMB)} MB
              </Badge>
            )}
          </div>

          {/* Accepted banner or Failed case details */}
          <div className="mt-4">
            {accepted ? (
              <Card className="border-emerald-500/30 bg-emerald-500/5">
                <CardContent className="py-3 text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  All test cases passed.
                </CardContent>
              </Card>
            ) : failed ? (
              <Card className="border-red-500/30 bg-red-500/5">
                <CardContent className="py-3">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium">Failed at Test Case {failed.index + 1}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm font-mono">
                    <div>
                      <span className="text-muted-foreground">Input:</span>{" "}
                      <span className="break-words">{failed.input}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Your Output:</span>{" "}
                      <span className="text-red-500 break-words">{failed.output}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Expected:</span>{" "}
                      <span className="break-words">{failed.expectedOutput}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-muted/40">
                <CardContent className="py-3 text-sm">Execution results not available for this submission.</CardContent>
              </Card>
            )}
          </div>

          {/* Tabs for Details and Code */}
          <div className="mt-6">
            <Tabs defaultValue="details" className="w-full">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="mt-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="rounded-md border p-3">
                    <div className="text-xs text-muted-foreground">Submission ID</div>
                    <div className="font-mono break-all">{submission?._id ?? "-"}</div>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="text-xs text-muted-foreground">Problem ID</div>
                    <div className="font-mono break-all">{submission?.problemId ?? "-"}</div>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="text-xs text-muted-foreground">User ID</div>
                    <div className="font-mono break-all">{submission?.userId ?? "-"}</div>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="text-xs text-muted-foreground">Country</div>
                    <div className="font-mono break-all">{submission?.country ?? "-"}</div>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="text-xs text-muted-foreground">Difficulty</div>
                    <div className="font-mono break-all">{submission?.difficulty ?? "-"}</div>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="text-xs text-muted-foreground">Score</div>
                    <div className="font-mono break-all">{submission?.score ?? "-"}</div>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="text-xs text-muted-foreground">Created At</div>
                    <div className="font-mono break-all">{formatDate(submission?.createdAt)}</div>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="text-xs text-muted-foreground">Updated At</div>
                    <div className="font-mono break-all">{formatDate(submission?.updatedAt)}</div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="code" className="mt-3">
                <div className="rounded-md border">
                  <div className="flex items-center justify-between px-3 py-2 border-b">
                    <div className="text-xs text-muted-foreground">User Code</div>
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                      <Code className="h-3.5 w-3.5 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <ScrollArea className="h-[300px]">
                    <pre className="p-3 text-xs font-mono whitespace-pre">{submission?.userCode ?? ""}</pre>
                  </ScrollArea>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
