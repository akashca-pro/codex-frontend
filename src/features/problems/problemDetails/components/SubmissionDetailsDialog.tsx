import { useMemo, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, XCircle, Clock, Cpu, Copy, Check } from "lucide-react"
import MonacoEditor from "@/components/MonacoEditor"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Submission } from "@/types/problem-api-types/responses/user"

// --- HELPERS ---
function statusColor(status: string) {
  const s = status.toLowerCase()
  if (s.includes("accept")) return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
  if (s.includes("wrong") || s.includes("fail")) return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30"
  if (s.includes("runtime") || s.includes("error") || s.includes("time limit"))
    return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30"
  return "bg-muted/50 text-foreground border-border/50"
}

function langBadge(lang: string | number) {
  const langStr = String(lang)
  if (langStr === "1") return "JS"
  if (langStr === "2") return "PY"
  if (langStr === "3") return "GO"
  if (isNaN(Number(langStr))) return langStr?.toUpperCase() || "UNKNOWN"
  return "UNKNOWN"
}

function formatNumber(n?: number) {
  if (typeof n !== "number") return "-"
  return Number.isInteger(n) ? n.toString() : n.toFixed(2)
}

function formatDate(iso?: string) {
  if (!iso) return "-"
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleString()
}

export interface SubmissionDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  submission: Submission | null
  monacoProps : {
    theme : string;
    language : string;
  }
}

export function SubmissionDetailsDialog({ open, onOpenChange, submission, monacoProps }: SubmissionDetailsDialogProps) {
  const [isCopied, setIsCopied] = useState(false)
  const stats = submission?.executionResult?.stats
  const failed = submission?.executionResult?.failedTestCase

  const accepted = useMemo(() => {
    if (!stats) return false
    return stats.totalTestCase > 0 && stats.passedTestCase === stats.totalTestCase && stats.failedTestCase === 0
  }, [stats])

  // Clean user code
  const cleanedUserCode = useMemo(() => {
    const code = submission?.userCode
    if (!code) return ""
    if (code.startsWith('"') && code.endsWith('"')) {
      try {
        return JSON.parse(code)
      } catch {
        return code.slice(1, -1)
      }
    }
    return code
  }, [submission?.userCode])

  const handleCopy = () => {
    if (isCopied) return
    navigator.clipboard.writeText(cleanedUserCode).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="flex items-center gap-2">
            <span className="truncate">{ "Submission Details"}</span>
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
          {submission?.isAiAssisted && (
            <div className="pt-2 text-xs">
              <Badge variant="secondary">AI Assisted</Badge>
              {submission.hintsUsed && (
                <span className="ml-2 text-muted-foreground">
                  Used {submission.hintsUsed} hint{submission.hintsUsed? "s" : ""}
                </span>
              )}
            </div>
          )}

        </DialogHeader>
        <Separator />

        {/* Scrollable area */}
        <ScrollArea className="max-h-[80vh]">
          <div className="px-6 py-4">
            {/* Summary */}
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

            {/* Test result summary */}
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
                  <CardContent className="py-3 text-sm">
                    Execution results not available for this submission.
                  </CardContent>
                </Card>
              )}
            </div>

            {/* User Code Section */}
            <div className="mt-6 rounded-md border">
              <div className="flex items-center justify-between px-3 py-2 border-b">
                <div className="text-xs text-muted-foreground">User Code</div>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={handleCopy}>
                  {isCopied ? <Check className="h-3.5 w-3.5 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                  {isCopied ? "Copied!" : "Copy"}
                </Button>
              </div>
              <div className="h-[300px]">
                <MonacoEditor
                  value={cleanedUserCode}
                  onChange={() => {}}
                  language={monacoProps.language}
                  theme={monacoProps.theme}
                  height="100%"
                  readOnly
                  fontSize={12}
                  intelliSense={false}
                />
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}