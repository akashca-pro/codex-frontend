import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, Navigate, useNavigate } from "react-router-dom";
import { CollaborationProvider, useCollaboration } from '@/features/collaboration/components/CollaborationProvider';
import CollabEditor from '@/features/collaboration/components/CollabMonacoEditor';
import { useSelect } from '@/hooks/useSelect';
import { Loader2 } from 'lucide-react';
import CollaborationHeader from './components/CollaborationHeader';

import { useBlocker } from "react-router-dom";
import { MetadataMsgType, RunCodeMsgTypes } from '@/const/events.const';
import type { MetadataMessage, RunCodeMessage } from '@/const/events.const';
import type { Language } from '@/const/language.const';
import ConsolePanel from '../CodePad/components/ConsolePanel';
import { useCustomCodeRunMutation, useLazyCustomCodeResultQuery } from '@/apis/codepad/public'
import { toast } from 'sonner';
import ChatPanel from './components/Chat-panel';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export interface CollabUserInfo {
  id : string;
  username : string;
  firstName : string;
  avatar : string;
  isTyping: false
}

const CollaborationPageInternal: React.FC = () => {
  const { socket, metadata, runCodeDetails, currentUser } = useCollaboration();
  const [language, setLanguage] = useState('javascript');
  const [fontSize, setFontSize] = useState(16);
  // const [intelliSense, setIntelliSense] = useState(true);
  const { collabSession } = useSelect();
  const isOwner = collabSession.isOwner;
  const consoleContainerRef = useRef<HTMLDivElement>(null);
  const [consoleHeight, setConsoleHeight] = useState(400);

  const [shouldBlock, setShouldBlock] = useState(true);
  const blocker = useBlocker(shouldBlock);
  const [confirmType, setConfirmType] = useState<null | 'end' | 'leave'>(null);
  const isProgrammaticNavRef = useRef(false);
  const navigate = useNavigate();

  const [editorContent, setEditorContent] = useState<string | undefined>();
  const [tempId, setTempId] = useState('');
  const [runCode] = useCustomCodeRunMutation();
  const [triggerResultQuery, { isFetching }] = useLazyCustomCodeResultQuery();
  const [isRunning, setIsRunning] = useState(false);
  const [consoleMessages, setConsoleMessages] = useState<string>(
    "View execution results, including logs and error traces, here."
  );
  
  // Track if current user is executing code (to distinguish from other users' executions)
  const [isCurrentUserExecuting, setIsCurrentUserExecuting] = useState(false);

  // Determine UI values: use local state if current user is executing, otherwise use socket data from other users
  const displayIsRunning = isCurrentUserExecuting 
    ? isRunning || isFetching 
    : runCodeDetails?.isRunning ?? false;
  
  const displayConsoleMessage = isCurrentUserExecuting
    ? consoleMessages
    : runCodeDetails?.consoleMessage ?? consoleMessages;


  // metadata events
  useEffect(() => {
    if (!socket) return;
    const message: MetadataMessage = {
      type: MetadataMsgType.FONT_CHANGE,
      payload: { fontSize },
    };
    socket.emit('change-metadata', message);
  }, [socket, fontSize]);

  useEffect(() => {
    if (!socket) return;
    const message: MetadataMessage = {
      type: MetadataMsgType.CHANGE_LANGUAGE,
      payload: { language : language as Language },
    };
    socket.emit('change-metadata', message);
  }, [socket, language]);

  // useEffect(() => {
  //   if (!socket) return;
  //   const message: MetadataMessage = {
  //     type: MetadataMsgType.TOGGLE_INTELLISENSE,
  //     payload: { intelliSense },
  //   };
  //   socket.emit('change-metadata', message);
  // }, [socket, intelliSense]);

  // Emit run code events only when current user's execution state changes
  useEffect(()=>{
    if(!socket || !isCurrentUserExecuting) return;
    const message : RunCodeMessage = {
      type : RunCodeMsgTypes.RUNNING_CODE,
      payload : { isRunning : isRunning || isFetching }
    }
    socket.emit('code-execution', message);
  },[socket, isRunning, isFetching, isCurrentUserExecuting])

  useEffect(()=>{
    if(!socket || !isCurrentUserExecuting) return;
    // Only emit if we have a meaningful console message (not the default placeholder)
    console.log('consoleMessages', consoleMessages);
    if(consoleMessages === "View execution results, including logs and error traces, here.") return;
    const message : RunCodeMessage = {
      type : RunCodeMsgTypes.RESULT_UPDATED,
      payload : { consoleMessage : consoleMessages }
    }
    socket.emit('code-execution', message);
  },[socket, consoleMessages, isCurrentUserExecuting])

// This effect will run AFTER the state is updated and the final results are emitted
  useEffect(() => {
    if (!isRunning && !isFetching && isCurrentUserExecuting) {
      setIsCurrentUserExecuting(false);
    }
  }, [isRunning, isFetching, isCurrentUserExecuting]);

  useEffect(()=>{
    if(metadata?.fontSize)
    setFontSize(metadata.fontSize);
    
    if(metadata?.language)
    setLanguage(metadata.language);

    // if(metadata?.intelliSense !== undefined)
    // setIntelliSense(metadata.intelliSense);
  },[metadata])

  useEffect(() => {
      const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        const message = "Are you sure you want to leave? Your session will end.";
        event.preventDefault();
        event.returnValue = message; // For older browsers
        return message; // For modern browsers
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }, []);

  // Open header dialog when route blocking occurs
  useEffect(() => {
    if (blocker.state === 'blocked' && !isProgrammaticNavRef.current) {
      setConfirmType(isOwner ? 'end' : 'leave');
    }
  }, [blocker.state, isOwner]);

  const handleProceedAfterConfirm = () => {
    setShouldBlock(false);
    setConfirmType(null);
    blocker.proceed?.();
  };

  const handleCancelBlockedNavigation = () => {
    setConfirmType(null);
    blocker.reset?.();
  };

  const handleRequestNavigateHome = () => {
    // Prevent blocker effect from opening dialog during programmatic nav
    isProgrammaticNavRef.current = true;
    setShouldBlock(false);
    setConfirmType(null);
    // Defer navigation to next tick to ensure state applied
    setTimeout(() => {
      navigate('/', { replace: true });
      isProgrammaticNavRef.current = false;
    }, 0);
  };

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

  // Calculate console height based on container
  useEffect(() => {
    const updateConsoleHeight = () => {
      if (consoleContainerRef.current) {
        const height = consoleContainerRef.current.clientHeight;
        setConsoleHeight(height);
      }
    };

    updateConsoleHeight();
    window.addEventListener('resize', updateConsoleHeight);
    return () => window.removeEventListener('resize', updateConsoleHeight);
  }, []);

  const handleCodeChange = (content : string) => {
    setEditorContent(content);
  }

  const handleRun = async () => {
    if (!editorContent) return
    setIsCurrentUserExecuting(true); // Mark that current user is executing
    setConsoleMessages("Executing code...");
    setIsRunning(true);
    setTempId('')
    const payload = {
      userCode: JSON.stringify(editorContent),
      language: language,
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
    <div className="flex flex-col h-full w-full overflow-hidden pl-2 pr-2 bg-background text-foreground">
      <CollaborationHeader
        disableNavigationBlock={() => setShouldBlock(false)}
        triggerConfirmType={confirmType}
        onConfirmProceed={blocker.state === 'blocked' ? handleProceedAfterConfirm : undefined}
        onConfirmCancel={blocker.state === 'blocked' ? handleCancelBlockedNavigation : undefined}
        onRequestNavigateHome={handleRequestNavigateHome}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        language={language}
        onLanguageChange={(newLanguage : string) => setLanguage(newLanguage)}
        // intelliSense={intelliSense}
        // onToggleIntelliSense={() => setIntelliSense((prev) => !prev)}
      />
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Section - CollabEditor (60%) */}
        <div className="w-[60%] h-full overflow-hidden p-1">
          <CollabEditor
            onChange={handleCodeChange}
            language={language}
            fontSize={fontSize}
          />
        </div>
        
        {/* Right Section - Tabs with ConsolePanel and ChatPanel (40%) */}
        <div className="w-[40%] h-full flex flex-col overflow-hidden border-l border-border">
          <Tabs defaultValue="console" className="flex flex-col h-full">
          <TabsList className="grid w-full grid-cols-2 mt-2 shrink-0">
            <TabsTrigger value="console">Console</TabsTrigger>
            <TabsTrigger value="chat" className="relative">
              Chat
            </TabsTrigger>
          </TabsList> 
            <TabsContent value="console" className="flex-1 min-h-0 overflow-hidden m-0 mt-2 p-2">
              <div ref={consoleContainerRef} className="h-full flex flex-col">
                <ConsolePanel
                  onRun={handleRun}
                  isRunning={displayIsRunning}
                  message={displayConsoleMessage}
                  height={consoleHeight}
                />
              </div>
            </TabsContent>
            <TabsContent value="chat" className="flex-1 min-h-0 overflow-hidden m-0 mt-2">
                <ChatPanel 
                  currentUserId={currentUser?.id!}
                />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

const CollaborationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token');
  const { user, collabSession } = useSelect();
  const [currentUser, setCurrentUser] = useState<CollabUserInfo | null>(null);
  const finalToken = tokenFromUrl || collabSession.inviteToken;

  useEffect(() => {
    if (user.isAuthenticated && user.details && user.details.userId) {
      setCurrentUser({
        id: user.details.userId, 
        username: user.details.username || 'username', 
        firstName : user.details.firstName || 'firstName',
        avatar : user.details.avatar || 'No image',
        isTyping: false
      });
    }
  }, [user.isAuthenticated, user.details, tokenFromUrl]);

  if (!user.isAuthenticated) {
    console.log("User not authenticated, redirecting to login.");
    return <Navigate to="/login" />;
  }

  if (!finalToken || !currentUser) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="font-semibold mt-2">Initializing session...</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-hidden">
      <CollaborationProvider inviteToken={finalToken} currentUser={currentUser}>
        <CollaborationPageInternal />
      </CollaborationProvider>
    </div>
  );
};

export default CollaborationPage;