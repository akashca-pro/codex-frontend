import { useState } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import FormField from "../FormField"
import { AddTestCaseSchema, type AddTestCaseSchemaType } from "../../../validation/schema"

interface AddTestCaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (testCase: AddTestCaseSchemaType) => void
}

export default function AddTestCaseDialog({ open, onOpenChange, onSuccess }: AddTestCaseDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<AddTestCaseSchemaType>({
    resolver: zodResolver(AddTestCaseSchema),
    defaultValues: {
      input: "",
      output: "",
      testCaseCollectionType: "run",
    },
  })

  const onSubmit = (data: AddTestCaseSchemaType) => {
      setIsSubmitting(true)
      onSuccess?.(data)
      form.reset()
      onOpenChange(false)
      setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <DialogTitle>Add Test Case</DialogTitle>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <FormField label="Type" error={form.formState.errors.testCaseCollectionType?.message} required>
            <select
              value={form.watch("testCaseCollectionType")}
              onChange={(e) => form.setValue("testCaseCollectionType", e.target.value as "run" | "submit")}
              disabled={isSubmitting}
              className="w-full rounded-md border border-gray-300 bg-black text-white p-2"
            >
              <option value="run">Run</option>
              <option value="submit">Submit</option>
            </select>
            </FormField>

            <FormField label="Input" error={form.formState.errors.input?.message} required>
              <Textarea
                {...form.register("input")}
                placeholder="Enter test case input..."
                className="min-h-[100px] font-mono text-sm"
                disabled={isSubmitting}
              />
            </FormField>

            <FormField label="Expected Output" error={form.formState.errors.output?.message} required>
              <Textarea
                {...form.register("output")}
                placeholder="Enter expected output..."
                className="min-h-[100px] font-mono text-sm"
                disabled={isSubmitting}
              />
            </FormField>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Test Case"}
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
