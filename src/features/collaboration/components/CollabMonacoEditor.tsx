import React, { useEffect, useRef, memo, useState } from "react";
import Editor, { type Monaco, type OnMount } from "@monaco-editor/react";
import { Card } from "@/components/ui/card";
import { Loader2, AlertTriangle } from "lucide-react";
import { MonacoThemes } from "@/utils/monacoThemes/index";
import { registerMonacoTheme } from "@/utils/monacoThemes/registerMonacoThemes";
import { registerLanguages } from "@/utils/monacoThemes/registerLanguages";
import { MonacoBinding } from 'y-monaco';
import { useCollaboration } from "@/features/collaboration/components/CollaborationProvider";

interface CollabEditorProps {
  onChange : ()=>void;
  language: string ;
  theme?: string;
  fontSize?: number;
  intelliSense?: boolean;
}

const SHARED_TEXT_KEY = 'shared-code';

const CollabEditor: React.FC<CollabEditorProps> = ({
  language,
  theme = "codexDark",
  fontSize = 16,
  intelliSense = true,
}) => {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);
  const [editorInstance, setEditorInstance] = useState<any | null>(null);
  const decorationsRef = useRef<Map<number, string[]>>(new Map());
  const widgetsRef = useRef<Map<number, any>>(new Map()); // Map clientID -> content widget

  const { doc, awareness, connectionStatus, metadata, currentUser } = useCollaboration();

  const currentLanguage =
    (metadata?.language as string)?.toLowerCase() || language.toLowerCase();

  // --- Monaco Setup & Config Effects ---
    useEffect(() => {
     if (editorRef.current) {
        editorRef.current.updateOptions({ fontSize });
     }
  }, [fontSize]);

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

        if (currentLanguage === "typescript" || currentLanguage === "javascript") {
             monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({ noSemanticValidation: !intelliSense, noSyntaxValidation: false });
             monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({ noSemanticValidation: !intelliSense, noSyntaxValidation: false });
        }
     }
  }, [intelliSense, currentLanguage]);

  useEffect(() => {
    if (editorRef.current && monacoRef.current && metadata?.language) {
      const model = editorRef.current.getModel();
      const langId = metadata.language.toLowerCase();
      if (model && model.getLanguageId() !== langId) {
        console.log(`Setting editor language model to: ${langId}`);
        monacoRef.current?.editor.setModelLanguage(model, langId);
      }
    }
  }, [metadata?.language]);

  useEffect(() => {
     if (monacoRef.current) {
        monacoRef.current.editor.setTheme(theme);
     }
  }, [theme]);


  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    Object.entries(MonacoThemes).forEach(([name, def]) =>
      registerMonacoTheme(monaco, name, def)
    );
    registerLanguages(monaco);
    monaco.editor.setTheme(theme);

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
        automaticLayout: true,
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
        contextmenu: true,
        "semanticHighlighting.enabled": true
    });

    if (currentLanguage === "typescript" || currentLanguage === "javascript") {
       monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({ noSemanticValidation: !intelliSense, noSyntaxValidation: false });
       monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({ noSemanticValidation: !intelliSense, noSyntaxValidation: false });
    }

    editor.focus();
    setEditorInstance(editor);
  };

  // --- Yjs Binding Effect ---
  useEffect(() => {
    if (!editorInstance || !doc || !awareness || connectionStatus !== 'connected' || !currentUser) {
      if (editorInstance) editorInstance.updateOptions({ readOnly: true });
      if (bindingRef.current) {
        bindingRef.current.destroy();
        bindingRef.current = null;
      }
      return;
    }

    const editor = editorInstance;
    editor.updateOptions({ readOnly: false });

    const yText = doc.getText(SHARED_TEXT_KEY);
    const monacoModel = editor.getModel();
    if (!monacoModel) return;

    console.log("Setting/Updating local user state:", currentUser);
    awareness.setLocalStateField('user', currentUser);  

    // Let y-monaco manage cursor and selection awareness state

    if (bindingRef.current) {
      bindingRef.current.destroy();
    }
    console.log(awareness);
    // This ONE binding handles ALL text, cursor, and selection syncing.
      bindingRef.current = new MonacoBinding(
        yText,
        monacoModel,
        new Set([editor]),
        awareness
      );
      console.log('Text Binding established.');

    // Manual remote cursor/selection rendering for names and per-user colors
    const renderRemoteDecorations = () => {
      if (!awareness || !editorInstance || !monacoRef.current) return;
      const monaco = monacoRef.current;
      const model = editorInstance.getModel();
      if (!model) return;

      const states = awareness.getStates() as Map<number, any>;
      const localClientID = awareness.clientID;
      const decorationsToAdd: import('monaco-editor').editor.IModelDeltaDecoration[] = [];
      const activeClientIDs = new Set<number>();

      states.forEach((state, clientID) => {
        if (clientID === localClientID) return; // skip self
        const user = state.user;
        const cursor = state.cursor;
        const selection = state.selection;
        if (!user) return;
        activeClientIDs.add(clientID);

        try {
          if (cursor && typeof cursor.pos === 'number' && cursor.pos >= 0 && cursor.pos <= model.getValueLength()) {
            const pos = model.getPositionAt(cursor.pos);
            if (pos) {
              decorationsToAdd.push({
                range: new (monaco as any).Range(pos.lineNumber, pos.column, pos.lineNumber, pos.column),
                options: {
                  stickiness: (monaco as any).editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
                  className: `codex-remote-cursor client-${clientID}`,
                  beforeContentClassName: `codex-remote-cursor-indicator client-${clientID}`,
                  isWholeLine: false,
                },
              });

              // Create/update a Monaco content widget to show the name near the cursor
              const widgetId = `codex-remote-tag-${clientID}`;
              const position = { lineNumber: pos.lineNumber, column: pos.column };
              let widget = widgetsRef.current.get(clientID);
              if (!widget) {
                const domNode = document.createElement('div');
                domNode.className = `codex-remote-cursor-label client-${clientID}`;
                domNode.style.pointerEvents = 'none';
                domNode.style.position = 'absolute';
                domNode.style.transform = 'translate(4px, -16px)';
                domNode.textContent = ` ${user.name || 'User'} `;

                widget = {
                  getId: () => widgetId,
                  getDomNode: () => domNode,
                  getPosition: () => ({ position, preference: [(monaco as any).editor.ContentWidgetPositionPreference.EXACT] })
                };
                editorInstance.addContentWidget(widget);
                widgetsRef.current.set(clientID, widget);
              } else {
                try {
                  // Update text and position
                  const dom = widget.getDomNode();
                  dom.textContent = ` ${user.name || 'User'} `;
                  widget.getPosition = () => ({ position, preference: [(monaco as any).editor.ContentWidgetPositionPreference.EXACT] });
                  editorInstance.layoutContentWidget(widget);
                } catch {}
              }
            }
          }

          if (
            selection &&
            typeof selection.anchor === 'number' && typeof selection.head === 'number' &&
            selection.anchor !== selection.head
          ) {
            const startOffset = Math.min(selection.anchor, selection.head);
            const endOffset = Math.max(selection.anchor, selection.head);
            if (startOffset >= 0 && endOffset <= model.getValueLength()) {
              const start = model.getPositionAt(startOffset);
              const end = model.getPositionAt(endOffset);
              if (start && end) {
                decorationsToAdd.push({
                  range: new (monaco as any).Range(start.lineNumber, start.column, end.lineNumber, end.column),
                  options: {
                    stickiness: (monaco as any).editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
                    className: `codex-remote-selection client-${clientID}`,
                    zIndex: 5,
                  },
                });
              }
            }
          }
        } catch (e) {
          // ignore faulty state
        }
      });

      // Remove decorations for clients that disappeared
      const removeIDs: string[] = [];
      decorationsRef.current.forEach((ids, clientID) => {
        if (!activeClientIDs.has(clientID)) removeIDs.push(...ids);
      });

      try {
        const newMap = new Map<number, string[]>();
        editorInstance.changeDecorations((accessor: any) => {
          removeIDs.forEach(id => accessor.removeDecoration(id));
          const added = accessor.deltaDecorations([], decorationsToAdd);

          // Map back to clients in the same order
          let idx = 0;
          const statesArr = Array.from(states.entries());
          for (const [clientID, state] of statesArr) {
            if (!activeClientIDs.has(clientID)) continue;
            const clientDecs: string[] = [];
            let expected = 0;
            if (state.cursor && typeof state.cursor.pos === 'number') expected++;
            if (state.selection && typeof state.selection.anchor === 'number' && typeof state.selection.head === 'number' && state.selection.anchor !== state.selection.head) expected++;
            for (let i = 0; i < expected; i++) {
              if (idx < added.length) clientDecs.push(added[idx++]);
            }
            if (clientDecs.length) newMap.set(clientID, clientDecs);
          }
        });
        decorationsRef.current = newMap;
      } catch {}
    };

    const onAwarenessChange = () => renderRemoteDecorations();
    awareness.on('change', onAwarenessChange);
    // Initial render
    renderRemoteDecorations();

    // Use MutationObserver to continuously update label text as Monaco DOM changes
    const observer = new MutationObserver(() => {
      if (!awareness) return;
      const states = awareness.getStates() as Map<number, any>;
      const localClientID = awareness.clientID;
      
      states.forEach((state, clientID) => {
        if (clientID === localClientID || !state.user) return;
        const name = state.user.name || 'User';
        try {
          const selectors = [
            `.codex-remote-cursor-label.client-${clientID}`,
            `[class*="client-${clientID}"][class*="codex-remote-cursor-label"]`
          ];
          
          for (const selector of selectors) {
            const nodes = document.querySelectorAll(selector);
            if (nodes.length > 0) {
              nodes.forEach((n) => {
                const el = n as HTMLElement;
                const expectedText = ` ${name} `;
                if (el.textContent !== expectedText) {
                  el.textContent = expectedText;
                }
              });
              break;
            }
          }
        } catch {}
      });
    });

    // Observe the Monaco editor container for DOM changes
    const editorContainer = editorInstance.getContainerDomNode();
    if (editorContainer) {
      observer.observe(editorContainer, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }

// --- Cleanup Function ---
  return () => {
    console.log('Cleaning up y-monaco binding...');
    observer.disconnect();
    if (awareness) awareness.off('change', onAwarenessChange);
    if (bindingRef.current) { bindingRef.current.destroy(); bindingRef.current = null; }
    if (editorInstance) {
      editorInstance.updateOptions({ readOnly: true });
    }
    try {
      const ids = Array.from(decorationsRef.current.values()).flat();
      if (ids.length) editorInstance?.changeDecorations((a: any) => ids.forEach(id => a.removeDecoration(id)));
    } catch {}
    try {
      widgetsRef.current.forEach((widget) => {
        editorInstance?.removeContentWidget(widget);
      });
      widgetsRef.current.clear();
    } catch {}
  };
  }, [doc, awareness, connectionStatus, editorInstance, currentUser]);

useEffect(() => {
    // Only run if the binding and awareness exist
    if (!bindingRef.current || !awareness) {
      return;
    }

    const binding = bindingRef.current; // Get the instance

    // Function to log binding state
    const logBindingState = () => {
      console.log('--- Binding State Check ---');
      console.log('Awareness States:', Array.from(awareness.getStates().entries()));
      // Access internal properties if possible (these might change between y-monaco versions)
      // Check the y-monaco source code or debugger for actual internal structure
      // @ts-ignore - Accessing private/internal properties for debugging
      console.log('Binding Internal Cursors:', binding.cursors);
      // @ts-ignore
      console.log('Binding Internal Selections:', binding.selections);
       // @ts-ignore
      console.log('Binding Awareness Listener Attached:', !!binding.awarenessChangeListener); // Check if listener seems attached
    };

    // Listener for awareness changes
    const handleAwarenessChange = () => {
      console.log('Awareness changed, checking binding state...');
      logBindingState();
    };

    // Attach listener
    awareness.on('change', handleAwarenessChange);

    // Initial check
    console.log('Initial Binding State Check (after mount/binding creation)');
    logBindingState();

    // Cleanup
    return () => {
      if (awareness) { // Check if awareness still exists
        awareness.off('change', handleAwarenessChange);
      }
      console.log('Removed binding state check listener.');
    };
  }, [bindingRef.current, awareness]);


  // --- Render Logic ---
  if (connectionStatus === "connecting") {
     return (
          <Card className="h-full flex items-center justify-center text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2" /> Connecting to Session...
          </Card>
      );
  }
  if (connectionStatus === "error") {
      return (
           <Card className="h-full flex flex-col items-center justify-center text-red-500 p-4 text-center">
              <AlertTriangle className="h-8 w-8 mb-2" />
              <p className="font-semibold">Connection Error</p>
              <p className="text-sm">Could not connect. Please check the token or network.</p>
           </Card>
      );
  }

  return (
    <Card
      className={`relative h-full overflow-hidden border border-border bg-card transition-opacity duration-300 ${
        connectionStatus !== "connected" ? "opacity-70 pointer-events-none" : ""
      }`}
    >
      {/* Loading overlay */}
      {!editorRef.current && (
         <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
           <div className="flex items-center gap-2 text-muted-foreground">
             <Loader2 className="h-4 w-4 animate-spin" />
             <span>Initializing Editor...</span>
           </div>
         </div>
       )}
      <Editor
        key={SHARED_TEXT_KEY}
        height="100%"
        language={currentLanguage}
        theme={theme}
        onMount={handleEditorDidMount}
        loading={
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading Editor...
          </div>
        }
        options={{}} // Options are set in handleEditorDidMount and useEffects
      />
    </Card>
  );
};

export default memo(CollabEditor);