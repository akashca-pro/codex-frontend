import React, { useEffect, useRef, memo } from "react";
import Editor, { type Monaco, type OnMount } from "@monaco-editor/react";
import { Card } from "@/components/ui/card";
import { Loader2, AlertTriangle } from "lucide-react";
import { MonacoThemes } from "@/utils/monacoThemes/index";
import { registerMonacoTheme } from "@/utils/monacoThemes/registerMonacoThemes";
import { registerLanguages } from "@/utils/monacoThemes/registerLanguages";

import { MonacoBinding } from 'y-monaco';
import { useCollaboration } from "@/features/collaboration/CollaborationProvider";
import { type Language } from '@/const/language.const'; 

interface CollabEditorProps {
  // Config props (optional, defaults provided)
  language?: Language | string; // Base language, can be overridden by session metadata
  theme?: string;
  fontSize?: number;
  intelliSense?: boolean;
}

// Define the standard key for the shared text within the Y.Doc
const SHARED_TEXT_KEY = 'shared-code';

const CollabEditor: React.FC<CollabEditorProps> = ({
  language: initialLanguage = "javascript", // Default if metadata not available yet
  theme = "codexDark", // Your preferred default theme
  fontSize = 16,
  intelliSense = true,
}) => {
  const editorRef = useRef<any>(null); // Monaco editor instance
  const monacoRef = useRef<Monaco | null>(null); // Monaco API instance
  const bindingRef = useRef<MonacoBinding | null>(null); // Store the y-monaco binding

  // Get shared state from context
  const { doc, awareness, connectionStatus, metadata } = useCollaboration();

  // Determine the actual language (prefer metadata if available, ensure lowercase)
  const currentLanguage = (metadata?.language as string)?.toLowerCase() || initialLanguage.toLowerCase();

  // --- Monaco Setup & Config Effects ---

  // Update font size when prop changes
  useEffect(() => {
     if (editorRef.current) {
        editorRef.current.updateOptions({ fontSize });
     }
  }, [fontSize]);

  // Update IntelliSense options when prop changes or language changes
  useEffect(() => {
     if (editorRef.current && monacoRef.current) {
        const monaco = monacoRef.current;
        const options = {
          quickSuggestions: intelliSense,
          suggestOnTriggerCharacters: intelliSense,
          wordBasedSuggestions: intelliSense ? "matchingDocuments" : "off",
          parameterHints: { enabled: intelliSense },
          acceptSuggestionOnEnter: intelliSense ? "on" : "off",
          tabCompletion: intelliSense ? "on" : "off",
          formatOnType: intelliSense,
          formatOnPaste: intelliSense,
        };
        editorRef.current.updateOptions(options);

        // Also update TS/JS diagnostics based on current language
        if (currentLanguage === "typescript" || currentLanguage === "javascript") {
             monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({ noSemanticValidation: !intelliSense, noSyntaxValidation: false });
             monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({ noSemanticValidation: !intelliSense, noSyntaxValidation: false });
        }
     }
  }, [intelliSense, currentLanguage]); // Add currentLanguage dependency

  // Update editor's language model if metadata changes
  useEffect(() => {
    if (editorRef.current && monacoRef.current && metadata?.language) {
      const model = editorRef.current.getModel();
      const langId = metadata.language.toLowerCase();
      if (model && model.getLanguageId() !== langId) {
        console.log(`Setting editor language model to: ${langId}`);
        monacoRef.current.editor.setModelLanguage(model, langId);
      }
    }
  }, [metadata?.language]);

  // Update theme dynamically if the theme prop changes
  useEffect(() => {
     if (monacoRef.current) {
        monacoRef.current.editor.setTheme(theme);
     }
  }, [theme]);

  // Runs ONCE when the editor first mounts
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco; // Store monaco instance
    
    // Theme, language registration (run once)
    Object.entries(MonacoThemes).forEach(([name, def]) => registerMonacoTheme(monaco, name, def));
    registerLanguages(monaco);
    monaco.editor.setTheme(theme);

    // Editor options setup (run once)
    editor.updateOptions({
        fontSize: fontSize,
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
        automaticLayout: true, // Crucial for responsiveness
        tabSize: 2,
        insertSpaces: true,
        detectIndentation: false,
        folding: true,
        foldingHighlight: true,
        showFoldingControls: "mouseover",
        bracketPairColorization: { enabled: true },
        guides: { bracketPairs: true, indentation: true },
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
        readOnly: true, // Start as readOnly, enable on connect
        contextmenu: true,
        "semanticHighlighting.enabled" : true
    });

    // Configure TS/JS IntelliSense on mount based on initial state
    if (currentLanguage === "typescript" || currentLanguage === "javascript") {
       monaco.languages.typescript.javascriptDefaults.setCompilerOptions({ /* ...TS/JS options... */ });
       monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({ noSemanticValidation: !intelliSense, noSyntaxValidation: false });
       monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({ noSemanticValidation: !intelliSense, noSyntaxValidation: false });
    }

    editor.focus();
  }
  
  // --- Yjs Binding Effect ---
  // This effect manages the y-monaco binding lifecycle
  useEffect(() => {
    // Wait for editor instance, Y.Doc, Awareness, and connection
    if (!editorRef.current || !doc || !awareness || connectionStatus !== 'connected') {
      // If editor exists, ensure it's readOnly when not connected
      if(editorRef.current) editorRef.current.updateOptions({ readOnly: true });
      // Destroy existing binding if connection drops or doc disappears
      if (bindingRef.current) {
        console.log("Binding Effect: Destroying existing binding (disconnected or missing deps).");
        bindingRef.current.destroy();
        bindingRef.current = null;
      }
      return; // Exit effect if prerequisites not met
    }

    // --- We are connected and have all dependencies ---
    console.log("Binding Effect: Prerequisites met. Creating/Recreating Yjs Binding...");
    const editor = editorRef.current;
    
    // Ensure editor is writable now that we are connected
    editor.updateOptions({ readOnly: false });

    // Get the shared Y.Text instance from the Y.Doc
    const yText = doc.getText(SHARED_TEXT_KEY); 
    // Get the current text model associated with the Monaco editor instance
    const monacoModel = editor.getModel();

    // Check if a model exists (it should after onMount)
    if (!monacoModel) {
        console.error("Binding Effect: Monaco model not found! Cannot create binding.");
        return; // Cannot bind without a model
    }

    // Destroy previous binding IF IT EXISTS before creating a new one
    // This handles potential re-runs if dependencies change subtly
    if (bindingRef.current) {
        console.log("Binding Effect: Destroying previous binding before creating new one.");
        bindingRef.current.destroy();
    }

    // Create the new MonacoBinding and store its instance in the ref
    bindingRef.current = new MonacoBinding(
      yText,
      monacoModel,
      new Set([editor]), // y-monaco expects a Set of editor instances
      awareness // Pass the awareness instance for cursor/selection sharing
    );

    console.log(`Binding Effect: Binding established for key: ${SHARED_TEXT_KEY}`);

    // --- Cleanup Function ---
    // This function runs when the component unmounts OR *before* the effect runs again
    return () => {
      if (bindingRef.current) {
        console.log(`Binding Effect Cleanup: Destroying binding for key: ${SHARED_TEXT_KEY}`);
        bindingRef.current.destroy();
        bindingRef.current = null; // Clear the ref
      }
      // Optionally set editor back to readOnly during cleanup/disconnect
      if (editorRef.current) {
         editorRef.current.updateOptions({ readOnly: true });
      }
    };

  // This effect depends on the Yjs objects and the connection status
  // It will re-run if the connection drops/reconnects or if doc/awareness somehow change reference
  }, [doc, awareness, connectionStatus]); 

  // --- Render Logic ---

  // Handle initial connecting and error states explicitly
  if (connectionStatus === 'connecting') {
      return (
          <Card className="h-full flex items-center justify-center text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2" /> Connecting to Session...
          </Card>
      );
  }
  if (connectionStatus === 'error') {
      return (
           <Card className="h-full flex flex-col items-center justify-center text-red-500 p-4 text-center">
              <AlertTriangle className="h-8 w-8 mb-2" />
              <p className="font-semibold">Connection Error</p>
              <p className="text-sm">Could not connect. Please check the token or network.</p>
           </Card>
      );
  }
  // Optional: Display disconnected state more explicitly if needed
  // if (connectionStatus === 'disconnected') { ... }

  return (
    <Card className={`relative h-full overflow-hidden border border-border bg-card transition-opacity duration-300 ${connectionStatus !== 'connected' ? 'opacity-70 pointer-events-none' : ''}`}>
       {/* Editor Mount Loading Overlay */}
      {!editorRef.current && ( // Show only if editor instance isn't ready yet
         <div
          className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Initializing Editor...</span>
          </div>
        </div>
      )}
      <Editor
        key={SHARED_TEXT_KEY} // Add a fixed key to potentially help Monaco stability on context changes
        height="100%"
        language={currentLanguage} // Use dynamically determined language
        theme={theme}
        onMount={handleEditorDidMount}
        // Use the loading prop for the initial mount indicator
        loading={<div className="flex items-center justify-center h-full"><Loader2 className="h-5 w-5 animate-spin"/> Loading Editor...</div>} 
        options={{
          // Set readOnly dynamically based on connection status
          readOnly: connectionStatus !== 'connected', 
          // Other static options are set in handleEditorDidMount
        }}
      />
    </Card>
  )
}

export default memo(CollabEditor); // Memoize component for performance