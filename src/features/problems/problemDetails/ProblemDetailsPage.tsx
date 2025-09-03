import { useState, useCallback, useEffect } from "react"
import { Allotment } from "allotment"
import "allotment/dist/style.css"
import { toast } from "sonner"
import MonacoEditor from "@/components/MonacoEditor"
import ProblemDetailsComponent from "./components/ProblemDetails"
import TestCasePanel from "./components/TestCasePanel"
import NotesPanel from "./components/NotesPanel"
import { useParams } from "react-router-dom"
import IDEToolbar from "@/features/CodePad/components/Toolbar"
import { usePublicGetProblemDetailsQuery } from '@/apis/problem/public'
import { DifficultyMap, LanguageMap } from "@/mappers/problem"
import ProblemDetailsPageSkeleton from "./components/LoadingSkeleton"


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

const initialProblemDetails = {
  Id : '',
  questionId : '',
  title : '',
  description : '',
  difficulty : '',
  tags : [''],
  constraints : [''],
  examples : [{
    Id : '',
    input : '',
    output : '',
    explanation : '',
  }],
  starterCodes : [{
    Id : '',
    language : '',
    code : ''
  }],
  run : [{
    Id : '',
    input : '',
    output : '',
  }] 
}



export default function ProblemDetails() {
  const { problemId } = useParams()
  const { data, isLoading } = usePublicGetProblemDetailsQuery(problemId!, {
    skip: !problemId,
  });
  const [editorTheme, setEditorTheme] = useState('codexDark');
  const [intelliSense, setIntelliSense] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const [problemDetails,setProblemDetails] = useState(initialProblemDetails);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('')
  const [showNotes, setShowNotes] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [testResults, setTestResults] = useState<any[]>([])
  const [consoleOutput, setConsoleOutput] = useState("")


useEffect(() => {
  if (data?.data) {
    const mappedDetails = {
      Id: data.data.Id,
      questionId: data.data.questionId,
      title: data.data.title,
      description: data.data.description,
      tags: data.data.tags,
      constraints: data.data.constraints,
      difficulty: DifficultyMap[data.data.difficulty],
      examples: data.data.examples,
      starterCodes: data.data.starterCodes.map(s => ({
        Id: s.Id,
        code: s.code,
        language: LanguageMap[s.language]
      })),
      run: data.data.run
    };

    setProblemDetails(mappedDetails);

    const starterCode = mappedDetails.starterCodes.find(s => s.language === language) || mappedDetails.starterCodes[0];
    setCode(starterCode?.code || "");
  }
}, [data, language]);


  console.log(problemDetails)

const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    const selectedStarterCode = problemDetails.starterCodes.find(s=>s.language === newLanguage)
    setCode(selectedStarterCode?.code || code);
  }

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
    setCode(code)
    setTestResults([])
    setConsoleOutput("")
    toast.info("Editor code has been reset!",{
      position : 'bottom-right'
    })
  }, [language])

  if(isLoading) return(<ProblemDetailsPageSkeleton/>)

  return (
    <div className="h-full bg-black">
      {/* Main Content */}
  <div className="h-screen w-screen overflow-hidden">
      <IDEToolbar
        editorTheme={editorTheme}
        onThemeChange={setEditorTheme}
        language={language}
        onLanguageChange={handleLanguageChange}
        onCollaboration={() => {}}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        intelliSense={intelliSense}
        onToggleIntelliSense={() => setIntelliSense((prev) => !prev)}
        goBackLink={'/problems'}
      />
    <Allotment >
      {/* Problem Details */}
      <Allotment.Pane minSize={300} preferredSize="27%">
        <div className="h-full overflow-auto p-4">
          <ProblemDetailsComponent problem={problemDetails} />
        </div>
      </Allotment.Pane>

      {/* Editor + Test Cases Section */}
      <Allotment.Pane minSize={400}>
        <Allotment vertical>
          <Allotment.Pane minSize={200}>
            <div className="h-full overflow-hidden">
              <MonacoEditor
                theme={editorTheme}
                value={code}
                onChange={setCode}
                language={language === "javascript" ? "javascript" : language}
                height="100%"
                fontSize={fontSize}
                intelliSense={intelliSense}
              />
            </div>
          </Allotment.Pane>

          <Allotment.Pane minSize={100} preferredSize="40%">
            <div className="h-full overflow-auto">
              <TestCasePanel
                testCases={problemDetails.run}
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
</div>
  {/* Notes Panel */}
  <NotesPanel isOpen={showNotes} onClose={() => setShowNotes(false)} />
</div>
  )
}
