import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Toolbar from "../ToolBar"
import { Button } from "@/components/ui/button"
import { Play, Plus, Trash2, Upload } from "lucide-react"
import DataTable from "../DataTable"
import { useEffect, useState } from "react"
import type { BulkUploadSchemaType, TestCaseItemSchemaType } from "../../../validation/schema"
import { Badge } from "@/components/ui/badge"
import AddTestCaseDialog from "../dialog/AddTestCaseDialog"
import BulkUploadDialog from "../dialog/BulkUploadDialog"
import ConfirmDialog from "../dialog/ConfirmDialog"
import { useAdminAddTestCaseMutation, useAdminRemoveTestCaseMutation, 
  useAdminBulkUploadTestCaseMutation } from '@/apis/problem/admin'
import { toast } from "sonner"

const TestCase = ({ testCaseData, problemId, refetchBasicDetails }) => {
  const [addTestCaseOpen, setAddTestCaseOpen] = useState(false)
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false)
  const [testCases, setTestCases] = useState<TestCaseItemSchemaType[]>([])
  const [deletingTestCase, setDeletingTestCase] = useState<TestCaseItemSchemaType>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [addTestCaseApi] = useAdminAddTestCaseMutation();
  const [removeTestCaseApi] = useAdminRemoveTestCaseMutation();
  const [bulkUploadTestCaseApi] = useAdminBulkUploadTestCaseMutation();

  useEffect(()=>{
    if(testCaseData){
      setTestCases(testCaseData)
    }
  },[testCaseData])

  const addTestCase = async (testCase: TestCaseItemSchemaType) => {
    const toastId =  toast.loading('Adding testcase, please wait . . .',{
      className : 'info-toast',
    });
    const payload = {
      problemId,
      testCaseData : {
        testCaseCollectionType : testCase.testCaseCollectionType,
        testCase : {
          input : testCase.input,
          output : testCase.output
        }
      }
    }
    try {
      await addTestCaseApi(payload).unwrap();
      refetchBasicDetails();
      toast.success('Testcase added',{
        className : 'success-toast',
        id : toastId
      })
    } catch (error : any) {
        if(error?.data?.error.length !== 0){
          toast.dismiss(toastId);
          error.data.error.map(e=>{
            toast.error(`field : ${e.field}`,{
              description : `Error : ${e.message}`
            })
          })
        }
        toast.error('Error',{
            className : 'error-toast',
            id : toastId,
            description : error?.data?.message
        })
    }
  }

  const bulkAddTestCases = async (testCases : BulkUploadSchemaType) => {
    const toastId =  toast.loading('Adding testcase, please wait . . .',{
      className : 'info-toast',
    });
    const payload = {
      problemId,
      testCases
    }
    try {
      await bulkUploadTestCaseApi(payload).unwrap();
      refetchBasicDetails();
      toast.success('Testcase added',{
        className : 'success-toast',
        id : toastId
      })
    } catch (error : any) {
        if(error?.data?.error.length !== 0){
          toast.dismiss(toastId);
          error.data.error.map(e=>{
            toast.error(`field : ${e.field}`,{
              description : `Error : ${e.message}`
            })
          })
        }
        toast.error('Error',{
            className : 'error-toast',
            id : toastId,
            description : error?.data?.message
        })
    }
  }

  const deleteTestCase = (item : TestCaseItemSchemaType) => {
    setDeleteDialogOpen(true);
    setDeletingTestCase(item);
  }

  const confirmDelete = async () => {
      const toastId = toast.loading('Removing testcase . . .',{
        className : 'info-toast'
      })
      if (!deletingTestCase?.Id) {
        toast.error("Removing testcase failed", {
          className: "error-toast",
        });
        return;
      }
      const payload = {
        problemId,
        testCaseId : deletingTestCase?.Id,
        testCaseCollectionType : deletingTestCase?.testCaseCollectionType
      }
      try {
        await removeTestCaseApi(payload).unwrap();
        refetchBasicDetails();
        setDeleteDialogOpen(false);
        toast.success('Testcase removed',{
          className : 'success-toast',
          id : toastId
        })
      } catch (error : any) {
        if(error?.data?.error.length !== 0){
          toast.dismiss(toastId);
          error.data.error.map(e=>{
            toast.error(`field : ${e.field}`,{
              description : `Error : ${e.message}`
            })
          })
        }
        toast.error('Error',{
            className : 'error-toast',
            id : toastId,
            description : error?.data?.message
        })
      }
  }

  const testCaseColumns = [
    { key: "id", header: "#", render: (_: TestCaseItemSchemaType, index: number) => index + 1 },
    {
      key: "input",
      header: "Input",
      render: (item: TestCaseItemSchemaType) => (
        <code className="text-xs bg-muted px-2 py-1 rounded">{item.input}</code>
      ),
    },
    {
      key: "output",
      header: "Output",
      render: (item: TestCaseItemSchemaType) => (
        <code className="text-xs bg-muted px-2 py-1 rounded">{item.output}</code>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (item: TestCaseItemSchemaType) => (
        <Badge variant={item.testCaseCollectionType === "run" ? "outline" : "outline"}>{item.testCaseCollectionType}</Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (item: TestCaseItemSchemaType) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => deleteTestCase(item)}
          className="bg-red-500 hover:bg-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  return (
    <div>
        <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
            <CardTitle>Test Cases</CardTitle>
            <Toolbar>
                {/* <Button variant="outline" size="sm" onClick={validateTestCases}>
                <Play className="h-4 w-4 mr-2" />
                Validate
                </Button> */}
                <Button variant="outline" size="sm" onClick={() => setBulkUploadOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Bulk Upload
                </Button>
                <Button size="sm" onClick={() => setAddTestCaseOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Test Case
                </Button>
            </Toolbar>
            </div>
        </CardHeader>
        <CardContent>
            <DataTable
            data={testCases}
            columns={testCaseColumns}
            emptyTitle="No test cases"
            emptyDescription="Add test cases to validate problem solutions."
            emptyAction={
                <Button onClick={() => setAddTestCaseOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Test Case
                </Button>
            }
            />
        </CardContent>
        </Card>

      <AddTestCaseDialog open={addTestCaseOpen} onOpenChange={setAddTestCaseOpen} onSuccess={addTestCase} />

      <BulkUploadDialog open={bulkUploadOpen} onOpenChange={setBulkUploadOpen} onSuccess={bulkAddTestCases} />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Test Case"
        description={`Are you sure you want to delete test case #${(deletingTestCase?.Id ?? '')}? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default TestCase
