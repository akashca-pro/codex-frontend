import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import FormField from "../FormField"
import TagInput from "../TagInput"
import { CreateProblemSchema, type CreateProblemSchemaType } from "../../../validation/schema"
import { useAdminCheckQuestionIdQuery, useAdminCheckTitleQuery, useAdminCreateProblemMutation } from '@/apis/problem/admin'
import { extractApiErrorMessage } from '@/utils/parseFetchBaseQueryError'
import { toast } from "sonner"

export default function CreateProblemDialog({ open, onClose, refetchProblemList }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateProblemSchemaType>({
    resolver: zodResolver(CreateProblemSchema),
    defaultValues: {
      questionId: "",
      title: "",
      description: "",
      difficulty: undefined,
      tags: [],
    },
  });

  const [createProblemApi] = useAdminCreateProblemMutation();

  const questionId = form.watch("questionId");
  const title = form.watch("title")

  const { 
    data : checkQuestionData, 
    error : checkQuestionError,
    isFetching : isFetchingQuestionId 
  } = useAdminCheckQuestionIdQuery({questionId},{skip : !questionId});

  const { 
    data : checkTitleData, 
    error : checkTitleError,
    isFetching : isFetchingTitleId
  } = useAdminCheckTitleQuery({title},{skip : (!title || title.trim().length <= 3)});

  const questionIdError = extractApiErrorMessage(checkQuestionError);
  const titleError = extractApiErrorMessage(checkTitleError);

  const onSubmit = async (data: CreateProblemSchemaType) => {
    if (checkQuestionError || checkTitleError) {
      return;
    }
    setIsSubmitting(true)
    const payload : CreateProblemSchemaType = {
      questionId : data.questionId,
      title : data.title,
      description : data.description,
      difficulty : data.difficulty,
      tags : data.tags 
    }
    const toastId = toast.loading('Processing...',{
      className : 'info-toast',
    })
    try {
      await createProblemApi(payload).unwrap();
      toast.success('Problem created successfully!',{
        className : 'success-toast',
        id : toastId
      });
      refetchProblemList();
      onClose();
      form.reset()
    } catch (error : any) {
      const apiErrors = error?.data?.error
      
      if (Array.isArray(apiErrors) && apiErrors.length > 0) {
        toast.dismiss(toastId);
        apiErrors.forEach((e: any) => {
          toast.error(`field : ${e.field}`, {
            description: `Error : ${e.message}`,
          })
        })
      }
        toast.error('Error',{
            className : 'error-toast',
            id : toastId,
            description : error?.data?.message
        })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open)=>{if(!open)onClose()}}>
      <DialogContent 
      className="sm:max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide "
      onInteractOutside={(e) => e.preventDefault()} 
      onEscapeKeyDown={(e) => e.preventDefault()}
      >
          <DialogHeader>
            <DialogTitle>Create New Problem</DialogTitle>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <FormField
              label="Question ID"
              description="Unique identifier for the problem (e.g., 1001)"
              error={form.formState.errors.questionId?.message || questionIdError }
              required
            >
              <Input 
              min={0}
              step={1}
              {...form.register("questionId")} type="number" placeholder="e.g., 1001" disabled={isSubmitting} />
              {questionId && !questionIdError && !isFetchingQuestionId && checkQuestionData?.message && (
                <span className="text-sm text-green-500 mt-1">
                  {checkQuestionData.message}
                </span>
              )}
            </FormField>

            <FormField
              label="Title"
              description="Problem title (3-100 characters)"
              error={form.formState.errors.title?.message || titleError}
              required
            >
              <Input {...form.register("title")} placeholder="Enter problem title" disabled={isSubmitting} />
              {title && title.trim().length >= 3 && !titleError && !isFetchingTitleId && checkTitleData?.message && (
                <span className="text-sm text-green-500 mt-1">
                  {checkTitleData.message}
                </span>
              )}
            </FormField>

            <FormField label="Description" error={form.formState.errors.description?.message} required>
              <Textarea
                {...form.register("description")}
                placeholder="Describe the problem..."
                className="min-h-[120px]"
                disabled={isSubmitting}
              />
            </FormField>

            <FormField label="Difficulty" error={form.formState.errors.difficulty?.message} required>
              <Select
                value={form.watch("difficulty")}
                onValueChange={(value: "Easy" | "Medium" | "Hard") => form.setValue("difficulty", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <FormField
              label="Tags"
              description="Add relevant tags (max 10 tags, 20 chars each)"
              error={form.formState.errors.tags?.message}
            >
              <TagInput
                tags={form.watch("tags")}
                onChange={(tags) => form.setValue("tags", tags)}
                disabled={isSubmitting}
              />
            </FormField>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => {
                onClose()
                form.reset()
                }} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Problem"}
              </Button>
            </DialogFooter>
          </form>
      </DialogContent>
    </Dialog>
  )
}
