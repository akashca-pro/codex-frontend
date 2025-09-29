import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import MonacoEditor from "@/components/MonacoEditor"
import { CodeSolutionSchema, type CodeSolutionFormData } from "@/features/admin/validation/schema"
import { Code, RotateCcw } from "lucide-react"
import { getLanguageIcon } from "@/utils/languageIcon"
import type { UpdateTemplateCodeRequest } from "@/types/problem-api-types/payload/admin"
import { toast } from "sonner"
import { 
    useAdminUpdateTemplateCodeMutation,
 } from '@/apis/problem/admin'
import type { ITemplateCode } from "@/types/problem-api-types/fieldTypes"

interface CodeSolutionFormProps {
  problemId : string | undefined
  templateCodes : ITemplateCode[]
}

const languageOptions = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python"},
  { value: "go", label: "Go" },
] as const

export default function TemplateCode({
    problemId,
    templateCodes
}: CodeSolutionFormProps) {
  const form = useForm<CodeSolutionFormData>({
    resolver: zodResolver(CodeSolutionSchema),
    defaultValues: {
        language: templateCodes?.[0]?.language || "javascript",
        wrappedCode: templateCodes?.[0]?.wrappedCode || '',
        templateCodeId: templateCodes?.[0]?.Id || ''
    },
  });
  const [updateTemplateCode, {isLoading}] = useAdminUpdateTemplateCodeMutation();

  const selectedLanguage = form.watch("language")

  // Update code templates when language changes
    useEffect(() => {
    if (!selectedLanguage) return;

    // find matching template code from props
    const template = templateCodes.find(t => t.language === selectedLanguage);

    if (template) {
        form.setValue("wrappedCode", template.wrappedCode ? JSON.parse(template.wrappedCode) : '');
        form.setValue("templateCodeId", template.Id);
        form.setValue("language", template.language);
    } else {
        // fallback if not found in backend
        form.setValue("wrappedCode", '');
        form.setValue("templateCodeId", undefined);
    }
    }, [selectedLanguage, templateCodes, form]);

  const handleSubmit = async (data: CodeSolutionFormData) => {
    if(!problemId) return
    const payload : UpdateTemplateCodeRequest = {
        problemId,
        templateCodeId : data.templateCodeId!,
        updatedData : {
            language : data.language,
            wrappedCode : JSON.stringify(data.wrappedCode)
        }
    }
    const toastId = toast.loading('Processing...');
    try {
        await updateTemplateCode(payload).unwrap();
        toast.success(`Template code for ${data.language} updated`,{
            className : 'success-toast',
            id : toastId
        })
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
    }
  }

const handleReset = () => {
  if (selectedLanguage) {
    const template = templateCodes.find(t => t.language === selectedLanguage);
    form.reset({
      language: template?.language || selectedLanguage,
      wrappedCode: template?.wrappedCode ? JSON.parse(template.wrappedCode) : '',
      templateCodeId: template?.Id || ''
    });
  }
};

  return (
    <div className={`space-y-6 `}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Header Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2 text-lg">
                  <div className="flex items-center justify- gap-2 text-lg">
                  <Code className="h-5 w-5" />
                    Template Code
                  </div>
                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex flex-col sm:flex-row gap-3"
                >
                    <Button type="submit" disabled={isLoading} className="flex-1 sm:flex-none" size="lg">
                    {isLoading ? "Submitting..." : "Submit"}
                    </Button>

                    <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    disabled={isLoading}
                    className="flex-1 sm:flex-none bg-transparent"
                    size="lg"
                    >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                    </Button>

                </motion.div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Language Selection */}
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Programming Language</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a programming language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {languageOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <i className={getLanguageIcon(option.value)} ></i>
                                <span>{option.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Choose the programming language for your solution</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Code Editors Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Solution Class Editor */}
            <Card>
              <CardHeader className="">
                <CardTitle className="text-base font-semibold">Wrapped Code</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="wrappedCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className=" rounded-lg overflow-hidden">
                          <MonacoEditor
                            value={field.value}
                            onChange={field.onChange}
                            language={selectedLanguage}
                            height="650px"
                            theme="vs-dark"
                            fontSize={16}
                          />
                        </div>
                      </FormControl>
                        <FormDescription>
                        This template provides a structured code scaffold, including the main function, helper utilities, and a class wrapper to encapsulate user-defined logic.
                        </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <Separator />
          </motion.div>
        </form>
      </Form>
    </div>
  )
}
