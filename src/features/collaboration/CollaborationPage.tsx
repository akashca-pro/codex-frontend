import React, { useEffect, useState } from 'react';
import { useSearchParams, Navigate } from "react-router-dom";
import { CollaborationProvider, useCollaboration } from '@/features/collaboration/components/CollaborationProvider';
import CollabEditor from '@/features/collaboration/components/CollabMonacoEditor';
import { useSelect } from '@/hooks/useSelect';
import { useCollabSessionActions } from '@/hooks/useDispatch';
import { Loader2, AlertTriangle, WifiOff, Users, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { getRandomColor } from '@/utils/getRandomColour';

// --- Header Component (This is fine, no changes) ---
const CollaborationHeader: React.FC = () => {
  const { connectionStatus } = useCollaboration();
  const { collabSession } = useSelect();
  const tokenToCopy = collabSession.inviteToken;

  const handleCopyInvite = () => {
    if (tokenToCopy) {
      navigator.clipboard.writeText(tokenToCopy)
        .then(() => toast.success("Invite token copied!"))
        .catch(() => toast.error("Failed to copy token."));
    } else {
      toast.error("Could not find invite token.");
    }
  };

  let statusElement: React.ReactNode = null;
  if (connectionStatus === 'connected') {
    statusElement = <div className="text-green-500 text-xs font-medium flex items-center gap-1"><Users className="h-3 w-3" /> Connected</div>;
  } else if (connectionStatus === 'connecting') {
    statusElement = <div className="text-yellow-500 text-xs font-medium flex items-center gap-1"><Loader2 className="animate-spin h-3 w-3" /> Connecting...</div>;
  } else if (connectionStatus === 'disconnected') {
    statusElement = <div className="text-gray-500 text-xs font-medium flex items-center gap-1"><WifiOff className="h-3 w-3" /> Disconnected</div>;
  } else if (connectionStatus === 'error') {
    statusElement = <div className="text-red-500 text-xs font-medium flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Connection Error</div>;
  }

  return (
    <header className="flex items-center justify-between p-2 px-4 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <h1 className="text-base font-semibold truncate">Collaboration Session</h1>
      <div className="flex items-center gap-4">
        {statusElement}
        {tokenToCopy && connectionStatus === 'connected' && (
          <Button variant="outline" size="sm" onClick={handleCopyInvite} className="gap-1 h-7 text-xs">
            <Copy className="h-3 w-3" /> Copy Invite
          </Button>
        )}
      </div>
    </header>
  );
};

// --- Internal Page Component (This is fine, no changes) ---
const CollaborationPageInternal: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <CollaborationHeader />
      <main className="flex-1 overflow-hidden p-1">
        <CollabEditor />
      </main>
    </div>
  );
};


// --- Wrapper Component (THIS IS THE FIX) ---
const CollaborationPage: React.FC = () => {
  const { initSession } = useCollabSessionActions();
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token');
  const { user, collabSession } = useSelect();
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; color: string } | null>(null);
  const [userColor] = useState(getRandomColor());
  const finalToken = tokenFromUrl || collabSession.inviteToken;

  // This effect runs when Redux state updates.
  // It builds the currentUser object once all data is ready.
  useEffect(() => {
    // Save the token to Redux state
    if (tokenFromUrl) {
      initSession({ inviteToken: tokenFromUrl });
    }

    // Check if we have the user details from Redux
    if (user.isAuthenticated && user.details && user.details.userId) {
      setCurrentUser({
        id: user.details.userId, 
        name: user.details.username || 'Anonymous User',
        color: userColor, 
      });
    }
  }, [user.isAuthenticated, user.details, tokenFromUrl, userColor]);


  // 1. Validate User Authentication (do this first)
  if (!user.isAuthenticated) {
    console.log("User not authenticated, redirecting to login.");
    return <Navigate to="/login" />;
  }

  // 2. Validate Token and User Object
  // We must wait until BOTH the token is present AND we have built our
  // currentUser object. This prevents the "unknown-user-id" bug.
  if (!finalToken || !currentUser) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="font-semibold mt-2">Initializing session...</p>
      </div>
    );
  }

  // 3. Render the Provider
  // We are now 100% sure that finalToken exists and
  // currentUser has a real, unique ID and a random color.
  return (
    <CollaborationProvider inviteToken={finalToken} currentUser={currentUser}>
      <CollaborationPageInternal />
    </CollaborationProvider>
  );
};

export default CollaborationPage;