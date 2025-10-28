import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { X, Plus } from "lucide-react"
import type { File } from "@/store/slices/codepadSlice"
import { getLanguageIcon } from "@/utils/languageIcon"


interface IDETabsProps {
  files: File[]
  openTabs: string[]
  activeFileId: string | null
  onTabSelect: (fileId: string) => void
  onTabClose: (fileId: string) => void
}

export default function IDETabs({ files, openTabs, activeFileId, onTabSelect, onTabClose }: IDETabsProps) {
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
                <span className="text-sm">
                  <i className={getLanguageIcon(file.language)} ></i>
                </span>
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
    </div>
  )
}