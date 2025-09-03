import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Allotment } from "allotment"
import "allotment/dist/style.css"
import MonacoEditor from "@/components/MonacoEditor"
import FileExplorer from "./components/FileExplorer"
import IDETabs from "./components/Tabs"
import IDEToolbar from "./components/Toolbar"
import ConsolePanel from "./components/ConsolePanel"
import { useSelect } from "@/hooks/useSelect"
import { useCodePadActions } from "@/hooks/useDispatch"


interface ConsoleMessage {
  id: string
  type: "log" | "error" | "warning" | "success" | "output"
  content: string
  timestamp: Date
}

export default function CodePad() {
  const { codePad } = useSelect();
  const { 
    createFile, 
    updateContent,
    renameFile, 
    deleteFile,  
    openTab,
    closeTab,
    setActiveFile,
    unsetActiveFile,
  } = useCodePadActions()
  const [editorTheme, setEditorTheme] = useState('codexDark');
  const [language, setLanguage] = useState('javascript');
  const [intelliSense, setIntelliSense] = useState(true);
  const [fontSize, setFontSize] = useState(16);
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


  const activeFile = codePad.files.find(f => f.id === codePad.activeFileId);

  const handleFileCreate = (name: string) => {
    createFile({ name, language })  
  }

  const handleCodeChange = (content: string) => {
    if (!codePad.activeFileId) return
    updateContent(content) 
  }

  const handleTabClose = (fileId: string) => {
    closeTab(fileId)   
  }

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

  const handleClearConsole = useCallback(() => {
    setConsoleMessages([])
  }, [])

  return (
    <div className="h-full bg-background">
      {/* Main Content */}
      <div className="h-screen w-screen overflow-hidden">
      {/* Toolbar */}
      <IDEToolbar
        editorTheme={editorTheme}
        onThemeChange={setEditorTheme}
        language={ activeFile?.language || language}
        onLanguageChange={(newLanguage : string) => setLanguage(newLanguage)}
        onCollaboration={() => {}}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        intelliSense={intelliSense}
        onToggleIntelliSense={() => setIntelliSense((prev) => !prev)}
        goBackLink={`/problems`}
      />
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
                language={language}
                files={codePad.files}
                activeFileId={codePad.activeFileId}
                onFileSelect={(id) => {
                  setActiveFile(id)
                  openTab(id) 
                }}
                unsetActiveFile={unsetActiveFile}
                onFileCreate={handleFileCreate}
                onFileRename={(id, newName)=> renameFile({id, name : newName})}
                onFileDelete={(id) => deleteFile(id)}
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
                files={codePad.files}
                openTabs={codePad.openTabs}
                activeFileId={codePad.activeFileId}
                onTabSelect={(id) => {
                  setActiveFile(id)
                  openTab(id)
                }}
                onTabClose={handleTabClose}
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
                        theme={editorTheme}
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
                    onRun={handleRun}
                    isRunning={isRunning}
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
