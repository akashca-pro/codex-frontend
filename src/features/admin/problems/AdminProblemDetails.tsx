import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useParams } from "react-router-dom";
import SolutionCode from "./components/tabs/SolutionCode"
import TestCase from "./components/tabs/TestCase"
import BasicDetails from "./components/tabs/BasicDetails"
import { useAdminGetProblemDetailsQuery } from '@/apis/problem/admin'
import type { ITemplateCode } from "@/types/problem-api-types/fieldTypes";
import { DifficultyMap, LanguageMap } from "@/mappers/problem";
import { Badge } from "@/components/ui/badge";
import TemplateCode from "./components/tabs/TemplateCode";

const initialBasicDetails = {
  Id : '',
  questionId : '',
  title : '',
  description : '',
  difficulty : '',
  active : false,
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
  }] 
}

const initialTestCaseData = {
  Id : '',
  input : '',
  output : '',
  testCaseCollectionType : ''
} 

const initialTemplateCodeDate : ITemplateCode = {
  Id : '',
  language : 'javascript',
  submitWrapperCode : '',
  runWrapperCode : ''
}

interface ConvertedTestCase {
  Id: string;
  input: string;
  output: string;
  testCaseCollectionType: "run" | "submit";
}

export default function ProblemDetailsPage() {
  const { problemId } = useParams();
  const [basicDetailsData,setBasicDetailsData] = useState(initialBasicDetails);
  const [testCaseData,setTestCaseData] = useState([initialTestCaseData]);
  const [templateCodeData, setTemplateCodeData] = useState([initialTemplateCodeDate]);
  const { data, isLoading ,refetch : refetchBasicDetails } = useAdminGetProblemDetailsQuery(problemId!);
  const [activeTab, setActiveTab] = useState("basic");

  useEffect(()=>{

    const loadProblems = () => {

      if(data && data.data){
        setBasicDetailsData({
          Id : data.data.Id,
          questionId : data.data.questionId,
          title : data.data.title,
          description : data.data.description,
          active : data.data.active,
          tags : data.data.tags,
          constraints : data.data.constraints,
          difficulty : DifficultyMap[data.data.difficulty],
          examples : data.data.examples,
          starterCodes : data.data.starterCodes.map(s=>{
            return {
              Id : s.Id,
              code : s.code,
              language : LanguageMap[s.language]
            }
          })
        });
      
          const converted : ConvertedTestCase[] = [
            ...data.data.testcaseCollection.run.map(tc=>({
              Id : tc.Id, 
              input : tc.input,
              output : tc.output,
              testCaseCollectionType : 'run' as const
            })),
            ...data.data.testcaseCollection.submit.map(tc=>({
              Id : tc.Id,
              input : tc.input,
              output : tc.output,
              testCaseCollectionType : 'submit' as const
            }))
          ]
          setTestCaseData(converted)

        setTemplateCodeData(data.data.templateCodes?.map(t => {
          return {
            Id : t.Id,
            language : LanguageMap[t.language],
            submitWrapperCode : t.submitWrapperCode,
            runWrapperCode : t.runWrapperCode,
          }
        }));
      }
    }
    loadProblems();

  },[data]);

  if (isLoading) {
    return <ProblemDetailsPageSkeleton />
  }


  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{basicDetailsData.title}</h1>
          <p className="text-muted-foreground">Question ID: {basicDetailsData.questionId}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge 
          variant={'outline'}
          className={` ${basicDetailsData.active ? "border-green-500" : "border-gray-800"} `}>
            {basicDetailsData.active ? "Active" : "Inactive"}
          </Badge>
          <Badge 
          className={`
            ${basicDetailsData.difficulty === 'Easy' 
              ? 'bg-green-500' 
              : basicDetailsData.difficulty === 'Medium' 
              ? 'bg-yellow-500' 
              : 'bg-red-500'}
          `}
          >{basicDetailsData.difficulty}</Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Details</TabsTrigger>
          <TabsTrigger value="testcases">Test Cases</TabsTrigger>
          <TabsTrigger value="template">Template Code</TabsTrigger>
        </TabsList>

          <div>
            {/* Basic Details Tab */}
            <TabsContent value="basic">

              { basicDetailsData && <BasicDetails
              refetchBasicDetails={refetchBasicDetails}
               basicDetailsData={basicDetailsData} />}
  
            </TabsContent>

            {/* Test Cases Tab */}
            <TabsContent value="testcases">
                <TestCase 
                refetchBasicDetails={refetchBasicDetails}
                 problemId={problemId}
                 testCaseData={testCaseData}/>
            </TabsContent>

            {/* Template code */}
            <TabsContent value="template" >
                <TemplateCode
                  problemId={problemId}
                  templateCodes={templateCodeData}
                />
            </TabsContent>
          </div>
      
      </Tabs>
    </div>
  )
}

function ProblemDetailsPageSkeleton() {
  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
