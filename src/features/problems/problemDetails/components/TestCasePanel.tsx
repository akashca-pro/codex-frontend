import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Play,
  Send,
  RotateCcw,
  Clock,
  Cpu,
  Sparkles,
} from "lucide-react"
import TestCase from "./tabs/TestCase"
import TestResult from "./tabs/TestResult"
import type { ExecutionResult } from "@/types/problem-api-types/fieldTypes"
import { z } from "zod"
import { useForm, useFieldArray } from "react-hook-form"
import type { ITestCase } from "@/types/problem-api-types/fieldTypes"
import AIHintsTab from "./tabs/AiHints"

const testCaseSchema = z.object({
  Id: z.string(),
  input: z.string(),
  output: z.string(),
})

type TestCaseForm = z.infer<typeof testCaseSchema>


interface TestCasePanelProps {
  testCases: ITestCase[]
  onRun: () => void
  onSubmit: () => void
  onReset: () => void
  isRunning?: boolean
  isSubmitting?: boolean
  runResult?: ExecutionResult
  onTestCasesChange?: (cases: TestCaseForm[]) => void
  previousHints?: Array<{ hint: string; createdAt: string }>
  newHint?: string
  usedHints?: number
  maxHints?: number
  requestHint?: any
  isRequestingHint?: boolean
  hintError?: string
  refetchHints : any
  clearNewHint : () => void
}

export default function TestCasePanel({
  testCases,
  onRun,
  onSubmit,
  onReset,
  isRunning = false,
  runResult,
  onTestCasesChange,
  previousHints = [],
  newHint,
  usedHints = 0,
  maxHints = 5,
  requestHint,
  isRequestingHint = false,
  hintError,
  refetchHints,
  clearNewHint
}: TestCasePanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState<"testcase" | "result" | "hint">("testcase")
  const [initialized, setInitialized] = useState(false)

  const { control, setValue } = useForm<{ cases: TestCaseForm[] }>({
    defaultValues: { cases: testCases || [] }, // initial parent data
  })

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "cases",
  })

  useEffect(() => {
    if (!initialized && testCases) {
      setValue("cases", testCases)
      setActiveCaseIndex(0)
      setInitialized(true)
    }
  }, [testCases, initialized, setValue])


  useEffect(() => {
    if(activeTab === 'result' || activeTab === 'testcase'){
      refetchHints();
    }
      if (newHint !== undefined) {
        clearNewHint();
    }
  }, [activeTab]);

  useEffect(() => {
    if (newHint) {
      refetchHints()
    }
  }, [newHint]);

  const [activeCaseIndex, setActiveCaseIndex] = useState(0)

  const handleAddCase = () => {
    const newCase: TestCaseForm = {
      Id: `case-${Date.now()}`,
      input: "",
      output: "",
    }
    append(newCase)
    setActiveCaseIndex(fields.length)
    if (onTestCasesChange) {
    onTestCasesChange([...fields, newCase])
  }
  }

const handleRemoveCase = (index: number) => {
  if (fields.length === 1) return
  const newCases = fields.filter((_, i) => i !== index)
  remove(index)

  // parent update
  if (onTestCasesChange) {
    onTestCasesChange(newCases)
  }

  if (activeCaseIndex >= fields.length - 1) {
    setActiveCaseIndex(fields.length - 2)
  }
}

const updateActiveCase = (patch: Partial<TestCaseForm>) => {
  const updated = {
    ...fields[activeCaseIndex],
    ...patch,
  }
  update(activeCaseIndex, updated)

  // parent update
  if (onTestCasesChange) {
    const newCases = fields.map((c, i) =>
      i === activeCaseIndex ? updated : c
    )
    onTestCasesChange(newCases)
  }
}

