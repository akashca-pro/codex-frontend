import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Plus, Search, Edit, Trash2 } from "lucide-react"
import type { File } from "@/store/slices/codepadSlice"
import { getLanguageIcon } from "@/utils/languageIcon"

interface FileExplorerProps {
  files: File[]
  activeFileId: string | null
  onFileSelect: (fileId: string) => void
  onFileCreate: (name: string) => void
  onFileRename: (fileId: string, newName: string) => void
  onFileDelete: (fileId: string) => void
  unsetActiveFile : () => void
  language : string
}

export default function FileExplorer({
  files,
  activeFileId,
  onFileSelect,
  onFileCreate,
  onFileRename,
  onFileDelete,
  unsetActiveFile,
  language,
}: FileExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateMenu, setShowCreateMenu] = useState(false)
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [newName, setNewName] = useState("")

  const filteredFiles = files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleRename = (fileId: string) => {
    if (newName.trim()) {
      onFileRename(fileId, `${newName.trim()}`)
    }
    setRenamingId(null)
  }

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
              onClick={() =>{ 
                unsetActiveFile()
                setShowCreateMenu(!showCreateMenu)}}
              className="h-6 w-6 p-0"
            >
              <Plus className="h-3 w-3" />
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
                  onFileCreate(`${language}File`)
                  setShowCreateMenu(false)
                }}
                className="w-full justify-start h-7 text-xs"
              >
                <FileText className="h-3 w-3 mr-2" />
                New File
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* File List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredFiles.map((file) => (
            <ContextMenu key={file.id}>
              <ContextMenuTrigger>
                <motion.div
                  className={`flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer hover:bg-accent/50 transition-colors ${
                    file.id === activeFileId ? "bg-accent text-accent-foreground" : ""
                  }`}
                  onClick={() => onFileSelect(file.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                <span className="text-sm">
                  <i className={getLanguageIcon(file.language)} ></i>
                </span>
                  {renamingId === file.id ? (
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onBlur={() => handleRename(file.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRename(file.id)
                        if (e.key === "Escape") setRenamingId(null)
                      }}
                      className="h-6 text-sm"
                      autoFocus
                    />
                  ) : (
                    <span className="text-sm truncate">{file.name}</span>
                  )}
                </motion.div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem
                  onClick={() => {
                    setRenamingId(file.id)
                    setNewName(file.name)
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Rename
                </ContextMenuItem>
                <ContextMenuItem onClick={() => onFileDelete(file.id)} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
