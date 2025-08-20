import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import FormField from "../FormField"
import LanguageSelect from "../LanguageSelect"
import { Input } from "@/components/ui/input"
import CodeEditor from "../CodeEditor"
import { Button } from "@/components/ui/button"
import { Play, Save } from "lucide-react"
import { SolutionSchema, type SolutionSchemaType } from "../../../validation/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

const SolutionCode = () => {

  const solutionForm = useForm<SolutionSchemaType>({
    resolver: zodResolver(SolutionSchema),
    defaultValues: {
      language: "javascript",
      code: "",
      executionTime: 0,
      memoryTaken: 0,
    },
  })

  const onSolutionSubmit = async (data: SolutionSchemaType) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const payload = {
        Language: data.language,
        Code: JSON.stringify(data.code),
        executionTime: data.executionTime,
        Memory: data.memoryTaken,
      }

      console.log("Solution payload:", payload)


    } catch (error) {

    }
  }

  const validateSolution = () => {
    const result = SolutionSchema.safeParse(solutionForm.getValues())
    if (result.success) {

    } else {

    }
  }


  return (
        <Card>
        <CardHeader>
            <CardTitle>Official Solution</CardTitle>
        </CardHeader>
        <CardContent>
            <form onSubmit={solutionForm.handleSubmit(onSolutionSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField label="Language" error={solutionForm.formState.errors.language?.message} required>
                <LanguageSelect
                    value={solutionForm.watch("language")}
                    onValueChange={(language) => solutionForm.setValue("language", language)}
                />
                </FormField>

                <FormField
                label="Execution Time (ms)"
                error={solutionForm.formState.errors.executionTime?.message}
                required
                >
                <Input type="number" {...solutionForm.register("executionTime")} min="0" step="0.1" />
                </FormField>

                <FormField
                label="Memory Taken (MB)"
                error={solutionForm.formState.errors.memoryTaken?.message}
                required
                >
                <Input type="number" {...solutionForm.register("memoryTaken")} min="0" step="0.1" />
                </FormField>
            </div>

            <FormField label="Solution Code" error={solutionForm.formState.errors.code?.message} required>
                <CodeEditor
                value={solutionForm.watch("code")}
                onChange={(code) => solutionForm.setValue("code", code)}
                language={solutionForm.watch("language")}
                />
            </FormField>

            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={validateSolution}>
                <Play className="h-4 w-4 mr-2" />
                Validate Code
                </Button>
                <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Submit Solution
                </Button>
            </div>
            </form>
        </CardContent>
        </Card>
  )
}

export default SolutionCode
