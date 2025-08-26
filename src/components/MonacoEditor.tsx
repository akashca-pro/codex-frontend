import { useEffect, useRef, useState } from "react"
import Editor from "@monaco-editor/react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface MonacoEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
  theme?: string
  height?: string
  readOnly?: boolean
  fontSize?:number;
  intelliSense?: boolean;
}

export default function MonacoEditor({
  value,
  onChange,
  language,
  theme = "vs-dark",
  height = "100%",
  readOnly = false,
  fontSize,
  intelliSense
}: MonacoEditorProps) {
  const editorRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(()=>{
    if(editorRef.current){
      editorRef.current.updateOptions({fontSize});
    }
  },[fontSize])

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        quickSuggestions: intelliSense,
        suggestOnTriggerCharacters: intelliSense,
        wordBasedSuggestions: intelliSense ? "matchingDocuments" : "off",
        parameterHints: { enabled: intelliSense },
        acceptSuggestionOnEnter: intelliSense ? "on" : "off",
        tabCompletion: intelliSense ? "on" : "off",
        formatOnType: intelliSense,
        formatOnPaste: intelliSense,
      });
    }
  }, [intelliSense]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor
    setIsLoading(false)

    // Configure editor options
    editor.updateOptions({
      fontSize: fontSize || 14,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
      lineHeight: 1.6,
      wordWrap: "on",
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      smoothScrolling: true,
      cursorBlinking: "expand",
      cursorSmoothCaretAnimation: "on",
      renderLineHighlight: "gutter",
      selectOnLineNumbers: true,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      detectIndentation: false,
      folding: true,
      foldingHighlight: true,
      showFoldingControls: "mouseover",
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true,
      },
      // Set IntelliSense options based on prop
      quickSuggestions: intelliSense,
      suggestOnTriggerCharacters: intelliSense,
      wordBasedSuggestions: intelliSense ? "matchingDocuments" : "off",
      parameterHints: { enabled: intelliSense },
      acceptSuggestionOnEnter: intelliSense ? "on" : "off",
      tabCompletion: intelliSense ? "on" : "off",
      formatOnType: intelliSense,
      formatOnPaste: intelliSense,
      autoClosingBrackets: "always",
      autoClosingQuotes: "always",
      autoSurround: "languageDefined",
    })

    monaco.editor.defineTheme("custom-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6A9955", fontStyle: "italic" },
        { token: "keyword", foreground: "C586C0" },
        { token: "string", foreground: "CE9178" },
        { token: "number", foreground: "B5CEA8" },
      ],
      colors: {
        "editor.background": "#0d1117",
        "editor.foreground": "#ffffff",
        "editorCursor.foreground": "#ffcc00",
        "editor.lineHighlightBackground": "#1e1e1e",
        "editor.selectionBackground": "#264f78",
        "editor.lineHighlightBorder": "#333333",
        "editor.inactiveSelectionBackground": "#3a3d41",
        "minimap.background": "#1e1e1e",
      },
    });


    monaco.editor.setTheme("custom-dark");

    // Configure TypeScript/JavaScript IntelliSense
    if (language === "typescript" || language === "javascript") {
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2020,
        allowNonTsExtensions: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.CommonJS,
        noEmit: true,
        esModuleInterop: true,
        jsx: monaco.languages.typescript.JsxEmit.React,
        reactNamespace: "React",
        allowJs: true,
        typeRoots: ["node_modules/@types"],
      })

      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: !intelliSense,
        noSyntaxValidation: false,
      })
    }

    // Auto-focus the editor
    editor.focus()
  }

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value)
    }
  }

  return (
    <Card className="relative h-full overflow-hidden border-gray-800 bg-card/50 backdrop-blur-sm">
      {isLoading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading editor...</span>
          </div>
        </motion.div>
      )}

      <Editor
        height={height}
        language={language}
        value={value}
        theme={theme}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        loading={null}
        options={{
          readOnly,
          contextmenu: true,
        }}
      />
    </Card>
  )
}