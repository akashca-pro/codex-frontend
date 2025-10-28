import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, RotateCcw, Save } from "lucide-react"
import FormField from "../FormField"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import TagInput from "../TagInput"
import { Button } from "@/components/ui/button"
import { BasicDetailsSchema, type BasicDetailsSchemaType, type StarterCodeType } from "../../../validation/schema"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { StarterCodeModal } from "../dialog/StarterCodeModal"
import { useAdminUpdateProblemDetailsMutation } from '@/apis/problem/admin'
import { toast } from "sonner"

const BasicDetails = ({ basicDetailsData, refetchBasicDetails }) => {
    const [modalValue, setModalValue] = useState<StarterCodeType | undefined>(undefined);  
    const [starterModalOpen, setStarterModalOpen] = useState(false)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [updateDetails] = useAdminUpdateProblemDetailsMutation();
    
    const basicForm = useForm<BasicDetailsSchemaType>({
        resolver: zodResolver(BasicDetailsSchema),
        defaultValues: {
        questionId: '',
        title: "",
        description: "",
        difficulty: basicDetailsData.difficulty,
        active: basicDetailsData.active,
        tags: [],
        constraints: [],
        examples: [{input : '', output : '', explanation : ''}],
        starterCodes: [{
            code : '',
            language : 'javascript'
        }],
        },
    })

  
    const { 
        fields: constraintFields, 
        append: appendConstraint, 
        remove: removeConstraint 
    } = useFieldArray({
        control: basicForm.control,
        name: "constraints" as never,
    })
  
    const { 
        fields: exampleFields, 
        append: appendExample, 
        remove: removeExample 
    } = useFieldArray({
    control: basicForm.control,
    name: "examples",
    });

    const { 
        fields: starterFields, 
        append: appendStarter, 
        remove: removeStarter, 
        update: updateStarter 
    } = useFieldArray({
    control: basicForm.control,
    name: "starterCodes",
    });

    useEffect(() => {
        if (basicDetailsData) {
        basicForm.reset({
            questionId: basicDetailsData.questionId,
            title: basicDetailsData.title,
            description: basicDetailsData.description,
            difficulty: basicDetailsData.difficulty || "Easy",
            active: basicDetailsData.active,
            tags: basicDetailsData.tags,
            constraints: basicDetailsData.constraints,
            examples: basicDetailsData.examples.length === 0 
                        ? [{input : '', output : '', explanation : ''}]
                        : basicDetailsData.examples,
            starterCodes: basicDetailsData.starterCodes || [],
        })
        }
            basicForm.trigger();
    }, [basicDetailsData, basicForm]);

    const onBasicSubmit = async (data: BasicDetailsSchemaType) => {
            const toastId = toast.loading('Updating data, please wait. . .',{
                className : 'info-toast'
            })
        try {
            await updateDetails({
                problemId : basicDetailsData.Id,
                updatedData : data
            }).unwrap();

            toast.success('Basic details updated',{
                id : toastId,
                className : 'success-toast'
            });

            refetchBasicDetails();

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

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                    Basic Details
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={basicForm.handleSubmit(onBasicSubmit)} className="space-y-6">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="Question ID" error={basicForm.formState.errors.questionId?.message} required>
                        <Input {...basicForm.register("questionId")} />
                        </FormField>

                        <FormField label="Active Status" description="Whether this problem is active">
                        <Controller
                            name="active"
                            control={basicForm.control}
                            render={({ field }) => (
                            <div className="flex items-center space-x-2">
                                <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange} 
                                />
                                <span className="text-sm">{field.value ? "Active" : "Inactive"}</span>
                            </div>
                            )}
                        />
                        </FormField>
                    </div>

                    <FormField label="Title" error={basicForm.formState.errors.title?.message} required>
                        <Input {...basicForm.register("title")} />
                    </FormField>

                    <FormField label="Description" error={basicForm.formState.errors.description?.message} required>
                        <Textarea {...basicForm.register("description")} className="min-h-[120px]" />
                    </FormField>

                    <FormField
                    label="Difficulty"
                    error={basicForm.formState.errors.difficulty?.message}
                    required
                    >
                    <Controller
                        name="difficulty"
                        control={basicForm.control}
                        render={({ field }) => (
                        <select
                            {...field}
                            className="w-full rounded-md border border-gray-800 bg-background px-3 py-2 text-sm text-foreground shadow-sm "
                        >
                            <option value="" disabled>
                            Select difficulty
                            </option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                        )}
                    />
                    </FormField>

                    <FormField label="Tags" error={basicForm.formState.errors.tags?.message}>
                        <TagInput
                        tags={basicForm.watch("tags")}
                        onChange={(tags) => basicForm.setValue("tags", tags)}
                        maxTags={20}
                        />
                    </FormField>

                    <FormField 
                        label="Constraints"
                        description="Add constraints one by one"
                        // This prop is for item-level errors and won't show the array's root error, which is fine.
                        error={basicForm.formState.errors.constraints?.message} 
                    >
                        <div className="space-y-2">
                            {constraintFields.map((field, index) => (
                                <div key={field.id} className="flex items-center gap-2">
                                    <Input
                                        {...basicForm.register(`constraints.${index}` as const)}
                                        placeholder={`Constraint ${index + 1}`}
                                    />
                                    {/* You could display item-level errors here if you had them */}
                                    {/* {basicForm.formState.errors.constraints?.[index]?.message} */}
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => removeConstraint(index)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => appendConstraint("")}
                            >
                                + Add Constraint
                            </Button>
                        </div>
                    </FormField>

                    {exampleFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
                        <FormField label="Input" error={basicForm.formState.errors.examples?.[index]?.input?.message}>
                        <Input {...basicForm.register(`examples.${index}.input` as const)} />
                        </FormField>

                        <FormField label="Output" error={basicForm.formState.errors.examples?.[index]?.output?.message}>
                        <Input {...basicForm.register(`examples.${index}.output` as const)} />
                        </FormField>

                        <FormField label="Explanation" error={basicForm.formState.errors.examples?.[index]?.explanation?.message}>
                        <Input {...basicForm.register(`examples.${index}.explanation` as const)} />
                        </FormField>

                        <Button type="button" variant="destructive" onClick={() => removeExample(index)}>Delete</Button>
                    </div>
                    ))}
                    <Button type="button" variant="outline" onClick={() => appendExample({ input: "", output: "", explanation: "" })}>
                    + Add Example
                    </Button>


                    {/* Starter Codes */}
                    {starterFields.map((field, index) => {
                        const currentStarterCode = basicForm.watch(`starterCodes.${index}`);
                        
                        return (
                        <div key={field.id} className="flex items-center justify-between p-2 border rounded-lg">
                            <span className="text-sm font-medium">
                            {currentStarterCode?.language?.toUpperCase() || field.language.toUpperCase()} – {(currentStarterCode?.code || field.code).slice(0, 30)}...
                            </span>
                            <div className="flex gap-2">
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                setEditingIndex(index)
                                const currentValue = basicForm.getValues(`starterCodes.${index}`);
                                setModalValue(currentValue || field)
                                setStarterModalOpen(true)
                                }}
                            >
                                Edit
                            </Button>
                            <Button type="button" size="sm" variant="destructive" onClick={() => removeStarter(index)}>
                                Delete
                            </Button>
                            </div>
                        </div>
                        )
                    })}
                    {basicForm.formState.errors.starterCodes && (
                        <p className="text-sm text-red-500">
                        {basicForm.formState.errors.starterCodes.message as string}
                        </p>
                    )}

                    <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                        setEditingIndex(null)
                        setModalValue({ language: "javascript", code: "" }) // set initial modal value
                        setStarterModalOpen(true) // open modal
                    }}
                    >
                    + Add Starter Code
                    </Button>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => basicForm.reset()}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                        </Button>
                        <Button 
                        type="submit">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                        </Button>
                    </div>
                </form>
            </CardContent>
            </Card>

            <StarterCodeModal
            open={starterModalOpen}
            onClose={()=>setStarterModalOpen(false)}
            initialValue={modalValue}
            onSave={(value) => {
                if (editingIndex !== null) {
                updateStarter(editingIndex, value) 
                } else {
                appendStarter(value) 
                }
                basicForm.trigger('starterCodes')
            }}
            />
        </motion.div>
    )
}

export default BasicDetails