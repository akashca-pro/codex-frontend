import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, Cpu } from "lucide-react"
import { type Submission } from "../SubmissionDetails"
import { useListProblemSpecificSubmissionsQuery } from '@/apis/problem/user'

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

export interface SubmissionsProps {
  submissions?: Submission[]
  isLoading?: boolean
  problemId : string;
}

const demoSubmissions: Submission[] = [
  {
    _id: "sub_001",
    problemId: "prob_123",
    userId: "user_001",
    country: "US",
    title: "Two Sum",
    battleId: null,
    score: 100,
    status: "Accepted",
    language: "JAVASCRIPT",
    userCode: `function twoSum(nums, target){ const map=new Map(); for(let i=0;i<nums.length;i++){ const c=nums[i]; if(map.has(target-c)) return [map.get(target-c), i]; map.set(c,i)} }`,
    executionResult: {
      stats: {
        totalTestCase: 55,
        passedTestCase: 55,
        failedTestCase: 0,
        executionTimeMs: 72.13,
        memoryMB: 36.5,
      },
    },
    difficulty: "EASY",
    isFirst: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "sub_002",
    problemId: "prob_123",
    userId: "user_001",
    country: "US",
    title: "Two Sum",
    battleId: null,
    score: 0,
    status: "Wrong Answer",
    language: "PYTHON",
    userCode: `def twoSum(nums, target): return [-1, -1]`,
    executionResult: {
      stats: {
        totalTestCase: 55,
        passedTestCase: 12,
        failedTestCase: 43,
        executionTimeMs: 85.4,
        memoryMB: 40.1,
      },
      failedTestCase: {
        index: 3,
        input: "nums=[3,2,4], target=6",
        output: "[-1,-1]",
        expectedOutput: "[1,2]",
      },
    },
    difficulty: "EASY",
    isFirst: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export default function Submissions({ submissions = demoSubmissions, isLoading = false, problemId }: SubmissionsProps) {
  const [search, setSearch] = useState("");
  const [nextCursor, setNextCursor] = useState(undefined);
  const { data } = useListProblemSpecificSubmissionsQuery({
    problemId,
    params : {
      limit : 10,
      nextCursor
    }
  });
  console.log(data);
  const filtered = useMemo(() => {
    return (submissions || [])
      .filter((s) => {
        if (!search.trim()) return true
        const q = search.toLowerCase()
        return (
          s._id.toLowerCase().includes(q) ||
          s.status.toLowerCase().includes(q) ||
          s.language.toLowerCase().includes(q) ||
          s.title.toLowerCase().includes(q)
        )
      })
  }, [submissions, search])

  const total = submissions?.length ?? 0
  const accepted = submissions?.filter((s) => s.status.toLowerCase().includes("accept")).length ?? 0

  return (
    <>
      <Card className="bg-card/40">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-lg font-semibold">Submissions</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Total: {total}</Badge>
              <Badge variant="outline">Accepted: {accepted}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Search */}
          <div className="flex flex-col md:flex-row md:items-end gap-3">
              <Input
                id="search"
                placeholder="Search by id, title, status, language"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
          </div>
          <Separator className="my-4" />
          {/* Table */}
          <ScrollArea className="h-[380px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">Status</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead className="w-[140px]">Runtime</TableHead>
                  <TableHead className="w-[120px]">Memory</TableHead>
                  <TableHead className="w-[120px]">Language</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <TableRow key={`sk-${i}`}>
                        <TableCell>
                          <Skeleton className="h-5 w-[110px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-[80px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-[70px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-[60px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-[80px]" />
                        </TableCell>
                      </TableRow>
                    ))
                  : filtered.map((s) => {
                      const res = s.executionResult?.stats
                      const statusVariant = statusBadgeVariant(s.status)
                      return (
                        <TableRow key={s._id} className="hover:bg-muted/50">
                          <TableCell>
                            <Badge variant={statusVariant as any}>{s.status}</Badge>
                          </TableCell>
                          <TableCell>
                            {res ? (
                              <div className="text-sm">
                                <span className="font-medium">
                                  {res.passedTestCase}/{res.totalTestCase}
                                </span>{" "}
                                passed
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {typeof res?.executionTimeMs === "number" ? (
                              <div className="inline-flex items-center text-sm">
                                <Clock className="h-3.5 w-3.5 mr-1" />
                                {formatNumber(res.executionTimeMs)} ms
                              </div>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell>
                            {typeof res?.memoryMB === "number" ? (
                              <div className="inline-flex items-center text-sm">
                                <Cpu className="h-3.5 w-3.5 mr-1" />
                                {formatNumber(res.memoryMB)} MB
                              </div>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{s.language?.toUpperCase() || "-"}</Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                {!isLoading && filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-sm text-muted-foreground">
                      No submissions found. Try adjusting filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  )
}
