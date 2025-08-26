import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Play, Send, RotateCcw, ChevronUp, ChevronDown, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react"

interface TestCase {
  id: string
  input: string
  output: string
  expected: string
  passed?: boolean
  executionTime?: number
}

interface TestCasePanelProps {
  testCases: TestCase[]
  onRun: () => void
  onSubmit: () => void
  onReset: () => void
  isRunning?: boolean
  isSubmitting?: boolean
  results?: TestCase[]
  consoleOutput?: string
}

export default function TestCasePanel({
  testCases,
  onRun,
  onSubmit,
  onReset,
  isRunning = false,
  isSubmitting = false,
  results = [],
  consoleOutput = "",
}: TestCasePanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState("testcase")

  const passedTests = results.filter((test) => test.passed).length
  const totalTests = results.length

  return (
    <motion.div
      className="border-t border-gray-800"
      initial={{ height: 300 }}
      animate={{ height: isCollapsed ? 60 : 300 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <Card className="h-full rounded-none border-0 border-t border-gray-800 bg-card/30 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle className="text-sm font-medium">Test Cases</CardTitle>
              {results.length > 0 && (
                <Badge variant={passedTests === totalTests ? "default" : "destructive"} className="text-xs">
                  {passedTests}/{totalTests} Passed
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                disabled={isRunning || isSubmitting}
                className="h-8 bg-transparent"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onRun}
                disabled={isRunning || isSubmitting}
                className="h-8 bg-transparent"
              >
                {isRunning ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Play className="h-3 w-3 mr-1" />}
                Run
              </Button>
              <Button size="sm" onClick={onSubmit} disabled={isRunning || isSubmitting} className="h-8">
                {isSubmitting ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Send className="h-3 w-3 mr-1" />}
                Submit
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8 p-0">
                {isCollapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="pt-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="testcase">Test Case</TabsTrigger>
                    <TabsTrigger value="result">
                      Result {results.length > 0 && `(${passedTests}/${totalTests})`}
                    </TabsTrigger>
                    <TabsTrigger value="console">Console</TabsTrigger>
                  </TabsList>

                  <TabsContent value="testcase" className="mt-4">
                    <ScrollArea className="h-[180px]">
                      <div className="space-y-3">
                        {testCases.map((testCase, index) => (
                          <motion.div
                            key={testCase.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-3 bg-muted/30 rounded-lg"
                          >
                            <div className="text-sm font-medium mb-2">Test Case {index + 1}</div>
                            <div className="space-y-2 text-sm font-mono">
                              <div>
                                <span className="text-muted-foreground">Input:</span>{" "}
                                <span className="text-foreground">{testCase.input}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Expected:</span>{" "}
                                <span className="text-foreground">{testCase.expected}</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="result" className="mt-4">
                    <ScrollArea className="h-[180px]">
                      {results.length > 0 ? (
                        <div className="space-y-3">
                          {results.map((result, index) => (
                            <motion.div
                              key={result.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="p-3 bg-muted/30 rounded-lg"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                {result.passed ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                )}
                                <span className="text-sm font-medium">Test Case {index + 1}</span>
                                {result.executionTime && (
                                  <Badge variant="outline" className="ml-auto text-xs">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {result.executionTime}ms
                                  </Badge>
                                )}
                              </div>
                              <div className="space-y-2 text-sm font-mono">
                                <div>
                                  <span className="text-muted-foreground">Input:</span>{" "}
                                  <span className="text-foreground">{result.input}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Output:</span>{" "}
                                  <span className={result.passed ? "text-green-400" : "text-red-400"}>
                                    {result.output}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Expected:</span>{" "}
                                  <span className="text-foreground">{result.expected}</span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          <div className="text-center">
                            <Play className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Run your code to see results</p>
                          </div>
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="console" className="mt-4">
                    <ScrollArea className="h-[180px]">
                      <div className="p-3 bg-muted/30 rounded-lg font-mono text-sm">
                        {consoleOutput ? (
                          <pre className="whitespace-pre-wrap text-foreground">{consoleOutput}</pre>
                        ) : (
                          <div className="text-muted-foreground text-center py-8">
                            Console output will appear here...
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}
