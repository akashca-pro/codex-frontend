import { z } from "zod"

export const LanguageEnum = z.enum(["python", "javascript"])

export interface TestCaseCollection {
  Run: { input: string; output: string }[]
  Submit: { input: string; output: string }[]
}

export const StarterCodeSchema = z.object({
  language: LanguageEnum,
  code: z.string().min(1, "Code is required"),
})

export const CreateProblemSchema = z.object({
  questionId: z.string().trim().min(1, "Question ID is required"),
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z.string().trim()
    .min(20, 'Description must be at least 20 characters long')
    .max(2000,'Description must not exceed 2000 characters'),
  difficulty: z.enum(["Easy", "Medium", "Hard"],"Difficulty is required"),
  tags: z.array(z.string().trim().min(1).max(20)).min(1,'Altleast 1 tag is required').max(10),
})

export const ExampleSchema = z.object({
  input:  z.string().trim().min(1, "Value cannot be empty"),
  output:  z.string().trim().min(1, "Value cannot be empty"),
  explanation:  z.string().trim().min(1, "Value cannot be empty"),
});

export const BasicDetailsSchema = z.object({
  questionId: z.string().trim().min(1, "Question ID is required"),
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z.string().trim()
    .min(20, 'Description must be at least 20 characters long')
    .max(2000,'Description must not exceed 2000 characters'),
  difficulty: z.enum(["Easy", "Medium", "Hard"],"Difficulty is required"),
  active: z.boolean(),
  tags: z
    .array(z.string().trim().nonempty("Tag cannot be empty."))
    .nonempty("At least one tag is required.")
    .max(20, "You can add up to 20 tags."),

  constraints: z
    .array(z.string().trim().nonempty("Constraint cannot be empty."))
    .nonempty("At least one constraint is required."),
  examples: z.array(ExampleSchema),
  starterCodes: z.array(StarterCodeSchema).min(1,'At least one starter code is required'),
})

export const TestCaseItemSchema = z.object({
  Id : z.string().optional(),
  input: z.string().min(1, "Input is required"),
  output: z.string().min(1, "Output is required"),
  testCaseCollectionType: z.enum(["run", "submit"]),
})

export const AddTestCaseSchema = TestCaseItemSchema;

export const BulkUploadSchema = z.object({
  testCase: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
      }),
    )
    .min(1, "At least one test case is required"),
  testCaseCollectionType: z.enum(["run", "submit"]),
})

export const SolutionSchema = z.object({
  language: LanguageEnum,
  code: z.string().min(1, "Code is required"),
  executionTime: z.number().nonnegative(),
  memoryTaken: z.number().nonnegative(),
})


export type CreateProblemSchemaType = z.infer<typeof CreateProblemSchema>
export type BasicDetailsSchemaType = z.infer<typeof BasicDetailsSchema>
export type TestCaseItemSchemaType = z.infer<typeof TestCaseItemSchema>
export type AddTestCaseSchemaType = z.infer<typeof AddTestCaseSchema>
export type BulkUploadSchemaType = z.infer<typeof BulkUploadSchema>
export type SolutionSchemaType = z.infer<typeof SolutionSchema>
export type LanguageType = z.infer<typeof LanguageEnum>


export type StarterCodeType = z.infer<typeof StarterCodeSchema>