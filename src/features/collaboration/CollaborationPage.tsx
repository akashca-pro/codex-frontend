import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, Navigate, useNavigate } from "react-router-dom";
import { CollaborationProvider } from '@/features/collaboration/components/CollaborationProvider';
import CollabEditor from '@/features/collaboration/components/CollabMonacoEditor';
import { useSelect } from '@/hooks/useSelect';
import { Loader2 } from 'lucide-react';
import CollaborationHeader from './components/CollaborationHeader';

// import { useCollabSessionActions } from '@/hooks/useDispatch';
import { useBlocker } from "react-router-dom";
 

export interface CollabUserInfo {
  id : string;
  username : string;
  firstName : string;
  avatar : string;
}

const CollaborationPageInternal: React.FC = () => {
  const [language, setLanguage] = useState('javascript');
  const [fontSize, setFontSize] = useState(16);
  const [intelliSense, setIntelliSense] = useState(true);
  const { collabSession } = useSelect();
  
  const isOwner = collabSession.isOwner;

  const [shouldBlock, setShouldBlock] = useState(true);
  const blocker = useBlocker(shouldBlock);
  const [confirmType, setConfirmType] = useState<null | 'end' | 'leave'>(null);
  const isProgrammaticNavRef = useRef(false);
  const navigate = useNavigate();

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

  const handleCodeChange = () => {
    console.log('');
  }

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

  return (
    <>
    <div className="flex flex-col h-screen bg-background text-foreground">
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
        intelliSense={intelliSense}
        onToggleIntelliSense={() => setIntelliSense((prev) => !prev)}
      />
      <main className="flex-1 overflow-hidden p-1">
        <CollabEditor
          onChange={handleCodeChange}
          language={language}
        />
      </main>
    </div>
    </>
  );
};


// --- Wrapper Component (THIS IS THE FIX) ---
const CollaborationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token');
  const { user, collabSession } = useSelect();
  const [currentUser, setCurrentUser] = useState<CollabUserInfo | null>(null);
  const finalToken = tokenFromUrl || collabSession.inviteToken;

  // This effect runs when Redux state updates.
  // It builds the currentUser object once all data is ready.
  useEffect(() => {
    // Check if we have the user details from Redux
    if (user.isAuthenticated && user.details && user.details.userId) {
      setCurrentUser({
        id: user.details.userId, 
        username: user.details.username || 'username', 
        firstName : user.details.firstName || 'firstName',
        avatar : user.details.avatar || 'No image'
      });
    }
  }, [user.isAuthenticated, user.details, tokenFromUrl]);


  // 1. Validate User Authentication (do this first)
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
    <CollaborationProvider inviteToken={finalToken} currentUser={currentUser}>
      <CollaborationPageInternal />
    </CollaborationProvider>
  );
};

export default CollaborationPage;