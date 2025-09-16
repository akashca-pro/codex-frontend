import { useState } from "react"
import { motion } from "framer-motion"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import FormField from "../FormField"
import { BulkUploadSchema, type BulkUploadSchemaType } from "../../../validation/schema"

interface BulkUploadDialogProps {
  open: boolean
  onClose: () => void,
  onSuccess : (data : BulkUploadSchemaType) => void
}

export default function BulkUploadDialog({ open, onClose, onSuccess } : BulkUploadDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [testType, setTestType] = useState<"run" | "submit">("run")

  const form = useForm<BulkUploadSchemaType>({
    resolver: zodResolver(BulkUploadSchema),
    defaultValues: {
      testCase: [{ input: "", output: "" , }],
      testCaseCollectionType : 'run'
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "testCase",
  })

  const onSubmit = async (data: BulkUploadSchemaType) => {
      setIsSubmitting(true)
      onSuccess?.(data)
      form.reset()
      onClose();
      setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={(open)=>{if(!open)onClose()}}>
      <DialogContent 
      className="sm:max-w-4xl max-h-[90vh] overflow-y-auto"
      onInteractOutside={(e) => e.preventDefault()} 
      onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <DialogTitle>Bulk Upload Test Cases</DialogTitle>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <FormField label="Test Case Type" description="All test cases will be added as this type" required>
              <Select
                value={testType}
                onValueChange={(value: "run" | "submit") => setTestType(value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="run">Run</SelectItem>
                  <SelectItem value="submit">Submit</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Test Cases</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ input: "", output: "" })}
                  disabled={isSubmitting}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Case
                </Button>
              </div>

              {fields.map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border border-border rounded-lg space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Test Case {index + 1}</h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        disabled={isSubmitting}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Input" error={form.formState.errors.testCase?.[index]?.input?.message} required>
                      <Textarea
                        {...form.register(`testCase.${index}.input`)}
                        placeholder="Enter input..."
                        className="min-h-[80px] font-mono text-sm"
                        disabled={isSubmitting}
                      />
                    </FormField>

                    <FormField
                      label="Expected Output"
                      error={form.formState.errors.testCase?.[index]?.output?.message}
                      required
                    >
                      <Textarea
                        {...form.register(`testCase.${index}.output`)}
                        placeholder="Enter expected output..."
                        className="min-h-[80px] font-mono text-sm"
                        disabled={isSubmitting}
                      />
                    </FormField>
                  </div>
                </motion.div>
              ))}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onClose()} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Uploading..." : `Upload ${fields.length} Test Cases`}
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
