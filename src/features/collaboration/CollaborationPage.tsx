import React from 'react';
import { useSearchParams, Navigate } from "react-router-dom";
import { CollaborationProvider, useCollaboration } from './CollaborationProvider';
import CollabEditor from '@/components/CollabMonacoEditor';
import { useSelect } from '@/hooks/useSelect'; // To get current user info
import { Loader2, AlertTriangle, WifiOff } from 'lucide-react'; // Icons for states

// A simple component to display connection status inside the provider
const CollaborationStatus: React.FC = () => {
  const { connectionStatus } = useCollaboration();

  if (connectionStatus === 'connected') {
    return <div className="text-green-500 text-xs font-medium">Connected</div>;
  }
  if (connectionStatus === 'connecting') {
    return <div className="text-yellow-500 text-xs font-medium flex items-center gap-1"><Loader2 className="animate-spin h-3 w-3" /> Connecting...</div>;
  }
  if (connectionStatus === 'disconnected') {
    return <div className="text-gray-500 text-xs font-medium flex items-center gap-1"><WifiOff className="h-3 w-3" /> Disconnected</div>;
  }
  if (connectionStatus === 'error') {
     return <div className="text-red-500 text-xs font-medium flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Connection Error</div>;
  }
  return null;
};

// Main Page Component
const CollaborationPageInternal: React.FC = () => {
  // You might add more UI elements here later (participants, chat, toolbar)
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Example Header */}
      <header className="flex items-center justify-between p-2 border-b border-border">
        <h1 className="text-lg font-semibold">Collaboration Session</h1>
        <CollaborationStatus /> 
      </header>
      {/* Editor takes up the remaining space */}
      <main className="flex-1 overflow-hidden p-1"> 
          <CollabEditor 
             // Pass editor config props if needed
             // theme="codexDark" 
             // fontSize={16}
          />
      </main>
    </div>
  );
};

// Wrapper to handle token extraction and provider setup
const CollaborationPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const { user } = useSelect(); // Get authenticated user details

    // 1. Check for token
    if (!token) {
        // Option 1: Redirect to a 'not found' or home page
        // return <Navigate to="/" replace />;
        // Option 2: Show an error message
        return (
          <div className="flex items-center justify-center h-screen text-red-500">
            <AlertTriangle className="mr-2" /> Invalid or missing invite token.
          </div>
        );
    }

    // 2. Check if user is logged in (required for currentUser prop)
    if (!user.isAuthenticated || !user.details) {
       // Redirect to login or show appropriate message
       return <Navigate to="/login" replace state={{ from: `/user/collab?token=${token}` }} />;
    }

    // 3. Prepare currentUser prop
    const currentUser = {
        id: user.details.userId,
        name: user.details.username || 'Guest',
        color:  '#ff00ff' // Example color
    };

    // 4. Render the Provider and the internal page content
    return (
        <CollaborationProvider inviteToken={token} currentUser={currentUser}>
            <CollaborationPageInternal />
        </CollaborationProvider>
    );
};

export default CollaborationPage;