import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Allotment } from "allotment"
import "allotment/dist/style.css"
import { toast } from "sonner"

import MonacoEditor from "../../components/MonacoEditor"
import LanguageSelector from "../problems/problemDetails/components/LanguageSelector"
import ProblemDetails from "../problems/problemDetails/components/tabs/ProblemDetails"
import TestCasePanel from "../problems/problemDetails/components/TestCasePanel"
import Timer from "../problems/problemDetails/components/Timer"
import NotesPanel from "../problems/problemDetails/components/NotesPanel"
import LayoutControls from "../problems/problemDetails/components/LayoutControls"

// Sample problem data
const sampleProblem = {
  id: "1",
  title: "Two Sum",
  difficulty: "Easy" as const,
  description: `
    <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to target</em>.</p>
    <p>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.</p>
    <p>You can return the answer in any order.</p>
  `,
  constraints: [
    "2 ≤ nums.length ≤ 10⁴",
    "-10⁹ ≤ nums[i] ≤ 10⁹",
    "-10⁹ ≤ target ≤ 10⁹",
    "Only one valid answer exists.",
  ],
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
    },
    {
      input: "nums = [3,2,4], target = 6",
      output: "[1,2]",
    },
    {
      input: "nums = [3,3], target = 6",
      output: "[0,1]",
    },
  ],
  acceptance: "49.1%",
  submissions: "8.2M",
  companies: ["Amazon", "Google", "Microsoft", "Apple", "Facebook"],
}

const sampleTestCases = [
  {
    id: "1",
    input: "[2,7,11,15], 9",
    output: "",
    expected: "[0,1]",
  },
  {
    id: "2",
    input: "[3,2,4], 6",
    output: "",
    expected: "[1,2]",
  },
  {
    id: "3",
    input: "[3,3], 6",
    output: "",
    expected: "[0,1]",
  },
]

const defaultCode = {
  javascript: `function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}`,
  typescript: `function twoSum(nums: number[], target: number): number[] {
    const map = new Map<number, number>();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement)!, i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}`,
  python: `def twoSum(nums, target):
    num_map = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        
        if complement in num_map:
            return [num_map[complement], i]
        
        num_map[num] = i
    
    return []`,
  java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            
            map.put(nums[i], i);
        }
        
        return new int[] {};
    }
}`,
  cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> map;
        
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            
            if (map.find(complement) != map.end()) {
                return {map[complement], i};
            }
            
            map[nums[i]] = i;
        }
        
        return {};
    }
};`,
}

export default function CodingPlayground() {
  const [language, setLanguage] = useState("javascript")
  const [code, setCode] = useState(defaultCode.javascript)
  const [layout, setLayout] = useState<"horizontal" | "vertical" | "editor-only">("horizontal")
  const [showNotes, setShowNotes] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [testResults, setTestResults] = useState<any[]>([])
  const [consoleOutput, setConsoleOutput] = useState("")

  const handleLanguageChange = useCallback((newLanguage: string) => {
    setLanguage(newLanguage)
    setCode(defaultCode[newLanguage as keyof typeof defaultCode] || "")
  }, [])

  const handleRun = useCallback(async () => {
    setIsRunning(true)
    setConsoleOutput("Running code...")

    // Simulate code execution
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockResults = sampleTestCases.map((testCase, index) => ({
      ...testCase,
      output: index === 0 ? "[0,1]" : index === 1 ? "[1,2]" : "[0,1]",
      passed: true,
      executionTime: Math.floor(Math.random() * 50) + 10,
    }))

    setTestResults(mockResults)
    setConsoleOutput("Code executed successfully!\nAll test cases passed.")
    setIsRunning(false)

    toast.success("Code executed successfully!")
  }, [])

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true)

    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsSubmitting(false)
    toast.success("Solution submitted successfully!")
  }, [])

  const handleReset = useCallback(() => {
    setCode(defaultCode[language as keyof typeof defaultCode] || "")
    setTestResults([])
    setConsoleOutput("")
    toast.info("Code reset to default")
  }, [language])

  const handleLayoutChange = useCallback((newLayout: "horizontal" | "vertical" | "editor-only") => {
    setLayout(newLayout)
  }, [])

  const handleToggleNotes = useCallback(() => {
    setShowNotes(!showNotes)
  }, [showNotes])

  const handleToggleCollaboration = useCallback(() => {
    toast.info("Collaboration feature coming soon!")
  }, [])

  return (
    <div className="h-full bg-background">
      {/* Top Toolbar */}
      <motion.div
        className="h-16 border-b border-gray-800 bg-card/30 backdrop-blur-sm flex items-center justify-between px-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Coding Playground</h1>
          <LanguageSelector value={language} onChange={handleLanguageChange} />
        </div>

        <div className="flex items-center gap-4">
          <Timer />
          <LayoutControls
            layout={layout}
            onLayoutChange={handleLayoutChange}
            onToggleNotes={handleToggleNotes}
            onToggleCollaboration={handleToggleCollaboration}
            showNotes={showNotes}
          />
        </div>
      </motion.div>

      {/* Main Content */}
<div className="h-screen w-screen overflow-hidden">
  {layout === "editor-only" ? (
    // Fullscreen editor-only layout
    <div className="h-full w-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        <MonacoEditor
          value={code}
          onChange={setCode}
          language={language === "cpp" ? "cpp" : language}
          height="100%"
        />
      </div>
      <div className="h-[40%] min-h-[200px] overflow-auto">
        <TestCasePanel
          testCases={sampleTestCases}
          onRun={handleRun}
          onSubmit={handleSubmit}
          onReset={handleReset}
          isRunning={isRunning}
          isSubmitting={isSubmitting}
          results={testResults}
          consoleOutput={consoleOutput}
        />
      </div>
    </div>
  ) : (
    <Allotment vertical={layout === "vertical"}>
      {/* Problem Details */}
      <Allotment.Pane minSize={300} preferredSize="40%">
        <div className="h-full overflow-auto p-4">
          <ProblemDetails problem={sampleProblem} />
        </div>
      </Allotment.Pane>

      {/* Editor + Test Cases Section */}
      <Allotment.Pane minSize={400}>
        <Allotment vertical>
          <Allotment.Pane minSize={200}>
            <div className="h-full overflow-hidden p-4">
              <MonacoEditor
                value={code}
                onChange={setCode}
                language={language === "cpp" ? "cpp" : language}
                height="100%"
              />
            </div>
          </Allotment.Pane>

          <Allotment.Pane minSize={150} preferredSize="40%">
            <div className="h-full overflow-auto">
              <TestCasePanel
                testCases={sampleTestCases}
                onRun={handleRun}
                onSubmit={handleSubmit}
                onReset={handleReset}
                isRunning={isRunning}
                isSubmitting={isSubmitting}
                results={testResults}
                consoleOutput={consoleOutput}
              />
            </div>
          </Allotment.Pane>
        </Allotment>
      </Allotment.Pane>
    </Allotment>
  )}
</div>


      {/* Notes Panel */}
      <NotesPanel isOpen={showNotes} onClose={() => setShowNotes(false)} />
    </div>
  )
}
