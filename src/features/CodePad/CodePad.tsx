import { useState, useEffect } from "react"
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
import { useCustomCodeRunMutation, useLazyCustomCodeResultQuery } from '@/apis/codepad/public'
import { toast } from "sonner"
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
  const [tempId, setTempId] = useState('');
  const [editorTheme, setEditorTheme] = useState('codexDark');
  const [language, setLanguage] = useState('javascript');
  const [intelliSense, setIntelliSense] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const [consoleMessages, setConsoleMessages] = useState<string>(
    "View execution results, including logs and error traces, here."
  )
  const [isRunning, setIsRunning] = useState(false)
  const [runCode] = useCustomCodeRunMutation();
  const [triggerResultQuery, { isFetching }] = useLazyCustomCodeResultQuery();

useEffect(() => {
  if (!tempId || !isRunning) return;

  let intervalId: NodeJS.Timeout;
  const start = Date.now();

  intervalId = setInterval(async () => {
    try {
      const result = await triggerResultQuery({ tempId }).unwrap();

      if (result.success && result.data?.stdOut !== undefined) {
        const output = result.data.stdOut.trim();
        setConsoleMessages(output === "" ? "Execution finished. (no output)" : output);
        setIsRunning(false);
        setTempId("");
        clearInterval(intervalId);
      } else if (!result.success) {
        setConsoleMessages(`Execution failed: ${result.message || "Unknown error"}`);
        setIsRunning(false);
        setTempId("");
        clearInterval(intervalId);
      } else if (Date.now() - start > 10000) {
        setConsoleMessages("Execution timed out after 10 seconds.");
        setIsRunning(false);
        setTempId("");
        clearInterval(intervalId);
      }
    } catch (err) {
      setConsoleMessages("Error fetching result.");
      setIsRunning(false);
      setTempId("");
      clearInterval(intervalId);
    }
  }, 500);

  return () => clearInterval(intervalId);
}, [tempId, isRunning, triggerResultQuery]);

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

  const handleRun = async () => {
    if (!activeFile) return
    setConsoleMessages("Executing code...");
    setIsRunning(true);
    setTempId('')
    const payload = {
      userCode: JSON.stringify(activeFile.content),
      language: activeFile.language,
    };
    try {
      const res = await runCode(payload).unwrap();
      if (res?.data?.tempId) {
        setTempId(res.data.tempId); 
      } else {
        throw new Error("Failed to get a valid execution ID.");
      }
      setTempId(res.data.tempId);
    } catch (error : any) {
      const apiErrors = error?.data?.error
      if (Array.isArray(apiErrors) && apiErrors.length > 0) {
        apiErrors.forEach((e: any) => {
          toast.error(`field : ${e.field}`, {
            description: `Error : ${e.message}`,
          })
        })
      }
      toast.error('Error',{
          className : 'error-toast',
          description : error?.data?.message
      })
      setConsoleMessages("Failed to start execution.");
      setIsRunning(false); 
    }

  }

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
                  <Allotment.Pane minSize={100}>
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
                  <Allotment.Pane minSize={30} preferredSize={300}>
                    <ConsolePanel
                      onRun={handleRun}
                      isRunning={isRunning || isFetching}
                      message={consoleMessages}
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
