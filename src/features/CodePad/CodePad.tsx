import { useState, useCallback, useEffect } from "react"
import { motion } from "framer-motion"
import { Allotment } from "allotment"
import "allotment/dist/style.css"
import { toast } from "sonner"

import MonacoEditor from "@/components/MonacoEditor"
import FileExplorer from "./components/FileExplorer"
import IDETabs from "./components/Tabs"
import IDEToolbar from "./components/Toolbar"
import ConsolePanel from "./components/ConsolePanel"
import type { File, Folder, Project } from "./validation/schemas"

// Sample project data
const initialProject: Project = {
  id: "1",
  name: "My Project",
  files: [
    {
      id: "1",
      name: "index.js",
      content: `// Welcome to the IDE Playground!
console.log("Hello, World!");

function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci sequence:");
for (let i = 0; i < 10; i++) {
    console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}`,
      language: "javascript",
      path: "/index.js",
      type: "file",
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      name: "styles.css",
      content: `/* Global Styles */
body {
    font-family: 'Inter', sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

h1 {
    color: #2d3748;
    text-align: center;
    margin-bottom: 30px;
}`,
      language: "css",
      path: "/styles.css",
      type: "file",
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "3",
      name: "utils.py",
      content: `# Python Utilities
import math
import random
from typing import List, Optional

def quicksort(arr: List[int]) -> List[int]:
    """
    Efficient quicksort implementation
    """
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quicksort(left) + middle + quicksort(right)

def generate_random_array(size: int, min_val: int = 1, max_val: int = 100) -> List[int]:
    """Generate a random array of integers"""
    return [random.randint(min_val, max_val) for _ in range(size)]

# Example usage
if __name__ == "__main__":
    test_array = generate_random_array(10)
    print(f"Original: {test_array}")
    print(f"Sorted: {quicksort(test_array)}")`,
      language: "python",
      path: "/src/utils.py",
      type: "file",
      parentId: "folder-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  folders: [
    {
      id: "folder-1",
      name: "src",
      path: "/src",
      type: "folder",
      parentId: null,
      children: ["3"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  activeFileId: "1",
  openTabs: ["1", "2"],
  theme: "vs-dark",
  createdAt: new Date(),
  updatedAt: new Date(),
}

interface ConsoleMessage {
  id: string
  type: "log" | "error" | "warning" | "success" | "output"
  content: string
  timestamp: Date
}

export default function CodePad() {
  const [intelliSense, setIntelliSense] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [project, setProject] = useState<Project>(initialProject)
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([
    {
      id: "1",
      type: "log",
      content: "IDE Playground initialized successfully!",
      timestamp: new Date(),
    },
    {
      id: "2",
      type: "success",
      content: "Ready to code! 🚀",
      timestamp: new Date(),
    },
  ])
  const [isRunning, setIsRunning] = useState(false)

  // Auto-save effect
  useEffect(() => {
    const saveProject = () => {
      localStorage.setItem("ide-project", JSON.stringify(project))
    }

    const interval = setInterval(saveProject, 30000) // Auto-save every 30 seconds
    return () => clearInterval(interval)
  }, [project])

  // Load project from localStorage on mount
  useEffect(() => {
    const savedProject = localStorage.getItem("ide-project")
    if (savedProject) {
      try {
        const parsed = JSON.parse(savedProject)
        setProject(parsed)
      } catch (error) {
        console.error("Failed to load saved project:", error)
      }
    }
  }, [])

  const activeFile = project.files.find((file) => file.id === project.activeFileId)

  const handleFileSelect = useCallback((fileId: string) => {
    setProject((prev) => ({
      ...prev,
      activeFileId: fileId,
      openTabs: prev.openTabs.includes(fileId) ? prev.openTabs : [...prev.openTabs, fileId],
    }))
  }, [])

  const handleTabClose = useCallback((fileId: string) => {
    setProject((prev) => {
      const newOpenTabs = prev.openTabs.filter((id) => id !== fileId)
      const newActiveFileId =
        prev.activeFileId === fileId
          ? newOpenTabs.length > 0
            ? newOpenTabs[newOpenTabs.length - 1]
            : null
          : prev.activeFileId

      return {
        ...prev,
        openTabs: newOpenTabs,
        activeFileId: newActiveFileId,
      }
    })
  }, [])

  const handleCodeChange = useCallback(
    (value: string) => {
      if (!project.activeFileId) return

      setProject((prev) => ({
        ...prev,
        files: prev.files.map((file) =>
          file.id === prev.activeFileId ? { ...file, content: value, updatedAt: new Date() } : file,
        ),
      }))
    },
    [project.activeFileId],
  )

  const handleLanguageChange = useCallback(
    (language: string) => {
      if (!project.activeFileId) return

      setProject((prev) => ({
        ...prev,
        files: prev.files.map((file) =>
          file.id === prev.activeFileId ? { ...file, language, updatedAt: new Date() } : file,
        ),
      }))
    },
    [project.activeFileId],
  )

  const handleFileCreate = useCallback((name: string, parentId?: string) => {
    const newFile: File = {
      id: crypto.randomUUID(),
      name,
      content: "",
      language: name.split(".").pop() || "plaintext",
      path: parentId ? `/${parentId}/${name}` : `/${name}`,
      type: "file",
      parentId: parentId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setProject((prev) => ({
      ...prev,
      files: [...prev.files, newFile],
      activeFileId: newFile.id,
      openTabs: [...prev.openTabs, newFile.id],
    }))

  }, [])

  const handleFolderCreate = useCallback((name: string, parentId?: string) => {
    const newFolder: Folder = {
      id: crypto.randomUUID(),
      name,
      path: parentId ? `/${parentId}/${name}` : `/${name}`,
      type: "folder",
      parentId: parentId || null,
      children: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setProject((prev) => ({
      ...prev,
      folders: [...prev.folders, newFolder],
    }))
  }, [])

  const handleFileRename = useCallback((fileId: string, newName: string) => {
    setProject((prev) => ({
      ...prev,
      files: prev.files.map((file) => (file.id === fileId ? { ...file, name: newName, updatedAt: new Date() } : file)),
    }))
  }, [])

  const handleFileDelete = useCallback((fileId: string) => {
    setProject((prev) => ({
      ...prev,
      files: prev.files.filter((file) => file.id !== fileId),
      openTabs: prev.openTabs.filter((id) => id !== fileId),
      activeFileId: prev.activeFileId === fileId ? null : prev.activeFileId,
    }))
  }, [])

  const handleFolderDelete = useCallback((folderId: string) => {
    setProject((prev) => ({
      ...prev,
      folders: prev.folders.filter((folder) => folder.id !== folderId),
      files: prev.files.filter((file) => file.parentId !== folderId),
    }))
  }, [])

  const handleRun = useCallback(async () => {
    if (!activeFile) return

    setIsRunning(true)

    const newMessage: ConsoleMessage = {
      id: crypto.randomUUID(),
      type: "log",
      content: `Running ${activeFile.name}...`,
      timestamp: new Date(),
    }

    setConsoleMessages((prev) => [...prev, newMessage])

    // Simulate code execution
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const outputMessage: ConsoleMessage = {
      id: crypto.randomUUID(),
      type: "success",
      content: `✅ ${activeFile.name} executed successfully!`,
      timestamp: new Date(),
    }

    setConsoleMessages((prev) => [...prev, outputMessage])
    setIsRunning(false)
    setIsConsoleOpen(true)

  }, [activeFile])

  const handleDownload = useCallback(() => {
    // Create a simple project download
    const projectData = {
      name: project.name,
      files: project.files.map((file) => ({
        name: file.name,
        content: file.content,
        path: file.path,
      })),
    }

    const blob = new Blob([JSON.stringify(projectData, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${project.name}.json`
    a.click()
    URL.revokeObjectURL(url)

    toast.success("Project downloaded successfully!")
  }, [project])

  const handleClearConsole = useCallback(() => {
    setConsoleMessages([])
  }, [])

  return (
    <div className="h-full bg-background">
      {/* Toolbar */}
      <IDEToolbar
        language={activeFile?.language || "javascript"}
        onLanguageChange={handleLanguageChange}
        theme={project.theme}
        onThemeChange={(theme) => setProject((prev) => ({ ...prev, theme: theme as any }))}
        onRun={handleRun}
        onDownload={handleDownload}
        onCollaboration={() => {}}
        isRunning={isRunning}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        intelliSense={intelliSense}
        onToggleIntelliSense={() => setIntelliSense((prev) => !prev)}
      />

      {/* Main Content */}
      <div className="h-screen w-screen overflow-hidden">
        <Allotment>
          {/* Left Panel - File Explorer */}
          <Allotment.Pane minSize={200} preferredSize="25%">
            <motion.div
              className="h-full"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <FileExplorer
                files={project.files}
                folders={project.folders}
                activeFileId={project.activeFileId}
                onFileSelect={handleFileSelect}
                onFileCreate={handleFileCreate}
                onFolderCreate={handleFolderCreate}
                onFileRename={handleFileRename}
                onFileDelete={handleFileDelete}
                onFolderDelete={handleFolderDelete}
              />
            </motion.div>
          </Allotment.Pane>

          {/* Right Panel - Editor */}
          <Allotment.Pane minSize={400}>
            <motion.div
              className="h-full flex flex-col"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Tabs */}
              <IDETabs
                files={project.files}
                openTabs={project.openTabs}
                activeFileId={project.activeFileId}
                onTabSelect={handleFileSelect}
                onTabClose={handleTabClose}
                onNewTab={() => handleFileCreate("untitled.js")}
              />

              {/* Editor */}
              <div className="flex-1">
                <Allotment vertical>
                  <Allotment.Pane minSize={200}>
                    {activeFile ? (
                      <MonacoEditor
                        value={activeFile.content}
                        onChange={handleCodeChange}
                        language={activeFile.language}
                        theme={project.theme}
                        height="100%"
                        fontSize={fontSize}
                        intelliSense={intelliSense}
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <h3 className="text-lg font-medium mb-2">No file selected</h3>
                          <p className="text-sm">Select a file from the explorer or create a new one</p>
                        </div>
                      </div>
                    )}
                  </Allotment.Pane>

                  {/* Console Panel */}
                  <Allotment.Pane minSize={40} preferredSize={isConsoleOpen ? 300 : 40}>
                  <ConsolePanel
                    isOpen={isConsoleOpen}
                    onToggle={() => setIsConsoleOpen(!isConsoleOpen)}
                    messages={consoleMessages}
                    onClear={handleClearConsole}
                    height={300}
                  />
                  </Allotment.Pane>
                </Allotment>
              </div>
            </motion.div>
          </Allotment.Pane>
        </Allotment>
      </div>
    </div>
  )
}