useEffect(() => {
  if (runResult) setActiveTab("result");
}, [runResult]);

  const totalCount = runResult?.stats?.totalTestCase || -1
  const testResults = runResult?.testResults ?? []
  const passedCount = runResult?.stats?.passedTestCase ?? 0
  const stats = runResult?.stats
  console.log(stats)


  return (
    <motion.div
      className="border-top border-border/50 h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      <Card className="h-full rounded-none border-0 border-t border-border/50 bg-card/30 backdrop-blur-sm">
        {/* Header */}
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className="text-sm font-semibold">Testcases</CardTitle>

              {stats && stats?.passedTestCase > 0 && (
                <Badge
                  variant={
                    passedCount === totalCount ? "default" : "destructive"
                  }
                  className="text-xs"
                >
                  {passedCount}/{totalCount} Passed
                </Badge>
              )}
            {(stats?.executionTimeMs !== undefined && stats?.executionTimeMs !== null) || 
            (stats?.memoryMB !== undefined && stats?.memoryMB !== null) ? (
              <div className="flex items-center gap-2">
                {stats?.executionTimeMs !== undefined && stats?.executionTimeMs !== null && (
                  <Badge variant="outline" className="text-[10px]">
                    <Clock className="h-3 w-3 mr-1" />
                    {stats.executionTimeMs}ms
                  </Badge>
                )}
                {stats?.memoryMB !== undefined && stats?.memoryMB !== null && (
                  <Badge variant="outline" className="text-[10px]">
                    <Cpu className="h-3 w-3 mr-1" />
                    {stats.memoryMB}MB
                  </Badge>
                )}
              </div>
            ) : null}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                disabled={isRunning}
                className="h-8 bg-transparent"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onRun}
                disabled={isRunning}
                className="h-8 bg-transparent"
              >
                {isRunning ? (
                  <motion.span
                    className="inline-flex items-center"
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{
                      duration: 1.2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    <Clock className="h-3 w-3 mr-1" />
                  </motion.span>
                ) : (
                  <Play className="h-3 w-3 mr-1" />
                )}
                Run
              </Button>
              <Button
                size="sm"
                onClick={onSubmit}
                disabled={isRunning}
                className="h-8"
              >
                {isRunning ? (
                  <motion.span
                    className="inline-flex items-center"
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{
                      duration: 1.2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    <Clock className="h-3 w-3 mr-1" />
                  </motion.span>
                ) : (
                  <Send className="h-3 w-3 mr-1" />
                )}
                Submit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed((c) => !c)}
                className="h-8 w-8 p-0"
                aria-label={isCollapsed ? "Expand panel" : "Collapse panel"}
              >
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Body */}
        <AnimatePresence initial={false}>
            <motion.div
              key="panel-body"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CardContent className="pt-0">
                <Tabs
                  value={activeTab}
                  onValueChange={(v) =>
                    setActiveTab(v as "testcase" | "result" | "hint")
                  }
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="testcase">Testcase</TabsTrigger>
                    <TabsTrigger value="result">
                      TestResult
                      {totalCount > 0 ? ` (${passedCount}/${totalCount})` : ""}
                    </TabsTrigger>
                    <TabsTrigger value="hints">
                      <Sparkles className="h-3.5 w-3.5 mr-1" />
                      AI Hints
                    </TabsTrigger>
                  </TabsList>

                  {/* Testcase tab */}
                  <TabsContent value="testcase" className="mt-4">
                    <TestCase
                      cases={fields}
                      activeCaseIndex={activeCaseIndex}
                      handleAddCase={handleAddCase}
                      handleRemoveCase={handleRemoveCase}
                      setActiveCaseIndex={setActiveCaseIndex}
                      updateActiveCase={updateActiveCase}
                    />
                  </TabsContent>

                  {/* Results tab */}
                  <TabsContent value="result" className="mt-4">
                    <TestResult 
                    stdout={runResult?.stats?.stdout}
                    failedOutput={runResult?.failedTestCase?.output}
                    totalCount={totalCount}
                    passedCount={passedCount}
                    testResults={testResults} 
                     />
                  </TabsContent>

                  {/* AI Hints tab */}
                  <TabsContent value="hints" className="mt-4">
                    <AIHintsTab
                      previousHints={previousHints}
                      newHint={newHint}
                      usedHints={usedHints}
                      maxHints={maxHints}
                      requestHint={requestHint || (() => Promise.resolve({ hint: "" }))}
                      isRequestingHint={isRequestingHint}
                      error={hintError}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </motion.div>
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}
