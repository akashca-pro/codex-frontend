import { useEffect, useRef, useState } from "react"
import Editor from "@monaco-editor/react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { MonacoThemes } from "@/utils/monacoThemes/index"
import { registerMonacoTheme } from "@/utils/monacoThemes/registerMonacoThemes"
import { registerLanguages } from "@/utils/monacoThemes/registerLanguages"

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
  intelliSense = false
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
    
      Object.entries(MonacoThemes).forEach(([name, def]) => {
        registerMonacoTheme(monaco, name, def);
      });
      monaco.editor.setTheme(theme);

      registerLanguages(monaco);

      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: !intelliSense,
        noSyntaxValidation: false,
      })

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



    // Configure TypeScript/JavaScript IntelliSense
    if (language === "typescript" || language === "javascript") {
      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2020,
        allowNonTsExtensions: true,
        allowJs: true,
        checkJs: false,
      })

      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: !intelliSense,
        noSyntaxValidation: false,
      })

      // Add global type definitions for better IntelliSense
      monaco.languages.typescript.javascriptDefaults.addExtraLib(`
        declare const console: {
          log(...args: any[]): void;
          error(...args: any[]): void;
          warn(...args: any[]): void;
        };
      `, 'ts:console.d.ts');
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
        loading={
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading Editor...
          </div>
        }
        options={{
          wordWrap: "off", 
          readOnly,
          contextmenu: true,
          "semanticHighlighting.enabled" : true
        }}
      />
    </Card>
  )
}