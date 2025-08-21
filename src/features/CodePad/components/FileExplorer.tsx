import type React from "react"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  FileText,
  Folder,
  FolderOpen,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  ChevronRight,
  ChevronDown,
} from "lucide-react"
import type { File, Folder as FolderType } from "../validation/schemas"

interface FileExplorerProps {
  files: File[]
  folders: FolderType[]
  activeFileId: string | null
  onFileSelect: (fileId: string) => void
  onFileCreate: (name: string, parentId?: string) => void
  onFolderCreate: (name: string, parentId?: string) => void
  onFileRename: (fileId: string, newName: string) => void
  onFileDelete: (fileId: string) => void
  onFolderDelete: (folderId: string) => void
}

interface FileTreeItemProps {
  item: File | FolderType
  level: number
  isActive: boolean
  onSelect: () => void
  onRename: (newName: string) => void
  onDelete: () => void
  children?: React.ReactNode
}

const getFileIcon = (filename: string) => {
  const ext = filename.split(".").pop()?.toLowerCase()
  switch (ext) {
    case "js":
    case "jsx":
    case "ts":
    case "tsx":
      return "🟨"
    case "py":
      return "🐍"
    case "cpp":
    case "c":
    case "h":
      return "⚡"
    case "java":
      return "☕"
    case "html":
      return "🌐"
    case "css":
      return "🎨"
    case "json":
      return "📋"
    case "md":
      return "📝"
    default:
      return "📄"
  }
}

function FileTreeItem({ item, level, isActive, onSelect, onRename, onDelete, children }: FileTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isRenaming, setIsRenaming] = useState(false)
  const [newName, setNewName] = useState(item.name)

  const handleRename = () => {
    if (newName.trim() && newName !== item.name) {
      onRename(newName.trim())
    }
    setIsRenaming(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRename()
    } else if (e.key === "Escape") {
      setNewName(item.name)
      setIsRenaming(false)
    }
  }

  return (
    <div>
      <ContextMenu>
        <ContextMenuTrigger>
          <motion.div
            className={`flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer hover:bg-accent/50 transition-colors ${
              isActive ? "bg-accent text-accent-foreground" : ""
            }`}
            style={{ paddingLeft: `${level * 16 + 8}px` }}
            onClick={onSelect}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {item.type === "folder" && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsExpanded(!isExpanded)
                }}
                className="p-0.5 hover:bg-accent rounded"
              >
                {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </button>
            )}

            <div className="flex items-center gap-2 flex-1 min-w-0">
              {item.type === "folder" ? (
                isExpanded ? (
                  <FolderOpen className="h-4 w-4 text-blue-500 flex-shrink-0" />
                ) : (
                  <Folder className="h-4 w-4 text-blue-500 flex-shrink-0" />
                )
              ) : (
                <span className="text-sm flex-shrink-0">{getFileIcon(item.name)}</span>
              )}

              {isRenaming ? (
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onBlur={handleRename}
                  onKeyDown={handleKeyDown}
                  className="h-6 text-sm"
                  autoFocus
                />
              ) : (
                <span className="text-sm truncate">{item.name}</span>
              )}
            </div>
          </motion.div>
        </ContextMenuTrigger>

        <ContextMenuContent>
          <ContextMenuItem onClick={() => setIsRenaming(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Rename
          </ContextMenuItem>
          <ContextMenuItem onClick={onDelete} className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </ContextMenuItem>
          <ContextMenuItem>
            <Copy className="h-4 w-4 mr-2" />
            Copy Path
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {item.type === "folder" && isExpanded && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}

export default function FileExplorer({
  files,
  folders,
  activeFileId,
  onFileSelect,
  onFileCreate,
  onFolderCreate,
  onFileRename,
  onFileDelete,
  onFolderDelete,
}: FileExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateMenu, setShowCreateMenu] = useState(false)

  const filteredFiles = files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const buildFileTree = useCallback(() => {
    const rootItems: (File | FolderType)[] = []
    const itemMap = new Map<string, File | FolderType>()

    // Add all items to map
    folders.forEach((item) => {
      itemMap.set(item.id, item)
    })
    filteredFiles.forEach((item) => {
      itemMap.set(item.id, item)
    })

    // Build tree structure
    const renderItem = (item: File | FolderType, level: number): React.ReactNode => {
      const isActive = item.type === "file" && item.id === activeFileId

      const handleSelect = () => {
        if (item.type === "file") {
          onFileSelect(item.id)
        }
      }

      const handleRename = (newName: string) => {
        if (item.type === "file") {
          onFileRename(item.id, newName)
        }
      }

      const handleDelete = () => {
        if (item.type === "file") {
          onFileDelete(item.id)
        } else {
          onFolderDelete(item.id)
        }
      }

      const children =
        item.type === "folder" ? (
          <>
            {folders
              .filter((folder) => folder.parentId === item.id)
              .map((folder) => (
                <div key={folder.id}>{renderItem(folder, level + 1)}</div>
              ))}
            {filteredFiles
              .filter((file) => file.parentId === item.id)
              .map((file) => (
                <div key={file.id}>{renderItem(file, level + 1)}</div>
              ))}
          </>
        ) : null

      return (
        <FileTreeItem
          key={item.id}
          item={item}
          level={level}
          isActive={isActive}
          onSelect={handleSelect}
          onRename={handleRename}
          onDelete={handleDelete}
        >
          {children}
        </FileTreeItem>
      )
    }

    // Get root items (no parent)
    const rootFolders = folders.filter((folder) => !folder.parentId)
    const rootFiles = filteredFiles.filter((file) => !file.parentId)

    return [...rootFolders, ...rootFiles].map((item) => renderItem(item, 0))
  }, [folders, filteredFiles, activeFileId, onFileSelect, onFileRename, onFileDelete, onFolderDelete])

  return (
    <div className="h-full flex flex-col bg-card/30 backdrop-blur-sm border-r border-gray-800">
      {/* Header */}
      <div className="p-3 border-b border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Explorer</h3>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCreateMenu(!showCreateMenu)}
              className="h-6 w-6 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-7 pl-7 text-xs"
          />
        </div>

        {/* Create Menu */}
        <AnimatePresence>
          {showCreateMenu && (
            <motion.div
              className="mt-2 space-y-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onFileCreate("new-file.js")
                  setShowCreateMenu(false)
                }}
                className="w-full justify-start h-7 text-xs"
              >
                <FileText className="h-3 w-3 mr-2" />
                New File
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onFolderCreate("new-folder")
                  setShowCreateMenu(false)
                }}
                className="w-full justify-start h-7 text-xs"
              >
                <Folder className="h-3 w-3 mr-2" />
                New Folder
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* File Tree */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">{buildFileTree()}</div>
      </ScrollArea>
    </div>
  )
}
