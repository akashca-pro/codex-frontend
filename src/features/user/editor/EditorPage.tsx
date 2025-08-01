import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, RotateCcw, Settings, CheckCircle, XCircle } from "lucide-react"

export default function Editor() {
  const [code, setCode] = useState(`function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}`)

  const [language, setLanguage] = useState("javascript")
  const [testResults, setTestResults] = useState([
    { input: "[2,7,11,15], target = 9", output: "[0,1]", expected: "[0,1]", passed: true },
    { input: "[3,2,4], target = 6", output: "[1,2]", expected: "[1,2]", passed: true },
    { input: "[3,3], target = 6", output: "[0,1]", expected: "[0,1]", passed: true },
  ])

  const handleRunCode = () => {
    // Simulate running code
    console.log("Running code...")
  }

  const handleSubmit = () => {
    // Simulate submitting code
    console.log("Submitting code...")
  }

  return (
    <div className="h-full flex">
      {/* Problem Description */}
      <motion.div
        className="w-1/2 border-r border-border overflow-auto"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold">1. Two Sum</h1>
              <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Easy</Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Acceptance: 49.1%</span>
              <span>Submissions: 8.2M</span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-foreground">
              Given an array of integers <code className="bg-muted px-1 py-0.5 rounded text-sm">nums</code> and an
              integer <code className="bg-muted px-1 py-0.5 rounded text-sm">target</code>, return{" "}
              <em>indices of the two numbers such that they add up to target</em>.
            </p>

            <p className="text-foreground">
              You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the
              same element twice.
            </p>

            <p className="text-foreground">You can return the answer in any order.</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Example 1:</h3>
            <div className="bg-muted p-4 rounded-lg font-mono text-sm">
              <div>
                <strong>Input:</strong> nums = [2,7,11,15], target = 9
              </div>
              <div>
                <strong>Output:</strong> [0,1]
              </div>
              <div>
                <strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Example 2:</h3>
            <div className="bg-muted p-4 rounded-lg font-mono text-sm">
              <div>
                <strong>Input:</strong> nums = [3,2,4], target = 6
              </div>
              <div>
                <strong>Output:</strong> [1,2]
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Constraints:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>2 ≤ nums.length ≤ 10⁴</li>
              <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>
              <li>-10⁹ ≤ target ≤ 10⁹</li>
              <li>Only one valid answer exists.</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Code Editor */}
      <motion.div
        className="w-1/2 flex flex-col"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Editor Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={handleRunCode}>
              <Play className="w-4 h-4 mr-2" />
              Run
            </Button>
            <Button size="sm" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </div>

        {/* Code Editor Area */}
        <div className="flex-1 p-4">
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full font-mono text-sm resize-none bg-background border-border"
            placeholder="Write your code here..."
          />
        </div>

        {/* Test Results */}
        <div className="border-t border-border">
          <Tabs defaultValue="testcase" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="testcase">Testcase</TabsTrigger>
              <TabsTrigger value="result">Result</TabsTrigger>
              <TabsTrigger value="console">Console</TabsTrigger>
            </TabsList>
            <TabsContent value="testcase" className="p-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Test Case 1</div>
                <div className="bg-muted p-3 rounded font-mono text-sm">
                  nums = [2,7,11,15]
                  <br />
                  target = 9
                </div>
              </div>
            </TabsContent>
            <TabsContent value="result" className="p-4">
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded">
                    {result.passed ? (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 space-y-1 text-sm">
                      <div>
                        <strong>Input:</strong> {result.input}
                      </div>
                      <div>
                        <strong>Output:</strong> {result.output}
                      </div>
                      <div>
                        <strong>Expected:</strong> {result.expected}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="console" className="p-4">
              <div className="bg-muted p-3 rounded font-mono text-sm text-muted-foreground">
                Console output will appear here...
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  )
}
