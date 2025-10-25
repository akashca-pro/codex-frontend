import React from 'react'; // Import useEffect
import { useSearchParams, Navigate } from "react-router-dom";
// Adjust paths as needed
import { CollaborationProvider, useCollaboration } from '@/features/collaboration/CollaborationProvider';
import CollabEditor from '@/features/collaboration/CollabMonacoEditor';
import { useSelect } from '@/hooks/useSelect';
import { useCollabSessionActions } from '@/hooks/useDispatch';
import { Loader2, AlertTriangle, WifiOff, Users, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// --- Header Component (Displays status and Copy button) ---
const CollaborationHeader: React.FC = () => {
const { connectionStatus } = useCollaboration();
const { collabSession } = useSelect(); // Get Redux state for token
const tokenToCopy = collabSession.inviteToken; // Token comes from Redux state now

const handleCopyInvite = () => {
    if (tokenToCopy) {
      navigator.clipboard.writeText(tokenToCopy)
        .then(() => toast.success("Invite token copied!"))
        .catch(() => toast.error("Failed to copy token."));
    } else {
        toast.error("Could not find invite token.");
    }
  };

// Determine status indicator text/icon
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


// --- Internal Page Component (Renders layout, handles cleanup) ---
const CollaborationPageInternal: React.FC = () => {
return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <CollaborationHeader />
      <main className="flex-1 overflow-hidden p-1">
          <CollabEditor
          />
      </main>
    </div>
  );
};


// --- Wrapper Component (Exported - Handles token logic, auth check, Provider setup) ---
const CollaborationPage: React.FC = () => {
    const { initSession } = useCollabSessionActions();
    const [searchParams] = useSearchParams();
    const tokenFromUrl = searchParams.get('token');
    initSession({ inviteToken : tokenFromUrl });
    const { user, collabSession } = useSelect();

    // Determine the token to use: URL first, then Redux persisted state
    const finalToken = tokenFromUrl || collabSession.inviteToken;

    // 1. Validate Token (check effective token)
    if (!finalToken) {
        // No token found in URL or Redux state
        return (
          <div className="flex flex-col items-center justify-center h-screen text-red-500">
            <AlertTriangle className="h-8 w-8 mb-2" />
            <p className="font-semibold">No Active Session</p>
            <p className="text-sm">Please start or join a session first.</p>
            {/* You could add a button here to navigate home or open the CollabDialog */}
          </div>
        );
    }

    // 2. Validate User Authentication
    if (!user.isAuthenticated || !user.details) {
       console.log("User not authenticated, redirecting to login.");
       return <Navigate to="/login" />;
    }

    // 3. Prepare `currentUser` prop for the Provider
    const currentUser = {
        id: user.details.userId || 'unknown-user-id-' + Date.now(),
        name: user.details.username || 'Anonymous User',
        color: '#ff8855' // Assign a default color (customize as needed)
    };

    // 4. Render the Provider using the effective token
    // The Provider's internal useEffect will handle the connection logic
    return (
        <CollaborationProvider inviteToken={finalToken} currentUser={currentUser}>
            {/* Render the actual page UI inside the provider */}
            <CollaborationPageInternal />
        </CollaborationProvider>
    );
};

export default CollaborationPage;