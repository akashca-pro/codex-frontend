import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { X, Plus } from "lucide-react"
import type { File } from '../validation/schemas'

interface IDETabsProps {
  files: File[]
  openTabs: string[]
  activeFileId: string | null
  onTabSelect: (fileId: string) => void
  onTabClose: (fileId: string) => void
  onNewTab: () => void
}

const getFileIcon = (filename: string) => {
  const ext = filename.split(".").pop()?.toLowerCase()
  switch (ext) {
    case "js":
    case "jsx":
      return "🟨"
    case "ts":
    case "tsx":
      return "🔷"
    case "py":
      return "🐍"
    default:
      return "📄"
  }
}

export default function IDETabs({ files, openTabs, activeFileId, onTabSelect, onTabClose, onNewTab }: IDETabsProps) {
  const [draggedTab, setDraggedTab] = useState<string | null>(null)

  const openFiles = files.filter((file) => openTabs.includes(file.id))

  return (
    <div className="flex items-center bg-card/20 backdrop-blur-sm border-b border-gray-800 min-h-[40px]">
      <ScrollArea className="flex-1">
        <div className="flex items-center">
          <AnimatePresence mode="popLayout">
            {openFiles.map((file) => (
              <motion.div
                key={file.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                whileDrag={{ scale: 1.05, zIndex: 10 }}
                onDragStart={() => setDraggedTab(file.id)}
                onDragEnd={() => {
                  setDraggedTab(null)
                  // Handle tab reordering logic here
                  console.log(`Tab ${file.id} drag ended`)
                }}
                className={`flex items-center gap-2 px-3 py-2 border-r border-border/30 cursor-pointer group relative ${
                  activeFileId === file.id
                    ? "bg-background text-foreground"
                    : "hover:bg-accent/50 text-muted-foreground"
                } ${draggedTab === file.id ? "opacity-70" : ""}`}
                onClick={() => onTabSelect(file.id)}
              >
                <span className="text-xs">{getFileIcon(file.name)}</span>
                <span className="text-sm font-medium truncate max-w-[120px]">{file.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onTabClose(file.id)
                  }}
                  className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20"
                >
                  <X className="h-3 w-3" />
                </Button>

                {/* Active tab indicator */}
                {activeFileId === file.id && (
                  <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" layoutId="activeTab" />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* New Tab Button */}
      <Button variant="ghost" size="sm" onClick={onNewTab} className="h-8 w-8 p-0 border-l border-border/30">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}