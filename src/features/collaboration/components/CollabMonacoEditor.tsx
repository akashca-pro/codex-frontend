import React, { useEffect, useRef, memo, useState } from "react";
import Editor, { type Monaco, type OnMount } from "@monaco-editor/react";
import { Card } from "@/components/ui/card";
import { Loader2, AlertTriangle } from "lucide-react";
import { MonacoThemes } from "@/utils/monacoThemes/index";
import { registerMonacoTheme } from "@/utils/monacoThemes/registerMonacoThemes";
import { registerLanguages } from "@/utils/monacoThemes/registerLanguages";
import * as monaco from "monaco-editor";
import { MonacoBinding } from 'y-monaco';
import { useCollaboration } from "@/features/collaboration/components/CollaborationProvider";
import { type Language } from '@/const/language.const';

interface CollabEditorProps {
  language?: Language | string;
  theme?: string;
  fontSize?: number;
  intelliSense?: boolean;
}
interface UserInfo {
  id: string;
  name: string;
  color: string;
}
interface CursorState {
    pos: number; // Yjs offset
}
interface SelectionState {
    anchor: number; // Yjs offset
    head: number; // Yjs offset
}
interface AwarenessState {
    user?: UserInfo;
    cursor?: CursorState;
    selection?: SelectionState;
}

const SHARED_TEXT_KEY = 'shared-code';

const CollabEditor: React.FC<CollabEditorProps> = ({
  language: initialLanguage = "javascript",
  theme = "codexDark",
  fontSize = 16,
  intelliSense = true,
}) => {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);
  const [editorInstance, setEditorInstance] = useState<any | null>(null);
  const decorationsRef = useRef<Map<number, string[]>>(new Map()); // Map clientID -> decoration IDs

  const { doc, awareness, connectionStatus, metadata, currentUser } = useCollaboration();

  const currentLanguage =
    (metadata?.language as string)?.toLowerCase() || initialLanguage.toLowerCase();

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
      if (editorInstance) {
          try {
              const allDecs = Array.from(decorationsRef.current.values()).flat();
              if (allDecs.length > 0) editorInstance.deltaDecorations(allDecs, []);
          } catch(e) {}
      }
      decorationsRef.current.clear();
      return;
    }

    const editor = editorInstance;
    editor.updateOptions({ readOnly: false });

    const yText = doc.getText(SHARED_TEXT_KEY);
    const monacoModel = editor.getModel();
    if (!monacoModel) return;

    console.log("Setting/Updating local user state:", currentUser);
    awareness.setLocalStateField('user', currentUser);  

    const currentLocalState = awareness.getLocalState();
        if (!currentLocalState?.cursor || !currentLocalState?.selection) {
            const currentPosition = editor.getPosition();
            if (currentPosition) {
                const offset = monacoModel.getOffsetAt(currentPosition);
                if (!currentLocalState?.cursor) {
                    console.log("Setting initial local cursor state.");
                    awareness.setLocalStateField('cursor', { pos: offset });
                }
                if (!currentLocalState?.selection) {
                    console.log("Setting initial local selection state.");
                    awareness.setLocalStateField('selection', { anchor: offset, head: offset });
                }
            }
        }

    if (bindingRef.current) {
      bindingRef.current.destroy();
    }
    console.log(awareness);
    // This ONE binding handles ALL text, cursor, and selection syncing.
      bindingRef.current = new MonacoBinding(
        yText,
        monacoModel,
        new Set([editor]),
        null
      );
      console.log('Text Binding established.');

// 3. Track Local Cursor Position -> Update Awareness
    const cursorChangeDisposable = editor.onDidChangeCursorPosition((e) => {
      if (awareness && currentUser && monacoModel) {
        const offset = monacoModel.getOffsetAt(e.position);
        awareness.setLocalStateField('cursor', { pos: offset } as CursorState);
      }
    });

// 4. Track Local Selection -> Update Awareness
    const selectionChangeDisposable = editor.onDidChangeCursorSelection((e) => {
      if (awareness && currentUser && monacoModel) {
        const anchor = monacoModel.getOffsetAt(e.selection.getStartPosition());
        const head = monacoModel.getOffsetAt(e.selection.getEndPosition());
        awareness.setLocalStateField('selection', { anchor, head } as SelectionState);
      }
    });

