import { z } from "zod"

export const FileSchema = z.object({
  id: z.string(),
  name: z.string(),
  content: z.string(),
  language: z.string(),
  path: z.string(),
  type: z.enum(["file", "folder"]),
  parentId: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const FolderSchema = z.object({
  id: z.string(),
  name: z.string(),
  path: z.string(),
  type: z.literal("folder"),
  parentId: z.string().nullable(),
  children: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  files: z.array(FileSchema),
  folders: z.array(FolderSchema),
  activeFileId: z.string().nullable(),
  openTabs: z.array(z.string()),
  theme: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type File = z.infer<typeof FileSchema>
export type Folder = z.infer<typeof FolderSchema>
export type Project = z.infer<typeof ProjectSchema>
