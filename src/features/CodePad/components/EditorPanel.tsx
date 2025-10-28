import { motion } from "framer-motion"
import { Allotment } from "allotment"
import "allotment/dist/style.css"
import MonacoEditor from "@/components/MonacoEditor"
import IDETabs from "../components/Tabs"
import ConsolePanel from "../components/ConsolePanel"
import React from "react"


// ... other imports

// Create a new component for the right panel
const EditorPanel = ({
  codePad,
  activeFile,
  handleTabSelect,
  handleTabClose,
  handleCodeChange,
  editorTheme,
  fontSize,
  intelliSense,
  onRun,
  isRunning,
  isFetching,
  consoleMessages
}) => {
  return (
    <motion.div
      className="h-full flex flex-col"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <IDETabs
        files={codePad.files}
        openTabs={codePad.openTabs}
        activeFileId={codePad.activeFileId}
        onTabSelect={handleTabSelect}
        onTabClose={handleTabClose}
      />
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
          <Allotment.Pane minSize={30} preferredSize={300}>
            <ConsolePanel
              onRun={onRun}
              isRunning={isRunning || isFetching} // Use both for consistent UI
              message={consoleMessages}
              height={300}
            />
          </Allotment.Pane>
        </Allotment>
      </div>
    </motion.div>
  );
};

// Memoize the new component
const MemoizedEditorPanel = React.memo(EditorPanel);