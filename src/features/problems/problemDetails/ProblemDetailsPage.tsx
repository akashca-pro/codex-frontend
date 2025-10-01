import { useState, useEffect } from "react"
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
import { useLazyRunResultQuery } from '@/apis/problem/public'
import { useRunProblemMutation } from '@/apis/problem/public'
import type { ExecutionResult, ITestCase } from "@/types/problem-api-types/fieldTypes"


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
  const [testResults, setTestResults] = useState<ExecutionResult | undefined>(undefined)
  const [tempId, setTempId] = useState('');
  const [stdErr,setStdErr] = useState('');
  const [testCases, setTestCases] = useState<ITestCase[] | null>(null);
  const [runProblem] = useRunProblemMutation()
  const [triggerResultQuery, { isFetching }] = useLazyRunResultQuery();


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
    setTestCases(mappedDetails.run)

    const starterCode = mappedDetails.starterCodes.find(s => s.language === language) || mappedDetails.starterCodes[0];
    setCode(starterCode?.code || "");
  }
}, [data, language]);

useEffect(() => {
  if (!tempId || !isRunning) return;

  let intervalId: NodeJS.Timeout;
  const start = Date.now();

  intervalId = setInterval(async () => {
    try {
      const result = await triggerResultQuery({ tempId, problemId: problemDetails.Id }).unwrap();

      if (result.success && result.data !== null) {
        console.log(result)
        setTestResults(result.data.executionResult) 
        setIsRunning(false);
        setTempId("");
        clearInterval(intervalId);
      } else if (!result.success) {
        setIsRunning(false);
        setTempId("");
        clearInterval(intervalId);
      } else if (Date.now() - start > 10000) {
        setIsRunning(false);
        setTempId("");
        clearInterval(intervalId);
      }
    } catch (err) {
      setIsRunning(false);
      setTempId("");
      clearInterval(intervalId);
    }
  }, 500);

  return () => clearInterval(intervalId);
}, [tempId, isRunning, triggerResultQuery, problemDetails.Id]);

useEffect(() => {
  if (!testResults) return;
  console.log("Updated testResults:", testResults);
  // Do anything else you need when testResults updates
}, [testResults]);

const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    const selectedStarterCode = problemDetails.starterCodes.find(s=>s.language === newLanguage)
    setCode(selectedStarterCode?.code || code);
  }

  const handleRun = async () => {
    console.log(testCases)
    if(!code)return;
    setTestResults(undefined);
    setIsRunning(true);
    setTempId('');
    const payload = {
        language,
        userCode : code,
        testCases : testCases!
    }
    try {
      const res = await runProblem({problemId : problemDetails.Id, payload}).unwrap();
      if (res?.data?.tempId) {
        setTempId(res.data.tempId); 
      } else {
        throw new Error("Failed to get a valid execution ID.");
      }
      setTempId(res.data.tempId);
    } catch (error : any) {
      const apiErrors = error?.data?.error
      if (Array.isArray(apiErrors) && apiErrors.length > 0) {
        apiErrors.forEach((e: any) => {
          toast.error(`field : ${e.field}`, {
            description: `Error : ${e.message}`,
          })
        })
      }
      toast.error('Error',{
          className : 'error-toast',
          description : error?.data?.message
      })
      setIsRunning(false); 
    }

  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsSubmitting(false)
    toast.success("Solution submitted successfully!")
  }

  const handleReset = () => {
    setCode(code)
    setTestResults(undefined)
    toast.info("Editor code has been reset!",{
      position : 'bottom-right'
    })
  }

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
      <Allotment.Pane minSize={300} preferredSize="35%">
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
            <div className="h-full w-full">
              {testCases && <TestCasePanel
                testCases={testCases}
                onTestCasesChange={setTestCases}
                onRun={handleRun}
                onSubmit={handleSubmit}
                onReset={handleReset}
                isRunning={isRunning}
                isSubmitting={isSubmitting}
                runResult={testResults}
              />}
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
