import React, { useEffect, useState } from 'react';
import { useSearchParams, Navigate } from "react-router-dom";
import { CollaborationProvider } from '@/features/collaboration/components/CollaborationProvider';
import CollabEditor from '@/features/collaboration/components/CollabMonacoEditor';
import { useSelect } from '@/hooks/useSelect';
import { Loader2 } from 'lucide-react';
import CollaborationHeader from './components/CollaborationHeader';

export interface CollabUserInfo {
  id : string;
  username : string;
  firstName : string;
  avatar : string;
}

const CollaborationPageInternal: React.FC = () => {
  const [language, setLanguage] = useState('javascript');
  const [isRunning, setIsRunning] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [intelliSense, setIntelliSense] = useState(true);

  const handleCodeChange = () => {
    console.log('');
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <CollaborationHeader
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
        firstName : 'firstName',
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