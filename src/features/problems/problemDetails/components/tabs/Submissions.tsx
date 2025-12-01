import { useCallback, useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { LanguageMap } from "@/mappers/problem"
import type { Submission } from "@/types/problem-api-types/responses/user"
import { SubmissionDetailsDialog } from "../SubmissionDetailsDialog"
import { Bot } from "lucide-react"

function statusBadgeVariant(status: string) {
  const s = status.toLowerCase()
  if (s.includes("accept")) return "default"
  if (s.includes("wrong") || s.includes("fail")) return "destructive"
  if (s.includes("runtime") || s.includes("error") || s.includes("time limit")) return "secondary"
  return "outline"
}

function formatNumber(n?: number) {
  if (typeof n !== "number") return "-"
  if (Number.isInteger(n)) return n.toString()
  return n.toFixed(2)
}

interface SubmissionsProps {
  problemId: string;
  monacoProps: { theme: string; language: string };
  submissions: Submission[];
  hasMore: boolean;
  nextCursor?: string;
  setNextCursor: React.Dispatch<React.SetStateAction<string | undefined>>;
  isFetching: boolean;
}

export default function Submissions({ monacoProps, submissions, nextCursor, hasMore, setNextCursor, isFetching } : SubmissionsProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || isFetching || !nextCursor) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 50 && hasMore) {
      setNextCursor(nextCursor);
    }
  }, [isFetching, nextCursor, hasMore, setNextCursor]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);


  const accepted = submissions.filter((s)=>{
    return s.executionResult?.stats?.passedTestCase === s.executionResult?.stats?.totalTestCase
  })

  return (
    <Card className="bg-card/40">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg font-semibold">Submissions</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Total: {submissions.length}</Badge>
            <Badge variant="outline">Accepted: {accepted.length}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Separator />
        {/* Scrollable container */}
        <div ref={containerRef} className="h-[550px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Runtime</TableHead>
                <TableHead>Memory</TableHead>
                <TableHead>Language</TableHead>
              </TableRow>
            </TableHeader>
              <TableBody>
                {submissions.map((s, i) => {
                  const res = s.executionResult?.stats
                  return (
                    <TableRow
                      key={i}
                      onClick={() => {
                        setSelectedSubmission(s)
                        setDialogOpen(true)
                      }}
                      className="cursor-pointer hover:bg-muted/50 transition"
                    >

                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Badge variant={statusBadgeVariant(s.status)}>{s.status}</Badge>
                          {s.isAiAssisted && <Bot className=" h-4 w-4 opacity-80" />}
                        </div>
                      </TableCell>
                      <TableCell>{res ? `${res.passedTestCase}/${res.totalTestCase}` : "-"}</TableCell>
                      <TableCell>{res ? `${formatNumber(res.executionTimeMs)} ms` : "-"}</TableCell>
                      <TableCell>{res ? `${formatNumber(res.memoryMB)} MB` : "-"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{LanguageMap[s.language] ?? "-"}</Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
          </Table>
        <SubmissionDetailsDialog
          monacoProps={monacoProps}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          submission={selectedSubmission}
        />
        </div>
      </CardContent>
    </Card>
  );
}