// 5. Render Remote Cursors/Selections Function (Keep your robust version)
    const renderRemoteDecorations = () => {
        if (!awareness || !editorInstance || !monacoModel) return;

        const states = awareness.getStates() as Map<number, AwarenessState>;
        const localClientID = awareness.clientID;
        const decorationsToAdd: monaco.editor.IModelDeltaDecoration[] = [];
        const clientIDsStillPresent = new Set<number>();

        console.log("Rendering remote decorations. Current states:", Array.from(states.entries())); // Debug

        states.forEach((state, clientID) => {
            // Skip self and states missing essential user info OR cursor info
            if (clientID === localClientID || !state.user?.name || !state.user?.color) { // Removed !state.cursor check here initially
                return;
            }
            clientIDsStillPresent.add(clientID); // Mark client as active for cleanup logic

            const user = state.user;
            const cursorData = state.cursor; // May be undefined initially
            const selectionData = state.selection; // May be undefined initially
            const safeColor = user.color.startsWith('#') ? user.color.substring(1) : user.color;
            const colorClass = `color-${safeColor || 'default'}`;

            try {
                // --- Render Cursor ---
                // IMPORTANT: Check if cursorData and pos exist before trying to render
                if (cursorData && typeof cursorData.pos === 'number') {
                    if (cursorData.pos >= 0 && cursorData.pos <= monacoModel.getValueLength()) {
                        const cursorPos = monacoModel.getPositionAt(cursorData.pos);
                        if (cursorPos) {
                            const cursorDecoration: monaco.editor.IModelDeltaDecoration = {
                                range: new monaco.Range(cursorPos.lineNumber, cursorPos.column, cursorPos.lineNumber, cursorPos.column),
                                options: {
                                    stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
                                    className: `remote-cursor client-${clientID}`,
                                    beforeContentClassName: `remote-cursor-indicator ${colorClass}`,
                                    afterContentClassName: `remote-cursor-label ${colorClass}`,
                                    after: { content: ` ${user.name} ` },
                                    isWholeLine: false,
                                },
                            };
                            decorationsToAdd.push(cursorDecoration);
                        }
                    } else {
                         console.warn(`Invalid cursor offset ${cursorData.pos} for client ${clientID}`);
                    }
                } else if (clientID !== localClientID) {
                    // Log if a remote user's state is missing cursor data
                    console.warn(`Cursor data missing for client ${clientID}`, state);
                }


                // --- Render Selection ---
                // IMPORTANT: Check if selectionData exists before trying to render
                if (selectionData && typeof selectionData.anchor === 'number' && typeof selectionData.head === 'number' && selectionData.anchor !== selectionData.head) {
                   const startOffset = Math.min(selectionData.anchor, selectionData.head);
                   const endOffset = Math.max(selectionData.anchor, selectionData.head);
                   if (startOffset >= 0 && endOffset <= monacoModel.getValueLength()) {
                       const startPos = monacoModel.getPositionAt(startOffset);
                       const endPos = monacoModel.getPositionAt(endOffset);
                       if (startPos && endPos) {
                           const selectionDecoration: monaco.editor.IModelDeltaDecoration = {
                               range: new monaco.Range(startPos.lineNumber, startPos.column, endPos.lineNumber, endPos.column),
                               options: {
                                   stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
                                   className: `remote-selection ${colorClass}`,
                                   zIndex: 5,
                               },
                           };
                           decorationsToAdd.push(selectionDecoration);
                       }
                   } else {
                        console.warn(`Invalid selection offsets for client ${clientID}:`, selectionData);
                   }
                }
            } catch (error) {
                console.error(`Error rendering decorations for client ${clientID}:`, error, state);
            }
        });

        // --- Apply Decorations ---
        const decorationIDsToRemove: string[] = [];
        decorationsRef.current.forEach((ids, clientID) => {
            if (!clientIDsStillPresent.has(clientID)) { // Remove if client is no longer in the current 'states' map
                decorationIDsToRemove.push(...ids);
            }
        });

        try {
            const newDecorationIDsMap = new Map<number, string[]>();
            editorInstance.changeDecorations(changeAccessor => {
                decorationIDsToRemove.forEach(id => changeAccessor.removeDecoration(id));
                const addedIDs = changeAccessor.deltaDecorations([], decorationsToAdd);

                // Map added IDs back to client IDs
                let addedIdIndex = 0;
                states.forEach((state, clientID) => {
                    if (!clientIDsStillPresent.has(clientID)) return;
                    const clientDecorations: string[] = [];
                    let expectedDecorations = 0;
                    if (state.cursor && typeof state.cursor.pos === 'number') expectedDecorations++;
                    if (state.selection && typeof state.selection.anchor === 'number' && typeof state.selection.head === 'number' && state.selection.anchor !== state.selection.head) expectedDecorations++;

                    for (let i = 0; i < expectedDecorations; i++) {
                        if (addedIdIndex < addedIDs.length) {
                            clientDecorations.push(addedIDs[addedIdIndex++]);
                        } else { break; }
                    }
                     if (clientDecorations.length > 0) {
                        newDecorationIDsMap.set(clientID, clientDecorations);
                     }
                });
                 decorationsRef.current = newDecorationIDsMap;
            });
        } catch(error) {
            console.error("Error applying decorations:", error);
            const allOldIDs = Array.from(decorationsRef.current.values()).flat();
            try { editorInstance.changeDecorations(acc => allOldIDs.forEach(id => acc.removeDecoration(id))); } catch (e) {}
            decorationsRef.current.clear();
        }
    }; // End of renderRemoteDecorations

// 6. Listen to Awareness changes -> Trigger Render
    const awarenessChangeHandler = (changes: { added: number[], updated: number[], removed: number[] }, origin: any) => {
        console.log("Awareness change detected, triggering renderRemoteDecorations. Origin:", origin, "Changes:", changes);
        // Always re-render to ensure consistency, especially if initial states were incomplete
        renderRemoteDecorations();
    };
    awareness.on('change', awarenessChangeHandler);

    // Initial render
    console.log("Performing initial renderRemoteDecorations after setup.");
    renderRemoteDecorations();

// --- Cleanup Function ---
    return () => {
          console.log('Cleaning up manual awareness handling...');
          cursorChangeDisposable.dispose();
          selectionChangeDisposable.dispose();
          if (awareness) {
             awareness.off('change', awarenessChangeHandler);
          }
          if (bindingRef.current) { bindingRef.current.destroy(); bindingRef.current = null; }
          if (editorInstance) {
            try { // Clear decorations
                const allDecorationIDs = Array.from(decorationsRef.current.values()).flat();
                if (allDecorationIDs.length > 0) {
                   editorInstance.changeDecorations(acc => allDecorationIDs.forEach(id => acc.removeDecoration(id)));
                }
            } catch (error) { /* ignore */ }
             editorInstance.updateOptions({ readOnly: true });
          }
          decorationsRef.current.clear();
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