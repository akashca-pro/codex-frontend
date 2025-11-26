import { useState, useEffect } from "react"
import { Allotment } from "allotment"
import "allotment/dist/style.css"
import { toast } from "sonner"
import MonacoEditor from "@/components/MonacoEditor"
import ProblemDetailsComponent from "./components/tabs/ProblemDetails"
import TestCasePanel from "./components/TestCasePanel"
import NotesPanel from "./components/NotesPanel"
import { useNavigate, useParams } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import IDEToolbar from "@/features/CodePad/components/Toolbar"
import { usePublicGetProblemDetailsQuery } from '@/apis/problem/public'
import { DifficultyMap, LanguageMap } from "@/mappers/problem"
import ProblemDetailsPageSkeleton from "./components/LoadingSkeleton"
import { useLazyRunResultQuery } from '@/apis/problem/public'
import { useRunProblemMutation } from '@/apis/problem/public'
import type { ExecutionResult, ITestCase } from "@/types/problem-api-types/fieldTypes"
import Submissions from "./components/tabs/Submissions"
import { useLazySubmitResultQuery, useListProblemSpecificSubmissionsQuery, useSubmitProblemMutation } from '@/apis/problem/user'
import { useSelect } from '@/hooks/useSelect'
import { usePolling } from "@/hooks/usePolling"

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
  const { user } = useSelect();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"problemInfo" | "submissions">("problemInfo")
  const [editorTheme, setEditorTheme] = useState('codexDark');
  const [intelliSense, setIntelliSense] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const [problemDetails,setProblemDetails] = useState(initialProblemDetails);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('')
  const [showNotes, setShowNotes] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<ExecutionResult | undefined>(undefined);
  const [tempId, setTempId] = useState('');
  const [submissionId, setSubmissionId] = useState('');
  const [testCases, setTestCases] = useState<ITestCase[] | null>(null);
  const [hasSubmissionResults, setHasSubmissionResults] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);

  const [submitProblem] = useSubmitProblemMutation();
  const [runProblem] = useRunProblemMutation()
  const [triggerRunResultQuery] = useLazyRunResultQuery();
  const [triggerSubmitResultQuery] = useLazySubmitResultQuery();
  const { problemId } = useParams()
  const { data, isLoading } = usePublicGetProblemDetailsQuery(problemId!, {
    skip: !problemId,
  });
  const {
    data: submissions,
    isFetching: isFetchingSubmissions,
    refetch: refetchSubmissions,
  } = useListProblemSpecificSubmissionsQuery(
    {
      problemId : problemId!,
      params: {
        limit: 10,
        nextCursor,
      },
    },
    { skip: !problemId }
  );


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

// Fetching run results
usePolling({
  id: tempId,
  isActive: isRunning && !!tempId,
  onPoll: async (id) => {
    const result = await triggerRunResultQuery({ tempId: id, problemId: problemDetails.Id }).unwrap()
    return result.success && result.data ? result.data.executionResult : null
  },
  onSuccess: (executionResult) => {
    setTestResults(executionResult)
    setIsRunning(false)
    setTempId("")
  },
  onError: () => {
    setIsRunning(false)
    setTempId("")
  }
})

// Fetching submit results
usePolling({
  id: submissionId,
  isActive: isRunning && !!submissionId,
  onPoll: async (id) => {
    const result = await triggerSubmitResultQuery({ problemId: problemDetails.Id, submissionId: id }).unwrap()
    console.log(result);
    return result.success && result.data ? result.data.executionResult : null
  },
  onSuccess: (executionResult) => {
    setTestResults(executionResult)
    setIsRunning(false)
    setSubmissionId("")
    setHasSubmissionResults(true);
  },
  onError: () => {
    setIsRunning(false)
    setSubmissionId("")
  }
})

useEffect(() => {
  if (hasSubmissionResults) {
    setActiveTab("submissions");   
    refetchSubmissions(); 
    setHasSubmissionResults(false);
  }
}, [hasSubmissionResults]);

const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    const selectedStarterCode = problemDetails.starterCodes.find(s=>s.language === newLanguage)
    setCode(selectedStarterCode?.code || code);
  }

  const handleRun = async () => {
    if(!code)return;
    setTestResults(undefined);
    setIsRunning(true);
    setTempId('');
    const payload = {
        language,
        userCode : JSON.stringify(code),
        testCases : testCases!
    }
    try {
      const res = await runProblem({problemId : problemDetails.Id, payload}).unwrap();
      if (res?.data?.tempId) {
        setTempId(res.data.tempId); 
      } else {
        throw new Error("Failed to get a valid execution ID.");
      }
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
    if(!code) return;
    if (!user.isAuthenticated) {
      toast.warning("Login required", {
        description: "Please log in or sign up to submit your solution.",
        action: {
          label: "Sign In",
          onClick: () => navigate('/login')
        },
      });
      return;
    }
    setTestResults(undefined);
    setIsRunning(true);
    setSubmissionId('');
    const payload = {
        country : user.details?.country ?? undefined,
        userCode : JSON.stringify(code),
        language
    }
    try {
      const res = await submitProblem({ problemId : problemDetails.Id, payload }).unwrap();
      console.log(res)
      if (res?.data?.submissionId) {
        setSubmissionId(res.data.submissionId); 
      } else {
        throw new Error("Failed to get a valid execution ID.");
      }
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

  const handleReset = () => {
    if(language === 'javascript') setCode(problemDetails.starterCodes[0].code)
    else if(language === 'python') setCode(problemDetails.starterCodes[1].code)
    else if(language === 'go') setCode(problemDetails.starterCodes[2].code)
    setTestResults(undefined)
    toast.info("Editor code has been reset!",{
      position : 'bottom-right'
    })
  }

  if(isLoading) return(<ProblemDetailsPageSkeleton/>)

  return (
    <div className="h-full bg-black">
      {/* Main Content */}
  <div className="h-screen w-screen overflow-hidden flex flex-col">
      <IDEToolbar
        editorTheme={editorTheme}
        onThemeChange={setEditorTheme}
        language={language}
        onLanguageChange={handleLanguageChange}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        intelliSense={intelliSense}
        onToggleIntelliSense={() => setIntelliSense((prev) => !prev)}
        goBackLink={'/problems'}
      />
  <div className="flex-1 overflow-hidden">
    <Allotment >
      {/* Problem Details */}
      <Allotment.Pane minSize={300} preferredSize="43.5%">
        <div className="h-full overflow-auto p-4">
          <Tabs
            value={activeTab}
            onValueChange={(v) =>
              setActiveTab(v as "problemInfo" | "submissions")
            }
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="problemInfo">
                Problem Details
              </TabsTrigger>
              <TabsTrigger value="submissions">
                Submissions
              </TabsTrigger>
            </TabsList>
            <TabsContent value="problemInfo">
              <ProblemDetailsComponent problem={problemDetails} />
            </TabsContent>
            <TabsContent value="submissions">
            <Submissions
              monacoProps={{
                language: language,
                theme: editorTheme,
              }}
              problemId={problemDetails.Id}
              submissions={submissions?.data?.submissions ?? []}
              hasMore={submissions?.data?.hasMore ?? false}
              nextCursor={nextCursor}
              setNextCursor={setNextCursor}
              isFetching={isFetchingSubmissions}
            />
            </TabsContent>
          </Tabs>
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
                runResult={testResults}
              />}
            </div>
          </Allotment.Pane>
        </Allotment>
      </Allotment.Pane>
    </Allotment>
  </div>
</div>
  {/* Notes Panel */}
  <NotesPanel isOpen={showNotes} onClose={() => setShowNotes(false)} />
</div>
  )
}
